import marksUrl from '@/assets/share-card-marks.svg';
import logoUrl from '@/assets/share-logo.svg';
import { WORD_IMAGES } from '@/pages/home/mission-word/word-images';

/** 공유 카드 한 칸. 사진이 없으면(안 올렸거나 가린 사진) 이름 첫 글자를 그립니다. */
export type ShareCardCell =
  | { kind: 'photo'; nickname: string; photoUrl: string; caption: string }
  | { kind: 'empty'; nickname: string };

export interface ShareCardInput {
  groupName: string;
  keyword: string;
  /** 한국 날짜 `YYYY-MM-DD` */
  missionDate: string;
  cells: ShareCardCell[];
}

/** 아래 수치는 모두 시안(카드 폭 320) 기준 CSS px입니다. 저장할 때는 3배로 그립니다. */
const SCALE = 3;
const WIDTH = 320;
const FONT = '"Pretendard Variable", Pretendard, sans-serif';
const NAVY = '31, 33, 36';
const BLUE = '111, 186, 254';

const COLUMN_X = [21.62, 161.66];
const COLUMN_W = [136.76, 137.58];
const CELL_H = 180.99;
const GRID_TOP = 107.24;
const ROW_STEP = 185.08;
/** 오른쪽 열은 시안처럼 아래로 조금 내려서 엇갈리게 둡니다. */
const RIGHT_COLUMN_OFFSET = 29.49;
const CELL_RADIUS = 19.655;
const FOOTER_GAP = 23.04;
const FOOTER_H = 17.3;
const BOTTOM_PADDING = 25.73;

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** "26.11.26 (목)" 모양. 세로 장식에는 요일 없이 씁니다. */
function formatCardDate(missionDate: string, withWeekday: boolean) {
  const [year, month, day] = missionDate.split('-').map(Number);
  const short = `${String(year).slice(2)}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
  if (!withWeekday) return short;

  return `${short} (${WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()]})`;
}

async function loadImage(src: string) {
  const image = new Image();
  // 다른 출처(Supabase 저장소) 사진도 캔버스를 오염시키지 않고 PNG로 뽑으려면 CORS로 받아야 합니다
  image.crossOrigin = 'anonymous';
  image.src = src;
  await image.decode();

  return image;
}

function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  top: number,
  lineHeight: number,
  font: string,
  color: string,
  align: CanvasTextAlign = 'left',
) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x, top + lineHeight / 2);
}

/** 넓이를 넘으면 끝을 말줄임표로 자릅니다. */
function fitText(ctx: CanvasRenderingContext2D, value: string, maxWidth: number) {
  if (ctx.measureText(value).width <= maxWidth) return value;
  let cut = value;
  while (cut.length > 0 && ctx.measureText(`${cut}…`).width > maxWidth) cut = cut.slice(0, -1);

  return `${cut}…`;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
  const drawW = image.naturalWidth * scale;
  const drawH = image.naturalHeight * scale;
  ctx.drawImage(image, x + (w - drawW) / 2, y + (h - drawH) / 2, drawW, drawH);
}

function drawPhotoCell(
  ctx: CanvasRenderingContext2D,
  cell: Extract<ShareCardCell, { kind: 'photo' }>,
  image: HTMLImageElement,
  x: number,
  y: number,
  w: number,
) {
  drawCover(ctx, image, x, y, w, CELL_H);
  const shade = ctx.createLinearGradient(0, y, 0, y + CELL_H);
  shade.addColorStop(0.03431, `rgba(${NAVY}, 0.5)`);
  shade.addColorStop(0.47304, `rgba(${NAVY}, 0)`);
  ctx.fillStyle = shade;
  ctx.fillRect(x, y, w, CELL_H);

  const font = `500 13.103px ${FONT}`;
  text(ctx, cell.nickname, x + w / 2, y + 13.103, 14.741, font, '#fff', 'center');
  if (!cell.caption) return;

  ctx.font = font;
  const caption = fitText(ctx, cell.caption, w - 16 - 9.827 * 2);
  const pillW = ctx.measureText(caption).width + 9.827 * 2;
  const pillH = 14.741 + 6.552 * 2;
  const pillY = y + CELL_H - 13.103 - pillH;
  ctx.fillStyle = `rgba(${NAVY}, 0.24)`;
  ctx.beginPath();
  ctx.roundRect(x + (w - pillW) / 2, pillY, pillW, pillH, pillH / 2);
  ctx.fill();
  text(ctx, caption, x + w / 2, pillY + 6.552, 14.741, font, '#fff', 'center');
}

function drawEmptyCell(
  ctx: CanvasRenderingContext2D,
  nickname: string,
  x: number,
  y: number,
  w: number,
) {
  const blockTop = y + (CELL_H - 78.619) / 2;
  const centerX = x + w / 2;
  text(
    ctx,
    nickname,
    centerX,
    blockTop,
    26.206,
    `500 14.741px ${FONT}`,
    `rgba(${NAVY}, 0.5)`,
    'center',
  );

  const size = 47.171;
  const avatarTop = blockTop + 78.619 - size;
  const fill = ctx.createLinearGradient(0, avatarTop, 0, avatarTop + size);
  fill.addColorStop(0, 'rgba(129, 195, 255, 0.52)');
  fill.addColorStop(1, 'rgba(182, 212, 239, 0.52)');
  ctx.beginPath();
  ctx.arc(centerX, avatarTop + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 1.769;
  ctx.strokeStyle = '#fff';
  ctx.beginPath();
  ctx.arc(centerX, avatarTop + size / 2, size / 2 - 1.769 / 2, 0, Math.PI * 2);
  ctx.stroke();
  text(
    ctx,
    nickname.slice(0, 1),
    centerX,
    avatarTop + (size - 31.448) / 2,
    31.448,
    `600 23.586px ${FONT}`,
    `rgba(${NAVY}, 0.5)`,
    'center',
  );
}

function cellRect(index: number) {
  const column = index % 2;
  const row = Math.floor(index / 2);

  return {
    x: COLUMN_X[column],
    y: GRID_TOP + row * ROW_STEP + (column === 1 ? RIGHT_COLUMN_OFFSET : 0),
    w: COLUMN_W[column],
  };
}

/**
 * @description 칸 수에 따른 카드 높이(폭 320 기준 CSS px). 이미지를 만들기 전에 화면에 같은 크기 자리를 잡아 둘 때도 씁니다.
 *
 * @internal
 */
export function shareCardHeight(cellCount: number) {
  const gridBottom = Math.max(
    ...Array.from({ length: cellCount }, (_, index) => cellRect(index).y + CELL_H),
    GRID_TOP,
  );

  return gridBottom + FOOTER_GAP + FOOTER_H + BOTTOM_PADDING;
}

/**
 * @description 시안(ROM-03 Share)의 사진 카드를 캔버스에 그려 PNG로 만듭니다.
 *
 * @remarks
 * 화면을 그대로 찍는 라이브러리 대신 직접 그립니다. Pretendard는 글자 묶음마다 따로 받는 글꼴이라, 화면 찍기는 글꼴을 빠뜨리기 쉽습니다. 그리기 전에 쓸 글자의 글꼴을 `document.fonts.load`로 받아 둡니다. 사진은 CORS로 받아야 해서 저장소가 CORS를 막으면 실패합니다.
 * @internal
 * @throws 사진이나 그림을 받지 못하면 오류
 */
export async function drawShareCard({ groupName, keyword, missionDate, cells }: ShareCardInput) {
  const wordImageUrl = WORD_IMAGES[keyword]?.after;
  const allText = [
    groupName,
    '의',
    keyword,
    formatCardDate(missionDate, true),
    '우리들의 사진 기록',
    ...cells.flatMap((cell) => [cell.nickname, cell.kind === 'photo' ? cell.caption : '']),
  ].join('');
  const [images, logo, marks, wordImage] = await Promise.all([
    Promise.all(cells.map((cell) => (cell.kind === 'photo' ? loadImage(cell.photoUrl) : null))),
    loadImage(logoUrl),
    loadImage(marksUrl),
    wordImageUrl ? loadImage(wordImageUrl) : null,
    ...[500, 600, 700].map((weight) => document.fonts.load(`${weight} 16px ${FONT}`, allText)),
  ]);

  const height = shareCardHeight(cells.length);
  const footerTop = height - BOTTOM_PADDING - FOOTER_H;

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH * SCALE;
  canvas.height = Math.round(height * SCALE);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('캔버스를 쓸 수 없음');
  ctx.scale(SCALE, SCALE);

  // 카드 바탕
  const border = 0.692;
  ctx.beginPath();
  ctx.roundRect(border / 2, border / 2, WIDTH - border, height - border, 27.676);
  ctx.fillStyle = '#fff';
  ctx.fill();
  const tint = ctx.createLinearGradient(0, 0, 0, height);
  tint.addColorStop(0, `rgba(${BLUE}, 0.016)`);
  tint.addColorStop(1, `rgba(${BLUE}, 0.04)`);
  ctx.fillStyle = tint;
  ctx.fill();
  ctx.lineWidth = border;
  ctx.strokeStyle = `rgba(${BLUE}, 0.5)`;
  ctx.stroke();

  // 방 이름, 단어, 날짜
  const label = `500 13.838px ${FONT}`;
  text(ctx, `${groupName}의`, 21.62, 26.81, 13.838, label, `rgba(${NAVY}, 0.5)`);
  if (wordImage) {
    const wordH = 45.904;
    ctx.drawImage(
      wordImage,
      21.62,
      46.7,
      (wordImage.naturalWidth / wordImage.naturalHeight) * wordH,
      wordH,
    );
  } else {
    text(ctx, keyword, 21.62, 46.7, 45.904, `700 44.319px ${FONT}`, `rgb(${NAVY})`);
  }
  text(
    ctx,
    formatCardDate(missionDate, true),
    301.46,
    52.76,
    13.838,
    label,
    `rgba(${NAVY}, 0.4)`,
    'right',
  );

  // 양옆 장식
  ctx.drawImage(marks, 6.05, 186.81, 7.679, 256.705);
  ctx.save();
  ctx.globalAlpha = 0.4;
  const sideX = 305.3;
  const sideTop = 142.03;
  const logoW = 28.245;
  const logoH = (logo.naturalHeight / logo.naturalWidth) * logoW;
  for (const top of [sideTop, sideTop + 354.929 - logoW]) {
    ctx.save();
    ctx.translate(sideX + logoH / 2, top + logoW / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(logo, -logoW / 2, -logoH / 2, logoW, logoH);
    ctx.restore();
  }
  ctx.save();
  ctx.translate(sideX + logoH / 2, sideTop + 354.929 / 2);
  ctx.rotate(Math.PI / 2);
  text(
    ctx,
    formatCardDate(missionDate, false),
    0,
    -4.5,
    9,
    `500 7.5px ${FONT}`,
    `rgb(${BLUE})`,
    'center',
  );
  ctx.restore();
  ctx.restore();

  // 사진 칸
  cells.forEach((cell, index) => {
    const { x, y, w } = cellRect(index);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, CELL_H, CELL_RADIUS);
    ctx.clip();
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, w, CELL_H);
    ctx.fillStyle = `rgba(${BLUE}, 0.16)`;
    ctx.fillRect(x, y, w, CELL_H);
    const image = images[index];
    if (cell.kind === 'photo' && image) drawPhotoCell(ctx, cell, image, x, y, w);
    else drawEmptyCell(ctx, cell.nickname, x, y, w);
    ctx.restore();

    ctx.beginPath();
    ctx.roundRect(x, y, w, CELL_H, CELL_RADIUS);
    ctx.lineWidth = 0.328;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  });

  // 아래 로고와 문구
  ctx.drawImage(logo, 19.9, footerTop, 63.689, FOOTER_H);
  text(
    ctx,
    '우리들의 사진 기록',
    300.98,
    footerTop + (FOOTER_H - 13.838) / 2,
    13.838,
    label,
    `rgba(${NAVY}, 0.6)`,
    'right',
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('PNG를 만들지 못함'))),
      'image/png',
    );
  });
}
