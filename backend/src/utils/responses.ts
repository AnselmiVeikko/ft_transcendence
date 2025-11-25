export function loginSuccess(user: { id: number, username: string }) {
    return {
        message: "Login succesful",
        user: { id: user.id, username: user.username },
    };
}

export function RegistrationSuccess(user: { id: number, username: string }) {
    return {
        message: "Registration succesful",
        user: { id: user.id, username: user.username },
    };
}