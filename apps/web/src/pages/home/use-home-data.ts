import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { toHomeData, type HomeRows, type HomeTableRows } from './home-mappers';
import type { HomeData } from './home-mission';
import { homeQueries } from './home-queries';

/** 화면에 내보낸 마지막 읽기 결과와 그 사진 주소. 주소 만들기에 실패했으면 `urls`가 비어 있습니다. */
interface ShownRows {
  rows: HomeTableRows;
  urls: Map<string, string> | undefined;
}

function rowsWithUrls({ rows, urls }: ShownRows): HomeRows {
  return { ...rows, urls: urls ?? new Map() };
}

type HomeDataResult =
  | { status: 'loading' }
  | { status: 'error' }
  | {
      status: 'ready';
      data: HomeData;
      /** 전에 읽어 둔 내용을 보이는 중이고 새로 읽기나 새 사진 주소 만들기가 아직 안 끝났으면 `true`입니다. */
      isRemembered: boolean;
      /** 보이던 내용이 없어 사진 주소 없이 먼저 돌려준 중이면 `true`입니다. 그동안 사진의 주소는 빈 문자열입니다. */
      isPhotoUrlsPending: boolean;
    };

/**
 * @description 내 방들과 지금 회차의 사진을 읽습니다.
 *
 * @remarks
 * 같은 회차를 전에 읽은 적이 있으면 그 내용을 먼저 돌려주고 새로 읽은 내용이 오면 바꿉니다. 새로 읽은 내용은 사진 주소까지 만든 뒤에 바꿔서, 바뀌는 사이에 사진이 비지 않습니다. 보이던 내용이 없으면(새로고침) 사진 주소를 기다리지 않고 사진 없이 먼저 돌려줍니다.
 * @param userId 로그인한 내 id
 * @param missionId 지금 회차의 미션 id. 아직 모르면 `null`이고 읽지 않습니다.
 * @returns 읽는 중이면 `loading`, 처음 읽기에 실패하면 `error`, 그 밖에는 `ready`와 `data`. 전에 읽은 내용이 있으면 실패해도 그 내용으로 `ready`입니다.
 */
export function useHomeData(userId: string, missionId: string | null): HomeDataResult {
  const rows = useQuery({
    ...homeQueries.rows(userId, missionId ?? ''),
    enabled: missionId !== null,
  });
  const urls = useQuery({
    ...homeQueries.photoUrls(rows.data?.photos ?? []),
    enabled: rows.data !== undefined,
  });
  const [shown, setShown] = useState<ShownRows | null>(null);

  if (!rows.data) {
    if (shown !== null) setShown(null);

    return rows.isError ? { status: 'error' } : { status: 'loading' };
  }

  const isUrlsSettled = urls.data !== undefined || urls.isError;
  if (isUrlsSettled && (shown?.rows !== rows.data || shown.urls !== urls.data)) {
    setShown({ rows: rows.data, urls: urls.data });
  }

  const isShowingPrevious = !isUrlsSettled && shown !== null;
  const source = isShowingPrevious ? shown : { rows: rows.data, urls: urls.data };

  return {
    status: 'ready',
    data: toHomeData(userId, rowsWithUrls(source)),
    isRemembered: rows.isFetching || isShowingPrevious,
    isPhotoUrlsPending: !isUrlsSettled && shown === null,
  };
}
