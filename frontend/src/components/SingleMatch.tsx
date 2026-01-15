import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsMenu from './SettingsMenu';

const colorClasses = {
  start:'bg-gradient-to-b from-indigo-700 to-blue-300 hover:bg-gradient-to-r hover:to-indigo-200',
  bgGlow: 'bg-glow [animation:blob-drift_20s_ease-in-out_infinite]',
};

const SingleMatch = () => {
  const { t } = useTranslation();

  const [isWaiting, setIsWaiting] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const MatchmakingAPI = 'http://localhost:3000/api/game/matchmaking';

  useEffect(() => {
    let intervalId: number | undefined;
    const checkMatch = async () => {
		try {
			const response = await fetch(MatchmakingAPI, {
			method: 'GET',
			credentials: 'include',
			headers: {},
			});
			if (response.status === 401) {
				throw new Error('User profile not found.');
			}
			if (!response.ok) {
				throw new Error(`HTTP Error: ${response.status}`);
			}

			const result = await response.json();

			if (result.data && result.message == 'Match created') {
				setIsWaiting(true);
				if (!intervalId) {
					intervalId = setInterval(checkMatch, 3000); //we check every 3s if player 2 joined 
				}
			} else if (result.data && result.message == 'Match found') {
				setIsWaiting(false);
				setGameStarted(true);
			} else {
				throw new Error(result.message);
			}
		} catch (e) {
			console.error('Failed to create match: ', e);
		}
    };
    checkMatch();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative">
      <SettingsMenu />
	  <div className={`${colorClasses.bgGlow} flex items-center justify-center p-4`} style={{ height: 'calc(100vh - 80px)' }}>
	  {isWaiting && (
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center animate-bounce-slow">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800">{t('waiting_player')}</h2>
          </div>
      )}
        <div className="flex lg:flex-row bg-opacity-50 backdrop-blur-sm items-center max-w-full mx-auto z-0">
			{(gameStarted) && (
          		<iframe
            		id="game"
            		title="Pong Game"
            		width="2400"
            		height="1200"
            		src="http://localhost:5174"
          		></iframe>
			)}
        </div>
      </div>
	</div>
  );
};

export default SingleMatch;
