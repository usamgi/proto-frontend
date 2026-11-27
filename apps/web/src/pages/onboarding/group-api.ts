import { supabase } from '@/shared/api/supabase';

import type { Group } from './onboarding-context';

interface GroupRow {
  id: string;
  name: string;
  created_at: string;
  invite_code: string;
}

/**
 * @description 참여 확인 화면에 첫 글자로 보이는 그룹 멤버.
 *
 * @remarks
 * 프로필 사진 주소는 본인이 아무 주소로나 바꿀 수 있어 읽지 않습니다. 저장소에서 만든 주소인지 확인할 수 있을 때 더합니다.
 */
export interface GroupMember {
  id: string;
  nickname: string;
}

async function fetchGroup(groupId: string): Promise<Group> {
  const { data, error } = await supabase
    .from('groups')
    .select('id, name, created_at, invite_code')
    .eq('id', groupId)
    .single<GroupRow>();
  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    createdAt: new Date(data.created_at),
    inviteCode: data.invite_code,
  };
}

/** 초대 링크(`/join?code=`)를 붙여 넣어도, 코드만 넣어도 코드를 꺼냅니다. */
function inviteCodeOf(linkOrCode: string) {
  const value = linkOrCode.trim();
  if (!URL.canParse(value)) return value;

  return new URL(value).searchParams.get('code') ?? value;
}

/**
 * @description 그룹을 만들고 만든 사람을 방장으로 넣습니다(`create_group`).
 *
 * @throws 로그인하지 않았거나 이름이 비었거나 50자를 넘으면 Supabase 오류
 */
export async function createGroup(name: string) {
  const { data, error } = await supabase.rpc('create_group', { group_name: name });
  if (error) throw error;

  return fetchGroup((data as { group_id: string }).group_id);
}

/**
 * @description 초대 링크나 초대 코드로 그룹에 들어갑니다(`join_group`).
 *
 * @remarks
 * 이미 들어간 그룹이면 다시 넣지 않고 그 그룹을 돌려줍니다. 그룹은 멤버만 읽을 수 있어서 들어간 뒤에 그룹 정보를 읽습니다.
 * @throws 없는 코드이거나 그룹이 10명으로 찼으면 Supabase 오류
 */
export async function joinGroup(linkOrCode: string) {
  const { data, error } = await supabase.rpc('join_group', {
    input_invite_code: inviteCodeOf(linkOrCode),
  });
  if (error) throw error;

  return fetchGroup((data as { group_id: string }).group_id);
}

/** 친구에게 보낼 초대 링크. 참여 화면(`/join`)이 `code`를 읽어 입력칸을 채웁니다. */
export function inviteLinkOf(group: Group) {
  return `${window.location.origin}/join?code=${group.inviteCode}`;
}

/**
 * @description 그룹 멤버를 들어간 순서로 읽습니다. 나도 들어 있습니다.
 *
 * @throws 그룹 멤버가 아니라 읽을 수 없으면 Supabase 오류
 */
export async function fetchGroupMembers(groupId: string): Promise<GroupMember[]> {
  const { data: members, error } = await supabase
    .from('group_members')
    .select('user_id, nickname')
    .eq('group_id', groupId)
    .order('joined_at')
    .returns<{ user_id: string; nickname: string | null }[]>();
  if (error) throw error;

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, name')
    .in(
      'id',
      members.map((member) => member.user_id),
    )
    .returns<{ id: string; name: string }[]>();
  if (profileError) throw profileError;

  const nameOf = new Map(profiles.map((profile) => [profile.id, profile.name]));
  // 그룹 닉네임을 정하지 않은 멤버는 프로필 이름(소셜 로그인 이름)을 보여 준다
  return members.map(({ user_id, nickname }) => ({
    id: user_id,
    nickname: nickname ?? nameOf.get(user_id) ?? '',
  }));
}

/**
 * @description 이 그룹에서만 쓰는 내 닉네임을 저장합니다(`group_members.nickname`).
 *
 * @remarks
 * 저장하지 않으면 `null`로 남고, 화면에는 프로필 이름이 보입니다.
 * @throws 저장에 실패하면 Supabase 오류
 */
export async function updateGroupNickname(groupId: string, userId: string, nickname: string) {
  const { error } = await supabase
    .from('group_members')
    .update({ nickname })
    .eq('group_id', groupId)
    .eq('user_id', userId);
  if (error) throw error;
}
