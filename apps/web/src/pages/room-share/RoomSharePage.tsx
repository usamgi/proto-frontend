import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';

import airdropIcon from '@/assets/share-airdrop.png';
import downloadIcon from '@/assets/share-download.svg';
import instagramIcon from '@/assets/share-instagram.png';
import kakaoIcon from '@/assets/share-kakao.png';
import { homeQueries } from '@/pages/home/home-queries';
import { detailCellsOf, missionChipsOf } from '@/pages/room-detail/room-detail-data';
import { useRoomDetail } from '@/pages/room-detail/use-room-detail';
import { useAuth } from '@/shared/auth/auth-context';
import { useTodayMission } from '@/shared/services/mission/use-today-mission';
import { Header } from '@/shared/ui/Header';
import { Screen } from '@/shared/ui/Screen';
import { Toast } from '@/shared/ui/Toast';

import { drawShareCard, type ShareCardCell } from './draw-share-card';

const NOTICE_MS = 2000;

/** 파일 이름에 못 쓰는 문자와 띄어쓰기를 뺍니다. */
function fileNamePart(value: string) {
  return value.replace(/[\\/:*?"<>|\s]/g, '');
}

/** `USAGI_방이름_단어_날짜.png`. 날짜는 `20261126` 모양입니다. */
function shareFileName(groupName: string, keyword: string, missionDate: string) {
  return `USAGI_${fileNamePart(groupName)}_${fileNamePart(keyword)}_${missionDate.replaceAll('-', '')}.png`;
}

function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * @description 휴대폰 공유창(Web Share API)으로 이미지를 넘깁니다. 공유창을 못 쓰는 브라우저면 내려받습니다.
 *
 * @returns 공유창 대신 내려받았으면 `true`
 */
async function shareFile(file: File) {
  if (!navigator.canShare?.({ files: [file] })) {
    downloadFile(file);
    return true;
  }
  try {
    await navigator.share({ files: [file] });
  } catch {
    // 사용자가 공유창을 닫아도 오류로 옵니다. 따로 알릴 일이 아닙니다
  }

  return false;
}

/**
 * @description 방의 한 미션 사진을 카드 이미지로 만들어 내려받거나 공유하는 화면(시안 ROM-03 Share).
 *
 * @remarks
 * 카드 이미지는 화면에 들어오면 미리 만들어 둡니다. 아이폰은 누른 직후에만 공유창을 열어 줘서, 누른 뒤에 만들면 공유창이 열리지 않습니다. 인스타그램, 카카오톡, AirDrop 버튼은 모두 휴대폰 공유창을 열고, 사용자가 그 안에서 앱을 고릅니다. 내가 아직 안 보내 가린 사진은 이름 첫 글자로 그립니다.
 * @internal
 * @name RoomSharePage
 * @tag div
 */
export function RoomSharePage() {
  const { groupId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const missionId = searchParams.get('mission') ?? '';
  const { session } = useAuth();
  const userId = session?.user.id ?? '';
  const detail = useRoomDetail(userId, groupId);
  const { mission: currentMission } = useTodayMission();
  const [notice, setNotice] = useState<string | null>(null);

  const isReady = detail.status === 'ready';
  const mission = isReady
    ? missionChipsOf(detail.missions, detail.rows.photos, currentMission?.id ?? null).find(
        (chip) => chip.id === missionId,
      )
    : undefined;
  const photos = isReady
    ? detail.rows.photos.filter((photo) => photo.mission_id === missionId)
    : [];
  const urls = useQuery({ ...homeQueries.photoUrls(photos), enabled: mission !== undefined });

  const cells: ShareCardCell[] =
    isReady && mission
      ? detailCellsOf(
          userId,
          groupId,
          detail.rows,
          mission.id,
          mission.id === currentMission?.id,
        ).map((cell) => {
          if (cell.kind === 'photo') {
            return {
              kind: 'photo',
              nickname: cell.nickname,
              photoUrl: urls.data?.get(cell.photoPath) ?? '',
              caption: cell.caption,
            };
          }
          return { kind: 'empty', nickname: cell.nickname };
        })
      : [];
  const card = useQuery({
    queryKey: ['share-card', groupId, missionId, cells] as const,
    queryFn: async () => {
      const blob = await drawShareCard({
        groupName: isReady ? detail.name : '',
        keyword: mission?.keyword ?? '',
        missionDate: mission?.missionDate ?? '',
        cells,
      });

      const file = new File(
        [blob],
        shareFileName(
          isReady ? detail.name : '',
          mission?.keyword ?? '',
          mission?.missionDate ?? '',
        ),
        { type: 'image/png' },
      );

      return { file, previewUrl: URL.createObjectURL(blob) };
    },
    enabled: mission !== undefined && urls.data !== undefined,
    staleTime: Infinity,
    gcTime: 0,
  });
  const previewUrl = card.data?.previewUrl;

  useEffect(() => {
    if (!previewUrl) return;

    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), NOTICE_MS);

    return () => clearTimeout(timer);
  }, [notice]);

  async function share() {
    if (!card.data) return;
    if (await shareFile(card.data.file)) setNotice('공유창을 열 수 없어 이미지를 저장했어요');
  }

  function renderPreview() {
    if (detail.status === 'error' || urls.isError || card.isError) {
      return (
        <p className="pt-40 text-center text-body-16 font-medium text-ink-mute">
          이미지를 만들지 못했어요
        </p>
      );
    }
    if (detail.status === 'missing' || (isReady && !mission)) {
      return (
        <p className="pt-40 text-center text-body-16 font-medium text-ink-mute">
          공유할 사진을 찾을 수 없어요
        </p>
      );
    }
    if (!previewUrl) return null;

    return (
      <img
        src={previewUrl}
        alt={`${isReady ? detail.name : ''} ${mission?.keyword ?? ''} 사진 카드`}
        className="mx-auto mt-6 w-80 rounded-[27.676px] shadow-[0_7.784px_3.459px_rgba(98,131,160,0.12)]"
      />
    );
  }

  const actions = [
    {
      label: '다운로드',
      icon: downloadIcon,
      onClick: () => card.data && downloadFile(card.data.file),
    },
    { label: 'Instagram', icon: instagramIcon, onClick: share },
    { label: '카카오톡', icon: kakaoIcon, onClick: share },
    { label: 'AirDrop', icon: airdropIcon, onClick: share },
  ];

  return (
    <div className="relative isolate mx-auto min-h-dvh max-w-100.5 bg-[#fafafa]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[calc(68px+env(safe-area-inset-top))] bg-white" />
      <Screen
        header={
          <div className="px-4 py-2.5">
            <Header title="공유하기" />
          </div>
        }
      >
        <div className="pb-44">{renderPreview()}</div>
      </Screen>

      {notice && (
        <div className="fixed bottom-[calc(max(29px,env(safe-area-inset-bottom))+118px)] left-1/2 z-20 -translate-x-1/2">
          <Toast message={notice} />
        </div>
      )}
      {/* 카드가 길어 버튼 줄 아래로 내려간 부분을 가립니다 */}
      <div
        aria-hidden
        className="fixed inset-x-0 bottom-0 z-10 mx-auto h-[calc(max(29px,env(safe-area-inset-bottom))+53px)] max-w-100.5 bg-[#fafafa]"
      />
      <div className="fixed bottom-[max(29px,env(safe-area-inset-bottom))] left-1/2 z-10 flex w-[calc(100%-32px)] max-w-[370px] -translate-x-1/2 items-center justify-center gap-7 rounded-[80px] bg-[#f1f1f1] px-8 py-4">
        {actions.map(({ label, icon, onClick }) => (
          <button
            key={label}
            type="button"
            disabled={!card.data}
            onClick={() => void onClick()}
            className="flex flex-col items-center gap-2 disabled:opacity-40"
          >
            <img src={icon} alt="" className="size-11 rounded-full" />
            <span className="text-[14px] leading-[22px] font-medium tracking-[0.203px] whitespace-nowrap text-navy">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
