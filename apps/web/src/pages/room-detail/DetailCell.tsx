import { Link } from 'react-router';

import { FadeInPhoto } from '@/pages/home/FadeInPhoto';
import { LockIcon } from '@/pages/home/icons/LockIcon';
import { InitialAvatar } from '@/pages/home/InitialAvatar';
import { StickerArea, StickerMark } from '@/pages/photo-decorate/StickerArea';
import { useStickers } from '@/pages/photo-decorate/sticker-store';

import type { DetailCellData } from './room-detail-data';

const CELL =
  'relative flex h-61 flex-col items-center overflow-hidden rounded-3xl border-[0.4px] border-white';
const EMPTY_BACKGROUND = 'bg-white bg-linear-to-r from-blue/16 to-blue/16';
const LABEL = 'text-body-18 leading-8 font-medium text-navy/50';

interface DetailCellProps {
  cell: DetailCellData;
  /** 사진 칸이 쓰는 서명 URL. 아직 만들지 못했으면 빈 문자열입니다. */
  photoUrl: string;
  groupId: string;
  /** 사진 칸을 누르면 가는 꾸미기 화면 주소에 넣는 미션 id */
  missionId: string;
}

/**
 * @description 방 상세 그리드의 한 칸. 사진, 가린 사진, 내 빈칸, 안 올린 사람 가운데 하나를 그립니다.
 *
 * @remarks
 * 사진 칸을 누르면 그 사진의 꾸미기 화면으로 갑니다. 꾸미기 화면에서 붙인 이모지를 같은 자리에 작게 그립니다. 홈 방 카드 칸(`RoomCell`)과 같은 모양이지만, 칸이 더 크고 네 귀가 모두 둥글며 올린 시간을 쓰지 않습니다(시안).
 * @internal
 * @name DetailCell
 * @tag li
 */
export function DetailCell({ cell, photoUrl, groupId, missionId }: DetailCellProps) {
  const stickers = useStickers((state) =>
    cell.kind === 'photo' ? state.byPhoto[cell.photoPath] : undefined,
  );

  if (cell.kind === 'photo') {
    return (
      <li className={`${CELL} ${EMPTY_BACKGROUND} justify-between py-4`}>
        <FadeInPhoto
          src={photoUrl}
          alt={`${cell.nickname} 사진`}
          className="absolute inset-0 size-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-navy/50 from-[3.4%] to-transparent to-[47.3%]"
        />
        <p className="relative text-body-16 font-medium text-white">{cell.nickname}</p>
        {cell.caption && (
          <p className="relative max-w-[calc(100%-16px)] truncate rounded-full bg-navy/24 px-3 py-2 text-body-16 font-medium text-white backdrop-blur-[25px]">
            {cell.caption}
          </p>
        )}
        {stickers && (
          <StickerArea>
            {stickers.map((sticker) => (
              // 줄인 이모지는 글자가 동그라미 가운데보다 오른쪽에 붙어 보여, 줄이기 전 기준 3px(칸에서 약 1.5px) 왼쪽으로 옮깁니다
              <StickerMark
                key={sticker.id}
                sticker={sticker}
                glyphClassName="-translate-x-[3px]"
                aria-hidden
              />
            ))}
          </StickerArea>
        )}
        <Link
          to={`/rooms/${groupId}/photos?mission=${missionId}&user=${cell.id}`}
          aria-label={`${cell.nickname} 사진 꾸미기`}
          className="absolute inset-0"
        />
      </li>
    );
  }
  if (cell.kind === 'locked') {
    return (
      <li className={`${CELL} ${EMPTY_BACKGROUND} justify-center`}>
        <FadeInPhoto
          src={photoUrl}
          alt=""
          className="absolute inset-0 size-full scale-110 object-cover blur-md"
        />
        <div aria-hidden className="absolute inset-0 bg-navy/24" />
        <LockIcon
          className="relative size-10 text-white"
          title={`${cell.nickname} 사진은 내 사진을 올리면 열려요`}
        />
      </li>
    );
  }
  if (cell.kind === 'mine-empty') {
    return (
      <li className={`${CELL} ${EMPTY_BACKGROUND} justify-center`}>
        <div className="flex h-24 flex-col items-center justify-between">
          <p className={LABEL}>내 사진</p>
          <div className="flex h-12 items-center">
            <Link
              to={`/camera?group=${groupId}`}
              className="rounded-[32px] bg-navy px-5 py-2 text-[16px] leading-5 font-semibold tracking-[-0.32px] text-white"
            >
              사진 찍기
            </Link>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={`${CELL} ${EMPTY_BACKGROUND} justify-center`}>
      <div className="flex h-24 flex-col items-center justify-between">
        <p className={LABEL}>{cell.nickname}</p>
        <InitialAvatar nickname={cell.nickname} avatarUrl={null} />
      </div>
    </li>
  );
}
