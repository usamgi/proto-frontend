/** 시안 모션(홈화면 모션 예시)의 시간입니다. 단위는 ms입니다. */
const TIMELINE = {
  beforeFadeOut: { delay: 300, duration: 300 },
  cellAppear: { delay: 300, duration: 150 },
  myPhotoAppear: { delay: 600, duration: 400 },
  /** 칸마다 0.1초씩 늦게 모입니다. */
  cellGather: { delay: 1350, stagger: 100, duration: 420 },
  /** 칩이 없던 칸은 0.6배에서 커지며 나타납니다. */
  lateCellGather: { delay: 1650, duration: 420 },
  cardPulse: { delay: 2050, duration: 650 },
  infoAppear: { delay: 2200, duration: 400 },
  todayAppear: { delay: 3250, duration: 400 },
  nextCardsAppear: { delay: 3300, duration: 500 },
  dotsAppear: { delay: 3500, duration: 250 },
};

/** 시안 키프레임의 곡선입니다. 자리를 잡을 때는 빠르게 다가가 천천히 멈춥니다. */
const SETTLE = 'cubic-bezier(0.2, 0, 0, 1)';
/** 칩이 없던 칸이 시작하는 자리. 시안에서 아래 오른쪽에서 기울어진 채 들어옵니다. */
const LATE_CELL_FROM = 'translate(30px, 50px) rotate(-6deg) scale(0.6)';
/** 촬영 전 홈 칩의 모서리와 같습니다. 칸이 칩 모양에서 출발해 카드 칸 모양으로 바뀝니다. */
const CHIP_RADIUS = '24px';

function chipSlotFor(cellIndex: number) {
  return cellIndex === 0 ? 'me' : `friend-${cellIndex - 1}`;
}

function centerOf(element: HTMLElement) {
  const { left, top, width, height } = element.getBoundingClientRect();

  return { x: left + width / 2, y: top + height / 2 };
}

type AddAnimation = (
  element: HTMLElement | null,
  keyframes: Keyframe[],
  timing: KeyframeAnimationOptions,
) => void;

function gatherCell(root: HTMLElement, cell: HTMLElement, add: AddAnimation) {
  const index = Number(cell.dataset.introCell);
  const chip = root.querySelector<HTMLElement>(`[data-chip-slot="${chipSlotFor(index)}"]`);
  const radius = getComputedStyle(cell).borderRadius;

  if (!chip) {
    add(
      cell,
      [
        { opacity: 0, transform: LATE_CELL_FROM, borderRadius: CHIP_RADIUS },
        { opacity: 1, transform: 'none', borderRadius: radius },
      ],
      { ...TIMELINE.lateCellGather, easing: SETTLE },
    );
    return;
  }

  const from = centerOf(chip);
  const to = centerOf(cell);
  const rotate = getComputedStyle(chip).rotate;
  const start = `translate(${from.x - to.x}px, ${from.y - to.y}px) rotate(${rotate === 'none' ? '0deg' : rotate})`;

  add(cell, [{ opacity: 0 }, { opacity: 1 }], TIMELINE.cellAppear);
  add(
    cell,
    [
      { transform: start, borderRadius: CHIP_RADIUS },
      { transform: 'none', borderRadius: radius },
    ],
    {
      delay: TIMELINE.cellGather.delay + index * TIMELINE.cellGather.stagger,
      duration: TIMELINE.cellGather.duration,
      easing: SETTLE,
    },
  );
}

function revealRest(root: HTMLElement, add: AddAnimation) {
  const find = (selector: string) => root.querySelector<HTMLElement>(selector);
  const rise = (distance: string) => [
    { opacity: 0, transform: distance },
    { opacity: 1, transform: 'none' },
  ];

  add(find('[data-intro="my-photo"]'), [{ opacity: 0 }, { opacity: 1 }], TIMELINE.myPhotoAppear);
  add(
    find('[data-intro="card"]'),
    [{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }],
    { ...TIMELINE.cardPulse, easing: 'ease-in-out' },
  );
  add(find('[data-intro="info"]'), rise('translateY(10px)'), {
    ...TIMELINE.infoAppear,
    easing: SETTLE,
  });
  add(find('[data-intro="today"]'), rise('translateY(16px)'), {
    ...TIMELINE.todayAppear,
    easing: SETTLE,
  });
  for (const card of root.querySelectorAll<HTMLElement>('[data-intro="next"]')) {
    add(card, rise('translateX(70px)'), { ...TIMELINE.nextCardsAppear, easing: SETTLE });
  }
  add(find('[data-intro="dots"]'), [{ opacity: 0 }, { opacity: 1 }], TIMELINE.dotsAppear);
}

/**
 * @description 방 형성 모션의 애니메이션을 모두 만들어 시작합니다.
 *
 * @remarks
 * `root` 안의 `data-chip-slot`(칩 자리), `data-intro-cell`(카드 칸), `data-intro`(나머지 조각)를 찾습니다. 칩의 실제 위치를 재서 칸까지 옮기므로, 칩과 카드가 화면에 그려진 뒤에 불러야 합니다.
 * @internal
 * @param root 촬영 전 칩 보드와 촬영 후 화면을 함께 담은 요소
 * @returns 시작한 애니메이션들. 호출부가 끝나기를 기다리거나 취소합니다.
 */
export function buildRoomIntro(root: HTMLElement) {
  const animations: Animation[] = [];
  const add: AddAnimation = (element, keyframes, timing) => {
    if (element) animations.push(element.animate(keyframes, { fill: 'backwards', ...timing }));
  };

  add(root.querySelector<HTMLElement>('[data-intro="before"]'), [{ opacity: 1 }, { opacity: 0 }], {
    ...TIMELINE.beforeFadeOut,
    fill: 'forwards',
  });
  for (const cell of root.querySelectorAll<HTMLElement>('[data-intro-cell]')) {
    gatherCell(root, cell, add);
  }
  revealRest(root, add);

  return animations;
}
