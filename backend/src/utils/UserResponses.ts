export function loginSuccess(user: { userId: string, userName: string }) {
	return {
		message: "Login succesful",
		data: {
			userId: user.userId,
			userName: user.userName
		},
	};
}

export function logoutSuccess(user: { userId: string, userName: string }) {
	return {
		message: "Logout succesful",
		data: {
			userId: user.userId,
			userName: user.userName
		},
	};
}

export function registrationSuccess(user: { userId: string, userName: string }) {
	return {
		message: "Registration succesful",
		data: {
			userId: user.userId,
			userName: user.userName
		},
	};
}

export function accessRefreshed() {
	return {
		message: "Access token refreshed",

	};
}

export function profileSelf(userProfile: {userId: string, userName: string, email: string}) {
	return {
		message: "Profile retrieve successful",
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


export function profileAll(userProfile: any[], pageNo: number, limit: number, totalUser: number) {
	return {
		message: "All profiles retrieve successful",
		data: userProfile.map(u => ({
			userId: u.userId,
			userName: u.userName,
			email: u.email
		})),
		pagination: {
			pageNo,
			limit,
			totalUser,
			totalPage: Math.ceil(totalUser / limit),
		}
	};
}


// export function ProfileAll(userProfile: {userId: number, userName: string, email: string}[])

