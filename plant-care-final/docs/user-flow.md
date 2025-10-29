# 새싹아이 사용자 플로우

## 전체 애플리케이션 플로우 다이어그램

```mermaid
flowchart TD
    Start([사용자 방문]) --> Home[🏠 Home 페이지]
    
    Home --> |서비스 소개 확인| Features[주요 기능 안내]
    Home --> |시작하기 버튼| Identify
    Home --> |더 알아보기| HowItWorks[작동 방식 설명]
    
    HowItWorks --> Identify[📷 Identify<br/>식물 종 식별]
    Features --> Identify
    
    Identify --> |이미지 업로드| Upload{이미지 선택}
    Upload --> |파일 유효성 검사| Validation{이미지 형식 확인}
    
    Validation --> |실패| ErrorMsg[❌ 오류 메시지<br/>이미지 재선택 요청]
    ErrorMsg --> Upload
    
    Validation --> |성공| AIProcess[🤖 AI 식별 중<br/>로딩 오버레이]
    AIProcess --> AIResult{식별 결과}
    
    AIResult --> |성공| ResultList[✅ 식별 결과 목록<br/>상위 K개 결과<br/>+ 진단 정보]
    AIResult --> |실패| ErrorMsg
    
    ResultList --> SelectPlant{식물 선택}
    
    SelectPlant --> Care[📋 Care 페이지<br/>식물 관리법 상세]
    SelectPlant --> Growth[📈 Growth 페이지<br/>성장 예측]
    SelectPlant --> MyChild[📅 우리아이 스케줄]
    
    %% Care 페이지 플로우
    Care --> ViewCareTips[💡 관리법 정보 확인<br/>- 물주기<br/>- 빛 요구사항<br/>- 온도/습도]
    Care --> RecordEnv[✍️ 환경 기록 입력<br/>- 일조 날짜<br/>- 급수 날짜<br/>- 메모]
    RecordEnv --> SaveRecord[(💾 로컬스토리지 저장)]
    ViewCareTips --> BackNav
    SaveRecord --> BackNav[⬅️ 뒤로가기]
    
    %% Growth 페이지 플로우
    Growth --> ViewChart[📊 성장 차트 확인<br/>12개월 예측 데이터]
    Growth --> SwitchPlant{다른 식물 선택}
    SwitchPlant --> |드롭다운에서 선택| ViewChart
    ViewChart --> ExportPDF{PDF 내보내기}
    ExportPDF --> |클릭| PDFGen[📄 PDF 생성 중]
    PDFGen --> Download[⬇️ 다운로드 완료]
    Download --> BackNav2[⬅️ 뒤로가기]
    ViewChart --> BackNav2
    
    %% MyChild 페이지 플로우
    MyChild --> ViewSchedules[📋 스케줄 목록 확인]
    MyChild --> AddSchedule{새 스케줄 추가}
    
    AddSchedule --> |폼 입력| InputForm[✍️ 날짜, 유형, 메모 입력]
    InputForm --> Validate{유효성 검사}
    Validate --> |실패| ErrorSchedule[❌ 날짜 입력 필요]
    ErrorSchedule --> InputForm
    Validate --> |성공| SaveSchedule[(💾 스케줄 저장<br/>로컬스토리지)]
    
    ViewSchedules --> FilterSchedule{필터 적용}
    FilterSchedule --> |전체/급수/일조| DisplayFiltered[필터된 목록 표시]
    
    ViewSchedules --> EditSchedule{수정/삭제}
    EditSchedule --> |수정| InputForm
    EditSchedule --> |삭제| ConfirmDelete{삭제 확인}
    ConfirmDelete --> |예| DeleteSchedule[(🗑️ 삭제)]
    ConfirmDelete --> |아니오| ViewSchedules
    DeleteSchedule --> ViewSchedules
    
    ViewSchedules --> ExportCSV{CSV 내보내기}
    ExportCSV --> |클릭| CSVGen[📊 CSV 파일 생성]
    CSVGen --> DownloadCSV[⬇️ CSV 다운로드]
    
    SaveSchedule --> ViewSchedules
    DisplayFiltered --> ViewSchedules
    DownloadCSV --> ViewSchedules
    
    %% Status 페이지 플로우
    Home --> Status[📍 Status 페이지<br/>단계별 안내]
    Status --> Step1[1️⃣ 사진 업로드]
    Step1 --> |다음| Step2[2️⃣ AI 종 식별]
    Step2 --> |다음| Step3[3️⃣ 상태 진단]
    Step3 --> |다음| Step4[4️⃣ 관리법 제공]
    Step4 --> |다음| Step5[5️⃣ 성장 예측]
    
    Step1 --> |버튼 클릭| Identify
    Step4 --> |버튼 클릭| Care
    Step5 --> |버튼 클릭| Growth
    
    %% 네비게이션 바 (공통)
    BackNav --> Home
    BackNav2 --> Home
    
    %% 스타일링
    classDef homeStyle fill:#10b981,stroke:#059669,stroke-width:3px,color:#fff
    classDef processStyle fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
    classDef successStyle fill:#22c55e,stroke:#16a34a,stroke-width:2px,color:#fff
    classDef errorStyle fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    classDef storageStyle fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
    classDef decisionStyle fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    
    class Home,Features,HowItWorks homeStyle
    class AIProcess,PDFGen,CSVGen processStyle
    class ResultList,Download,DownloadCSV,SaveRecord,SaveSchedule successStyle
    class ErrorMsg,ErrorSchedule errorStyle
    class SaveRecord,SaveSchedule,DeleteSchedule storageStyle
    class Upload,Validation,AIResult,SelectPlant,ExportPDF,AddSchedule,FilterSchedule,EditSchedule,ConfirmDelete,ExportCSV,SwitchPlant,Validate decisionStyle
```

