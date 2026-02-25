import { useState, useEffect, useRef } from 'react';
import apiClient from '../utils/apiClient';

interface Player {
  userId: string;
  username: string;
}

export const useMatchmaking = () => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isAbandoned, setIsAbandoned] = useState(false);
  const [matchId, setMatchId] = useState('');
  const [gameToken, setGameToken] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const matchmakingStarted = useRef(false);
  const latestStatus = useRef({ isWaiting, gameStarted, matchId, isGameFinished, isAbandoned });

  const MATCHMAKING_API = '/api/game/matchmaking';
  const STATUS_API = '/api/game/matchstatus';
  const DELETEMATCH_API = '/api/game/deleteMatch';

  //ref to track latest states
  useEffect(() => {
    latestStatus.current = { isWaiting, gameStarted, matchId, isGameFinished, isAbandoned };
  }, [isWaiting, gameStarted, matchId]);

  //game ready to start
  const gameReady = async () => {
    setGameStarted(true);
    setIsWaiting(false);
	setIsGameFinished(false);
    //stopPolling();
    console.log('GAME STARTED');
  };

  const gameFinished = async () => {
    setGameStarted(false);
    setIsWaiting(false);
	setIsGameFinished(true);
    stopPolling();
    console.log('GAME FINISHED');
  };

  const startMatchmaking = async () => {
    try {
      const { data } = await apiClient.post(MATCHMAKING_API);
      if (data.status === 409) {
		setIsAbandoned(true);
        setIsWaiting(true);
        return;
      }
      const result = await data;
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
      const { data } = await apiClient.get(urlWithQuery);
      const result = await data;
      console.log(result.data?.matchStatus);
      if (
        result.data?.matchStatus === 'STARTING' ||
        result.data?.matchStatus === 'IN_PROGRESS'
      ) {
        return gameReady();
      }
	  else if (result.data?.matchStatus === 'FINISHED') return gameFinished();
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

  // delete match if user abandons queue/page
  useEffect(() => {
    const cleanUpMatch = () => {
      const { isWaiting: waiting, gameStarted: started, matchId: id, isAbandoned: abandoned } = latestStatus.current; //make sure we have up-to-date states using ref

      if (abandoned || (waiting && !started && id)) {
        const data = JSON.stringify({ matchId: id });
		console.log('DELETING MATCH');
        const blob = new Blob([data], { type: 'application/json' });

        navigator.sendBeacon(DELETEMATCH_API, blob);
        console.log('MATCH DELETED (User abandoned queue)');
      }
    };
    const handleUnload = () => cleanUpMatch();
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      cleanUpMatch();
      stopPolling();
    };
  }, []);

  //start matchmaking on load
  useEffect(() => {
    if (matchmakingStarted.current) return; // prevent double-fire (self-match)
    matchmakingStarted.current = true;
    startMatchmaking();
    return () => stopPolling();
  }, []);

  // polling
  useEffect(() => {
    if (matchId && !isGameFinished) {
      intervalRef.current = setInterval(checkStatus, 3000);
    }
    return () => stopPolling();
  }, [isWaiting, matchId, gameStarted, isGameFinished],);

  return { isWaiting, gameStarted, matchId, isGameFinished, gameToken, player };
};
