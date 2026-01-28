import { useTranslation } from 'react-i18next';
import SettingsMenu from './SettingsMenu';
import { useMatchmaking } from '../hooks/useMatchmaking';
import { useRef, useEffect } from 'react';
import { PlaySquare } from 'lucide-react';

const colorClasses = {
  start:
    'bg-gradient-to-b from-indigo-700 to-blue-300 hover:bg-gradient-to-r hover:to-indigo-200',
  bgGlow: 'bg-glow [animation:blob-drift_20s_ease-in-out_infinite]',
};

const SingleMatch = () => {
  const { t } = useTranslation();
  const { isWaiting, gameStarted, matchId, gameToken, player } =
    useMatchmaking();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = () => {
    if (iframeRef.current && gameStarted && player) {
      const message = {
        matchId: matchId,
        player: {
          id: player.userId,
          username: player.username,
        },
        gameWsUrl: 'ws://localhost:4000/ws',
        accessToken: gameToken,
      };
      iframeRef.current.contentWindow?.postMessage(message, "http://localhost:5174");
	  console.log("INITIALIZING GAME WITH ", matchId, player.userId, player.username, gameToken);
    }
  };

  return (
    <div className="relative">
      <SettingsMenu />
      <div
        className={`${colorClasses.bgGlow} flex items-center justify-center p-4`}
        style={{ height: 'calc(100vh - 80px)' }}
      >
        {isWaiting && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-10">
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
              src="http://localhost:5174"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleMatch;
