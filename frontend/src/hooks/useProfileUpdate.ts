import { useState } from 'react';
import apiClient from '../utils/apiClient';

export const useProfileUpdate = (onSuccess: (name: string) => void) => {
  const [isSaving, setIsSaving] = useState(false);

  const updateUsername = async (newUsername: string) => {
    setIsSaving(true);
    try {
      const response = await apiClient.put('/api/user/profile/update', {
        userName: newUsername,
      });

      const updatedName = response.data.data.userName;

      onSuccess(updatedName);
      return { success: true };
    } catch (err: any) {
	  const message = err.response?.data?.message || err.message || "Update failed";
      alert(message);
      return { success: false };
    } finally {
      setIsSaving(false);
    }
  };

  return { updateUsername, isSaving };
};