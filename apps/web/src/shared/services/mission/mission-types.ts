import type { TableRow } from '@/shared/services/database-types';

/** `missions` 표에서 읽는 칸 */
export type MissionRow = Pick<TableRow<'missions'>, 'id' | 'keyword' | 'round'>;

/** 지금 회차의 미션 */
export interface TodayMission {
  id: string;
  /** 오늘의 단어 */
  keyword: string;
}

/** `missions` 표에서 지난 미션 목록에 읽는 칸 */
export type DatedMissionRow = Pick<
  TableRow<'missions'>,
  'id' | 'keyword' | 'round' | 'mission_date'
>;

/** 지금까지 열린 미션 하나. 지난 회차와 지금 회차를 함께 담습니다. */
export interface StartedMission {
  id: string;
  keyword: string;
  /** 한국 날짜 `YYYY-MM-DD` */
  missionDate: string;
}
