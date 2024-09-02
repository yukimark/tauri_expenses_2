import { defineStore } from 'pinia';
import { ref } from 'vue';
import { GetUpdateProfile } from '../types.ts';

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<GetUpdateProfile[]>([]);

  const set = async (params: GetUpdateProfile[]): Promise<void> => {
    profile.value = params;
  };

  return { profile, set };
});
