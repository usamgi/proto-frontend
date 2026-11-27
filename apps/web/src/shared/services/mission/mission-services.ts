import { supabase } from '@/shared/api/supabase';

import type { MissionRow, TodayMission } from './mission-types';

/** 미션 날짜는 한국 날짜입니다. 기기 시간대와 상관없이 같은 날로 봅니다. */
const MISSION_TIME_ZONE = 'Asia/Seoul';

function todayInKorea() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: MISSION_TIME_ZONE }).format(new Date());
}

async function servFetchActiveRound() {
  const { data, error } = await supabase
    .from('ut_settings')
    .select('active_round')
    .single<{ active_round: number }>();
  if (error) throw error;

  return data.active_round;
}

async function servFetchMissionsOn(missionDate: string) {
  const { data, error } = await supabase
    .from('missions')
    .select('id, keyword, round')
    .eq('mission_date', missionDate)
    .returns<MissionRow[]>();
  if (error) throw error;

  return data;
}

/**
 * @description 오늘(한국 날짜) 지금 회차의 미션을 읽습니다. `ut_settings`의 회차와 `missions`를 함께 읽습니다.
 *
 * @public
 * @returns 오늘 날짜와 지금 회차에 넣어 둔 단어가 없으면 `null`
 * @throws 읽기에 실패하면 Supabase 오류
 */
export async function servFetchTodayMission(): Promise<TodayMission | null> {
  const [activeRound, missions] = await Promise.all([
    servFetchActiveRound(),
    servFetchMissionsOn(todayInKorea()),
  ]);
  const found = missions.find((mission) => mission.round === activeRound);

  return found ? { id: found.id, keyword: found.keyword } : null;
}

/**
 * @description 모든 사람의 회차를 1과 2 사이에서 바꿉니다(`switch_mission_round`).
 *
 * @public
 * @throws 바꾸기에 실패하면 Supabase 오류
 */
export async function servSwitchMissionRound() {
  const { error } = await supabase.rpc('switch_mission_round');
  if (error) throw error;
}

/**
 * @description 누가 회차를 바꾸면 `onChange`를 부르는 실시간 구독을 켭니다.
 *
 * @public
 * @param onChange `ut_settings`가 바뀔 때마다 불립니다.
 * @returns 구독을 끄는 함수. 화면을 떠날 때 반드시 부릅니다.
 */
export function servSubscribeRoundChange(onChange: () => void) {
  const channel = supabase
    .channel(`ut-settings-${crypto.randomUUID()}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'ut_settings' }, onChange)
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
