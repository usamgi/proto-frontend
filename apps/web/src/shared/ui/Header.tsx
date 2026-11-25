import { useNavigate } from 'react-router';

import arrowBack from '../../assets/arrow-back-ios.svg';
import close from '../../assets/close.svg';

interface HeaderProps {
  /** 주면 오른쪽에 닫기 버튼을, 안 주면 왼쪽에 뒤로 가기 버튼을 둔다 */
  onClose?: () => void;
}

export function Header({ onClose }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex h-12 items-center justify-between">
      {onClose ? (
        <button type="button" aria-label="닫기" className="ml-auto" onClick={onClose}>
          <img src={close} alt="" />
        </button>
      ) : (
        <button type="button" aria-label="뒤로 가기" onClick={() => navigate(-1)}>
          <img src={arrowBack} alt="" />
        </button>
      )}
    </header>
  );
}
