import { View, Text, Image, FlatList } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useLibrary } from '@/context/LibraryContext'
import { Link, Href } from 'expo-router'
import { useEffect } from 'react'

const getGenreColor = (genre?: string) => {
  const category = genre?.toLowerCase() || '';

  if (category.includes('fiction')) return 'rgba(31, 96, 200, 0.7)'; // Blue
  if (category.includes('philosophy')) return 'rgba(168, 85, 247, 1)'; // Purple
  if (category.includes('history')) return 'rgba(245, 158, 11, 0.6)'; // Amber
  if (category.includes('science')) return 'rgba(16, 185, 129, 0.6)'; // Green
  
  return 'rgba(148, 163, 184, 0.2)'; // Default Slate
}

export default function LibraryScreen() {
  const { library } = useLibrary()

  useEffect(() => {
    console.log("--- CURRENT LIBRARY DATA ---");
    // use JSON.stringify to see the full object instead of [Object object]
    console.log(JSON.stringify(library, null, 2)); 
  }, [library]);

  return (
    <View className="flex-1">     
      <FlatList
        data={library}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const genreColor = getGenreColor(item.categories?.[0])
          return (
            <Link href={`/book/${item.id}` as Href} asChild>
              <View className="w-1/3">
                <View className="relative h-60 w-full overflow-hidden shadow-sm bg-white">
                  <Text>{item.title}</Text>
                  <View className="absolute inset-0 bg-slate-200 items-center justify-center">
                    <Image source={{ uri: item.thumbnail }} className='w-full h-full' resizeMode='cover'/>
                  </View>

                  {/*<LinearGradient colors={[genreColor, 'transparent']} className="absolute inset-0" />*/}
                  <LinearGradient 
                    // A 'holographic' array: Color -> Highlight -> Color
                    colors={['transparent', 'rgba(255,255,255,0.1)', 'transparent']}
                    className="absolute inset-0"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} // Diagonal angle
                    locations={[0, 0.5, 1]} // Puts the white highlight exactly in the middle
                  />
                  <LinearGradient 
                    // A 'holographic' array: Color -> Highlight -> Color
                    colors={[genreColor, 'rgba(255,255,255,0.4)', genreColor]} 
                    className="absolute inset-0"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} // Diagonal angle
                    locations={[0, 0.5, 1]} // Puts the white highlight exactly in the middle
                  />
                </View>
              </View>
            </Link>
          )
        }}
        // If list empty, show message
        ListEmptyComponent={() => (
          <View className="p-10 items-center">
            <Text className="text-slate-400">Your library is empty. Search for books to add!</Text>
          </View>
        )}
      />
    </View>
  );
}