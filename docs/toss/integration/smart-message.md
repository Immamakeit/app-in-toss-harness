# 스마트 메시지 연동

## 업무 목적

토스 사용자에게 테스트 메시지 또는 실제 메시지를 발송한다.

## 선행 조건

- 토스 로그인 연동
- 메시지 발송 scope 확보
- 메시지 템플릿 코드 준비
- `mTLS` 인증서 및 서버 연동 준비

## 연동 흐름

1. 필요 시 테스트 메시지 발송 API로 사전 검증한다.
2. 서버가 `send-message`로 실제 메시지를 발송한다.
3. 응답의 성공/실패 카운트와 상세 실패 사유를 기록한다.

## 연동 규격

### 테스트 메시지 발송 API

- 용도: 개발 중 실제 사용자에게 테스트 발송
- 요구 사항:
  - 사용자 인증 토큰
  - 메시지 전송 scope

### 메시지 발송 API

- BaseURL: `https://apps-in-toss-api.toss.im`
- `POST /api-partner/v1/apps-in-toss/messenger/send-message`

#### 요청 헤더

- `x-toss-user-key`

#### 요청 바디

- `templateSetCode`
- `context`

#### 응답에서 볼 값

- `resultType`
- 발송 성공 카운트:
  - `msgCount`
  - `sentPushCount`
  - `sentInboxCount`
  - `sentSmsCount`
  - `sentAlimtalkCount`
  - `sentFriendtalkCount`
- 세부 성공/실패 목록
- 실패 사유(`reachFailReason`)

## 예외 처리

- 사용자 인증 토큰이 없거나 scope가 없으면 테스트 발송 API가 동작하지 않는다.
- `x-toss-user-key`가 없으면 실발송 API를 정상 호출할 수 없다.
- `resultType`이 성공이어도 일부 채널은 실패할 수 있으므로, 채널별 성공/실패 카운트를 따로 본다.
- 실패 상세는 `reachFailReason` 기준으로 로깅하고 운영 재시도 판단에 사용한다.

## 운영 메모

- `templateSetCode`와 `context` 키 이름이 템플릿과 맞지 않으면 기대한 메시지가 발송되지 않을 수 있다.
- 사용자 이름은 기본 변수로 채워지는 문맥이 있어, 모든 이름 필드를 직접 넘길 필요는 없다.

## 원문 근거

- `https://developers-apps-in-toss.toss.im/smart-message/develop.md`
- `https://developers-apps-in-toss.toss.im/development/integration-process.md`
- `https://developers-apps-in-toss.toss.im/api/overview.md`
