/** 그룹 이름 첫 글자를 넣은 원형 프로필 */
export function GroupAvatar({ name }: { name: string }) {
  return (
    <div className="flex size-12 items-center justify-center rounded-full border-2 border-white bg-sky text-[24px] leading-[22px] font-medium text-navy">
      {name.charAt(0)}
    </div>
  );
}
