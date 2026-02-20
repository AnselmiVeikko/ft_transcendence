import { useTranslation } from 'react-i18next';
import SettingsMenu from './SettingsMenu';
import { useRef, useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const colorClasses = {
  bgGlow: 'bg-glow [animation:blob-drift_20s_ease-in-out_infinite]',
};

const GAME_ORIGIN = "https://localhost:8443/game/";

const getGameStrings = (t: (key: string) => string) => ({
  welcome: t('landing_welcome_message'),
  gameOverTemplate: t('game_over_template'),
  youWon: t('you_won'),
  youLost: t('you_lost'),
  opponent: t('opponent'),
  connected: t('game_connected'),
  disconnected: t('game_disconnected'),
  waiting: t('game_waiting'),
  controls: t('game_controls'),
  moveLeft: t('game_move_left'),
  moveRight: t('game_move_right'),
});

const AIMatch = () => {
  const { t, i18n } = useTranslation();
  const { userId, userName, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [matchId] = useState(() => `ai-${userId}-${Date.now()}`);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !userId) {
      navigate('/');
    }
  }, [userId, userLoading, navigate]);

  const sendStringsToGame = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'STRINGS_UPDATE', strings: getGameStrings(t) },
        GAME_ORIGIN
      );
    }
  };

  // When language changes, push updated strings to the game iframe
  useEffect(() => {
    if (!gameStarted) return;
    sendStringsToGame();
  }, [i18n.language, gameStarted]);

  const handleIframeLoad = async () => {
    if (!iframeRef.current || !userId || !userName || gameStarted) return;

    try {
      // Get game token from main BE (reuse existing endpoint or create simple one)
      // For now, we'll create a simple token request
      const tokenResponse = await fetch('/api/game/aiToken', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId }),
      });

      let gameToken: string;
      if (tokenResponse.ok) {
        const result = await tokenResponse.json();
        gameToken = result.data?.gameToken || '';
      } else {
        // Fallback: use a simple token (game BE will verify it)
        // In production, this should always succeed
        console.warn('Failed to get AI token, using fallback');
        gameToken = '';
      }

      const message = {
        matchId: matchId,
        player: {
          id: userId,
          username: userName,
        },
        gameWsUrl: 'wss://localhost:8443/game-ws/ws',
        accessToken: gameToken,
        strings: getGameStrings(t),
        gameMode: 'AI', // Signal this is an AI match
      };
      
      iframeRef.current.contentWindow?.postMessage(message, GAME_ORIGIN);
      console.log("INITIALIZING AI MATCH WITH ", matchId, userId, userName);
      setGameStarted(true);
      
      // Resend strings after a short delay
      setTimeout(sendStringsToGame, 150);
    } catch (error) {
      console.error('Failed to initialize AI match:', error);
    }
  };

  if (userLoading || !userId) {
    return (
      <div className="relative">
        <SettingsMenu />
        <div className={`${colorClasses.bgGlow} flex items-center justify-center p-4`} style={{ height: 'calc(100vh - 80px)' }}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <SettingsMenu />
      <div
        className={`${colorClasses.bgGlow} flex items-center justify-center p-4`}
        style={{ height: 'calc(100vh - 80px)' }}
      >
        <div className="flex lg:flex-row bg-opacity-50 backdrop-blur-sm items-center max-w-full mx-auto z-0">
          <iframe
            ref={iframeRef}
            id="game"
            title="Pong AI Game"
            width="2400"
            height="1200"
            onLoad={handleIframeLoad}
            src={GAME_ORIGIN}
          />
        </div>
      </div>
    </div>
  );
};

export default AIMatch;
