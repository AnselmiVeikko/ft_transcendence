// Friend List Responses
export function currentList(list: any[], pageNo: number, limit: number, totalFriend: number) {
	return {
		message: "Friends List",
		data: list.map(u => ({
			friendRId: u.friendRId,
			userId: u.userId,
			userName: u.userName
		})),
		pagination: {
			pageNo,
			limit,
			totalFriend,
			totalPage: Math.ceil(totalFriend / limit),
		}
	};
}

export function searchList(list: any[]) {
	return {
		message: "Search List",
		data: list.map(u => ({
			friendRId: u.friendRId,
			userId: u.userId,
			userName: u.userName,
			status: u.status
		})),
	};
}

export function pendingList(list: any[]) {
	return {
		message: "Friends Pending List",
		data: list.map(u => ({
			friendRId: u.friendRId,
			userId: u.userId,
			userName: u.userName
		})),
	};
}

export function suggestionList(list: any[]) {
	return {
		message: "Friends Suggestion List",
		data: list.map(u => ({
			userId: u.userId,
			userName: u.userName
		})),
	};
}

// Friend Request Responses
export function frSendSuccess(request: { friendRId: string, senderId: string, receiverId: string}) {
	return {
		message: "Request sent",
		data: {
			friendRId: request.friendRId,
			senderId: request.senderId,
			receiverId: request.receiverId,
		},
	};
}

export function frAcceptSuccess(request: { friendRId: string, senderId: string, receiverId: string}) {
	return {
		message: "Request Accepted",
		data: {
			friendRId: request.friendRId,
			senderId: request.senderId,
			receiverId: request.receiverId,
		},
	};
}

export function frDeclineSuccess(request: { friendRId: string, senderId: string, receiverId: string}) {
	return {
		message: "Request Declined",
		data: {
			friendRId: request.friendRId,
			senderId: request.senderId,
			receiverId: request.receiverId,
		},
	};
}

export function frDeleteSuccess(request: { friendRId: string, senderId: string, receiverId: string}) {
	return {
		message: "Request Deleted",
		data: {
			friendRId: request.friendRId,
			senderId: request.senderId,
			receiverId: request.receiverId,
		},
	};
}
