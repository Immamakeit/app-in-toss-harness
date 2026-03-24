# 토스페이 연동

## 업무 목적

토스 로그인 기반 사용자에게 결제를 생성하고, 인증 후 실제 승인을 수행하며,
환불과 상태 조회를 통해 거래 정합성을 관리한다.

## 선행 조건

- 토스 로그인 연동 완료
- 서버에서 `x-toss-user-key` 확보 가능
- `mTLS` 인증서 등록
- 테스트/라이브 결제 환경 분리

## 연동 흐름

1. 서버가 `make-payment`로 결제 건을 생성한다.
2. 클라이언트가 `checkoutPayment`로 사용자 인증을 진행한다.
3. 서버가 `execute-payment`로 실제 결제를 승인한다.
4. 필요 시 `refund-payment`로 환불한다.
5. 승인/환불 응답 누락 시 `get-payment-status`로 상태를 복구한다.

## 연동 규격

### BaseURL

- `https://pay-apps-in-toss-api.toss.im`

### 공통 헤더

- `x-toss-user-key`: 토스 로그인으로 획득한 `userKey`

### 1. 결제 생성

- `POST /api-partner/v1/apps-in-toss/pay/make-payment`
- 필수 입력:
  - `orderNo`
  - `productDesc`
  - `amount`
  - `amountTaxFree`
  - `isTestPayment`
- 핵심 규칙:
  - `orderNo`는 가맹점 기준 매회 유니크
  - 허용 문자/길이 제한 준수
  - 구매자 인증 완료 이후 재사용 불가
  - 최초 생성 후 2년이 지나야 재사용 가능
  - 테스트/라이브 환경 간 충돌이 없게 관리
- 응답 핵심:
  - `payToken`

### 2. 결제 인증

- 클라이언트 SDK: `checkoutPayment`
- 주의:
  - 사용자 인증만 수행한다.
  - 실제 결제 완료로 간주하면 안 된다.

### 3. 결제 실행

- `POST /api-partner/v1/apps-in-toss/pay/execute-payment`
- 필수 입력:
  - `payToken`
  - `isTestPayment`
- 응답 핵심:
  - `mode`
  - `orderNo`
  - `payMethod`
  - `payToken`
  - `transactionId`
  - `approvalTime`
  - 결제 수단 상세 정보

### 4. 환불

- `POST /api-partner/v1/apps-in-toss/pay/refund-payment`
- 필수 입력:
  - `payToken`
  - `reason`
  - `isTestPayment`
- 응답 핵심:
  - `refundNo`
  - `approvalTime`
  - `refundableAmount`
  - `refundedAmount`
  - `transactionId`

### 5. 상태 조회

- `POST /api-partner/v1/apps-in-toss/pay/get-payment-status`
- 필수 입력:
  - `payToken`
  - `orderNo`
  - `isTestPayment`
- 응답 핵심:
  - `payStatus`
  - `transactions`
  - `refundableAmount`
  - `createdTs`
  - `paidTs`

### 상태값

- `PAY_STANDBY`
- `PAY_APPROVED`
- `PAY_CANCEL`
- `PAY_PROGRESS`
- `PAY_COMPLETE`
- `REFUND_PROGRESS`
- `REFUND_SUCCESS`
- `SETTLEMENT_COMPLETE`
- `SETTLEMENT_REFUND_COMPLETE`

## 예외 처리

### 결제 생성

- `PAYMENT_EXISTING_PAYMENT`
  - 원인: 중복 결제 또는 `orderNo` 충돌
  - 대응: 주문번호 전략 점검, 중복 생성 방지
- `COMMON_INVALID_API_KEY`
  - 원인: 잘못된 API 키
  - 대응: 운영 시크릿 및 환경 분리 확인

### 결제 실행/상태 조회

- `checkoutPayment` 성공만으로 결제 완료 처리하지 않는다.
- 반드시 서버의 `execute-payment` 성공 또는 `get-payment-status` 확인 후 완료 처리한다.
- 승인/환불 응답을 놓친 경우 상태 조회를 정합성 복구 경로로 사용한다.

### 토스머니 결제

- `COMMON_BREAK_TIME_OF_BANK`
  - 원인: 은행 점검 시간
  - 대응: 사용자 안내 + 일정 시간 후 재시도 유도
- 결제 수단이 카드가 아니면 카드 필드는 `null`일 수 있다.
- 결제 수단이 토스머니가 아니면 계좌 필드는 `null`일 수 있다.

## 운영 메모

- `payToken`은 유니크하므로 반드시 저장한다.
- `transactionId`는 대사와 추적용 식별자로 저장한다.
- `isTestPayment`는 발급된 `payToken`의 환경과 일치해야 한다.
- 토스머니 결제 응답에는 은행/증권사/토스머니/토스포인트 코드가 올 수 있다.

## 원문 근거

- `https://developers-apps-in-toss.toss.im/tosspay/develop.md`
- `https://developers-apps-in-toss.toss.im/development/integration-process.md`
- `https://developers-apps-in-toss.toss.im/api/overview.md`
