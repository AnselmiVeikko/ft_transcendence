import apiClient from './apiClient';

export const friendsApi = {

	async getCurrentFriends(pageNo = 1, limit = 5) {
		const response = await apiClient.get('/api/friendlist/current', {
			params: { pageNo, limit }
		});
		return response.data;
	},

	async searchFriends(keyWord = '', onlineStatus = 'ALL', pageNo = 1, limit = 10) {
		const response = await apiClient.get('/api/friendlist/search', {
			params: {
				...(keyWord && { keyWord }),
				onlineStatus,
				pageNo,
				limit
			}
		});
		return response.data;
	},

	// friend requests
	async getPendingRequests() {
		const response = await apiClient.get('/api/friendlist/pending');
		return response.data;
	},

	async getSuggestions() {
		const response = await apiClient.get('/api/friendlist/suggestion');
		return response.data;
	},

	async sendFriendRequest(receiverId: string) {
		const response = await apiClient.post('/api/friendrequest/send', {
			receiverId
		});
		return response.data;
	},

	async acceptFriendRequest(friendRId: string) {
		const response = await apiClient.post('/api/friendrequest/accept', {
			friendRId
		});
		return response.data;
	},

	async declineFriendRequest(friendRId: string) {
		const response = await apiClient.delete('/api/friendrequest/decline', {
			params: { friendRId }
		});
		return response.data;
	},

	async removeFriend(friendRId: string) {
		const response = await apiClient.delete('/api/friendrequest/delete', {
			params: { friendRId }
		});
		return response.data;
	}
};
