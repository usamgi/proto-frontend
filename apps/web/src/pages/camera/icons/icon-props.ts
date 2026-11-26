export interface IconProps {
  /** 크기와 색을 정하는 클래스. 색은 `currentColor`라 `text-*`로 줍니다. 비우면 아이콘마다 정해 둔 크기로 그립니다. */
  className?: string;
  /** 주면 `role="img"`로 읽히고, 없으면 장식으로 숨겨집니다. */
  title?: string;
}
