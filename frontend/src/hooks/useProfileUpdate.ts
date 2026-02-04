import { useState } from 'react';

export const useProfileUpdate = (onSuccess: (name: string) => void) => {
  const [isSaving, setIsSaving] = useState(false);

  const updateUsername = async (newUsername: string) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: newUsername }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Update failed');

      onSuccess(data.data.userName);
      return { success: true };
    } catch (err: any) {
      alert(err.message);
      return { success: false };
    } finally {
      setIsSaving(false);
    }
  };

  return { updateUsername, isSaving };
};