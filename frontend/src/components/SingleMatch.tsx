import { useTranslation } from 'react-i18next';
import SettingsMenu from './SettingsMenu';
import { useUser } from '../hooks/useUser';
import { useMatchmaking } from '../hooks/useMatchmaking';

const colorClasses = {
  start: 'bg-gradient-to-b from-indigo-700 to-blue-300 hover:bg-gradient-to-r hover:to-indigo-200',
  bgGlow: 'bg-glow [animation:blob-drift_20s_ease-in-out_infinite]',
};

const SingleMatch = () => {
  const { t } = useTranslation();
  const { userName, loading: userLoading } = useUser();
  const { isWaiting, gameStarted, matchId } = useMatchmaking();

  if (userLoading) return null;

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
              id="game"
              title="Pong Game"
              width="2400"
              height="1200"
              src="http://localhost:5174"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleMatch;
