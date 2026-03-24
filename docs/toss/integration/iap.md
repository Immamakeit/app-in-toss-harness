# 인앱결제 연동

## 업무 목적

콘솔에 등록한 인앱 상품을 노출하고 결제를 수행한 뒤,
파트너 상품 지급 완료와 미결 주문 복원까지 보장한다.

## 선행 조건

- 인앱결제 상품 등록
- 토스 로그인 연동
- 파트너 서버 지급 로직 준비
- 주문 상태 조회 API를 쓸 경우 `mTLS`와 서버 연동 준비

## 연동 흐름

1. SDK로 상품 목록을 가져온다.
2. SDK로 인앱결제를 요청한다.
3. 결제 성공 후 파트너 상품 지급 로직을 수행한다.
4. 지급 실패 또는 중단 시 `getPendingOrders`로 미결 주문을 복원한다.
5. 지급 완료 후 `completeProductGrant`를 호출한다.
6. 필요 시 서버에서 주문 상태 조회 API로 정합성을 확인한다.

## 연동 규격

### SDK 중심 기능

- 상품 목록 조회: `getProductItemList`
- 결제 요청: `createOneTimePurchaseOrder`
- 미결 주문 조회: `getPendingOrders`
- 지급 완료 처리: `completeProductGrant`
- 완료/환불 주문 조회: `getCompletedOrRefundedOrders`

### 서버 API

- `POST /api-partner/v1/apps-in-toss/order/get-order-status`
- 요청 헤더:
  - `x-toss-user-key`
- 요청 바디:
  - `orderId`

### 주문 상태

- `PURCHASED`: 결제 및 지급 완료
- `PAYMENT_COMPLETED`: 결제 완료, 지급 실패
- `FAILED`: 주문 실패
- `REFUNDED`: 환불 완료
- `ORDER_IN_PROGRESS`: 주문 진행 중
- `NOT_FOUND`: 주문 없음
- `MINIAPP_MISMATCH`: 앱 상품 불일치
- `ERROR`: 내부 오류

## 예외 처리

### 결제/지급 불일치

- SDK 1.1.3 이상에서는 결제 성공 후에도 파트너 상품 지급이 실패할 수 있다.
- 이 경우:
  - `PRODUCT_NOT_GRANTED_BY_PARTNER` 오류가 올 수 있다.
  - 앱은 지급 실패 안내를 제공해야 한다.
  - 재실행 시 `getPendingOrders`로 복구해야 한다.
  - 지급 후 `completeProductGrant`를 호출해야 한다.

### 기기 변경

- 문서상 기기 변경 후에도 지급 유지가 가능해야 한다.
- 저장소 기능, 토스 로그인, 주문 상태 조회 API를 함께 고려한다.

### 버전 게이트

- 최소 지원 버전 미만에서는 일부 SDK 함수가 `undefined`를 반환할 수 있다.

### 환불

- 앱마켓 환불 권한은 앱마켓에 있다.
- Apps in Toss는 환불 승인 여부를 보장하지 않으므로 테스트는 소액으로 진행한다.

## 필수 샌드박스 테스트

- 결제 성공
- 결제 성공 + 서버 지급 실패
- 에러 시나리오

테스트 포인트:

- `event.data` 정상 반환
- 지급 로직 정상 동작
- UI 업데이트
- 미결 주문 복원
- 에러 UI와 재시도 흐름

## 운영 메모

- 샌드박스에서는 실제 과금이 발생하지 않는다.
- 샌드박스 상품 목록은 콘솔에서 **노출 ON**인 상품만 내려온다.
- 주문 상태 조회 API는 승인/환불 응답 누락 시 서버 검증 경로로 둔다.

## 원문 근거

- `https://developers-apps-in-toss.toss.im/iap/develop.md`
- `https://developers-apps-in-toss.toss.im/development/integration-process.md`
- `https://developers-apps-in-toss.toss.im/api/overview.md`
