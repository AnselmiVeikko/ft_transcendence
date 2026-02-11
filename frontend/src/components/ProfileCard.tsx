import React from 'react';

interface ProfileCardProps {
  title: string;
  colorClass: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ProfileCard = ({ title, colorClass, icon, onClick }: ProfileCardProps) => (
  <button
    onClick={onClick}
    className={`w-full lg:w-56 lg:h-44 flex flex-col items-center justify-center p-6 mb-6 
                text-white rounded-2xl shadow-xl transition-all duration-300 
                origin-bottom transform hover:scale-[1.05] hover:shadow-indigo-500/20 
                ${colorClass} backdrop-blur-md cursor-pointer border border-white/10`}
  >
    <div className="text-4xl mb-3 opacity-90">{icon}</div>
    <h2 className="text-sm font-black uppercase tracking-widest text-center">
      {title}
    </h2>
  </button>
);

export default ProfileCard;