## 페이지별 상세 플로우

### 1. Identify 페이지 (식물 식별)

```mermaid
stateDiagram-v2
    [*] --> 초기상태
    초기상태 --> 이미지선택: 파일 업로드 클릭
    이미지선택 --> 검증: 파일 선택 완료
    
    검증 --> 오류: 이미지 형식 아님
    검증 --> 미리보기: 유효한 이미지
    
    오류 --> 이미지선택: 토스트 알림
    미리보기 --> 식별시작: 식별 버튼 클릭
    
    식별시작 --> AI분석중: 로딩 시작
    AI분석중 --> 결과표시: 성공
    AI분석중 --> 오류: 네트워크/API 오류
    
    결과표시 --> [*]: 식물 선택 → Care/Growth
```

### 2. Care 페이지 (식물 관리법)

```mermaid
graph LR
    A[Care 페이지 진입] --> B{식물 ID 유효?}
    B -->|No| C[404 페이지]
    B -->|Yes| D[관리법 표시]
    
    D --> E[관리법 상세 확인]
    D --> F[환경 기록 입력]
    
    E --> G[물주기 정보]
    E --> H[빛 요구사항]
    E --> I[온도/습도]
    
    F --> J[일조 날짜]
    F --> K[급수 날짜]
    F --> L[메모 작성]
    
    J --> M[저장하기 버튼]
    K --> M
    L --> M
    
    M --> N[로컬스토리지 저장]
    N --> O[토스트 알림: 저장 완료]
    
    C --> P[뒤로가기]
    O --> P
```

### 3. Growth 페이지 (성장 예측)

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Page as Growth 페이지
    participant Data as 성장 데이터
    participant PDF as PDF 생성기
    
    User->>Page: 페이지 접속 (ID 파라미터)
    Page->>Data: 성장 데이터 조회
    
    alt 데이터 존재
        Data-->>Page: 성장 예측 데이터 반환
        Page->>User: 차트 및 표 표시
        
        User->>Page: 다른 식물 선택 (드롭다운)
        Page->>Data: 새로운 ID로 조회
        Data-->>Page: 데이터 반환
        Page->>User: 업데이트된 차트 표시
        
        User->>Page: PDF 내보내기 클릭
        Page->>PDF: 리포트 영역 전달
        PDF->>PDF: HTML to PDF 변환
        PDF-->>User: 파일 다운로드
    else 데이터 없음
        Data-->>Page: null
        Page->>User: 404 오류 페이지
    end
```

### 4. MyChild 페이지 (스케줄 관리)

```mermaid
flowchart TD
    Start([MyChild 페이지]) --> Load[로컬스토리지에서<br/>스케줄 로드]
    
    Load --> Display{스케줄 있음?}
    Display -->|Yes| ShowList[스케줄 목록 표시]
    Display -->|No| EmptyState[빈 상태 안내]
    
    EmptyState --> AddNew
    ShowList --> Actions{사용자 액션}
    
    Actions -->|추가| AddNew[새 스케줄 입력]
    Actions -->|필터| Filter[필터 적용<br/>전체/급수/일조]
    Actions -->|수정| Edit[기존 스케줄 수정]
    Actions -->|삭제| Delete[삭제 확인 후 제거]
    Actions -->|내보내기| Export[CSV 다운로드]
    
    AddNew --> Form[폼 작성<br/>- 날짜<br/>- 유형 선택<br/>- 메모]
    Form --> Validate{유효성?}
    Validate -->|No| Error[오류 토스트]
    Error --> Form
    Validate -->|Yes| Save[로컬스토리지 저장]
    
    Edit --> Form
    Delete --> Save
    Save --> ShowList
    
    Filter --> ShowList
    Export --> Download[CSV 파일 생성]
    Download --> ShowList
