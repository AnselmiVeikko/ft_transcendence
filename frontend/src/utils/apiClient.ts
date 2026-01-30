import axios from 'axios';

const apiClient = axios.create({
	baseURL: '',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: unknown) => void;
	reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
	failedQueue.forEach(promise => {
		if (error) {
			promise.reject(error);
		} else {
			promise.resolve();
		}
	});
	failedQueue = [];
};

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {

			// Prevent refresh loop on the refresh endpoint itself
			if (originalRequest.url === '/api/user/refreshAccess') {
				isRefreshing = false;
				processQueue(error);
				window.location.href = '/';
				return Promise.reject(error);
			}

			if (isRefreshing) {
				// If already refreshing, queue this request
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => apiClient(originalRequest))
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				await apiClient.post('/api/user/refreshAccess');

				// Success! Process queued requests
				isRefreshing = false;
				processQueue(null);

				// Retry the original request
				return apiClient(originalRequest);
			} catch (refreshError) {
				// Refresh failed - user needs to log in again
				isRefreshing = false;
				processQueue(refreshError as Error);

				window.location.href = '/';
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
