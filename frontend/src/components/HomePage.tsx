import { useState } from "react";
import { GrClose } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser, FaUserFriends, FaSignOutAlt } from "react-icons/fa";


const HomePage = () => {

  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    console.log('Logging out soon...');
  };

  return (
    <header className="bg-slate-900/95 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Desktop view and hidden on mobile*/}
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
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg "
          >
            <FaUserFriends className="w-5 h-5" />
            <span className="font-semibold">Friends</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg "
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="font-semibold">Log out</span>
          </button>
        </nav>

        {/* mobile view here and hidden on desktop */}
        <nav className="sm:hidden flex flex-col items-end gap-2 relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-white font-bold text-2xl hover:bg-white/10 p-2 rounded-lg "
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
                className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 text-white font-semibold w-full text-left"
              >
                <FaUserFriends className="w-5 h-5" />
                <span>Friends</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 text-white font-semibold w-full text-left border-t border-gray-500/30"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default HomePage;