import { useState, useEffect } from 'react';
import { GrClose } from 'react-icons/gr';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaUser, FaUserFriends, FaSignOutAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { HandHelping } from 'lucide-react';
import { useLogout } from '../hooks/useLogout';
import { useUser } from '../hooks/useUser';

const Header = () => {
  const { logout } = useLogout();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { userName, loading: userLoading } = useUser();

  const handlePongClick = () => {
    setShowMenu(false);
    navigate('/menu');
  };

  const handleFriendsClick = () => {
    setShowMenu(false);
    navigate('/friends');
  };

  const handleProfileClick = () => {
    setShowMenu(false);
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    setShowMenu(false);
	logout();
  };

  const { t } = useTranslation();

  if (userLoading) return null;

  return (
    <header className="bg-linear-to-b from-slate-900 to-slate-700 p-4 h-20 sticky top-0 z-15">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
		  	  onClick={handlePongClick}
			  className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-t from-indigo-700 to-blue-200 px-4 transform hover:scale-[1.05] py-2 duration-300">
              PONG
          </button>

          <div className="hidden sm:flex items-center gap-4">
            <div className="h-8 w-px bg-purple-500/50"></div>
			<button
			  onClick={handleProfileClick}
			  className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transform hover:scale-[1.03] duration-300">
              <img src='avatars/avatar01.png' className="w-7 h-7" />
              <span className="font-semibold">{userName}</span>
			</button>
          </div>
        </div>

        <nav className="hidden sm:flex items-center gap-6">
          <button
            onClick={handleFriendsClick}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transform hover:scale-[1.03] duration-300"
          >
            <FaUserFriends className="w-5 h-5" />
            <span className="font-semibold">{t('friends')}</span>
          </button>

          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transform hover:scale-[1.03] duration-300"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="font-semibold">{t('log_out')}</span>
          </button>
        </nav>

        {/* mobile view here and hidden on desktop */}
        <nav className="sm:hidden flex flex-col items-end gap-2 relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-white font-bold text-2xl hover:bg-white/10 p-2 rounded-lg"
            aria-label={showMenu ? 'Close menu' : 'Open menu'}
          >
            {showMenu ? <GrClose /> : <GiHamburgerMenu />}
          </button>

          {showMenu && (
            <div className="absolute top-12 right-0 bg-slate-900/95 rounded-lg shadow-xl overflow-hidden min-w-[200px]">
              <div className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 text-white font-semibold border-b border-gray-500/30">
                <FaUser className="w-5 h-5" />
                <span>Player1</span>
              </div>

              <button
                onClick={handleFriendsClick}
                className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 text-white font-semibold w-full text-left"
              >
                <FaUserFriends className="w-5 h-5" />
                <span>{t('friends')}</span>
              </button>

              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 text-white font-semibold w-full text-left border-t border-gray-500/30"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span>{t('log_out')}</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
