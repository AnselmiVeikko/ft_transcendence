import { useState } from 'react';
import { useUser } from '../context/UserContext';

interface AvatarUpdateResponse {
  message: string;
  data: {
    userId: string;
    userName: string;
    avatarName: string;
  };
}

export const useAvatarUpdate = (onSuccess: (newUrl: string) => void) => {
  const [isSaving, setIsSaving] = useState(false);
  const { refetch } = useUser();

  const updateAvatar = async (file: File) => {
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/user/avatar/set', {
        method: 'PUT',
        body: formData,
      });

      const result: AvatarUpdateResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      const newAvatarUrl = `/avatars/upload/${result.data.avatarName}?t=${Date.now()}`;
      
      onSuccess(newAvatarUrl);
	  await refetch();
      return { success: true, url: newAvatarUrl };
      
    } catch (err: any) {
      console.error("Avatar Upload Error:", err);
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  };

  return { updateAvatar, isSaving };
};