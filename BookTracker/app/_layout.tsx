import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { LibraryProvider } from '@/context/LibraryContext'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'
import '../global.css'
import { useColorScheme } from '@/components/useColorScheme'
export { ErrorBoundary} from 'expo-router' // Catch errors thrown by Layout component

export const unstable_settings = {
  initialRouteName: '(tabs)', // Ensure reloading on `/modal` keeps a back button present
}
SplashScreen.preventAutoHideAsync() // Prevent splash screen from auto-hiding before asset loading complete

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  useEffect(() => {
    if (error) throw error;
  }, [error]) // Expo Router uses Error Boundaries to catch errors in navigation tree

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  return (
    <LibraryProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </LibraryProvider>
  )
}