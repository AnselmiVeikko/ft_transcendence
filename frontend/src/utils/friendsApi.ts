export const friendsApi = {

	async getCurrentFriends(pageNo = 1, limit = 5) {
		const response = await fetch(
			`/api/friendlist/current?pageNo=${pageNo}&limit=${limit}`,
			{ credentials: 'include' }
		);
		if (!response.ok)
			throw new Error('Failed to fetch friends');
		return response.json();
	},

	async searchFriends(keyWord = '', onlineStatus = 'ALL', pageNo = 1, limit = 10) {
		const params = new URLSearchParams();
		if (keyWord)
			params.append('keyWord', keyWord);
		params.append('onlineStatus', onlineStatus);
		params.append('pageNo', pageNo.toString());
		params.append('limit', limit.toString());

		const response = await fetch(
			`/api/friendlist/search?${params.toString()}`,
			{ credentials: 'include' }
		);
		if (!response.ok)
			throw new Error('Failed to search friends');
		return response.json();
	},

	// friend requests
	async getPendingRequests() {
		const response = await fetch(
			`/api/friendlist/pending`,
			{ credentials: 'include' }
		);
		if (!response.ok)
			throw new Error('Failed to fetch pending requests');
		return response.json();
	},

	async getSuggestions() {
		const response = await fetch(
			`/api/friendlist/suggestion`,
			{ credentials: 'include' }
		);
		if (!response.ok)
			throw new Error('Failed to fetch suggestions');
		return response.json();
	},

	async sendFriendRequest(receiverId: string) {
		const response = await fetch(
			`/api/friendrequest/send`,
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
			`/api/friendrequest/accept`,
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
			`/api/friendrequest/decline?friendRId=${friendRId}`,
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
			`/api/friendrequest/delete?friendRId=${friendRId}`,
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
