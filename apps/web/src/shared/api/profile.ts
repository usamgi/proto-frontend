import { supabase } from './supabase';

export interface Profile {
  name: string;
  avatar_url: string | null;
}

/** 사용자의 profiles 행. 없으면 null */
export async function fetchProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('name, avatar_url')
    .eq('id', userId)
    .maybeSingle<Profile>();
  return data;
}
