import { useNavigate } from 'react-router';

import emojiEyes from '../../assets/emoji-eyes.svg';
import emojiHeartEyes from '../../assets/emoji-heart-eyes.svg';
import emojiSleeping from '../../assets/emoji-sleeping.svg';
import emojiStarStruck from '../../assets/emoji-star-struck.svg';
import emojiThinking from '../../assets/emoji-thinking.svg';
import googleLogo from '../../assets/google-logo.svg';
import kakaoLogo from '../../assets/kakao-logo.svg';
import { Button } from '../../shared/ui/Button';
import { Screen } from '../../shared/ui/Screen';

/** 시안(폭 402) 기준 칩 중심 좌표와 지름 */
const CHIPS = [
  { src: emojiStarStruck, x: 72, y: 225, size: 79, rotate: -10 },
  { src: emojiHeartEyes, x: 326, y: 227, size: 80, rotate: 10 },
  { src: emojiThinking, x: 41, y: 384, size: 67, rotate: 14 },
  { src: emojiSleeping, x: 140, y: 490, size: 67, rotate: -62 },
  { src: emojiEyes, x: 309, y: 447, size: 63, rotate: 0 },
];

export function LoginPage() {
  const navigate = useNavigate();
  const login = () => navigate('/group');

  return (
    <Screen
      footer={
        <div className="flex flex-col gap-4 pb-[52px]">
          <Button variant="kakao" icon={kakaoLogo} onClick={login}>
            카카오로 계속하기
          </Button>
          <Button variant="white" icon={googleLogo} onClick={login}>
            Google로 계속하기
          </Button>
        </div>
      }
    >
      <div className="relative min-h-[540px] flex-1 overflow-x-clip">
        <div
          aria-hidden
          className="absolute top-[117px] left-1/2 size-[520px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(111,186,254,0.16),rgba(111,186,254,0))]"
        />
        {CHIPS.map(({ src, x, y, size, rotate }) => (
          <div
            key={src}
            aria-hidden
            className="absolute flex items-center justify-center rounded-full bg-white drop-shadow-[0_5px_7px_rgba(20,41,82,0.14)]"
            style={{
              left: `${(x / 402) * 100}%`,
              top: y,
              width: size,
              height: size,
              transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
            }}
          >
            <img src={src} alt="" />
          </div>
        ))}
        <div className="absolute inset-x-0 top-[288px] text-center">
          <p className="text-[16px] leading-[38px] font-light text-navy">우리들의 사진 기록</p>
          <h1 className="-mt-[3px] font-logo text-[56px] leading-[72px] font-bold tracking-[-1.7864px] text-black">
            USAGI
          </h1>
        </div>
      </div>
    </Screen>
  );
}
