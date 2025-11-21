export function loginSuccess(user: { id: number, username: string }, token: string) {
    return {
        message: "Login succesful",
        token,
        user: { id: user.id, username: user.username },
    };
}