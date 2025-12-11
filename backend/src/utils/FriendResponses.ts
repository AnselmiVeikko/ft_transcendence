export function FRSendSuccess(request: { senderId: string, receiverId: string}) {
	return {
		message: "Request sent",
		data: {
			senderId: request.senderId,
			receiverId: request.receiverId,
		},
	};
}

export function FRAcceptSuccess(request: { senderId: string, receiverId: string}) {
	return {
		message: "Request Accepted",
		data: {
			senderId: request.senderId,
			receiverId: request.receiverId,
		},
	};
}

export function FRDecclineSuccess(request: { senderId: string, receiverId: string}) {
	return {
		message: "Request Declined",
		data: {
			senderId: request.senderId,
			receiverId: request.receiverId,
		},
	};
}
