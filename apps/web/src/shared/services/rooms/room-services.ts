import { supabase } from '@/shared/api/supabase';

import type { GroupRow, MemberRow, ProfileRow } from './room-types';

/**
 * @description 내가 속한 방을 들어간 순서로 읽습니다(`group_members`와 `groups`).
 *
 * @public
 * @param userId 로그인한 내 id
 * @throws 읽기에 실패하면 Supabase 오류
 */
export async function servFetchMyGroups(userId: string): Promise<GroupRow[]> {
  const { data, error } = await supabase
    .from('group_members')
    .select('groups(id, name)')
    .eq('user_id', userId)
    .order('joined_at')
    .returns<{ groups: GroupRow }[]>();
  if (error) throw error;

  return data.map((membership) => membership.groups);
}

/**
 * @description 내가 볼 수 있는 방 멤버를 들어간 순서로 모두 읽습니다(`group_members`).
 *
 * @remarks
 * 방 id로 거르지 않습니다. 정책(RLS)이 내 방의 멤버만 돌려주고, 그래야 내 방 목록을 기다리지 않고 함께 읽을 수 있습니다. 정책이 넓어질 때를 대비해 호출부가 내 방 id로 한 번 더 거릅니다.
 * @public
 * @throws 읽기에 실패하면 Supabase 오류
 */
export async function servFetchVisibleMembers(): Promise<MemberRow[]> {
  const { data, error } = await supabase
    .from('group_members')
    .select('group_id, user_id')
    .order('joined_at')
    .returns<MemberRow[]>();
  if (error) throw error;

  return data;
}

/**
 * @description 내가 볼 수 있는 프로필을 모두 읽습니다(`profiles`). 정책(RLS)이 나와 같은 방 사람만 돌려줍니다.
 *
 * @public
 * @throws 읽기에 실패하면 Supabase 오류
 */
export async function servFetchVisibleProfiles(): Promise<ProfileRow[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, nickname, avatar_url')
    .returns<ProfileRow[]>();
  if (error) throw error;

  return data;
}
