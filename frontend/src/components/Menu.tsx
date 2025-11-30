import React from 'react';
/* import Header from './Header'; */
import { useTranslation } from 'react-i18next'
import LangSwitcher from './LangSwitcher'
import { FaPlay, FaTrophy, FaChartBar } from 'react-icons/fa';

interface MenuCardProps {
  title: string;
  colorClass: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const MenuCard = ({ title, colorClass, icon, onClick }: MenuCardProps) => (
    <button
        onClick={onClick}
        className={`w-full lg:w-60 lg:h-90 flex flex-col items-center justify-center p-6
                    text-white rounded-xl shadow-lg transition duration-300
                    transform hover:scale-[1.07] hover:shadow-xl ${colorClass}`}
    >
        <div className="text-4xl mb-3">{icon}</div>
        <span className="text-xl font-bold uppercase tracking-wider">{title}</span>
    </button>
);
// ---------------------------------------

const Menu = () => {
  const handleButtonClick = (buttonName: string) => {
    console.log(`${buttonName} clicked`);
  };

/*   const handleLogout = () => {
    console.log('Logging out from Menu component...');
  };

  const handleFriendsClick = () => {
    console.log('Navigating to Friends list...');
  }; */

  const { t } = useTranslation();

  const colorClasses = {
      start: 'bg-gradient-to-b from-indigo-700 to-blue-300 hover:bg-gradient-to-r hover:to-indigo-200',
      tournament: 'bg-gradient-to-b from-violet-700 to-blue-300 hover:bg-gradient-to-r hover:to-violet-200',
      stats: 'bg-gradient-to-b from-fuchsia-600 to-blue-300 hover:bg-gradient-to-r hover:to-fuchsia-200',
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <LangSwitcher />
{/*       <Header
        appName="PONG"
        playerName="Player1"
        onFriendsClick={handleFriendsClick}
        onLogout={handleLogout}
      /> */}
      <div
        className="bg-linear-to-b from-white to-slate-100  flex items-center justify-center p-4"
        style={{ height: 'calc(100vh - 3.5rem)' }} // make sure content fits below header
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto">
          <MenuCard
            title={t('single_match')}
            colorClass={colorClasses.start}
            icon={<FaPlay />}
            onClick={() => handleButtonClick('Start')}
          />
          <MenuCard
            title={t('tournament')}
            colorClass={colorClasses.tournament}
            icon={<FaTrophy />}
            onClick={() => handleButtonClick('Tournament')}
          />
          <MenuCard
            title={t('stats')}
            colorClass={colorClasses.stats}
            icon={<FaChartBar />}
            onClick={() => handleButtonClick('Stats')}
          />
        </div>
      </div>
    </div>
  );
};

export default Menu;
