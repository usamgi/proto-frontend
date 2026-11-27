import type { StartedMission } from '@/shared/services/mission/mission-types';
import type { GroupPhotoRow } from '@/shared/services/photos/photo-types';
import type { GroupRow, MemberRow, ProfileRow } from '@/shared/services/rooms/room-types';

/** 방 상세 한 화면을 그리려고 읽어 온 표 모양의 묶음 */
export interface RoomDetailRows {
  groups: GroupRow[];
  members: MemberRow[];
  profiles: ProfileRow[];
  /** 이 방의 사진. 모든 미션 것을 올린 순서로 담습니다. */
  photos: GroupPhotoRow[];
}

/** 상단 칩 하나. 이 방에 사진이 올라온 미션과 지금 미션입니다. */
export interface MissionChipData {
  id: string;
  keyword: string;
  /** 한국 날짜 `YYYY-MM-DD` */
  missionDate: string;
  /** 이 방에서 이 미션에 사진을 올린 사람 수(나 포함) */
  doneCount: number;
}

/** 그리드 한 칸 */
export type DetailCellData =
  | { kind: 'photo'; id: string; nickname: string; photoPath: string; caption: string }
  | { kind: 'locked'; id: string; nickname: string; photoPath: string }
  /** 내가 안 올린 칸. 지금 미션이면 사진 찍기 버튼을, 지난 미션이면 내 이름 첫 글자를 그립니다. */
  | { kind: 'mine-empty'; id: string; nickname: string; canSend: boolean }
  | { kind: 'waiting'; id: string; nickname: string };

/**
 * @description 칩으로 보일 미션을 고릅니다. 지금 미션은 늘 넣고, 지난 미션은 이 방에 사진이 하나라도 있을 때만 넣습니다.
 *
 * @internal
 * @param missions 지금까지 열린 미션. 최근 것부터입니다.
 * @param currentMissionId 지금 회차의 미션 id. 모르면 `null`입니다.
 */
export function missionChipsOf(
  missions: StartedMission[],
  photos: GroupPhotoRow[],
  currentMissionId: string | null,
): MissionChipData[] {
  return missions
    .map((mission) => ({
      ...mission,
      doneCount: new Set(
        photos.filter((photo) => photo.mission_id === mission.id).map((photo) => photo.user_id),
      ).size,
    }))
    .filter((mission) => mission.id === currentMissionId || mission.doneCount > 0);
}

/**
 * @description 한 미션의 그리드 칸을 만듭니다. 올린 사람이 올린 순서로 앞에, 그다음 내가(안 올렸으면), 그다음 안 올린 사람이 들어온 순서로 옵니다.
 *
 * @remarks
 * 지금 미션에 내가 아직 안 보냈으면 친구 사진을 가립니다(홈 방 카드와 같습니다). 지난 미션은 더 보낼 수 없어서 가리지 않습니다.
 * @internal
 * @param missionId 그릴 미션
 * @param isCurrentMission 그릴 미션이 지금 회차의 미션이면 `true`
 */
export function detailCellsOf(
  userId: string,
  groupId: string,
  rows: RoomDetailRows,
  missionId: string,
  isCurrentMission: boolean,
): DetailCellData[] {
  const profileName = new Map(rows.profiles.map((profile) => [profile.id, profile.name]));
  const roomMembers = rows.members.filter((member) => member.group_id === groupId);
  const nicknameOf = (id: string) =>
    roomMembers.find((member) => member.user_id === id)?.nickname ?? profileName.get(id) ?? '';
  const photos = rows.photos.filter((photo) => photo.mission_id === missionId);
  const hasMine = photos.some((photo) => photo.user_id === userId);
  const isLocked = isCurrentMission && !hasMine;

  const uploaded = photos.map((photo): DetailCellData => {
    const base = {
      id: photo.user_id,
      nickname: nicknameOf(photo.user_id),
      photoPath: photo.image_path,
    };
    if (isLocked && photo.user_id !== userId) return { kind: 'locked', ...base };

    return { kind: 'photo', ...base, caption: photo.caption ?? '' };
  });
  const mine: DetailCellData[] = hasMine
    ? []
    : [{ kind: 'mine-empty', id: userId, nickname: nicknameOf(userId), canSend: isCurrentMission }];
  const waiting = roomMembers
    .filter(
      (member) =>
        member.user_id !== userId && !photos.some((photo) => photo.user_id === member.user_id),
    )
    .map((member): DetailCellData => ({
      kind: 'waiting',
      id: member.user_id,
      nickname: nicknameOf(member.user_id),
    }));

  return [...uploaded, ...mine, ...waiting];
}

/**
 * @description 미션 날짜를 칩과 제목 줄에 쓰는 "11. 26" 모양으로 바꿉니다.
 *
 * @internal
 * @param missionDate 한국 날짜 `YYYY-MM-DD`
 */
export function formatMissionDate(missionDate: string) {
  const [, month, day] = missionDate.split('-');

  return `${Number(month)}. ${Number(day)}`;
}
