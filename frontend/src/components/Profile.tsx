import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsMenu from './SettingsMenu';
import {
  FaUserEdit,
  FaCameraRetro,
  FaTimes,
  FaRedRiver,
  FaTimesCircle,
  FaRegTimesCircle,
} from 'react-icons/fa';

const colorClasses = {
  userName:
    'bg-gradient-to-b from-indigo-700 to-blue-300 hover:bg-gradient-to-r hover:to-indigo-200',
  profileDetails:
    'bg-gradient-to-b from-indigo-700 to-indigo-400 hover:bg-gradient-to-r hover:to-indigo-200',
  avatar:
    'bg-gradient-to-b from-violet-700 to-blue-300 hover:bg-gradient-to-r hover:to-violet-200',
  bgGlow: 'bg-glow [animation:blob-drift_20s_ease-in-out_infinite]',
  bgGlow2: 'bg-glow2 [animation:blob-drift_20s_ease-in-out_infinite]'
};

interface ProfileCardProps {
  title: string;
  colorClass: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ProfileCard = ({
  title,
  colorClass,
  icon,
  onClick,
}: ProfileCardProps) => (
  <button
    onClick={onClick}
    className={`w-full lg:w-50 lg:h-40 max-w-sm flex flex-col items-center justify-center p-6
                    text-white rounded-xl shadow-2xl transition duration-300 
                    transform hover:scale-[1.07] hover:shadow-3xl ${colorClass} backdrop-blur-sm cursor-pointer`}
  >
    <div className="text-4xl mb-2">{icon}</div>
    <h2 className="text-lg font-extrabold uppercase tracking-wider mb-1">
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
    <div
      className={`${colorClasses.bgGlow} fixed inset-0 z-10 flex items-center justify-center`}
      onClick={onClose}
    >
      <div
        className={`${colorClasses.bgGlow2} p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 border border-white/20 transform transition-all duration-300 scale-100`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="text-indigo-500 hover:text-indigo-400 transition duration-150"
        >
          <FaTimes className="align-right w-12 h-6" />
        </button>
        <div className="py-6">{children}</div>
      </div>
    </div>
  );
};

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
  const [email, setEmail] = useState('');
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
		if (result.data && result.data.email) {
          setEmail(result.data.email);
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

  const avatars = Array.from({ length: 20 }, (_, i) =>
    `/avatars/avatar${String(i + 1).padStart(2, '0')}.png`
  );

  const [avatarUrl, setAvatarUrl] = useState('/avatars/avatar01.png'); // Default to first avatar

  const [isuserNameModalOpen, setIsuserNameModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const [newuserName, setNewuserName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarUrl);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAvatar = async () => {
    if (!newAvatarFile) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // setAvatarUrl('New URL from server');
    setNewAvatarFile(null);
    setIsSaving(false);
    setIsAvatarModalOpen(false); // Close the modal on success
    alert(`Avatar upload simulated for: ${newAvatarFile.name}`);
  };

  const handleSaveSelectedAvatar = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAvatarUrl(selectedAvatar);
    setIsSaving(false);
    setIsAvatarModalOpen(false);
    alert(`Avatar changed to: ${selectedAvatar}`);
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
            {t('profile_settings')}
          </h1>
        </div>
        <div className="mb-12 p-6 text-center max-w-5xl w-full z-10 flex justify-center">
          <div
            className={`w-70 lg:w-90 h-80 md:h-90 lg:h-90 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-100/10 via-blue-100/10 to-violet-100/10 hover:bg-gradient-to-t hover:from-blue-100/20 hover:via-indigo-100/20 hover:to-violet-100/30
			backdrop-blur-md border dark:border-white/20 border-black/10 rounded-2xl shadow-2xl transition duration-300 transform hover:scale-[1.03]`}>
            <div className="relative mb-4">
              <img
                src={avatarUrl}
                className="w-20 h-20 rounded-full border border-black/10 dark:border-white/50 shadow-lg object-cover"
                alt="User Avatar"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black uppercase tracking-tight
			  bg-clip-text text-transparent bg-linear-to-r from-indigo-700 dark:from-indigo-500 to-blue-400 hover:bg-linear-to-bl">
                {userName}
              </h2>
              <p className="text-xl font-medium bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-blue-400 hover:bg-linear-to-bl">{email}</p>
              <div className="mt-3 px-4 py-1 bg-black/10 dark:bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                5 Friends
              </div>
            </div>
          </div>
        </div>
        <div className="mb-12 p-6 text-center max-w-5xl w-full z-10">
          <h2 className="text-xl font-extrabold tracking-tight sm:pb-2 bg-clip-text text-transparent bg-linear-to-r from-indigo-700 to-blue-200 sm:text-3xl lg:text-4xl">
            {t(randomGreetingKey)}?
          </h2>
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
            onClick={() => { setSelectedAvatar(avatarUrl); setIsAvatarModalOpen(true); }}
          />
        </div>
      </div>

      <ProfileModal
        isOpen={isuserNameModalOpen}
        onClose={() => setIsuserNameModalOpen(false)}
      >
        <form onSubmit={'USERNAMESAVINGLOGICHERE'} className="space-y-6">
          <p className="text-center text-sm text-slate-700 dark:text-white">
            {t('current_username')}
            <br />
            <strong className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500 text-xl">
              {userName}
            </strong>
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
                            ${
                              isSaving
                                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                : 'bg-linear-to-br from-indigo-600 to-indigo-400 hover:bg-linear-to-tl text-white'
                            }`}
            disabled={
              isSaving || !newuserName.trim() || newuserName === userName
            }
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
            className="w-28 h-28 rounded-full border-4 border-blue-400 shadow-md object-cover"
          />

          <div className="w-full space-y-4">
            <p className="text-sm font-medium text-gray-700 dark:text-white text-center">{t('avatar_select')}</p>
            <div className="grid grid-cols-5 p-4 gap-6 justify-items-center">
              {avatars.map(avatar => (
                <img
                  key={avatar}
                  src={avatar}
                  alt={avatar.replace('/avatars/', '').replace('.png', '')}
                  className={`w-12 h-12 rounded-full cursor-pointer border-2 object-cover transition duration-200 ${
                    selectedAvatar === avatar ? 'border-blue-400 shadow-md' : 'border-gray-300 shadow-sm hover:border-blue-400 transition duration-200 transform hover:scale-[1.20]'
                  }`}
                  onClick={() => setSelectedAvatar(avatar)}
                />
              ))}
            </div>
            <img
              src={selectedAvatar}
              alt="Selected Avatar"
              className="w-20 h-20 rounded-full mx-auto mb-6 border-4 border-blue-400 shadow-md transition duration-200 transform hover:scale-[1.03] object-cover"
            />
            <button
              onClick={handleSaveSelectedAvatar}
              className={`w-full p-3 mt-2 font-semibold rounded-lg transition duration-200 transform hover:scale-[1.03]
                              ${
                                isSaving || selectedAvatar === avatarUrl
                                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                  : 'bg-green-500 hover:bg-green-600 text-white'
                              }`}
              disabled={isSaving || selectedAvatar === avatarUrl}
            >
              {isSaving ? 'Saving...' : 'Save Selected Avatar'}
            </button>
          </div>

          <hr className="w-full" />

          <p className="text-center text-sm text-slate-700 dark:text-white">{t('avatar_upload')}</p>

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
                            ${
                              isSaving
                                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                : 'bg-linear-to-br from-indigo-600 to-indigo-400 hover:bg-linear-to-tl text-white'
                            }`}
          >
            {newAvatarFile ? 'Change File' : 'Select File'}
          </label>

          {newAvatarFile && (
            <p className="text-sm text-gray-300">
              Selected: <strong className="text-yellow-300">{newAvatarFile.name}</strong>
            </p>
          )}

          <button
            onClick={handleSaveAvatar}
            className={`w-full p-3 font-semibold rounded-lg transition duration-200 transform hover:scale-[1.03]
                            ${
                              isSaving || !newAvatarFile
                                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
            disabled={isSaving || !newAvatarFile}
          >
            {isSaving ? 'Uploading...' : 'Upload Avatar'}
          </button>
        </div>
      </ProfileModal>
    </div>
  );
};

export default ProfileSettings;
