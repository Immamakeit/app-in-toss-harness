# 프로모션 연동

## 업무 목적

게임/비게임 미니앱에서 토스 포인트 지급 이벤트를 운영하고,
중복 지급과 사용자 오인을 방지한다.

## 현재 문서셋 범위

현재 정리본은 `https://developers-apps-in-toss.toss.im/promotion/develop.md` 기준이다.
이 문서셋에는 상세 HTTP 스펙이 아니라 **업무 방식과 운영 주의사항**이 중심으로 들어 있다.

## 업무 분류

### 게임

- 서버 없이도 프로모션 지급 가능
- 함수: `grantPromotionRewardForGame`

### 비게임

- 두 가지 방식이 있다.
  - 서버 없이 지급
  - 서버를 통한 지급(Server-to-Server)
- 요청 위변조 방지나 무결성이 중요하면 서버 지급 방식을 선택한다.

## 선행 조건

- 프로모션 코드 준비
- 게임/비게임 구분 확정
- 중복 지급 방어 로직 설계
- 비게임 Server-to-Server를 쓰면 파트너 서버와 `mTLS` 준비

## 예외 처리

### 중복 지급

- 게임:
  - `grantPromotionRewardForGame` 중복 호출 시 같은 사용자에게 중복 지급될 수 있다.
- 비게임:
  - `grantPromotionReward` 중복 호출 시 같은 사용자에게 중복 지급될 수 있다.
- 대응:
  - 서버 또는 클라이언트에서 idempotency에 준하는 방어 로직을 둔다.

### 버전 게이트

- 게임 프로모션은 토스앱 `5.232.0` 이상에서만 지원한다.
- 미만 버전에서는 `undefined`가 반환되고 업데이트 안내 화면이 뜬다.

### 테스트 전제

- 실제 프로모션 시작 전, 테스트용 프로모션 코드로 최소 1회 이상 호출해야 한다.

## 용어/정책 주의사항

- 자체 리워드에 `포인트`라는 명칭을 쓰지 않는다.
- `토스 포인트`와 혼동될 표현을 피한다.
- `출금`, `인출` 등 현금화로 오인될 수 있는 표현을 쓰지 않는다.
- 가상 자산이 토스 포인트로 전환되는 문맥이면 `토스 포인트 지급`으로 표기한다.

## 운영 메모

- 비게임 Server-to-Server의 상세 엔드포인트 스펙은 현재 정리 대상 문서셋에 충분히 들어오지 않았다.
- 상세 HTTP 규격이 필요하면 다음 문서 반입 시 이 문서를 확장한다.

## 원문 근거

- `https://developers-apps-in-toss.toss.im/promotion/develop.md`
- `https://developers-apps-in-toss.toss.im/development/integration-process.md`
