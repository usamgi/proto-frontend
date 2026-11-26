import { useNavigate } from 'react-router';

import { Button } from '../../shared/ui/Button';
import { Header } from '../../shared/ui/Header';
import { Screen } from '../../shared/ui/Screen';
import { useOnboarding, type Agreement } from './onboarding-context';

interface AgreementDetailPageProps {
  id: Agreement;
  title: string;
}

/** 약관 동의 화면에서 꺾쇠를 누르면 여는 약관 전문 */
export function AgreementDetailPage({ id, title }: AgreementDetailPageProps) {
  const navigate = useNavigate();
  const { agreed, setAgreed } = useOnboarding();

  const agree = () => {
    if (!agreed.includes(id)) setAgreed([...agreed, id]);
    navigate(-1);
  };

  return (
    <Screen
      header={
        // 시안에서 이 헤더는 상태 표시줄 아래 10px 여백을 둔다
        <div className="pt-2.5">
          <Header title={title} />
        </div>
      }
      footer={<Button onClick={agree}>동의</Button>}
    >
      {/* TODO: 노션 약관 페이지를 웹뷰(iframe)로 띄운다 */}
      <div className="flex-1" />
    </Screen>
  );
}
