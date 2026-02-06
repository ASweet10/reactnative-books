import { View, Text, Image, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Mock Data for testing
const MOCK_BOOKS = [
  { id: '1', title: 'The Hobbit', genre: 'Fantasy', color: 'rgba(59, 130, 246, 0.6)' },
  { id: '2', title: 'Deep Work', genre: 'Productivity', color: 'rgba(168, 85, 247, 0.6)' },
  { id: '3', title: 'Deep Work', genre: 'Productivity', color: 'rgba(168, 85, 247, 0.6)' },
  { id: '4', title: 'Deep Work', genre: 'Productivity', color: 'rgba(168, 85, 247, 0.6)' },
  { id: '5', title: 'Deep Work', genre: 'Productivity', color: 'rgba(168, 85, 247, 0.6)' },
  { id: '6', title: 'Deep Work', genre: 'Productivity', color: 'rgba(168, 85, 247, 0.6)' },
];

export default function BookLibrary() {
  return (
    <View className="flex-1 bg-slate-50 p-4">     
      <FlatList
        data={MOCK_BOOKS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-1 m-2">
            <View className="relative h-60 w-full rounded-xl overflow-hidden shadow-sm bg-white">
              {/* Placeholder for Cover */}
              <View className="absolute inset-0 bg-slate-200 items-center justify-center">
                 <Image source={require('../../assets/images/jules-verne.jpg')} className='w-full h-full'/>
              </View>

              <LinearGradient colors={[item.color, 'transparent']} className="absolute inset-0" />
            </View>
          </View>
        )}
      />
    </View>
  );
}