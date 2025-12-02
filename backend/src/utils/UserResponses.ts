export function loginSuccess(user: { userId: number, userName: string }) {
	return {
		message: "Login succesful",
		data: {
			userId: user.userId,
			userName: user.userName
		},
	};
}

export function RegistrationSuccess(user: { userId: number, userName: string }) {
	return {
		message: "Registration succesful",
		data: {
			userId: user.userId,
			userName: user.userName
		},
	};
}

export function ProfileSelf(userProfile: {userId: number, userName: string, email: string}) {
	return {
		message: "Profile retrieved successfully",
		data: {
			userId: userProfile.userId,
			userName: userProfile.userName,
			email: userProfile.email
		},
	};
}

export function errorResponse(status: number, message: string) {
	const errors: Record<number, string> = {
		400: "Bad Request",
		401: "Unauthorized",
		403: "Forbidden",
		404: "Not Found",
		500: "Internal Server Error",
		501: "Not Implemented",
		503: "Service Unavailable",
	};

	return {
		statusCode: status,
		error: errors[status] || "Unknown Error",
		message: message,
	};
}


export function ProfileAll(userProfile: {userId: number, userName: string, email: string}[]) {
	return {
		message: "All profiles retrieved successfully",
		data: userProfile.map(u => ({
			userId: u.userId,
			userName: u.userName,
			email: u.email
		})),
	};
}
