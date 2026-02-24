import { useTranslation } from 'react-i18next';
import { useMatchmaking } from '../hooks/useMatchmaking';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CURRENT_HOST = window.location.hostname;

const GAME_ORIGIN = `https://${CURRENT_HOST}:8443/game/`;

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

const SingleMatch = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isWaiting, gameStarted, matchId, gameToken, player, isGameFinished } =
    useMatchmaking();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
	if (isGameFinished) {
		const timer = setInterval(() => {
			setCountdown((prev) => Math.max(0, prev - 1));
		}, 1000);
		const redirect = setTimeout(() => {
			navigate('/menu');
		}, 5000);
		return () => {
			clearInterval(timer);
			clearTimeout(redirect);
		};
	}	
  }, [isGameFinished, navigate]);


  const sendStringsToGame = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'STRINGS_UPDATE', strings: getGameStrings(t) },
        GAME_ORIGIN
      );
    }
  };

  // When language changes, push updated strings to the game iframe so it stays in sync
  useEffect(() => {
    if (!gameStarted) return;
    sendStringsToGame();
  }, [i18n.language, gameStarted]);

  const handleIframeLoad = () => {
    if (iframeRef.current && gameStarted && player) {
      const message = {
        matchId: matchId,
        player: {
          id: player.userId,
          username: player.username,
        },
        gameWsUrl: `wss://${CURRENT_HOST}:8443/game-ws/ws`,
        accessToken: gameToken,
        strings: getGameStrings(t),
      };
      iframeRef.current.contentWindow?.postMessage(message, GAME_ORIGIN);
      console.log("INITIALIZING GAME WITH ", matchId, player.userId, player.username, gameToken);
      // Resend strings after a short delay so game gets correct locale if translations loaded async (e.g. Swedish)
      setTimeout(sendStringsToGame, 150);
    }
  };

  return (
    <div className="relative">

	 {isGameFinished && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-4 border border-indigo-400">
            <span className="font-bold uppercase tracking-wider">
              {t('game_finished')}
            </span>
            <div className="h-6 w-px bg-indigo-400" />
            <span>
              {t('returning_in')} <strong className="text-lg">{countdown}s</strong>
            </span>
          </div>
        </div>
      )}

      <div
        className="flex items-center justify-center p-4"
        style={{ height: 'calc(100vh - 11rem)' }}
      >
        {isWaiting && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center animate-bounce-slow">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800">
                {t('waiting_player')}
              </h2>
            </div>
          </div>
        )}

        <div className="flex lg:flex-row bg-opacity-50 backdrop-blur-sm items-center max-w-full mx-auto z-0">
          {gameStarted && (
            <iframe
              ref={iframeRef}
              id="game"
              title="Pong Game"
              width="2400"
              height="1200"
              onLoad={handleIframeLoad}
              src={GAME_ORIGIN}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleMatch;
