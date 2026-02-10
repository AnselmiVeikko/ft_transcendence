export function loginSuccess(user: { userId: string, userName: string }) {
	return {
		message: "Login successful",
		data: {
			userId: user.userId,
			userName: user.userName
		},
	};
}

export function logoutSuccess(user: { userId: string, userName: string }) {
	return {
		message: "Logout successful",
		data: {
			userId: user.userId,
			userName: user.userName
		},
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


export function profileAll(userProfile: any[], pageNo: number, limit: number, totalUser: number) {
	return {
		message: "All profiles retrieve successful",
		data: userProfile.map(u => ({
			userId: u.userId,
			userName: u.userName,
			email: u.email,
			avatarUrl: u.avatarUrl
		})),
		pagination: {
			pageNo,
			limit,
			totalUser,
			totalPage: Math.ceil(totalUser / limit),
		}
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
