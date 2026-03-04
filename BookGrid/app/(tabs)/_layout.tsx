import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
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
        headerShown: false, // Disable header static render to prevent hydration error (React Nav V6)
      }}>
      <Tabs.Screen name="LibraryScreen"
        options={{ title: 'BookGrid', tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} /> }}
      />
      <Tabs.Screen name="SearchScreen"
        options={{ title: 'Add', tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} /> }}
      />
    </Tabs>
  )
}