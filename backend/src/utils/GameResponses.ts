export function MatchFound( match: {matchId: string, playerOneId: string, playerTwoId: string} ) {
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