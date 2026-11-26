import { useRef, useState, type PointerEvent, type ReactElement } from 'react';

/** 카드 폭 308과 카드 사이 12. 가로 스크롤 위치를 지금 카드 순서로 바꿀 때 씁니다. */
const CARD_STEP_PX = 320;
/** 지금 카드에서 멀어질수록 작아지는 점 크기(8, 6, 5, 4px). 누르는 영역은 점 둘레로 옆 4px, 위아래 12px 넓힙니다. */
const DOT_SIZES = ['size-2', 'size-1.5', 'size-1.25', 'size-1'];
/** 방이 하나일 때 손가락보다 덜 따라오게 해서 더 넘길 방이 없다는 느낌을 줍니다. */
const DRAG_RESISTANCE = 0.4;

function SingleRoom({ card }: { card: ReactElement }) {
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const isDragging = dragStartX !== null;

  function release() {
    setDragStartX(null);
    setOffsetX(0);
  }

  return (
    <div className="flex justify-center px-4">
      <div
        onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragStartX(event.clientX);
        }}
        onPointerMove={(event) => {
          if (dragStartX !== null) setOffsetX((event.clientX - dragStartX) * DRAG_RESISTANCE);
        }}
        onPointerUp={release}
        onPointerCancel={release}
        style={{ transform: `translateX(${offsetX}px)` }}
        className={`touch-pan-y ${isDragging ? '' : 'transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none'}`}
      >
        {card}
      </div>
    </div>
  );
}

interface RoomCarouselProps {
  cards: ReactElement[];
  /** 방 형성 모션 중이면 `true`. 칸이 카드 밖 칩 자리에서 출발하므로 잘리지 않게 넘침을 엽니다. */
  isIntroPlaying: boolean;
}

/**
 * @description 방 카드를 가로로 넘기는 목록과 지금 위치를 알려 주는 점.
 *
 * @remarks
 * 방이 둘 이상이면 왼쪽 여백 16에서 시작하고 다음 카드가 오른쪽에 살짝 보입니다. 마지막 카드도 왼쪽 여백에 맞춰 멈추도록 오른쪽에 화면 폭에서 카드 폭과 여백(324px)을 뺀 만큼 비워 둡니다. 점을 누르면 그 카드로 넘어갑니다. 마우스로 끌어서는 넘어가지 않는 PC 브라우저에서도 넘겨 볼 수 있게 합니다.
 * 방이 하나면 카드를 가운데에 두고, 옆으로 밀면 따라오다가 손을 떼면 제자리로 돌아옵니다. 점은 그리지 않습니다.
 * @internal
 * @name RoomCarousel
 * @tag div
 */
export function RoomCarousel({ cards, isIntroPlaying }: RoomCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  if (cards.length === 1) return <SingleRoom card={cards[0]} />;

  function goTo(index: number) {
    const isReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollerRef.current?.scrollTo({
      left: index * CARD_STEP_PX,
      behavior: isReduced ? 'instant' : 'smooth',
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={scrollerRef}
        onScroll={(event) => setCurrent(Math.round(event.currentTarget.scrollLeft / CARD_STEP_PX))}
        className={`flex w-full snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-3 pr-[calc(100%-324px)] pl-4 ${isIntroPlaying ? 'overflow-visible' : 'overflow-x-auto'}`}
      >
        {cards}
      </div>
      <div data-intro="dots" className="flex items-center gap-2">
        {cards.map((card, index) => {
          const distance = Math.min(Math.abs(index - current), DOT_SIZES.length - 1);

          return (
            <button
              key={card.key}
              type="button"
              aria-label={`${index + 1}번째 방`}
              aria-current={index === current ? 'true' : undefined}
              onClick={() => goTo(index)}
              className={`relative rounded-full before:absolute before:-inset-x-1 before:-inset-y-3 ${DOT_SIZES[distance]} ${index === current ? 'bg-blue' : 'bg-navy/16'}`}
            />
          );
        })}
      </div>
    </div>
  );
}
