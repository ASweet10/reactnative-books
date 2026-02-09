import { View, Text, Image, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MOCK_BOOKS = [
  { id: '1', title: 'The Hobbit', genre: 'Fantasy', color: 'rgba(59, 130, 246, 0.2)' }, // Blue
  { id: '2', title: 'Deep Work', genre: 'Productivity', color: 'rgba(168, 85, 247, 0.2)' }, // Purple
];

export default function BookLibrary() {
  return (
    <View className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold mb-6 mt-10">My Library</Text>
      
      <FlatList
        data={MOCK_BOOKS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-1 m-2">
            <View className="relative h-60 w-full rounded-xl overflow-hidden shadow-sm bg-white">
              {/* Placeholder for Cover */}
              <View className="absolute inset-0 bg-slate-200 items-center justify-center">
                 <Text className="text-slate-400">Cover Art</Text>
              </View>

              {/* The "Foil" Overlay */}
              <LinearGradient
                colors={[item.color, 'transparent']}
                className="absolute inset-0"
              />
              
              <View className="absolute bottom-0 p-3 w-full bg-white/80">
                <Text className="font-semibold text-slate-800" numberOfLines={1}>
                  {item.title}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}