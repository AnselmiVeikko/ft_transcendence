import React, { useState, useEffect } from 'react';
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

  const handleLogout = () => {
	console.log('Logging out from Menu component...');
  };

  const handleFriendsClick = () => {
	console.log('Navigating to Friends list...');
  };

  const { t } = useTranslation();
  
  const [userName, setUserName] = useState('Loading...');
  const SelfAPI = 'http://localhost:3000/api/user/profile/self';

  useEffect(() => {
	const fetchUserName = async () => {
		try {
			const response = await fetch(SelfAPI, {
				method: 'GET',
				credentials: 'include',
				headers: {
				},
			});
			if (response.status === 401) {
				throw new Error("User not authenticated.");
			}
			if (!response.ok) {
				throw new Error(`HTTP Error: ${response.status}`);
			}
			const result = await response.json();

  			if (result.data && result.data.userName) {
				console.log(result.data.userName);
				setUserName(result.data.userName);
			} else {
				throw new Error(result.message);
			}
		} catch (e) {
			console.error("Failed to fetch user profile: ", e);
			setUserName("Player1");
		}
	};
	fetchUserName();
  }, []);

  return (
	<div className="relative h-screen overflow-hidden">
		
	  <SettingsMenu />
	  <Header
		appName="PONG"
		playerName={userName}
		onFriendsClick={handleFriendsClick}
		onLogout={handleLogout}
	  />
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