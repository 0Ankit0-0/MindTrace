import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { Animated, Easing, View } from 'react-native';

import { AuthGate } from '@/components/AuthGate';
import { LaunchOverlay } from '@/components/LaunchOverlay';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { appTheme, palette } from '@/constants/theme';
import { MindTraceProvider, useMindTrace } from '@/hooks/useMindTrace';

export default function Layout() {
  const [showLaunchOverlay, setShowLaunchOverlay] = useState(true);

  return (
    <PaperProvider theme={appTheme}>
      <MindTraceProvider>
        <RootShell showLaunchOverlay={showLaunchOverlay} onFinishLaunch={() => setShowLaunchOverlay(false)} />
      </MindTraceProvider>
    </PaperProvider>
  );
}

function RootShell({
  onFinishLaunch,
  showLaunchOverlay,
}: {
  onFinishLaunch: () => void;
  showLaunchOverlay: boolean;
}) {
  const { isAuthenticated, onboardingCompleted } = useMindTrace();
  const [shellOpacity] = useState(new Animated.Value(0));
  const [shellRise] = useState(new Animated.Value(12));

  useEffect(() => {
    if (showLaunchOverlay) {
      return;
    }

    shellOpacity.setValue(0);
    shellRise.setValue(12);

    Animated.parallel([
      Animated.timing(shellOpacity, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(shellRise, {
        toValue: 0,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isAuthenticated, shellOpacity, shellRise, showLaunchOverlay]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={showLaunchOverlay ? 'light' : 'dark'} />
      {!showLaunchOverlay ? (
        <Animated.View style={{ flex: 1, opacity: shellOpacity, transform: [{ translateY: shellRise }] }}>
          {isAuthenticated ? (
            onboardingCompleted ? (
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: palette.primary,
                tabBarInactiveTintColor: '#8C96A8',
                tabBarStyle: {
                  backgroundColor: '#F8FBFF',
                  borderTopColor: palette.border,
                  borderTopWidth: 1,
                  elevation: 8,
                  height: 74,
                  paddingTop: 8,
                  paddingBottom: 10,
                },
                tabBarLabelStyle: {
                  fontSize: 11,
                  fontWeight: '700',
                },
              }}
            >
              <Tabs.Screen
                name="index"
                options={{
                  title: 'Home',
                  tabBarIcon: ({ color, size }) => <Ionicons color={color} name="home-outline" size={size} />,
                }}
              />
              <Tabs.Screen
                name="checkin"
                options={{
                  title: 'Pulse',
                  tabBarIcon: ({ color, size }) => <Ionicons color={color} name="sparkles-outline" size={size} />,
                }}
              />
              <Tabs.Screen
                name="journal"
                options={{
                  title: 'Journal',
                  tabBarIcon: ({ color, size }) => <Ionicons color={color} name="book-outline" size={size} />,
                }}
              />
              <Tabs.Screen
                name="chat"
                options={{
                  title: 'Shift',
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons color={color} name="chatbubble-ellipses-outline" size={size} />
                  ),
                }}
              />
              <Tabs.Screen
                name="profile"
                options={{
                  title: 'You',
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons color={color} name="person-circle-outline" size={size} />
                  ),
                }}
              />
              <Tabs.Screen
                name="dashboard"
                options={{
                  href: null,
                }}
              />
              <Tabs.Screen
                name="studyplan"
                options={{
                  href: null,
                }}
              />
              <Tabs.Screen
                name="comfort"
                options={{
                  href: null,
                }}
              />
              <Tabs.Screen
                name="rescue"
                options={{
                  href: null,
                }}
              />
              <Tabs.Screen
                name="counselor"
                options={{
                  href: null,
                }}
              />
            </Tabs>
            ) : (
              <OnboardingFlow />
            )
          ) : (
            <AuthGate />
          )}
        </Animated.View>
      ) : null}

      <LaunchOverlay visible={showLaunchOverlay} onFinish={onFinishLaunch} />
    </View>
  );
}
