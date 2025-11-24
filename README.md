# The‑Julge

Part3 5팀 더줄게 프로젝트 레포지토리입니다. 서비스와 협업 히스토리를 한눈에 볼 수 있도록 README를 정리했습니다.

## 프로젝트 개요

- 주제: The‑Julge
- 목표: 인증/신청 플로우를 갖춘 웹 애플리케이션 제작 및 배포
- 기간: 11/18 ~ 12/3
- 배포: Vercel (3주차 배포 예정)

## 기술 스택

- **런타임/언어**: Next 16(App Router), React 19, TypeScript
- **스타일**: Tailwind CSS 4
- **폼/유효성**: react-hook-form, zod, @hookform/resolvers
- **도구/유틸**: axios(API 클라이언트), dayjs (날짜), Vercel 배포 예정
- **품질/포맷**: ESLint(+eslint-config-next, @typescript-eslint/parser & plugin, eslint-config-prettier, eslint-plugin-prettier), Prettier
- **커밋/훅**: Husky(pre-commit/prepare), Commitlint(+config-conventional)
- **빌드/타입체크 스크립트**: `build`, `type-check`, `lint`, `format`

## 코드 패턴 / 타입 유틸 기록

- React 타입 유틸: `ComponentPropsWithRef<'button' | 'input'>`, `Omit` 등으로 기본 DOM props 확장 후 재사용(`Button`, `Input`)
- `forwardRef`: 버튼·인풋 컴포넌트에서 ref 전달
- 폼: `react-hook-form` + `zodResolver` 조합으로 상태/검증 구성
- API: `src/lib/api.ts`에서 axios 인스턴스 생성
- 유틸: `dayjs`로 날짜 핸들링
- 커스텀 훅: `usePagination`, `UseModal`로 페이징·모달 제어

## 디렉토리 구조 (요약)

```
.
  public/            # 정적 자산
  src/
    app/             # App Router 엔트리, 글로벌 스타일, 폰트 로드
      public/        # 비로그인 접근 가능
      member/        # 일반회원 전용
      owner/         # 사장님 전용
      playground/    # 처음 세팅 이름 dev로 만들어져서 추후 컴포넌트 완료시 변경필요
      fonts/         # 웹폰트 파일
      layout.tsx
      page.tsx
    components/      # 재사용 UI 컴포넌트
      common/        # 버튼, 인풋, 테이블, 필터, Nav 등
      pagination/
      modal/
      layout/
    hooks/           # 커스텀 훅(usePagination, UseModal 등)
    features/        # 도메인 로직(shifts 등)
    constants/       # 공통 상수
    styles/          # 스타일 리소스
    lib/             # 유틸/확장 모듈
```

## 개발 환경 세팅

### 1. 레포 클론

```bash
git clone https://github.com/TEAM3-5/The‑Julge.git
cd The‑Julge
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 에서 확인 가능합니다.

### 주요 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run lint`: ESLint 검사
- `npm run build`: 프로덕션 빌드
- `npm run format`: Prettier 포맷
- `npm run type-check`: TS 타입 검사

## 일정 / 마일스톤

### 1주차 (11/18 ~ 11/23)

- 프로젝트 초기 세팅: 폴더 구조, Git branch 전략, 글로벌 폰트·컬러 파일, ESLint/Prettier/Husky, Github Issue & Milestone 준비
- 공통 UI 컴포넌트 R&R 분배 및 제작 → 제작한 컴포넌트로 페이지 UI 구성
- Swagger 기반 API 분석

### 2주차 (11/24 ~ 11/30)

- 페이지별 R&R 분배 후 요구사항 구현 (버그 수정·예외 처리 포함)
- 전역 상태 관리 협의 및 API 연동, 성능 최적화
- 선택: 모바일 반응형, 추가 기능

### 3주차 (12/1 ~ 12/3)

- Vercel 배포, QA, 발표 자료 제작, 최종 발표 (12/3)
  자세한 일정: [세부 계획](https://www.notion.so/2ab024fc464080a6aecaf67ee2092d5b?pvs=21)

## R&R

### 공통 UI 컴포넌트

| 팀원   | 역할                                                                        |
| ------ | --------------------------------------------------------------------------- |
| 최우석 | 프로젝트 기본 세팅, 네비게이션 바, 로그인 페이지 Input, 로그인 및 신청 버튼 |
| 김정대 | 글로벌 글꼴 및 색상 정의, 리스트 테이블, 지역 필터링 컴포넌트               |
| 김준열 | 페이지네이션, 모달, 토스트 메시지, API 구축                                 |
| 차혁   | 드롭다운 메뉴, 알림 모달                                                    |

### 페이지별

| 팀원   | 역할          |
| ------ | ------------- |
| 최우석 | 로그인 페이지 |
| 김정대 | 404 페이지    |
| 김준열 | (추가 예정)   |
| 차혁   | (추가 예정)   |

## 문제점 / 아쉬운 점

- (추가 예정)

## 개선 사항 (멘토링 피드백 반영 등)

- 공통 컴포넌트 제작 시 다형성·확장성 고려
- API 구축 담당 명확화
- 컴포넌트 개발에 필요한 핵심 개념 숙지
