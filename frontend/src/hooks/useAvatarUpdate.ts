import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useAvatarUpdate = (onSuccess: (newUrl: string) => void) => {
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();

  const updateAvatar = async (file: File) => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/user/avatar/set', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Upload failed');

      const newAvatarUrl = `/avatars/upload/${data.data.avatarName}?t=${Date.now()}`;
      onSuccess(newAvatarUrl);
      return { success: true };
    } catch (err: any) {
      alert(err.message);
      return { success: false };
    } finally {
      setIsSaving(false);
    }
  };

  return { updateAvatar, isSaving };
};