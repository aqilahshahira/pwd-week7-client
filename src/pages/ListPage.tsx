import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import RestaurantList from '../components/RestaurantList';
import { restaurantAPI } from '../services/api';
import { ClipLoader } from 'react-spinners';

const PageContainer = styled.div`
    padding: 2rem 0;
`;

const FilterContainer = styled.div`
    background: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
    padding: 0.5rem 1rem;
    border: 2px solid #667eea;
    background: ${props => props.$active ? '#667eea' : 'white'};
    color: ${props => props.$active ? 'white' : '#667eea'};
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
        background: #667eea;
        color: white;
    }
`;

function ListPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', 'Korean cuisine', 'Chinese cuisine', 'Japanese cuisine', 'Western', 'Asian', 'Snack', 'Cafe', 'Other'];

    const { data, isLoading, error } = useQuery({
        queryKey: ['restaurants'],
        queryFn: restaurantAPI.getRestaurants,
    });

    if (isLoading) {
        return (
            <div className="loading">
                <ClipLoader color="#667eea" size={50} />
                <p>Loading restaurant information...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error">An error occurred: {error.message}</div>;
    }

    const filteredData = selectedCategory === "All"
        ? data?.data 
        : data?.data.filter(r => r.category === selectedCategory);
    
    return (
        <PageContainer>
            <h2>List of Popular Restaurants</h2>

            <FilterContainer>
                {categories.map(category => (
                    <FilterButton
                        key={category}
                        $active={selectedCategory === category}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </FilterButton>
                ))}
            </FilterContainer>

            <RestaurantList restaurants={filteredData || []} />
        </PageContainer>
    );
}

export default ListPage;