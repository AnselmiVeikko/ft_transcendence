import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserEdit, FaCameraRetro } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import { useGreetings } from '../hooks/useGreetings';
import { useProfileUpdate } from '../hooks/useProfileUpdate';
import { useAvatarUpdate } from '../hooks/useAvatarUpdate';
import ProfileCard from '../components/ProfileCard';
import ProfileModal from '../components/ProfileModal';

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

const ProfileSettings = () => {
  const { t } = useTranslation();
  const { userName, email, loading, avatarUrl, refetch } = useUser();
  const greetingKey = useGreetings();

  // modal states
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // form states
  const [tempUsername, setTempUsername] = useState('');
  const [selectedGridAvatar, setSelectedGridAvatar] = useState('');
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);

  // logic hooks
  const { updateUsername, isSaving: isSavingName } = useProfileUpdate(async () => {
    await refetch();
    setIsUsernameModalOpen(false);
  });

  const { updateAvatar, isSaving: isSavingAvatar } = useAvatarUpdate(async () => {
    await refetch();
    setIsAvatarModalOpen(false);
  });

  // event handlers
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUsername || tempUsername === userName) return;
    await updateUsername(tempUsername);
  };

  const handleSaveSelectedAvatar = async () => {
    if (!selectedGridAvatar) return;
    try {
      const response = await fetch(selectedGridAvatar);
      const blob = await response.blob();
      const file = new File([blob], "avatar.png", { type: "image/png" });
      await updateAvatar(file);
    } catch (error) {
      console.error("Failed to convert grid selection to file", error);
    }
  };

  const avatars = Array.from({ length: 20 }, (_, i) =>
    `/avatar_gallery/avatar${String(i + 1).padStart(2, '0')}.png`
  );

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-screen">

      <div
        className={`flex flex-col grow items-center justify-center p-4 w-full`}
      >
        <div className="mb-4 pt-8 md:pt-0 p-6 text-center max-w-5xl w-full z-10">
          <h1 className="text-2xl font-extrabold tracking-tight sm:pb-2 bg-clip-text text-transparent bg-linear-to-r from-indigo-700 to-blue-200 sm:text-4xl lg:text-5xl">
            {t('profile_settings')}
          </h1>
        </div>

        <div className="mb-12 p-6 text-center max-w-5xl w-full z-10 flex items-center justify-center">
          <div
            className={`w-70 lg:w-90 h-80 md:h-90 lg:h-90 flex flex-col items-center justify-center p-8 bg-linear-to-br from-indigo-100/10 via-blue-100/10 to-violet-100/10 hover:bg-linear-to-t hover:from-blue-100/20 hover:via-indigo-100/20 hover:to-violet-100/30
			backdrop-blur-md border dark:border-white/20 border-black/10 rounded-2xl shadow-2xl transition duration-300 transform hover:scale-[1.03]`}>
            <img 
		   		src={avatarUrl || '/avatars/default/default.webp'}
				className="w-20 h-20 rounded-xl border border-black/10 dark:border-white/50 shadow-lg object-cover mb-8"
				onClick={() => { setSelectedGridAvatar(avatarUrl); setIsAvatarModalOpen(true); }}
                alt="User Avatar"
			/>
            <h2 className="text-2xl font-black text-slate-700 dark:text-white">{userName}</h2>
		    <p className="text-xl font-medium bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-blue-400 hover:bg-linear-to-bl">{email}</p>
		</div>
		</div>
		<p className="mt-2 mb-12 text-xl font-bold text-indigo-300/80">
            {t(greetingKey)}?
        </p>

        <div className="flex flex-col sm:flex-row gap-8">
          <ProfileCard
            title={t('change_username')}
            icon={<FaUserEdit />}
            colorClass={colorClasses.userName}
            onClick={() => {
                setTempUsername(userName);
                setIsUsernameModalOpen(true);
            }}
          />
          <ProfileCard
            title={t('change_avatar')}
            icon={<FaCameraRetro />}
            colorClass={colorClasses.avatar}
            onClick={() => setIsAvatarModalOpen(true)}
          />
        </div>
      </div>

      <ProfileModal isOpen={isUsernameModalOpen} onClose={() => setIsUsernameModalOpen(false)}>
        <form onSubmit={handleUsernameSubmit} className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">{t('change_username')}</h3>
            <p className="text-sm text-gray-400">{t('current_username')}: <span className="text-indigo-400 font-bold">{userName}</span></p>
          </div>
          <input
            type="text"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={t('enter-new-username')}
            minLength={3}
            maxLength={20}
            required
          />
          <button
            type="submit"
            disabled={isSavingName || tempUsername === userName || !tempUsername}
            className="w-full p-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingName ? t('saving') : t('save')}
          </button>
        </form>
      </ProfileModal>

      <ProfileModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)}>
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white text-center">{t('change_avatar')}</h3>
          
          <div className="grid grid-cols-5 gap-6 max-h-80 overflow-y-auto p-2 custom-scrollbar">
            {avatars.map(url => (
              <img
                key={url}
                src={url}
                onClick={() => setSelectedGridAvatar(url)}
                className={`w-full aspect-square rounded-xl cursor-pointer border-2 transition-transform hover:scale-110 ${
                    selectedGridAvatar === url ? 'border-indigo-500 scale-105' : 'border-transparent'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleSaveSelectedAvatar}
            disabled={isSavingAvatar || !selectedGridAvatar}
            className="w-full p-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl disabled:opacity-50"
          >
            {isSavingAvatar ? t('saving') : t('save_selected')}
          </button>

          <div className="relative flex items-center py-2">
            <div className="grow border-t border-white/10"></div>
            <span className="shrink mx-4 text-gray-500 text-xs uppercase">{t('or_upload')}</span>
            <div className="grow border-t border-white/10"></div>
          </div>

          <input
            type="file"
            id="avatar-file"
            className="hidden"
            onChange={(e) => e.target.files && setNewAvatarFile(e.target.files[0])}
          />
          <label
            htmlFor="avatar-file"
            className="block w-full p-4 border-2 border-dashed border-white/10 rounded-xl text-center text-gray-400 hover:border-indigo-500 cursor-pointer transition-colors"
          >
            {newAvatarFile ? newAvatarFile.name : t('select_file')}
          </label>

          <button
            onClick={() => newAvatarFile && updateAvatar(newAvatarFile)}
            disabled={isSavingAvatar || !newAvatarFile}
            className="w-full p-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl disabled:opacity-50"
          >
            {isSavingAvatar ? t('uploading') : t('upload_avatar')}
          </button>
        </div>
      </ProfileModal>
    </div>
  );
};

export default ProfileSettings;
