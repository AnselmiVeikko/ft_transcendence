export function matchFound(
    match: { matchId: string, playerOneId: string, playerTwoId: string | null },
    gameToken: string,
    player: { userId: string, username: string }
) {
    return {
        message: "Match found",
        data: {
            matchId: match.matchId,
            playerOneId: match.playerOneId,
            playerTwoId: match.playerTwoId,
            gameToken,
            player,
        },
    };

}

export function matchCreated(
    match: { matchId: string, playerOneId: string },
    gameToken: string,
    player: { userId: string, username: string }
) {
    return {
        message: "Match created",
        data: {
            matchId: match.matchId,
            playerOneId: match.playerOneId,
            gameToken,
            player,
        },
    };
}

export function matchStatusResponse( matchStatus: string ) {
    return {
        message: "Match status query succesful",
        data: { matchStatus },
    };
}

export function gameTokenCreated(
    token: { gameToken: string, matchId: string },
    player: { userId: string, username: string }
) {
    return {
        message: "Game token created",
        data: {
            gameToken: token.gameToken,
            matchId: token.matchId,
            player: {
                userId: player.userId,
                username: player.username,
            },
        },
    };
}