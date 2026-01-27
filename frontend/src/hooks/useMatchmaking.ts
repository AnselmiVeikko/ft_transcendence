import { useState, useEffect, useRef } from 'react';

interface Player {
	userId: string;
	username: string;
}

export const useMatchmaking = () => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [matchId, setMatchId] = useState('');
  const [gameToken, setGameToken] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const matchmakingStarted = useRef(false);

  const MATCHMAKING_API = '/api/game/matchmaking';
  const STATUS_API = '/api/game/matchstatus';
  const DELETEMATCH_API = '/api/game/deleteMatch';

  useEffect(() => {
    const cleanUpMatch = () => {
      if (!isWaiting || !matchId || gameStarted) return;

      const data = JSON.stringify({ matchId });
	  const blob = new Blob([data], { type: 'application/json' });

	  navigator.sendBeacon(DELETEMATCH_API, blob);
	  console.log("MATCH DELETED");
	};
	const handleUnload = () => cleanUpMatch();
	window.addEventListener('beforeunload', handleUnload);
    return () => {
	  window.removeEventListener('beforeunload', handleUnload);
      cleanUpMatch();
      stopPolling();
    };
  }, [isWaiting, matchId, gameStarted]);

  const gameReady = async () => {
    setGameStarted(true);
    setIsWaiting(false);
    stopPolling();
	console.log("GAME STARTED");
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
	  if (result.data?.player) setPlayer(result.data.player);

      console.log(result.message);
      setGameToken(result.data.gameToken);
      setMatchId(result.data.matchId);
      setIsWaiting(true);
      if (result.message === 'Match found') return gameReady();
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

  return { isWaiting, gameStarted, matchId, gameToken, player };
};
