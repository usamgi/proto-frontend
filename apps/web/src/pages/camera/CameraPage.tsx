import { useSearchParams } from 'react-router';

import { useAuth } from '@/shared/auth/auth-context';
import {
  useTodayMission,
  useTodayMissionSync,
  type TodayMissionStatus,
} from '@/shared/services/mission/use-today-mission';
import { useMyGroups, type MyGroupsStatus } from '@/shared/services/rooms/use-my-groups';

import { CameraView } from './camera-view';
import { CameraHeader } from './CameraHeader';
import { PhotoPreview } from './photo-preview';
import { useSendPhoto } from './use-send-photo';
import { useShot } from './use-shot';

/** 보내기를 막는 까닭을 사용자에게 알리는 문구. 읽는 중에는 알리지 않습니다. */
function blockedNoticeOf(missionStatus: TodayMissionStatus, groupsStatus: MyGroupsStatus) {
  if (missionStatus === 'missing') return '오늘의 단어가 아직 없어요';
  if (missionStatus === 'error' || groupsStatus === 'error') {
    return '불러오지 못했어요. 잠시 뒤 다시 열어 주세요';
  }
  if (groupsStatus === 'empty')
    return '사진을 보낼 방이 없어요. 홈에서 방을 만들거나 참여해 주세요';

  return null;
}

/**
 * @description 카메라로 찍고, 찍은 사진에 캡션과 보낼 그룹을 정해 올리는 촬영 화면.
 *
 * @remarks
 * `?group=`은 내 그룹 목록에 있을 때만 방 안에서 찍은 것으로 봅니다. 보내기를 누르기 전에는 어디에도 올리지 않습니다. 오늘의 단어나 내 방이 없으면 보내기를 막고 그 까닭을 보입니다.
 * @internal
 * @name CameraPage
 * @tag main
 */
export function CameraPage() {
  const [searchParams] = useSearchParams();
  const { session } = useAuth();
  const userId = session?.user.id ?? '';
  const { mission, status: missionStatus } = useTodayMission();
  const { groups, status: groupsStatus } = useMyGroups(userId);
  const roomGroup = groups.find((group) => group.id === searchParams.get('group')) ?? null;
  const { shot, replaceShot } = useShot();
  const { isSending, hasSendError, send } = useSendPhoto(userId, mission?.id ?? null);
  const blockedNotice = blockedNoticeOf(missionStatus, groupsStatus);
  const notice = blockedNotice ?? (hasSendError ? '보내지 못했어요. 다시 눌러 주세요' : null);
  useTodayMissionSync();

  return (
    <main className="mx-auto flex min-h-dvh max-w-100.5 flex-col gap-8 bg-navy pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <CameraHeader keyword={mission?.keyword} isLeaveBlocked={isSending} />

      {shot ? (
        <PhotoPreview
          photoUrl={shot.url}
          groups={groups}
          roomGroup={roomGroup}
          isSending={isSending}
          isSendBlocked={!mission}
          onRetake={() => replaceShot(null)}
          onSend={(caption, groupIds) => void send(shot.photo, caption, groupIds)}
        />
      ) : (
        <CameraView onCapture={replaceShot} />
      )}
      {notice && (
        <p role="alert" className="px-4 text-center text-body-14 font-medium text-white/70">
          {notice}
        </p>
      )}
    </main>
  );
}
