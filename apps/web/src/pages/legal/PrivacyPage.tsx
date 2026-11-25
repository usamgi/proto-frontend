import { LegalDocument, type LegalSection } from './LegalDocument';
import { CONTACT_EMAIL, EFFECTIVE_DATE, OPERATOR, SERVICE } from './legal-info';

const SECTIONS: LegalSection[] = [
  {
    title: '수집하는 개인정보 항목',
    items: [
      '소셜 로그인(구글, 카카오) 시: 이메일 주소, 이름(닉네임), 프로필 사진',
      '서비스 이용 중: 그룹 이름, 그룹에서 쓰는 닉네임, 업로드한 사진',
      '자동으로 생성되는 정보: 접속 일시, IP 주소, 브라우저 정보 등 서비스 이용 기록',
    ],
  },
  {
    title: '개인정보의 이용 목적',
    items: [
      '이용자 식별과 로그인',
      '그룹 만들기, 참여, 사진 공유 등 서비스 기능 제공',
      '사용성 테스트(UT) 결과 분석과 서비스 개선',
    ],
  },
  {
    title: '보유 기간과 파기',
    items: [
      '수집한 개인정보는 사용성 테스트(UT)가 끝난 뒤 30일 이내에 파기합니다.',
      '이용자가 삭제를 요청하면 지체 없이 파기합니다.',
      '전자 파일은 복구할 수 없는 방법으로 삭제합니다.',
    ],
  },
  {
    title: '개인정보의 제3자 제공',
    text: `운영자는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 따라 요구되는 경우는 예외로 합니다.`,
  },
  {
    title: '개인정보 처리 위탁',
    text: '서비스 운영을 위해 아래 업체에 개인정보 처리를 맡깁니다. 해당 업체의 서버는 국외에 있을 수 있습니다.',
    items: ['Supabase Inc.: 로그인 처리, 데이터와 사진 저장', 'Vercel Inc.: 웹 서비스 호스팅'],
  },
  {
    title: '이용자의 권리',
    text: `이용자는 언제든지 자신의 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다. ${CONTACT_EMAIL}로 요청하면 지체 없이 처리합니다.`,
  },
  {
    title: '개인정보의 안전성 확보 조치',
    items: [
      '모든 통신 구간을 HTTPS로 암호화합니다.',
      '개인정보에 접근할 수 있는 사람을 운영 인원으로 제한합니다.',
    ],
  },
  {
    title: '개인정보 보호책임자',
    items: [`책임자: ${OPERATOR}`, `이메일: ${CONTACT_EMAIL}`],
  },
  {
    title: '처리방침의 변경',
    text: '이 처리방침이 바뀌면 시행 7일 전에 서비스 안에서 알립니다.',
  },
];

export function PrivacyPage() {
  return (
    <LegalDocument
      title="개인정보처리방침"
      intro={`${OPERATOR}(이하 "운영자")는 ${SERVICE} 서비스를 제공하면서 이용자의 개인정보를 「개인정보 보호법」에 따라 처리합니다.`}
      sections={SECTIONS}
      effectiveDate={EFFECTIVE_DATE}
    />
  );
}
