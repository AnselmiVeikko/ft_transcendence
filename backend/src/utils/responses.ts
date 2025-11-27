export function loginSuccess(user: { userId: number, userName: string }) {
	return {
		message: "Login succesful",
		user: {
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

export function ProfilePersonal(userProfile: {userId: number, userName: string, email: string}) {
	return {
		message: "Profile retrieved successfully",
		data: {
			userId: userProfile.userId,
			userName: userProfile.userName,
			email: userProfile.email
		},
	};
}
