import React, { useState, useEffect } from 'react'
import { View, TextInput, FlatList, Text, Image, TouchableOpacity } from 'react-native'
import { searchBooks, Book } from '../../services/BookSearch'
import { useLibrary } from '@/context/LibraryContext'

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const { addBook } = useLibrary()

  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true)
      const books = await searchBooks(query)
      setResults(books)
      setLoading(false)
    }, 500) // 500ms debounce delay

    return () => clearTimeout(delayDebounceFn) // Clean up timer if user types again
  }, [query])

  return (
    <View className="flex-1 bg-white p-4 pt-12">
      {/* Search Input Area */}
      <View className="flex-row items-center bg-slate-100 rounded-full px-4 py-2 mb-6">
        <TextInput
          className="flex-1 h-10 text-slate-800"
          placeholder="Search for a book..."
          value={query}
          onChangeText={setQuery}
          //onSubmitEditing={handleSearch} // Triggers when user hits "Search" on keyboard
        />
        {/*
        <TouchableOpacity onPress={handleSearch}>
          <Text className="text-blue-500 font-bold ml-2">Search</Text>
        </TouchableOpacity>
        */}
      </View>

      <FlatList data={results} keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center mb-4 p-2 bg-slate-50 rounded-lg">
            {item.thumbnail ? (
              <Image source={{ uri: item.thumbnail }} className="w-16 h-24 rounded" />
            ) : (
              <View className="w-16 h-24 bg-slate-200 rounded items-center justify-center">
                <Text className="text-[10px] text-slate-400">No Cover</Text>
              </View>
            )}
            <View className="ml-4 flex-1">
              <Text className="font-bold text-lg" numberOfLines={1}>{item.title}</Text>
              <Text className="text-slate-500">{item.authors.join(', ')}</Text>
            </View>

            <TouchableOpacity onPress={() => addBook(item)} className="bg-blue-500 p-2 rounded-md"
            >
              <Text className="text-white text-xs font-bold">Add to Library</Text>
            </TouchableOpacity>
          </View>
          
        )}
      />
    </View>
  );
}