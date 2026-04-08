import { Tabs } from 'expo-router';
import React from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
    
        tabBarActiveTintColor: '#D88EC0', 
        headerShown: false,
      }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: 'My Notes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      
     
    </Tabs>
  );
}