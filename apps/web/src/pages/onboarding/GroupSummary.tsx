import type { ReactNode } from 'react';

import { GroupAvatar } from '../../shared/ui/GroupAvatar';
import { formatDate, type Group } from './onboarding-context';

interface GroupSummaryProps {
  group: Group;
  /** 그룹 정보 아래에 보여 줄 멤버 현황 */
  children: ReactNode;
}

export function GroupSummary({ group, children }: GroupSummaryProps) {
  return (
    <div className="flex flex-col items-center gap-20">
      <div className="flex flex-col items-center gap-2">
        <GroupAvatar name={group.name} />
        <p className="text-[24px] leading-[28px] font-semibold tracking-[-0.288px]">{group.name}</p>
        <p className="text-[14px] font-medium tracking-[-0.168px] text-ink/60">
          개설일: {formatDate(group.createdAt)}
        </p>
      </div>
      {children}
    </div>
  );
}
