import axios from 'axios';

const apiClient = axios.create({
	baseURL: '',
	withCredentials: true,
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
		const noRefreshEndpoints = ['/api/user/refreshAccess','/api/user/login'];

		if (error.response?.status === 401 && noRefreshEndpoints.includes(originalRequest.url)) {
  			return Promise.reject(error);
		}

		if (error.response?.status === 401 && !originalRequest._retry) {

			// Prevent refresh loop on the refresh endpoint itself
			if (originalRequest.url === '/api/user/refreshAccess') {
				isRefreshing = false;
				processQueue(error);
				if (window.location.pathname !== '/') window.location.href = '/';
				return Promise.reject(error);
			}

			if (isRefreshing) {
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

				isRefreshing = false;
				processQueue(null);

				return apiClient(originalRequest);
			} catch (refreshError) {
				isRefreshing = false;
				processQueue(refreshError as Error);

				if (window.location.pathname !== '/') window.location.href = '/';
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
