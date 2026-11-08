import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { restaurantAPI } from '../services/api';
import type { CreateRestaurantInput } from '../types';

const emptyForm = {
	name: '',
	category: '',
	location: '',
	priceRange: '',
	rating: '0',
	description: '',
	recommendedMenu: '',
};

function AdminPage() {
	const queryClient = useQueryClient();
	const [form, setForm] = useState(emptyForm);
	const { data, isLoading, error } = useQuery({
		queryKey: ['restaurants'],
		queryFn: restaurantAPI.getRestaurants,
	});
	const restaurants = data?.data ?? [];

	const createMutation = useMutation({
		mutationFn: (payload: CreateRestaurantInput) => restaurantAPI.createRestaurant(payload),
		onSuccess: () => {
			toast.success('Restaurant added');
			setForm(emptyForm);
			queryClient.invalidateQueries({ queryKey: ['restaurants'] });
			queryClient.invalidateQueries({ queryKey: ['popular-restaurants'] });
		},
		onError: (mutationError: Error) => toast.error(mutationError.message),
	});

	const updateField = (field: keyof typeof emptyForm, value: string) => {
		setForm((current) => ({ ...current, [field]: value }));
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		createMutation.mutate({
			name: form.name.trim(),
			category: form.category,
			location: form.location.trim(),
			priceRange: form.priceRange.trim() || undefined,
			rating: Number(form.rating) || 0,
			description: form.description.trim() || undefined,
			recommendedMenu: form.recommendedMenu.split(/[\n,]/).map((item) => item.trim()).filter(Boolean),
		});
	};

	return (
		<section className="container">
			<h2>Restaurant administration</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Name <input required value={form.name} onChange={(event) => updateField('name', event.target.value)} />
				</label>
				<label>
					Category <input required value={form.category} onChange={(event) => updateField('category', event.target.value)} />
				</label>
				<label>
					Location <input required value={form.location} onChange={(event) => updateField('location', event.target.value)} />
				</label>
				<label>
					Price range <input value={form.priceRange} onChange={(event) => updateField('priceRange', event.target.value)} />
				</label>
				<label>
					Rating <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => updateField('rating', event.target.value)} />
				</label>
				<label>
					Description <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} />
				</label>
				<label>
					Recommended menu <textarea value={form.recommendedMenu} onChange={(event) => updateField('recommendedMenu', event.target.value)} />
				</label>
				<button type="submit" disabled={createMutation.isPending}>
					{createMutation.isPending ? 'Adding…' : 'Add restaurant'}
				</button>
			</form>

			<h3>Restaurants</h3>
			{isLoading && <p>Loading restaurants…</p>}
			{error && <p role="alert">Could not load restaurants: {error.message}</p>}
			<ul>
				{restaurants.map((restaurant) => (
					<li key={restaurant.id}>{restaurant.name} · {restaurant.category} · {restaurant.location}</li>
				))}
			</ul>
		</section>
	);
}

export default AdminPage;
