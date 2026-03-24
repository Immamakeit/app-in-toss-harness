import { createRoute } from '@granite-js/react-native';
import { Button, Text } from '@toss/tds-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const Route = createRoute('/about', {
  component: AboutPage,
});

export function AboutPage() {
  const navigation = Route.useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>배포 전 확인</Text>
      <Text style={styles.description} typography="t5" color="#4A5568">
        1. 콘솔 appName과 granite.config.ts 값 일치
      </Text>
      <Text style={styles.description} typography="t5" color="#4A5568">
        2. 샌드박스 앱 테스트 완료
      </Text>
      <Text style={styles.description} typography="t5" color="#4A5568">
        3. CORS 허용 목록과 HTTPS 반영
      </Text>
      <Text style={styles.description} typography="t5" color="#4A5568">
        4. 로그인/결제/프로모션이면 mTLS 준비
      </Text>
      <Button
        display="block"
        size="big"
        viewStyle={styles.button}
        onPress={handleGoBack}
      >
        홈으로 돌아가기
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F7FAFC',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    marginTop: 24,
    alignSelf: 'stretch',
  },
});
