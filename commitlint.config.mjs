/**
 * subject-case 를 끈 이유: config-conventional 의 기본값은 영어 대소문자를 판정하는데
 * 한글 제목에 섞인 영어 고유명사(`feat: Expo 카메라 연동`)가 걸린다.
 */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0],
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
