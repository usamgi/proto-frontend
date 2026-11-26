import type { Participant } from './home-mission';

const AVATAR = 'size-[57.6px] rounded-full border-[2.16px] border-white';

/**
 * @description 칩과 방 카드의 안 올린 친구 자리에 쓰는 큰 동그라미 얼굴.
 *
 * @remarks
 * 프로필 사진이 없으면 닉네임 첫 글자를 그립니다.
 * @internal
 * @name InitialAvatar
 * @tag span
 */
export function InitialAvatar({
  nickname,
  avatarUrl,
}: Pick<Participant, 'nickname' | 'avatarUrl'>) {
  if (avatarUrl) return <img src={avatarUrl} alt="" className={`${AVATAR} object-cover`} />;

  return (
    <span
      aria-hidden
      className={`${AVATAR} flex items-center justify-center bg-linear-to-b from-avatar-from/52 to-avatar-to/52 text-chip-initial font-semibold text-navy/50`}
    >
      {nickname.slice(0, 1)}
    </span>
  );
}
