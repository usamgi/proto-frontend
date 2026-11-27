import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import share from '@/assets/share.svg';
import { homeQueries } from '@/pages/home/home-queries';
import { MissionWord } from '@/pages/home/mission-word';
import { useAuth } from '@/shared/auth/auth-context';
import { useTodayMission } from '@/shared/services/mission/use-today-mission';
import { Header } from '@/shared/ui/Header';
import { Screen } from '@/shared/ui/Screen';

import { DetailCell } from './DetailCell';
import { MissionChips } from './MissionChips';
import {
  detailCellsOf,
  formatMissionDate,
  missionChipsOf,
  type MissionChipData,
  type RoomDetailRows,
} from './room-detail-data';
import { useRoomDetail } from './use-room-detail';

function StatusMessage({ children }: { children: string }) {
  return <p className="pt-40 text-center text-body-16 font-medium text-ink-mute">{children}</p>;
}

interface MissionPhotosProps {
  userId: string;
  groupId: string;
  rows: RoomDetailRows;
  mission: MissionChipData;
  isCurrentMission: boolean;
}

/** 고른 미션의 날짜와 단어, 사진 그리드 */
function MissionPhotos({ userId, groupId, rows, mission, isCurrentMission }: MissionPhotosProps) {
  const photos = rows.photos.filter((photo) => photo.mission_id === mission.id);
  const { data: urls } = useQuery(homeQueries.photoUrls(photos));
  const cells = detailCellsOf(userId, groupId, rows, mission.id, isCurrentMission);

  return (
    <div className="mt-4.5 flex flex-col gap-5 px-4 pb-32">
      <div className="flex flex-col gap-3">
        <p className="flex items-center gap-1.5 text-[16px] leading-4 font-medium tracking-[-0.32px]">
          <span className="text-blue">{formatMissionDate(mission.missionDate)}</span>
          <span className="text-blue">미션</span>
          <span aria-hidden className="size-[3.2px] rounded-full bg-navy/12" />
          <span className="text-navy/40">{mission.doneCount}명 참여</span>
        </p>
        <MissionWord word={mission.keyword} placement="detail" />
      </div>
      <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5">
        {cells.map((cell) => (
          <DetailCell
            key={cell.id}
            cell={cell}
            photoUrl={'photoPath' in cell ? (urls?.get(cell.photoPath) ?? '') : ''}
            groupId={groupId}
          />
        ))}
      </ul>
    </div>
  );
}

/**
 * @description 방 하나의 미션별 사진을 크게 보는 화면. 위쪽 칩으로 지난 미션의 사진도 봅니다.
 *
 * @remarks
 * 처음에는 지금 미션을 보입니다. 오른쪽 위 공유 버튼은 고른 미션의 공유 화면으로 갑니다. 지금 미션에 내가 아직 안 보냈으면(친구 사진을 가린 동안) 누를 수 없습니다.
 * @internal
 * @name RoomDetailPage
 * @tag div
 */
export function RoomDetailPage() {
  const { groupId = '' } = useParams();
  const { session } = useAuth();
  const userId = session?.user.id ?? '';
  const detail = useRoomDetail(userId, groupId);
  const { mission: currentMission } = useTodayMission();
  const currentMissionId = currentMission?.id ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const chips =
    detail.status === 'ready'
      ? missionChipsOf(detail.missions, detail.rows.photos, currentMissionId)
      : [];
  const selected =
    chips.find((chip) => chip.id === selectedId) ??
    chips.find((chip) => chip.id === currentMissionId) ??
    chips[0];
  const isLocked =
    detail.status === 'ready' &&
    selected?.id === currentMissionId &&
    !detail.rows.photos.some(
      (photo) => photo.mission_id === selected.id && photo.user_id === userId,
    );
  const navigate = useNavigate();

  function renderBody() {
    if (detail.status === 'loading') return null;
    if (detail.status === 'missing') return <StatusMessage>방을 찾을 수 없어요</StatusMessage>;
    if (detail.status === 'error') {
      return <StatusMessage>불러오지 못했어요. 잠시 뒤 다시 열어 주세요</StatusMessage>;
    }
    if (!selected) return <StatusMessage>아직 올라온 사진이 없어요</StatusMessage>;

    return (
      <>
        <MissionChips
          chips={chips}
          selectedId={selected.id}
          currentMissionId={currentMissionId}
          onSelect={setSelectedId}
        />
        <MissionPhotos
          key={selected.id}
          userId={userId}
          groupId={groupId}
          rows={detail.rows}
          mission={selected}
          isCurrentMission={selected.id === currentMissionId}
        />
      </>
    );
  }

  return (
    <div className="relative isolate mx-auto min-h-dvh max-w-100.5 bg-[#fafafa]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[calc(68px+env(safe-area-inset-top))] bg-white" />
      <Screen
        header={
          <div className="relative px-4 py-2.5">
            <Header title={detail.status === 'ready' ? detail.name : undefined} />
            <button
              type="button"
              aria-label="공유"
              disabled={!selected || isLocked}
              onClick={() =>
                selected && void navigate(`/rooms/${groupId}/share?mission=${selected.id}`)
              }
              className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2 items-center justify-center disabled:opacity-40"
            >
              <img src={share} alt="" />
            </button>
          </div>
        }
      >
        <div className="mt-2">{renderBody()}</div>
      </Screen>
      {/* 사진이 많아 하단 탭(TabLayout) 아래로 내려간 내용을 가립니다. 탭 높이(80px)의 가운데까지 덮습니다 */}
      <div
        aria-hidden
        className="fixed inset-x-0 bottom-0 z-10 mx-auto h-[calc(max(31px,env(safe-area-inset-bottom))+40px)] max-w-100.5 bg-[#fafafa]"
      />
    </div>
  );
}
