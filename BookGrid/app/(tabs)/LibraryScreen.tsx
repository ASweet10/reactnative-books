import { View, Text, Image, FlatList, SectionList, TouchableOpacity, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useLibrary } from '@/context/LibraryContext'
import { Link, Href } from 'expo-router'
import { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'

export default function LibraryScreen() {
  const { library, genres, removeBook } = useLibrary()

  useEffect(() => {
    console.log(JSON.stringify(library, null, 2)) // stringify: see full object instead of [Object object]
  }, [library])

  const sections = [
  // 1. Map your custom genres as usual
  ...genres.map(genre => ({
    id: genre.id,
    title: genre.name,
    color: genre.color,
    data: library.filter(book => book.userGenre === genre.name)
  })),
  // 2. Add an "Uncategorized" section for books that don't match any genre
  {
    id: 'uncategorized',
    title: 'Uncategorized',
    color: '#94a3b8',
    data: library.filter(book => 
      !book.userGenre || 
      book.userGenre === 'Uncategorized' || 
      !genres.find(g => g.name === book.userGenre)
    )
  }
].filter(section => section.data.length > 0); // Only show sections with books

  return (
    <SafeAreaView className="flex-1 bg-slate-800 pb-1" edges={['top']}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false} // Set to true if you want the header to stay at the top as you scroll
        renderSectionHeader={({ section: { title, color } }) => (
          <View className="px-6 py-3 flex-row items-center bg-slate-800">          
            <Text className="text-xl font-extrabold" style={{ color: color }}>
              {title}
            </Text>
          </View>
        )}
        renderItem={({ section, index }) => {
          if (index !== 0) return null; // Used to maintain horizontal rows. For vertical, just return book item here
          return (
            <FlatList
              numColumns={3}
              data={section.data}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 0 }}
              className='mx-5'
              renderItem={({ item }) => {
                if (index !== 0) return null;
                // Fetch color for this specific book's genre
                const currentBookGenre = genres.find(g => g.name === item.userGenre);
                const foilColor = currentBookGenre ? currentBookGenre.color : 'rgba(148, 163, 184, 0.5)';

                return (
                  <View style={{ width: '33%' }}>

                      <Link href={`/book/${item.id}`} asChild>
                        <TouchableOpacity 
                          className="h-48 w-full overflow-hidden shadow-2xl bg-slate-700"
                          onLongPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                            Alert.alert(
                              "Remove Book",
                              `Are you sure you want to remove "${item.title}" from your library?`,
                              [
                                { text: "Cancel", style: "cancel" },
                                { 
                                  text: "Remove", 
                                  style: "destructive", 
                                  onPress: () => removeBook(item.id)
                                }
                              ]
                            )
                          }}
                        >
                          <Image source={{ uri: item.thumbnail }} className="w-full h-full" resizeMode="cover" />
                          
                          <LinearGradient 
                            colors={[foilColor, 'rgba(255,255,255,0.2)', foilColor]}
                            className="absolute inset-0"
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                          />
                        </TouchableOpacity>
                      </Link>
                  </View>
                );
              }}
            />
          )
        }}
      />
      {/*
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
                      colors={[foilColor, 'rgba(255,255,255,0.1)', foilColor]}
                      className="absolute inset-0"
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }} // Diagonal angle
                      //locations={[0, 0.5, 1]} // Puts the white highlight exactly in the middle
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          )
        }}

        ListEmptyComponent={() => (
          <View className="p-10 items-center">
            <Text className="text-slate-400">Your library is empty. Search for books to add!</Text>
          </View>
        )}
      />
      */}
      
    </SafeAreaView>
  );
}