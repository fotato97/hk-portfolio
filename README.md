# 한국경제 AI 교육 포트폴리오

웹사이트: https://fotato97.github.io/hk-portfolio/

`dist/introduce.html`, `dist/article.html`, `dist/image.html`, `dist/video.html`, `dist/final.html`은 각각 독립적인 HTML 파일입니다. `dist/index.html`은 소개 페이지와 동일한 시작 화면입니다. HTML 파일을 직접 열거나 `node server.mjs` 실행 후 http://127.0.0.1:4173 에서 확인하세요.

공통 스타일은 `dist/style.css`, 동작은 `dist/app.js`, 이미지는 `dist/assets/ribbon.png`입니다. 폴더 전체를 함께 보관하세요. 페이지 텍스트를 직접 수정할 수 있습니다. `build.mjs`를 수정하고 실행하면 모든 HTML이 다시 생성됩니다.

자료 추가는 IndexedDB를 사용하며 해당 기기·브라우저·사이트 주소에만 저장합니다. 실제 서버 업로드나 방문자 사이의 자료 공유 기능은 없습니다. 브라우저 데이터를 삭제하면 추가한 자료도 삭제되므로 원본 파일을 별도로 보관하세요. 배포 주소와 로컬 주소의 저장 공간은 서로 다릅니다.

소개 페이지의 이름·관심 분야·목표는 임시 문구입니다. 기사는 예시이며 영상 페이지는 스토리보드입니다. 직접 MP4 또는 WEBM 파일을 추가하면 재생할 수 있습니다. 이미지 페이지는 AI로 생성한 한 작품과 CSS 색상·구도 변주입니다. GMarketSans 폰트 연결이 불가능해도 시스템 글꼴로 표시됩니다.

검증: HTML 진입점, 내부 링크와 자산 경로, JavaScript 문법, HTTP 응답을 확인합니다. 브라우저 UI 자동화 테스트와 WebMCP 실행 검증은 별도로 수행하지 않았습니다.
