export function profileUpdate(user: { userId: string, userName: string, email: string }) {
	return {
		message: "Profile information update successful",
		data: {
			userId: user.userId,
			userName: user.userName,
			email: user.email
		},
	};
}
