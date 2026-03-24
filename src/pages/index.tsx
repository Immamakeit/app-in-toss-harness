import { createRoute } from '@granite-js/react-native';
import { Button, Text } from '@toss/tds-react-native';
import type React from 'react';
import { StyleSheet, View } from 'react-native';

export const Route = createRoute('/', {
  component: IndexPage,
});

export function IndexPage() {
  const navigation = Route.useNavigation();

  const goToAboutPage = () => {
    navigation.navigate('/about');
  };

  return (
    <Container>
      <Text style={styles.title}>Apps in Toss RN Starter</Text>
      <Text style={styles.subtitle} typography="t4" color="#4A5568">
        Granite + Apps in Toss SDK + React Native 구성을 적용한 시작 화면이에요.
      </Text>
      <Text style={styles.description} typography="t5" color="#718096">
        앱 이름, 브랜드, 배포 키, CORS, mTLS 같은 운영 값은 `.env`와 콘솔
        설정으로 맞추면 돼요.
      </Text>
      <Button
        display="block"
        size="big"
        viewStyle={styles.button}
        onPress={goToAboutPage}
      >
        설정 체크리스트 보기
      </Button>
    </Container>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    alignSelf: 'stretch',
  },
});
