export function FRSendSuccess(request: { senderId: number, receiverId: number}) {
	return {
		message: "Request sent",
		data: {
			senderId: request.senderId,
			receiverId: request.receiverId,
		},
	};
}

export function FRAcceptSuccess(request: { senderId: number, receiverId: number}) {
	return {
		message: "Request Accepted",
		data: {
			senderId: request.senderId,
			receiverId: request.receiverId,
		},
	};
}

export function FRDecclineSuccess(request: { senderId: number, receiverId: number}) {
	return {
		message: "Request Declined",
		data: {
			senderId: request.senderId,
			receiverId: request.receiverId,
		},
	};
}
