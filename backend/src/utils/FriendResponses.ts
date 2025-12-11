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
