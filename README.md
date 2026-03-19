# ☆ SANDBOXELS ☆
> Pixel Particle Simulator — React + Tailwind CSS + Vite

모바일 최적화 픽셀 샌드박스 게임. 불·물·모래·흙·용암·산·가스·폭탄 등 12종 원소의 물리 시뮬레이션.

## 🚀 Vercel 배포 (원클릭)

### 방법 1 — Vercel CLI

```bash
# 1. 의존성 설치
npm install

# 2. Vercel CLI 설치 (최초 1회)
npm install -g vercel

# 3. 배포
vercel

# 이후 업데이트 배포
vercel --prod
```

### 방법 2 — GitHub 연동 (자동 배포 추천)

1. GitHub에 이 프로젝트 push
   ```bash
   git init
   git add .
   git commit -m "init: sandboxels"
   git remote add origin https://github.com/YOUR_NAME/sandboxels.git
   git push -u origin main
   ```

2. [vercel.com/new](https://vercel.com/new) 접속

3. GitHub 저장소 선택 → **Import**

4. 설정은 자동 감지됨 (Vite 프레임워크):
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Deploy** 클릭 → 완료 🎉

> `main` 브랜치에 push할 때마다 자동으로 재배포됩니다.

## 🛠 로컬 개발

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ 빌드
npm run preview    # 빌드 결과 미리보기
```

## 🧩 프로젝트 구조

```
src/
├── constants.js          # 원소 ID, 색상, 밀도 상수
├── simulation/
│   └── physics.js        # 물리 엔진 (순수 JS, UI 무관)
├── hooks/
│   └── useSimulation.js  # 게임 루프 + 렌더링 훅
└── components/
    ├── SandboxGame.jsx   # 메인 조합 컴포넌트
    ├── GlitchHeader.jsx  # CRT 글리치 타이틀
    ├── GameCanvas.jsx    # 캔버스 + CRT 오버레이
    ├── ElementButton.jsx # 원소 선택 버튼
    ├── ControlBar.jsx    # 브러시 + 재생/정지
    ├── ReactionLog.jsx   # 반응 알림
    └── ReactionCheatsheet.jsx
```

## ⚗️ 반응 목록

| 조합 | 결과 |
|------|------|
| 🔥 불 + 💧 물 | 💨 증기 |
| 🔥 불 + 🪵 나무 | 🔥 연소 |
| 🌋 용암 + 💧 물 | 🪨 돌 |
| 💥 폭탄 + ⛽ 가스 | 💥 연쇄폭발 |
| 🧪 산 + 🪨 돌/모래 | ✨ 용해 |
| 🔥 불 + ⛽ 기름 | 🔥 점화 |
