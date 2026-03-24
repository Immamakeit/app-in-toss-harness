# 공통 연동 규격

## 범위

현재 문서셋 기준으로 아래 서버 API 계열에 공통 적용되는 규격을 정리한다.

- 토스 로그인
- 토스페이
- 인앱결제 상태 조회 API
- 스마트 메시지
- 프로모션 Server-to-Server

## 통신 모델

- 구조: `파트너사 서버 -> 앱인토스 서버 -> 토스 서버`
- 호출 위치: Apps in Toss 서버 API는 **파트너사 서버**에서 호출한다.
- 문서상 필수 보안: `mTLS`

## 도메인

- 공통 계열: `https://apps-in-toss-api.toss.im`
- 결제 계열: `https://pay-apps-in-toss-api.toss.im`

## mTLS

- 콘솔에서 인증서와 키 파일을 직접 발급받는다.
- 서버 애플리케이션에 인증서/키를 등록해야 한다.
- 인증서/키는 안전한 위치에 보관해야 한다.
- 인증서 만료 전에 재발급이 필요하다.
- 문서상 다중 인증서 관리가 가능하므로 무중단 교체 전략을 고려한다.

## 방화벽

방화벽을 관리하는 환경이면 아래를 체크한다.

- Inbound: Apps in Toss -> 가맹점 서버 콜백 수신용 443 허용
- Outbound: 가맹점 -> Apps in Toss API 호출용 443 허용
- 상세 IP는 원문 소스를 그대로 따른다.

## 공통 응답 규격

모든 API는 먼저 `resultType`을 본다.

- `SUCCESS`: 실제 데이터는 `success` 또는 해당 API 문서가 정의한 성공 객체에 있다.
- `FAIL`: `errorCode`, `reason` 기반으로 실패 처리한다.

실무 규칙:

- HTTP 상태코드만으로 성공/실패를 판단하지 않는다.
- 응답 파싱 전에 `resultType` 분기를 먼저 둔다.
- 실패 시 원문 문서의 에러 코드와 이유를 함께 로깅한다.

## 요청 제한

- 기본 한도: `3,000 QPM`
- 예상 트래픽이 높으면 오픈 전에 상향 협의를 검토한다.

## 공통 구현 메모

- 클라이언트 번들에는 토큰, 인증서, 시크릿을 넣지 않는다.
- API 응답 지연이나 콜백 누락 가능성을 고려해 **상태 조회 API**를 정합성 복구 수단으로 둔다.
- 테스트/라이브 환경을 섞지 않는다.

## 원문 근거

- `https://developers-apps-in-toss.toss.im/api/overview.md`
- `https://developers-apps-in-toss.toss.im/development/integration-process.md`
