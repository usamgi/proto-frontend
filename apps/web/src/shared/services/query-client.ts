import { QueryClient } from '@tanstack/react-query';

/**
 * @description 앱 전체가 함께 쓰는 TanStack Query 클라이언트.
 *
 * @remarks
 * 화면에 다시 들어오면 기억해 둔 내용을 먼저 보이고 새로 읽습니다(기본 동작). 창으로 돌아올 때는 다시 읽지 않습니다. 방 형성 모션 도중에 홈 내용이 바뀌지 않게 하려는 것입니다.
 * @public
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});
