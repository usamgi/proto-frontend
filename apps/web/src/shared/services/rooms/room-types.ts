import type { TableRow } from '@/shared/services/database-types';

/** `groups` 표에서 읽는 칸. 내가 속한 방 하나입니다. */
export type GroupRow = Pick<TableRow<'groups'>, 'id' | 'name'>;

/** `group_members` 표에서 읽는 칸. 어느 방에 누가 어떤 닉네임으로 있는지입니다. */
export type MemberRow = Pick<TableRow<'group_members'>, 'group_id' | 'user_id' | 'nickname'>;

/** `profiles` 표에서 읽는 칸 */
export type ProfileRow = Pick<TableRow<'profiles'>, 'id' | 'name' | 'avatar_url'>;
