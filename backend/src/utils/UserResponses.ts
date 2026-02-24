export function loginSuccess() {
	return {
		message: "Login successful",
	};
}

export function logoutSuccess() {
	return {
		message: "Logout successful",
	};
}

export function registrationSuccess(user: { userId: string, userName: string }) {
	return {
		message: "Registration successful",
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

export function profileSelf(userProfile: {userId: string, userName: string, email: string}, avatarUrl: string) {
	return {
		message: "Profile retrieve successful",
		data: {
			userId: userProfile.userId,
			userName: userProfile.userName,
			email: userProfile.email,
			avatarUrl: avatarUrl,
		},
	};
}

export function errorResponse(status: number, message: string) {
	const errors: Record<number, string> = {
		400: "Bad Request",
		401: "Unauthorized",
		403: "Forbidden",
		404: "Not Found",
		409: "Conflict",
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

// AVATAR
export function profileAvatarSet(user: { userId: string, userName: string, avatarName: string | null }){
	return {
	message: "Profile avatar change successful",
		data: {
			userId: user.userId,
			userName: user.userName,
			avatarName: user.avatarName,
		},
	};
}

export function getAvatarUrl(filename: string | null) {
	if (!filename) {
		return `/avatars/default/00000000-0000-0000-0000-000000000000.webp`;
	}
	return `/avatars/${filename}`;
}
