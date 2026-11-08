import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { FaMapMarkedAlt, FaUtensils, FaStar } from 'react-icons/fa';

const HomeContainer = styled.div`
    text-align: center;
    padding: 3rem 1rem;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
`;

const Subtitle = styled.p`
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 3rem;
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
`;

const Card = styled(Link)`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: transform: 0.3s;
    
    &:hover {
        transform: translateY(-5);
    }
        
    svg {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #667eea;
    }
        
    h3 {
        margin-bottom: 0.5rem;
    }
        
    p {
        color: #666;
    }
`;

function HomePage() {
    return (
        <HomeContainer>
            <Title>Find the best restaurants at our school!</Title>
            <Subtitle>Hidden gems around campus at a glance</Subtitle>

            <CardGrid>
                <Card to="/list">
                    <FaMapMarkedAlt />
                    <h3>Exploring Great Restaurants</h3>
                    <p>Find great restaurants by category</p>
                </Card>

                <Card to="/submit">
                    <FaUtensils />
                    <h3>Report a great restaurant</h3>
                    <p>Please tell me about a new restaurant</p>
                </Card>
                <Card to="/popular">
                    <FaStar />
                    <h3>Top Popular Restaurants</h3>
                    <p>This week's most popular restaurants</p>
                </Card>
            </CardGrid>
        </HomeContainer>
    );
}

export default HomePage;