```

## 데이터 흐름

```mermaid
graph TB
    subgraph "프론트엔드"
        UI[사용자 인터페이스]
        State[React State]
        LocalStorage[(로컬스토리지)]
    end
    
    subgraph "API 레이어"
        Client[API Client]
        Mock[Mock Service Worker]
    end
    
    subgraph "데이터 소스"
        CareDB[(careDB.js<br/>식물 관리법)]
        GrowthDB[(growth.js<br/>성장 데이터)]
        Backend[백엔드 API<br/>AI 식별 서비스]
    end
    
    UI --> State
    State --> UI
    
    UI --> LocalStorage
    LocalStorage --> |스케줄, 환경기록| UI
    
    UI --> Client
    Client --> Mock
    Mock --> Backend
    Backend --> |식별 결과| Mock
    Mock --> Client
    Client --> UI
    
    UI --> CareDB
    CareDB --> |관리법 정보| UI
    
    UI --> GrowthDB
    GrowthDB --> |성장 예측| UI
```

## 상태 관리

```mermaid
graph LR
    subgraph "전역 상태"
        Toast[Toast 알림]
    end
    
    subgraph "페이지별 상태"
        IdentifyState[Identify<br/>- preview<br/>- result<br/>- loading]
        CareState[Care<br/>- sunDate<br/>- waterDate<br/>- memo]
        GrowthState[Growth<br/>- selectedPlantId]
        MyChildState[MyChild<br/>- schedules<br/>- filter]
    end
    
    subgraph "영구 저장"
        Persisted[(usePersistedState<br/>로컬스토리지 동기화)]
    end
    
    IdentifyState --> Persisted
    MyChildState --> Persisted
    CareState --> Persisted
    
    Toast -.-> IdentifyState
    Toast -.-> CareState
    Toast -.-> GrowthState
    Toast -.-> MyChildState
```

## 기술 스택 흐름

```mermaid
graph TD
    Browser[웹 브라우저] --> React[React 18]
    React --> Router[React Router v6]
    React --> UI[shadcn/ui 컴포넌트]
    React --> Motion[Framer Motion]
    
    Router --> Pages[페이지 컴포넌트]
    Pages --> Home
    Pages --> Identify
    Pages --> Care
    Pages --> Growth
    Pages --> MyChild
    Pages --> Status
    
    UI --> Tailwind[Tailwind CSS]
    
    React --> Hooks[커스텀 Hooks]
    Hooks --> useToast
    Hooks --> usePersistedState
    
    React --> API[API Client]
    API --> MSW[Mock Service Worker]
    MSW --> Dev[개발 환경]
    
    React --> Utils[유틸리티]
    Utils --> PDFExport[PDF 내보내기]
```

## 사용자 여정 맵

```mermaid
journey
    title 새싹아이 사용자 여정
    section 발견
      홈페이지 방문: 5: 사용자
      서비스 소개 확인: 4: 사용자
      시작하기 클릭: 5: 사용자
    section 식별
      식물 사진 업로드: 4: 사용자
      AI 식별 대기: 3: 사용자, AI
      결과 확인: 5: 사용자
    section 관리
      관리법 확인: 5: 사용자
      환경 기록 입력: 4: 사용자
      스케줄 등록: 4: 사용자
    section 예측
      성장 차트 확인: 5: 사용자
      PDF 다운로드: 5: 사용자
    section 지속 사용
      정기적 기록: 4: 사용자
      데이터 누적: 5: 사용자
```

---

## 주요 특징

### 🎯 핵심 기능
1. **AI 기반 식물 식별** - 이미지 업로드로 간편한 종 분류
2. **맞춤형 관리법** - 각 식물별 상세 관리 가이드
3. **성장 예측** - 12개월 성장 데이터 시각화
4. **스케줄 관리** - 일조/급수 일정 기록 및 추적
5. **데이터 내보내기** - PDF 리포트 및 CSV 다운로드

### 💾 데이터 저장
- **로컬스토리지**: 스케줄, 환경 기록, 식별 결과
- **세션 지속성**: 페이지 새로고침 시에도 데이터 유지
- **내보내기 지원**: PDF(성장 리포트), CSV(스케줄)

### 🎨 UI/UX
- **반응형 디자인**: 모바일/태블릿/데스크톱 최적화
- **애니메이션**: Framer Motion을 활용한 부드러운 전환
- **접근성**: ARIA 레이블, 키보드 네비게이션 지원
- **토스트 알림**: 사용자 액션에 대한 즉각적인 피드백

