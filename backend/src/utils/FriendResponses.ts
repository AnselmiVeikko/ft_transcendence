// Friend List Responses
export function CurrentList(list: any[]) {
	return {
		message: "Friends List",
		data: list.map(u => ({
			friendRId: u.friendRId,
			userId: u.userId,
			userName: u.userName
		})),
	};
}

export function PendingList(list: any[]) {
	return {
		message: "Friends Pending List",
		data: list.map(u => ({
			friendId: u.friendId,
			userId: u.userId,
			userName: u.userName
		})),
	};
}

export function SuggestionList(list: any[]) {
	return {
		message: "Friends Suggestion List",
		data: list.map(u => ({
			friendId: u.friendId,
			userId: u.userId,
			userName: u.userName
		})),
	};
}

// Friend Request Responses
export function FRSendSuccess(request: { friendRId: string, senderId: string, receiverId: string}) {
	return {
		message: "Request sent",
		data: {
			friendRId: request.friendRId,
			senderId: request.senderId,
			receiverId: request.receiverId,
		},
	};
}

export function FRAcceptSuccess(request: { friendRId: string, senderId: string, receiverId: string}) {
	return {
		message: "Request Accepted",
		data: {
			friendRId: request.friendRId,
			senderId: request.senderId,
			receiverId: request.receiverId,
		},
	};
}

export function FRDecclineSuccess(request: { friendRId: string, senderId: string, receiverId: string}) {
	return {
		message: "Request Declined",
		data: {
			friendRId: request.friendRId,
			senderId: request.senderId,
			receiverId: request.receiverId,
		},
	};
}

export function FRDeleteSuccess(request: { friendRId: string}) {
	return {
		message: "Request Deleted",
		data: {
			friendRId: request.friendRId,
		},
	};
}
