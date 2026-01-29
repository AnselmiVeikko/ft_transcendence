export function matchFound(
    matchId: string,
    gameToken: string,
    player: { userId: string, username: string }
) {
    return {
        message: "Match found",
        data: {
            matchId,
            gameToken,
            player,
        },
    };

}

export function matchCreated(
    matchId: string,
    gameToken: string,
    player: { userId: string, username: string }
) {
    return {
        message: "Match created",
        data: {
            matchId,
            gameToken,
            player,
        },
    };
}

export function matchStatusResponse( matchStatus: string ) {
    return {
        message: "Match status query successful",
        data: { matchStatus },
    };
}

export function matchDeleted( matchId: string ) {
    return {
        message: "Match deleted",
        data: {
            matchId,
        },
    };
}