import React from 'react';
import Header from './Header'; 
import { useTranslation } from 'react-i18next'
import SettingsMenu from './SettingsMenu'
import { FaPlay, FaTrophy, FaChartBar } from 'react-icons/fa';
import { Link } from 'react-router-dom'

const colorClasses = {
	start: 'bg-gradient-to-b from-indigo-700 to-blue-300 hover:bg-gradient-to-r hover:to-indigo-200',
	tournament: 'bg-gradient-to-b from-violet-700 to-blue-300 hover:bg-gradient-to-r hover:to-violet-200',
	stats: 'bg-gradient-to-b from-fuchsia-600 to-blue-300 hover:bg-gradient-to-r hover:to-fuchsia-200',
	bgGlow: 'bg-glow [animation:blob-drift_20s_ease-in-out_infinite]',
};

// ---------------------------------------

const SingleMatch = () => {

  const { t } = useTranslation();

  return (
	<div className="relative h-screen overflow-hidden">
		
	  <SettingsMenu />
	  {/* <Header
		appName="PONG"
		playerName={userName}
		onFriendsClick={handleFriendsClick}
		onLogout={handleLogout}
	  /> */}
	  <div 
		className={`${colorClasses.bgGlow} flex items-center justify-center p-4`}
		style={{ height: 'calc(100vh - 3.5rem)' }} // make sure content fits below header
	  >
		<div className="flex lg:flex-row items-center max-w-full mx-auto z-0">

		  <iframe
			id="game"
			title="Pong Game"
			width="2400"
			height="1200"
			src="http://localhost:5174">
		</iframe>
		</div>
	  </div>
	</div>
  );
};

export default SingleMatch;