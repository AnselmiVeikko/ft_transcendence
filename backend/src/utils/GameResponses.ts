export function MatchFound( match: { matchId: string, playerOneId: string, playerTwoId: string | null } ) {
    return {
        message: "Match found",
        data: {
            matchId: match.matchId,
            playerOneId: match.playerOneId,
            playerTwoId: match.playerTwoId,
        },
    };

}

export function MatchCreated( match: { matchId: string, playerOneId: string } ) {
    return {
        message: "Match created",
        data: {
            matchId: match.matchId,
            playerOneId: match.playerOneId,
        },
    };
}

export function GameTokenCreated(
    token: { gameToken: string, matchId: string, wsUrl: string },
    player: { userId: string, username: string }
) {
    return {
        message: "Game token created",
        data: {
            gameToken: token.gameToken,
            matchId: token.matchId,
            wsUrl: token.wsUrl,
            player: {
                userId: player.userId,
                username: player.username,
            },
        },
    };
}