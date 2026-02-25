import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'
import { FaPlay, FaUserEdit, FaRobot } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext';

interface MenuCardProps {
  title: string;
  colorClass: string;
  icon: React.ReactNode;
  to: string;
}

const colorClasses = {
	start: 'bg-gradient-to-b from-indigo-700 to-blue-300 hover:bg-gradient-to-r hover:to-indigo-200',
	ai_match: 'bg-gradient-to-b from-violet-700 to-blue-300 hover:bg-gradient-to-r hover:to-violet-200',
	stats: 'bg-gradient-to-b from-fuchsia-600 to-blue-300 hover:bg-gradient-to-r hover:to-fuchsia-200',
	bgGlow: 'bg-glow [animation:blob-drift_30s_ease-in-out_infinite]',
};

const MenuCard = ({ title, colorClass, icon, to }: MenuCardProps) => (
    <Link
        to={to}
        className={`w-full sm:h-60 lg:w-60 lg:h-90 flex flex-col items-center justify-center p-4 sm:p-6 
                    text-white rounded-xl shadow-lg transition duration-300 
                    transform hover:scale-[1.07] hover:shadow-xl ${colorClass}`}>
        <div className="text-xl md:text-4xl mb-3">{icon}</div>
        <span className="text-sm md:text-xl font-bold uppercase tracking-wider">{title}</span>
    </Link>
);

const Menu = () => {
  const { t } = useTranslation();
  const { userName } = useUser();

  const welcomePhrases = [
    'greeting_welcome',
    'greeting_hey_there',
    'greeting_good_to_see_you',
    'greeting_lets_play',
    'greeting_hello',
  ];

  const [randomGreetingKey, setRandomGreetingKey] = useState(welcomePhrases[0]);

  useEffect(() => {
    const getRandomGreeting = () => {
      const randomIndex = Math.floor(Math.random() * welcomePhrases.length);
      return welcomePhrases[randomIndex];
    };
    setRandomGreetingKey(getRandomGreeting());
  }, []);

  return (
    <div className="relative">
      <div
        className={`flex flex-col items-center justify-center p-4 w-full`}
        style={{ height: 'calc(100vh - 11rem)' }}
      >
        <div className="mb-4 sm:mb-12 p-6 text-center max-w-5xl w-full z-10">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight sm:pb-2 bg-clip-text text-transparent bg-linear-to-r from-indigo-700 to-blue-200">
            {t(randomGreetingKey)}, {userName}!
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-12 max-w-7xl mx-auto z-10">
          <MenuCard
            title={t('single_match')}
            colorClass={colorClasses.start}
            icon={<FaPlay />}
            to="/singlematch"
          />
          <MenuCard
            title={t('ai_match')}
            colorClass={colorClasses.ai_match}
            icon={<FaRobot />}
            to="/aimatch"
          />
          <MenuCard
            title={t('profile')}
            colorClass={colorClasses.stats}
            icon={<FaUserEdit />}
            to="/profile"
          />
        </div>
      </div>
    </div>
  );
};

export default Menu;
