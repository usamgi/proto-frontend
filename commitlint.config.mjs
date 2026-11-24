/**
 * subject-case 를 끈 이유: config-conventional 의 기본값은 영어 대소문자를 판정하는데
 * 한글 제목에 섞인 영어 고유명사(`feat: Expo 카메라 연동`)가 걸린다.
 */

// 영문, 코드, 숫자 뒤에 오는 조사는 붙여 쓴다. 조사가 아니라 명사가 이어지면(`MR 본문`) 띄운다
const PARTICLES = [
  '으로',
  '이라고',
  '라고',
  '에서',
  '까지',
  '부터',
  '처럼',
  '보다',
  '이나',
  '을',
  '를',
  '이',
  '가',
  '은',
  '는',
  '와',
  '과',
  '로',
  '에',
  '의',
  '도',
  '만',
];
const PARTICLE_AFTER_SPACE = new RegExp(`[A-Za-z0-9\`)"\\]] (${PARTICLES.join('|')})(\\s|$|[,.)])`);

const SENTENCE_ENDING = /(다|요|죠|네)$/;

const config = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'korean-particle-no-space': ({ header }) => [
          !PARTICLE_AFTER_SPACE.test(header ?? ''),
          '영문과 코드 뒤 조사는 붙여 쓴다. "README 를"이 아니라 "README를"',
        ],
        'subject-noun-ending': ({ subject }) => [
          !SENTENCE_ENDING.test(subject ?? ''),
          '제목은 명사형으로 끝낸다. "추가한다"가 아니라 "추가"',
        ],
      },
    },
  ],
  rules: {
    'subject-case': [0],
    'korean-particle-no-space': [2, 'always'],
    'subject-noun-ending': [2, 'always'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'style',
        'docs',
        'test',
        'chore',
        'build',
        'ci',
        'perf',
        'revert',
      ],
    ],
  },
};

export default config;
