import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserEdit, FaCameraRetro } from 'react-icons/fa';
import { useUser } from '../hooks/useUser';
import { useGreetings } from '../hooks/useGreetings';
import { useProfileUpdate } from '../hooks/useProfileUpdate';
import { useAvatarUpdate } from '../hooks/useAvatarUpdate';
import SettingsMenu from './SettingsMenu';
import ProfileCard from './ProfileCard';
import ProfileModal from './ProfileModal';

const ProfileSettings = () => {
  const { t } = useTranslation();
  const { userName, email, loading, avatarURL, refetch } = useUser();
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
    `/avatars/avatar${String(i + 1).padStart(2, '0')}.png`
  );

  if (loading) return null;

  return (
    <div className="relative min-h-screen pt-28 pb-24 px-4 overflow-hidden bg-slate-950">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      <SettingsMenu />

      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12 z-10 relative">
        <div className="text-center">
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-400">
            {t('profile_settings')}
          </h1>
          <p className="mt-4 text-xl font-bold text-indigo-300/80">
            {t(greetingKey)}?
          </p>
        </div>

        {/* User Card */}
        <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col items-center">
           <img src={avatarURL || '/avatars/default/default.webp'} className="w-24 h-24 rounded-full border-4 border-indigo-500/30 mb-4 object-cover" />
           <h2 className="text-2xl font-black text-white">{userName}</h2>
           <p className="text-indigo-400 font-medium">{email}</p>
        </div>

        {/* Profile Action Cards */}
        <div className="flex flex-col sm:flex-row gap-6">
          <ProfileCard 
            title={t('change_username')} 
            icon={<FaUserEdit />} 
            colorClass="bg-gradient-to-br from-indigo-600 to-blue-600"
            onClick={() => {
                setTempUsername(userName); // Initialize input with current name
                setIsUsernameModalOpen(true);
            }} 
          />
          <ProfileCard 
            title={t('change_avatar')} 
            icon={<FaCameraRetro />} 
            colorClass="bg-gradient-to-br from-violet-600 to-indigo-600"
            onClick={() => setIsAvatarModalOpen(true)} 
          />
        </div>
      </div>

      {/* --- MODAL: CHANGE USERNAME --- */}
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

      {/* --- MODAL: CHANGE AVATAR --- */}
      <ProfileModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)}>
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white text-center">{t('change_avatar')}</h3>
          
          {/* Avatar Grid */}
          <div className="grid grid-cols-5 gap-3 max-h-48 overflow-y-auto p-2 custom-scrollbar">
            {avatars.map(url => (
              <img
                key={url}
                src={url}
                onClick={() => setSelectedGridAvatar(url)}
                className={`w-full aspect-square rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${
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
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">{t('or_upload')}</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* File Upload Section */}
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