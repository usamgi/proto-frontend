import type { TableRow } from '@/shared/services/database-types';

/** `missions` 표에서 읽는 칸 */
export type MissionRow = Pick<TableRow<'missions'>, 'id' | 'keyword' | 'round'>;

/** 지금 회차의 미션 */
export interface TodayMission {
  id: string;
  /** 오늘의 단어 */
  keyword: string;
}
