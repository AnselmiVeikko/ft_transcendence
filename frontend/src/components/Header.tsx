import { useState } from "react";
import { GrClose } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser, FaUserFriends, FaSignOutAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

/* interface HeaderProps {
  appName: string;
  playerName: string;
  onLogout: () => void;
} */

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleFriendsClick = () => {
    setShowMenu(false);
    navigate("/friends");
  };

  const handleLogoutClick = () => {
    setShowMenu(false);
  };
  // 't' is for translation
  const { t } = useTranslation();

  return (
    <header className="bg-linear-to-b from-slate-900/95 to-slate-700  p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white px-4 py-2">
            PONG
          </h1>

          <div className="hidden sm:flex items-center gap-4">
            <div className="h-8 w-px bg-purple-500/50"></div>
            <div className="flex items-center gap-2 text-white px-4 py-2">
              <FaUser className="w-5 h-5" />
              <span className="font-semibold">Player1</span>
            </div>
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
}

export default Header;
