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
