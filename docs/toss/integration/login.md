# 토스 로그인 연동

## 업무 목적

사용자 인증을 받아 인가 코드를 획득하고, 서버에서 토큰을 발급/재발급한 뒤
사용자 정보를 조회하거나 연결을 해제한다.

## 선행 조건

- `appLogin` SDK 연동
- 파트너 서버 준비
- `mTLS` 인증서 발급 및 서버 등록
- 로그인 관련 콘솔 설정

## 연동 흐름

1. 클라이언트가 `appLogin`으로 `authorizationCode`, `referrer`를 받는다.
2. 서버가 `generate-token`으로 `accessToken`, `refreshToken`을 발급받는다.
3. 서버가 `login-me`로 사용자 정보를 조회한다.
4. 필요 시 `refresh-token`으로 토큰을 재발급한다.
5. 필요 시 `remove-by-access-token` 또는 `remove-by-user-key`로 연결을 끊는다.
6. 사용자가 토스앱에서 직접 연결을 끊은 경우, 파트너 서버는 콜백으로 이를 수신한다.

## 연동 규격

### SDK 입력

- 함수: `appLogin`
- 반환:
  - `authorizationCode`
  - `referrer`
- 유효시간:
  - `authorizationCode`: 10분

### 서버 API

#### 1. AccessToken 발급

- `POST /api-partner/v1/apps-in-toss/user/oauth2/generate-token`
- 요청:
  - `authorizationCode`
  - `referrer`
- 응답:
  - `accessToken`
  - `refreshToken`
  - `tokenType`
  - `expiresIn`
  - `scope`

#### 2. AccessToken 재발급

- `POST /api-partner/v1/apps-in-toss/user/oauth2/refresh-token`
- 요청:
  - `refreshToken`
- 응답:
  - `accessToken`
  - `refreshToken`
  - `tokenType`
  - `expiresIn`
  - `scope`

#### 3. 사용자 정보 조회

- `GET /api-partner/v1/apps-in-toss/user/oauth2/login-me`
- 요청 헤더:
  - `Authorization: Bearer ${AccessToken}`
- 응답:
  - `userKey`
  - `scope`
  - `agreedTerms`
  - 개인정보 필드(암호화)

#### 4. 로그인 연결 해제

- `POST /api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-access-token`
- `POST /api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-user-key`

### 토큰 수명

- `authorizationCode`: 10분
- `accessToken`: 1시간
- `refreshToken`: 14일

### 사용자 정보 복호화

- 개인정보는 암호화된 형태로 제공된다.
- 복호화에는 콘솔/운영 채널로 받은 `복호화 키`, `AAD`가 필요하다.
- 알고리즘:
  - AES
  - 256비트 키
  - GCM
- 암호문 앞부분에 IV(NONCE)가 포함된다.

## 예외 처리

### 인가 코드/토큰

- 인가 코드 만료 또는 같은 코드 재사용:
  - `invalid_grant`
  - 대응: 새 인가 코드를 다시 받는다.
- 유효하지 않은 토큰:
  - 대응: 만료 확인 후 재발급, 실패하면 재로그인

### 사용자 정보

- `login-me` 응답의 `scope`는 앞으로 새 값이 추가될 수 있다.
- 문서상 `2026-01-02`부터 `user_key` scope가 추가되므로, 미지의 값이 들어와도 실패하지 않게 파싱한다.
- `di`는 항상 `null`로 내려온다.

### 연결 해제

- `remove-by-user-key`는 하나의 `userKey`에 연결된 토큰이 많으면 `readTimeout(3초)`가 발생할 수 있다.
- 대응:
  - 즉시 재시도하지 않는다.
  - 일정 시간 후 재시도한다.

### 콜백

- 직접 연결 해제 API를 호출한 경우에는 콜백이 오지 않는다.
- 콜백 수신 서버는 아래를 지원해야 한다.
  - GET 방식
  - POST 방식
  - 콘솔에 설정한 Basic Auth 헤더 검증
- `referrer` 값:
  - `UNLINK`
  - `WITHDRAWAL_TERMS`
  - `WITHDRAWAL_TOSS`

## 운영 메모

- 액세스/리프레시 토큰은 서버에 저장한다.
- 사용자 정보는 서버에서만 복호화한다.
- 클라이언트는 인가 코드 획득까지만 맡고, 토큰 교환/조회는 서버 책임으로 둔다.

## 원문 근거

- `https://developers-apps-in-toss.toss.im/login/develop.md`
- `https://developers-apps-in-toss.toss.im/development/integration-process.md`
- `https://developers-apps-in-toss.toss.im/api/overview.md`
