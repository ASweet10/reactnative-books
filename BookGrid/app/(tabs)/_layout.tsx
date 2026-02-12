import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        //tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarActiveTintColor: '#1a68dc',
        tabBarStyle: {
          backgroundColor: "#1e293b",
          borderTopWidth: 1,
          borderTopColor: '#1a68dc',
        },
        // Disable header static render on web to prevent hydration error: React Navigation v6
        headerShown: false,
      }}>
      <Tabs.Screen
        name="LibraryScreen"
        options={{
          title: 'BookGrid',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="SearchScreen"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />
      {/*
      <Tabs.Screen
        name="SettingsScreen" // Create a file called SettingsScreen.tsx in (tabs)
        options={{
          title: 'Theme',
          tabBarIcon: ({ color }) => (
            <FontAwesome 
              name={colorScheme === 'dark' ? "moon-o" : "sun-o"} 
              color={color} 
              size={24} 
            />
          ),
        }}
      />
      */}
    </Tabs>
  )
}