import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiImage } from 'moti';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('(tabs)'); // Ana ekrana yönlendir
    }, 2500); // 2.5 saniye beklet

    return () => clearTimeout(timeout);
  }, [router]); // router'ı bağımlılıklara eklemek iyi pratik

  return (
    <View style={styles.container}>
      <MotiImage
        source={require('../assets/images/seturmarinas.png')}
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 1000 }}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa', // Hafif marina havası
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
