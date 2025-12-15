import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsMenu from './SettingsMenu';
import { FaUserEdit, FaCameraRetro, FaTimes, FaRedRiver, FaTimesCircle, FaRegTimesCircle } from 'react-icons/fa';

const colorClasses = {
    userName: 'bg-gradient-to-b from-indigo-700 to-blue-300 hover:bg-gradient-to-r hover:to-indigo-200',
    avatar: 'bg-gradient-to-b from-violet-700 to-blue-300 hover:bg-gradient-to-r hover:to-violet-200',
    bgGlow: 'bg-glow [animation:blob-drift_20s_ease-in-out_infinite]',
};

interface ProfileCardProps {
  title: string;
  colorClass: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ProfileCard = ({ title, colorClass, icon, onClick }: ProfileCardProps) => (
    <button
        onClick={onClick}
        className={`w-full lg:w-120 lg:h-90 max-w-sm flex flex-col items-center justify-center p-6 min-h-[250px]
                    text-white rounded-xl shadow-2xl transition duration-300 
                    transform hover:scale-[1.07] hover:shadow-3xl ${colorClass} backdrop-blur-sm cursor-pointer`}>
        <div className="text-4xl mb-4">{icon}</div>
        <h2 className="text-2xl font-extrabold uppercase tracking-wider mb-2">
          {title}
        </h2>
    </button>
);

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ProfileModal = ({ isOpen, onClose, children }: ProfileModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={`${colorClasses.bgGlow} fixed inset-0 z-10 flex items-center justify-center bg-opacity-50 backdrop-blur-sm duration-500`}>
            <div className={`${colorClasses.bgGlow} p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100`}>
                    <button onClick={onClose} className="text-indigo-500 hover:text-indigo-400 transition duration-150">
                        <FaTimes className="align-right w-12 h-6" />
                    </button>
                <div className="py-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- Profile Settings Component ---

const ProfileSettings = () => {
  const { t } = useTranslation();

  const welcomePhrases = [
  		'greeting_settings_need',
  		'greeting_settings_something',
  		'greeting_settings_time',
  		'greeting_settings_updates',
  		'greeting_settings_want',
   ];

  const [randomGreetingKey, setRandomGreetingKey] = useState(welcomePhrases[0]);
   
	 useEffect(() => {
	   const getRandomGreeting = () => {
		 const randomIndex = Math.floor(Math.random() * welcomePhrases.length);
		 return welcomePhrases[randomIndex];
	   };
	   setRandomGreetingKey(getRandomGreeting());
	 }, []);

  const [userName, setUserName] = useState('');
  const SelfAPI = 'http://localhost:3000/api/user/profile/self';

  useEffect(() => {
	const fetchUserName = async () => {
	  try {
		const response = await fetch(SelfAPI, {
		  method: 'GET',
		  credentials: 'include',
		  headers: {},
		});
		if (response.status === 401) {
		  throw new Error('User not authenticated.');
		}
		if (!response.ok) {
		  throw new Error(`HTTP Error: ${response.status}`);
		}
		const result = await response.json();

		if (result.data && result.data.userName) {
		  setUserName(result.data.userName);
		} else {
		  throw new Error(result.message);
		}
	  } catch (e) {
		console.error('Failed to fetch user profile: ', e);
		setUserName('Player1');
	  }
	};
	fetchUserName();
  }, []);

  const [avatarUrl, setAvatarUrl] = useState('DEFAULT_AVATAR'); // Placeholder

  const [isuserNameModalOpen, setIsuserNameModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const [newuserName, setNewuserName] = useState('');
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAvatar = async () => {
    if (!newAvatarFile) return;

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // setAvatarUrl('New URL from server'); 
    setNewAvatarFile(null);
    setIsSaving(false);
    setIsAvatarModalOpen(false); // Close the modal on success
    alert(`Avatar upload simulated for: ${newAvatarFile.name}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewAvatarFile(e.target.files[0]);
    }
  };

  return (
    <div className="relative">
      <SettingsMenu />

      <div 
        className={`${colorClasses.bgGlow} flex flex-col items-center justify-center p-4 w-full`}
        style={{ height: 'calc(100vh - 80px)' }} //header height is h-20 = 80px
      >
		<div className="mb-12 p-6 text-center max-w-5xl w-full z-10">
            <h1 className="text-2xl font-extrabold tracking-tight sm:pb-2 bg-clip-text text-transparent bg-linear-to-r from-indigo-700 to-blue-200 sm:text-4xl lg:text-5xl">
                {t(randomGreetingKey)}?
            </h1>
        </div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 max-w-5xl mx-auto z-10">

          <ProfileCard
            title={t('change_username')}
            colorClass={colorClasses.userName}
            icon={<FaUserEdit />}
            onClick={() => setIsuserNameModalOpen(true)}
          />

          <ProfileCard
            title={t('change_avatar')}
            colorClass={colorClasses.avatar}
            icon={<FaCameraRetro />}
            onClick={() => setIsAvatarModalOpen(true)}
          />

        </div>
      </div>

      <ProfileModal
        isOpen={isuserNameModalOpen}
        onClose={() => setIsuserNameModalOpen(false)}
      >
        <form onSubmit={"USERNAMESAVINGLOGICHERE"} className="space-y-6">
            <p className="text-center text-sm text-slate-700 dark:text-white">
                {t('current_username')} 
                <br />
                <strong className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500 text-xl">{userName}</strong>
            </p>
            
            <input
                type="text"
                value={newuserName}
                onChange={(e) => setNewuserName(e.target.value)}
                placeholder={t('enter-new-username')}
                className="w-full p-3 rounded-lg text-slate-700 dark:text-white border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                minLength={3}
                maxLength={20}
                disabled={isSaving}
            />
            <button
                type="submit"
                className={`w-full p-3 font-semibold rounded-lg transition duration-200 transform hover:scale-[1.03] 
                            ${isSaving 
                                ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                                : 'bg-linear-to-br from-indigo-600 to-indigo-400 hover:bg-linear-to-tl text-white'
                            }`}
                disabled={isSaving || !newuserName.trim() || newuserName === userName}
            >
                {isSaving ? t('saving') : t('save')}
            </button>
        </form>
      </ProfileModal>

      <ProfileModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      >
        <div className="flex flex-col items-center space-y-6">
            <img
                src={avatarUrl}
                alt={t('current_avatar') || 'Current Avatar'}
                className="w-28 h-28 rounded-full border-4 border-blue-400 shadow-xl object-cover"
            />
            
            <input
              id="avatar-upload-modal"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isSaving}
            />
            
            <label 
                htmlFor="avatar-upload-modal" 
                className={`cursor-pointer w-full text-center p-3 rounded-lg font-semibold transition duration-200 transform hover:scale-[1.03]
                            ${isSaving 
                              ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                              : 'bg-linear-to-br from-indigo-600 to-indigo-400 hover:bg-linear-to-tl text-white'
                            }`}>
                {newAvatarFile ? t('change_file') : t('select_file')}
            </label>
            

            {newAvatarFile && (
              <p className="text-sm text-gray-300">
                {t('selected_file') || 'Selected:'} <strong className='text-yellow-300'>{newAvatarFile.name}</strong>
              </p>
            )}

            <button
                onClick={handleSaveAvatar}
                className={`w-full p-3 font-semibold rounded-lg transition duration-200 transform hover:scale-[1.03]
                            ${isSaving || !newAvatarFile
                                ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                disabled={isSaving || !newAvatarFile}
            >
                {isSaving ? t('uploading') : t('upload_avatar')}
            </button>
        </div>
      </ProfileModal>

    </div>
  );
};

export default ProfileSettings;