# node나 pnpm이 PATH에 없으면 husky가 code 127로 끝나 원인이 드러나지 않는다.
# GUI는 셸 프로필을 읽지 않아 nvm이 넣어 주는 경로가 빠진다. 무엇을 해야 하는지 알려 준다.
for tool in node pnpm; do
  command -v "$tool" >/dev/null 2>&1 && continue
  echo "husky: $tool: PATH에서 찾을 수 없다"
  echo "GUI로 커밋하거나 push 하면 ~/.config/husky/init.sh가 필요하다. README의 \"커밋 훅\"을 본다"
  exit 1
done
