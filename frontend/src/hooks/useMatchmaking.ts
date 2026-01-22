import { useState, useEffect, useRef } from 'react';

export const useMatchmaking = () => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [matchId, setMatchId] = useState('');
  const [gameToken, setGameToken] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const matchmakingStarted = useRef(false);

  const MATCHMAKING_API = 'http://localhost:3000/api/game/matchmaking';
  const STATUS_API = 'http://localhost:3000/api/game/matchstatus';

  const gameReady = async () => {
    setGameStarted(true);
    setIsWaiting(false);
    stopPolling();
  };
  const startMatchmaking = async () => {
    try {
      const response = await fetch(MATCHMAKING_API, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.status === 409) {
		setIsWaiting(true);
		return;
	  }
      const result = await response.json();

      console.log(result.message);
      setGameToken(result.data.gameToken);
      setMatchId(result.data.matchId);
      setIsWaiting(true);
      if (result.message === 'Match found') return gameReady();
	  console.log("gameStarted: ", gameStarted);
  	  console.log("isWaiting: ", isWaiting);
      console.log("matchId: ", matchId);
    } catch (e) {
      console.error('Matchmaking error:', e);
    }
  };

  const checkStatus = async () => {
    if (!matchId) return;
    try {
	  const urlWithQuery = `${STATUS_API}?matchId=${encodeURIComponent(matchId)}`;
      const response = await fetch(urlWithQuery, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const result = await response.json();
      console.log(result.data?.matchStatus);
      if (
        result.data?.matchStatus === 'STARTING' ||
        result.data?.matchStatus === 'IN_PROGRESS'
      ) {
        return gameReady();
      }
    } catch (e) {
      console.error('Status check error:', e);
    }
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  //start matchmaking on load
  useEffect(() => {
    if (matchmakingStarted.current) return; // prevent double-fire (self-match)
    matchmakingStarted.current = true;
    startMatchmaking();
    return () => stopPolling();
  }, []);

  // polling
  useEffect(() => {
    if (isWaiting && matchId && !gameStarted) {
      intervalRef.current = setInterval(checkStatus, 3000);
    }
    return () => stopPolling();
  }, [isWaiting, matchId, gameStarted]);

  return { isWaiting, gameStarted, matchId, gameToken };
};
