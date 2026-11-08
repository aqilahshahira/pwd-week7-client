import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { restaurantAPI, submissionAPI } from '../services/api';
import type { CreateRestaurantInput, Submission, SubmissionStatus } from '../types';

type StatusFilter = SubmissionStatus | 'all';

function SubmissionsPage() {
	const queryClient = useQueryClient();
	const [status, setStatus] = useState<StatusFilter>('pending');
	const { data, isLoading, error } = useQuery({
		queryKey: ['submissions', status],
		queryFn: () => submissionAPI.listSubmissions(status === 'all' ? undefined : status),
	});

	const refreshSubmissions = () => queryClient.invalidateQueries({ queryKey: ['submissions'] });
	const rejectMutation = useMutation({
		mutationFn: (submission: Submission) => submissionAPI.updateSubmission(submission.id, { status: 'rejected' }),
		onSuccess: () => {
			toast.success('Submission rejected');
			refreshSubmissions();
		},
		onError: (mutationError: Error) => toast.error(mutationError.message),
	});
	const deleteMutation = useMutation({
		mutationFn: (submission: Submission) => submissionAPI.deleteSubmission(submission.id),
		onSuccess: () => {
			toast.success('Submission deleted');
			refreshSubmissions();
		},
		onError: (mutationError: Error) => toast.error(mutationError.message),
	});
	const approveMutation = useMutation({
		mutationFn: async (submission: Submission) => {
			const payload: CreateRestaurantInput = {
				name: submission.restaurantName,
				category: submission.category,
				location: submission.location,
				priceRange: submission.priceRange,
				description: submission.review,
				recommendedMenu: submission.recommendedMenu,
			};
			await restaurantAPI.createRestaurant(payload);
			await submissionAPI.updateSubmission(submission.id, { status: 'approved' });
		},
		onSuccess: () => {
			toast.success('Submission approved and added as a restaurant');
			refreshSubmissions();
			queryClient.invalidateQueries({ queryKey: ['restaurants'] });
			queryClient.invalidateQueries({ queryKey: ['popular-restaurants'] });
		},
		onError: (mutationError: Error) => toast.error(mutationError.message),
	});

	const submissions = data?.data ?? [];

	return (
		<section className="container">
			<h2>Restaurant submissions</h2>
			<label>
				Status{' '}
				<select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
					<option value="pending">Pending</option>
					<option value="approved">Approved</option>
					<option value="rejected">Rejected</option>
					<option value="all">All</option>
				</select>
			</label>
			{isLoading && <p>Loading submissions…</p>}
			{error && <p role="alert">Could not load submissions: {error.message}</p>}
			{!isLoading && !error && submissions.length === 0 && <p>No submissions found.</p>}
			<ul>
				{submissions.map((submission) => (
					<li key={submission.id}>
						<h3>{submission.restaurantName} <small>({submission.status})</small></h3>
						<p>{submission.category} · {submission.location}</p>
						{submission.review && <p>{submission.review}</p>}
						{submission.submitterName && <p>Submitted by {submission.submitterName}</p>}
						<div>
							{submission.status === 'pending' && (
								<>
									<button type="button" disabled={approveMutation.isPending} onClick={() => approveMutation.mutate(submission)}>
										Approve
									</button>{' '}
									<button type="button" disabled={rejectMutation.isPending} onClick={() => rejectMutation.mutate(submission)}>
										Reject
									</button>{' '}
								</>
							)}
							<button type="button" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(submission)}>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}

export default SubmissionsPage;
