import { LegalDocument, type LegalSection } from './LegalDocument';
import { CONTACT_EMAIL, EFFECTIVE_DATE, OPERATOR, SERVICE } from './legal-info';

const SECTIONS: LegalSection[] = [
  {
    title: '목적',
    text: `이 약관은 ${OPERATOR}(이하 "운영자")가 제공하는 ${SERVICE} 서비스의 이용 조건을 정합니다.`,
  },
  {
    title: '서비스의 성격',
    text: `${SERVICE}는 사용성 테스트(UT)를 위한 프로토타입입니다. 기능은 예고 없이 바뀌거나 중단될 수 있고, 테스트 중 데이터가 초기화될 수 있습니다.`,
  },
  {
    title: '이용 신청',
    text: '구글 또는 카카오 계정으로 로그인하면 이 약관과 개인정보처리방침에 동의한 것으로 봅니다.',
  },
  {
    title: '이용자의 의무',
    text: '이용자는 다음 행위를 해서는 안 됩니다.',
    items: [
      '다른 사람의 계정을 도용하는 행위',
      '다른 사람의 초상권, 저작권 등 권리를 침해하는 사진을 올리는 행위',
      '불법이거나 음란한 사진을 올리는 행위',
      '서비스 운영을 방해하는 행위',
    ],
  },
  {
    title: '게시물',
    items: [
      '이용자가 올린 사진의 권리는 이용자에게 있습니다.',
      '올린 사진은 같은 그룹의 멤버에게 공개됩니다.',
      '운영자는 서비스 제공과 UT 결과 분석에 필요한 범위에서만 사진을 이용합니다.',
      '운영자는 제4조를 어긴 게시물을 알리지 않고 삭제할 수 있습니다.',
    ],
  },
  {
    title: '서비스의 변경과 종료',
    text: 'UT가 끝나면 서비스를 종료할 수 있습니다. 종료 후 데이터는 개인정보처리방침에 따라 파기합니다.',
  },
  {
    title: '책임의 제한',
    text: '서비스는 무료로 제공되는 프로토타입입니다. 운영자는 고의나 중대한 과실이 없는 한 서비스 이용으로 생긴 손해에 책임지지 않습니다.',
  },
  {
    title: '문의',
    text: `서비스에 관한 문의는 ${CONTACT_EMAIL}로 보내 주세요.`,
  },
];

export function TermsPage() {
  return (
    <LegalDocument
      title="서비스 이용약관"
      intro={`${SERVICE} 서비스를 이용해 주셔서 감사합니다.`}
      sections={SECTIONS}
      effectiveDate={EFFECTIVE_DATE}
    />
  );
}
