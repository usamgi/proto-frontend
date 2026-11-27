import { useMutation, useQueryClient } from '@tanstack/react-query';

import { servUploadPhoto } from './photo-services';

/**
 * @description 찍은 사진을 고른 방마다 올리는 뮤테이션.
 *
 * @remarks
 * 올리고 나면 읽어 둔 쿼리를 모두 다시 읽게 합니다. 사진은 홈처럼 여러 도메인을 묶어 읽는 화면 쿼리에 들어가서 키 하나로 가리킬 수 없습니다. 올리는 중에 화면을 떠나도 다시 읽습니다.
 * @public
 * @returns TanStack Query의 뮤테이션. `mutateAsync`에 올릴 사진과 방을 넘기고, 실패하면 던집니다.
 */
export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: servUploadPhoto,
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
