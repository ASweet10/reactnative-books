import { View, Text, Image, FlatList, SectionList, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useLibrary } from '@/context/LibraryContext'
import { Link, Href } from 'expo-router'
import { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const getGenreColor = (genre?: string) => {
  const category = genre?.toLowerCase() || '';

  if (category.includes('fiction')) return 'rgba(31, 96, 200, 0.7)'; // Blue
  if (category.includes('philosophy')) return 'rgba(168, 85, 247, 1)'; // Purple
  if (category.includes('history')) return 'rgba(245, 158, 11, 0.6)'; // Amber
  if (category.includes('science')) return 'rgba(16, 185, 129, 0.6)'; // Green
  
  return 'rgba(148, 163, 184, 0.2)'; // Default Slate
}

export default function LibraryScreen() {
  const { library, genres } = useLibrary()

  useEffect(() => {
    console.log(JSON.stringify(library, null, 2)) // stringify: see full object instead of [Object object]
  }, [library])

  const sections = genres.map(genre => ({
    title: genre.name,
    color: genre.color,
    // Find all books belonging to this specific genre
    data: library.filter(book => book.userGenre === genre.name)
  })).filter(section => section.data.length > 0)

  return (
    <SafeAreaView className="flex-1 bg-slate-800" edges={['top']}>     
      <FlatList
        data={library}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const currentBookGenre = genres.find(g => g.name === item.userGenre);
          const foilColor = currentBookGenre ? currentBookGenre.color : 'rgba(148, 163, 184, 0.2)'

          return (
            <Link href={`/book/${item.id}` as Href} asChild>
              <TouchableOpacity className='w-1/3'>
                <View className="w-full">
                  <View className="relative h-60 w-full overflow-hidden shadow-sm bg-white">
                    <Text>{item.title}</Text>
                    <View className="absolute inset-0 bg-slate-200 items-center justify-center">
                      <Image source={{ uri: item.thumbnail }} className='w-full h-full' resizeMode='cover'/>
                    </View>

                    <LinearGradient 
                      // A 'holographic' array: Color -> Highlight -> Color
                      colors={[foilColor, 'rgba(255,255,255,0.1)', foilColor]}
                      className="absolute inset-0"
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }} // Diagonal angle
                      //locations={[0, 0.5, 1]} // Puts the white highlight exactly in the middle
                    />
                    {/*
                    <LinearGradient 
                      // A 'holographic' array: Color -> Highlight -> Color
                      colors={[genreColor, 'rgba(255,255,255,0.4)', genreColor]} 
                      className="absolute inset-0"
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }} // Diagonal angle
                      locations={[0, 0.5, 1]} // Puts the white highlight exactly in the middle
                    />
                    */}
                  </View>
                </View>
              </TouchableOpacity>
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
    </SafeAreaView>
  );
}