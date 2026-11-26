import check from '@/assets/check.svg';

export function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="flex h-9 items-center rounded-full bg-blue px-5 text-[14px] leading-[26px] font-medium tracking-[0.0798px] whitespace-nowrap text-white"
    >
      <img src={check} alt="" />
      {message}
    </div>
  );
}
