const API_BASE_URL = 'http://localhost:3000';

export const friendsApi = {

	async getCurrentFriends(pageNo = 1, limit = 5) {
		const response = await fetch(
			`${API_BASE_URL}/api/friendlist/current?pageNo=${pageNo}&limit=${limit}`,
			{ credentials: 'include' }
		);
		if (!response.ok)
			throw new Error('Failed to fetch friends');
		return response.json();
	},

	// friend requests
	async getPendingRequests() {
		const response = await fetch(
			`${API_BASE_URL}/api/friendlist/pending`,
			{ credentials: 'include' }
		);
		if (!response.ok)
			throw new Error('Failed to fetch pending requests');
		return response.json();
	},

	async getSuggestions() {
		const response = await fetch(
			`${API_BASE_URL}/api/friendlist/suggestion`,
			{ credentials: 'include' }
		);
		if (!response.ok)
			throw new Error('Failed to fetch suggestions');
		return response.json();
	},

	async sendFriendRequest(receiverId: string) {
		const response = await fetch(
			`${API_BASE_URL}/api/friendrequest/send`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ receiverId })
			}
		);
		if (!response.ok)
			throw new Error('Failed to send friend request');
		return response.json();
	},

	async acceptFriendRequest(friendRId: string) {
		const response = await fetch(
			`${API_BASE_URL}/api/friendrequest/accept`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ friendRId })
			}
		);
		if (!response.ok)
			throw new Error('Failed to accept friend request');
		return response.json();
	},

	async declineFriendRequest(friendRId: string) {
		const response = await fetch(
			`${API_BASE_URL}/api/friendrequest/decline?friendRId=${friendRId}`,
			{
				method: 'DELETE',
				credentials: 'include'
			}
		);
		if (!response.ok)
			throw new Error('Failed to decline friend request');
		return response.json();
	},

	async removeFriend(friendRId: string) {
		const response = await fetch(
			`${API_BASE_URL}/api/friendrequest/delete?friendRId=${friendRId}`,
			{
				method: 'DELETE',
				credentials: 'include'
			}
		);
		if (!response.ok)
			throw new Error('Failed to remove friend');
		return response.json();
	}
};

