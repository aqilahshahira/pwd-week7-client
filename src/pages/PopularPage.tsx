import { useQuery } from '@tanstack/react-query';
import PopularRestaurants from '../components/PopularRestaurants';
import { restaurantAPI } from '../services/api';
import { ClipLoader } from 'react-spinners';

function PopularPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['popular-restaurants'],
    queryFn: restaurantAPI.getPopularRestaurants,
  });

  if (isLoading) {
    return (
      <div className="loading">
        <ClipLoader color="#667eea" size={50} />
        <p>Loading popular restaurants...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">An error occurred: {error.message}</div>;
  }

  return <PopularRestaurants restaurants={data?.data || []} />;
}

export default PopularPage;