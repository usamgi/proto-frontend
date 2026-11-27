import { useQuery } from '@tanstack/react-query';
import { useRef, useState, type PointerEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import { BackIcon } from '@/pages/camera/icons/BackIcon';
import { FadeInPhoto } from '@/pages/home/FadeInPhoto';
import { formatUploadedAgo } from '@/pages/home/format-uploaded-ago';
import { homeQueries } from '@/pages/home/home-queries';
import { detailCellsOf } from '@/pages/room-detail/room-detail-data';
import { useRoomDetail } from '@/pages/room-detail/use-room-detail';
import { useAuth } from '@/shared/auth/auth-context';
import { useTodayMission } from '@/shared/services/mission/use-today-mission';

import { StickerArea, StickerMark } from './StickerArea';
import { useStickers } from './sticker-store';

/** 시안의 이모지. 시안 셋째 줄은 둘째 줄과 같아 뺐습니다. */
const EMOJIS = ['😍', '😂', '👍', '😮', '🥹', '😅', '😫', '👀', '🤯', '💘'];
/** 지금 사진에서 멀어질수록 작아지는 점 크기(8, 6, 5, 4px) */
const DOT_SIZES = ['size-2', 'size-1.5', 'size-1.25', 'size-1'];
/** 끄는 동안 손가락을 따라오는 이모지. 꾸미기 사진에 붙은 크기와 같습니다. */
const GHOST =
  'flex size-13 items-center justify-center rounded-full bg-white/40 text-[28px] leading-8 text-[#111] backdrop-blur-[10px]';

interface Slide {
  userId: string;
  nickname: string;
  photoPath: string;
  caption: string;
  uploadedAt: string;
}

/** 끌고 있는 이모지. 아래 목록에서 새로 끌어오거나, 사진에 붙인 것을 옮기는 중입니다. */
interface Drag {
  emoji: string;
  clientX: number;
  clientY: number;
  sticker?: { photoKey: string; id: string };
}

/**
 * @description 방 상세에서 누른 사진을 크게 보고, 이모지를 끌어다 붙여 꾸미는 화면(시안 ROM-04 Photo Detail).
 *
 * @remarks
 * 그 미션에 올라온 사진을 좌우로 넘겨 봅니다. 아래 이모지를 사진 위에 놓으면 붙고, 붙인 이모지를 끌어 옮기며, 사진 밖에 놓으면 떼어집니다. 이모지 가운데가 사진 안에 있어야 붙습니다. UT용이라 붙인 이모지는 서버에 저장하지 않습니다(`useStickers`).
 * @internal
 * @name PhotoDecoratePage
 * @tag main
 */
export function PhotoDecoratePage() {
  const { groupId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const missionId = searchParams.get('mission') ?? '';
  const startUserId = searchParams.get('user') ?? '';
  const navigate = useNavigate();
  const { session } = useAuth();
  const userId = session?.user.id ?? '';
  const detail = useRoomDetail(userId, groupId);
  const { mission: currentMission } = useTodayMission();
  const { byPhoto, add, move, remove } = useStickers();

  const isReady = detail.status === 'ready';
  const photos = isReady
    ? detail.rows.photos.filter((photo) => photo.mission_id === missionId)
    : [];
  const { data: urls } = useQuery({ ...homeQueries.photoUrls(photos), enabled: isReady });
  const slides: Slide[] = isReady
    ? detailCellsOf(
        userId,
        groupId,
        detail.rows,
        missionId,
        missionId === currentMission?.id,
      ).flatMap((cell) =>
        cell.kind === 'photo'
          ? [
              {
                userId: cell.id,
                nickname: cell.nickname,
                photoPath: cell.photoPath,
                caption: cell.caption,
                uploadedAt:
                  photos.find((photo) => photo.image_path === cell.photoPath)?.created_at ?? '',
              },
            ]
          : [],
      )
    : [];

  const startIndex = Math.max(
    slides.findIndex((slide) => slide.userId === startUserId),
    0,
  );
  const [current, setCurrent] = useState<number | null>(null);
  const shown = current ?? startIndex;
  const frames = useRef(new Map<number, HTMLDivElement>());
  /** 사진마다 3:4 사진 전체 영역. 이모지 위치는 이 영역 기준 비율로 저장합니다. */
  const imageBoxes = useRef(new Map<number, HTMLDivElement>());
  const [drag, setDrag] = useState<Drag | null>(null);

  /** 처음 그릴 때 누른 사진으로 넘겨 둡니다. */
  const scrollToStart = (scroller: HTMLDivElement | null) => {
    if (scroller && current === null && slides.length > 0) {
      scroller.scrollLeft = startIndex * scroller.clientWidth;
    }
  };

  function startDrag(event: PointerEvent<HTMLElement>, emoji: string, sticker?: Drag['sticker']) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ emoji, clientX: event.clientX, clientY: event.clientY, sticker });
  }

  function endDrag(event: PointerEvent<HTMLElement>) {
    if (!drag) return;
    setDrag(null);
    const slide = slides[shown];
    const frame = frames.current.get(shown)?.getBoundingClientRect();
    const image = imageBoxes.current.get(shown)?.getBoundingClientRect();
    if (!slide || !frame || !image) return;

    // 붙는지는 보이는 사진(칸) 안인지로 보고, 위치는 사진 전체 기준으로 저장합니다
    const isInside =
      event.clientX >= frame.left &&
      event.clientX <= frame.right &&
      event.clientY >= frame.top &&
      event.clientY <= frame.bottom;
    const x = (event.clientX - image.left) / image.width;
    const y = (event.clientY - image.top) / image.height;
    if (drag.sticker) {
      if (isInside) move(drag.sticker.photoKey, drag.sticker.id, x, y);
      else remove(drag.sticker.photoKey, drag.sticker.id);
    } else if (isInside) {
      add(slide.photoPath, drag.emoji, x, y);
    }
  }

  const dragHandlers = {
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (drag) setDrag({ ...drag, clientX: event.clientX, clientY: event.clientY });
    },
    onPointerUp: endDrag,
    onPointerCancel: () => setDrag(null),
  };

  function renderPhotos() {
    if (detail.status === 'error' || detail.status === 'missing') {
      return (
        <p className="pt-40 text-center text-body-16 text-white/50">사진을 불러오지 못했어요</p>
      );
    }
    if (!isReady) return <div className="aspect-[370/481]" />;
    if (slides.length === 0) {
      return (
        <p className="pt-40 text-center text-body-16 text-white/50">볼 수 있는 사진이 없어요</p>
      );
    }

    return (
      <>
        <div
          ref={scrollToStart}
          onScroll={(event) =>
            setCurrent(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))
          }
          className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto"
        >
          {slides.map((slide, index) => (
            <div key={slide.photoPath} className="w-full shrink-0 snap-center px-4">
              <div
                ref={(frame) => {
                  if (frame) frames.current.set(index, frame);
                  else frames.current.delete(index);
                }}
                className="relative aspect-[370/481] overflow-hidden rounded-[40px] bg-white/10"
              >
                <FadeInPhoto
                  src={urls?.get(slide.photoPath) ?? ''}
                  alt={`${slide.nickname} 사진`}
                  className="absolute inset-0 size-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-b from-navy/72 to-transparent to-[31.08%]"
                />
                <div className="absolute top-5 left-5 flex items-center gap-2 font-logo text-white">
                  <span
                    aria-hidden
                    className="flex size-8 items-center justify-center rounded-full bg-linear-to-b from-avatar-from to-avatar-to text-[14px] font-semibold text-navy/50"
                  >
                    {slide.nickname.slice(0, 1)}
                  </span>
                  <span className="text-[18px] font-bold tracking-[0.18px]">{slide.nickname}</span>
                  {slide.uploadedAt && (
                    <span className="text-[14px] font-medium tracking-[0.14px] opacity-50">
                      {formatUploadedAgo(slide.uploadedAt)}
                    </span>
                  )}
                </div>
                {slide.caption && (
                  <p className="absolute bottom-5 left-1/2 flex h-11 max-w-[calc(100%-40px)] -translate-x-1/2 items-center truncate rounded-full bg-navy/24 px-4 font-logo text-[16px] font-bold tracking-[0.16px] text-white backdrop-blur-[25px]">
                    {slide.caption}
                  </p>
                )}
                <StickerArea
                  ref={(box) => {
                    if (box) imageBoxes.current.set(index, box);
                    else imageBoxes.current.delete(index);
                  }}
                >
                  {(byPhoto[slide.photoPath] ?? []).map((sticker) => (
                    <StickerMark
                      key={sticker.id}
                      sticker={sticker}
                      role="img"
                      aria-label={`붙인 이모지 ${sticker.emoji}`}
                      onPointerDown={(event) =>
                        startDrag(event, sticker.emoji, {
                          photoKey: slide.photoPath,
                          id: sticker.id,
                        })
                      }
                      {...dragHandlers}
                      className={`pointer-events-auto cursor-grab touch-none ${drag?.sticker?.id === sticker.id ? 'opacity-0' : ''}`}
                    />
                  ))}
                </StickerArea>
              </div>
            </div>
          ))}
        </div>
        {slides.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {slides.map((slide, index) => {
              const distance = Math.min(Math.abs(index - shown), DOT_SIZES.length - 1);

              return (
                <span
                  key={slide.photoPath}
                  aria-hidden
                  className={`rounded-full bg-white ${DOT_SIZES[distance]} ${index === shown ? '' : 'opacity-20'}`}
                />
              );
            })}
          </div>
        )}
      </>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-100.5 flex-col bg-navy pt-[env(safe-area-inset-top)] pb-[max(12px,env(safe-area-inset-bottom))]">
      <header className="px-4 py-3">
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={() => void navigate(-1)}
          className="flex size-11 items-center justify-center rounded-full bg-white/20"
        >
          <BackIcon className="size-6 text-white" />
        </button>
      </header>

      <div className="mt-10">{renderPhotos()}</div>

      <p className="mt-7 text-center font-logo text-[14px] leading-[17px] font-medium tracking-[0.14px] text-white/50">
        이모지를 끌어서 사진에 붙여보세요
      </p>
      <ul className="mx-auto mt-[30px] grid w-81 grid-cols-5 gap-4">
        {EMOJIS.map((emoji) => (
          <li key={emoji}>
            <button
              type="button"
              aria-label={`${emoji} 끌어서 붙이기`}
              onPointerDown={(event) => startDrag(event, emoji)}
              {...dragHandlers}
              className="flex size-13 cursor-grab touch-none items-center justify-center rounded-full bg-white/20 text-[28px] leading-8 text-[#111] select-none"
            >
              {emoji}
            </button>
          </li>
        ))}
      </ul>

      {drag && (
        <span
          aria-hidden
          style={{ left: drag.clientX, top: drag.clientY }}
          className={`${GHOST} pointer-events-none fixed z-50 -translate-1/2`}
        >
          {drag.emoji}
        </span>
      )}
    </main>
  );
}
