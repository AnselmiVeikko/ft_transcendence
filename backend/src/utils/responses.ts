export function loginSuccess(user: { id: number, username: string }, token: string) {
    return {
        message: "Login succesful",
        token,
        user: { id: user.id, username: user.username },
    };
}

export function RegistrationSuccess(user: { id: number, username: string }) {
    return {
        message: "Registration succesful",
        user: { id: user.id, username: user.username },
    };
}