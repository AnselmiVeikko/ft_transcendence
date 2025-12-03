import React from 'react';
import Header from './Header'; 
import { useTranslation } from 'react-i18next'
import SettingsMenu from './SettingsMenu'
import { FaPlay, FaTrophy, FaChartBar } from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface MenuCardProps {
  title: string;
  colorClass: string;
  icon: React.ReactNode;
  to: string;
}

const colorClasses = {
	start: 'bg-gradient-to-b from-indigo-700 to-blue-300 hover:bg-gradient-to-r hover:to-indigo-200',
	tournament: 'bg-gradient-to-b from-violet-700 to-blue-300 hover:bg-gradient-to-r hover:to-violet-200',
	stats: 'bg-gradient-to-b from-fuchsia-600 to-blue-300 hover:bg-gradient-to-r hover:to-fuchsia-200',
	bgGlow: 'bg-glow [animation:blob-drift_30s_ease-in-out_infinite]',
};

const MenuCard = ({ title, colorClass, icon, to }: MenuCardProps) => (
    <Link
        to={to}
        className={`w-full lg:w-60 lg:h-90 flex flex-col items-center justify-center p-6 
                    text-white rounded-xl shadow-lg transition duration-300 
                    transform hover:scale-[1.07] hover:shadow-xl ${colorClass}`}>
        <div className="text-4xl mb-3">{icon}</div>
        <span className="text-xl font-bold uppercase tracking-wider">{title}</span>
    </Link>
);
// ---------------------------------------

const Menu = () => {

  const handleLogout = () => {
    console.log('Logging out from Menu component...');
  };

  const handleFriendsClick = () => {
    console.log('Navigating to Friends list...');
  };

  const { t } = useTranslation();

  return (
    <div className="relative h-screen overflow-hidden">
		
      <SettingsMenu />
      <Header
        appName="PONG"
        playerName="Player1"
        onFriendsClick={handleFriendsClick}
        onLogout={handleLogout}
      />
      <div 
        className={`${colorClasses.bgGlow} flex items-center justify-center p-4`}
        style={{ height: 'calc(100vh - 3.5rem)' }} // make sure content fits below header
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto z-10">
          
          <MenuCard
            title={t('single_match')}
            colorClass={colorClasses.start}
            icon={<FaPlay />}
            to="/singlematch"
          />
          
          <MenuCard
            title={t('tournament')}
            colorClass={colorClasses.tournament}
            icon={<FaTrophy />}
            to="/"
          />
          
          <MenuCard
            title={t('stats')}
            colorClass={colorClasses.stats}
            icon={<FaChartBar />}
            to="/"
          />
        </div>
      </div>
    </div>
  );
};

export default Menu;