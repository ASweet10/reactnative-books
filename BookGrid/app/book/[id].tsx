import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { View, Text, Image, ScrollView, Modal, TextInput, TouchableOpacity, Button, Linking, Pressable } from 'react-native'
import { useState } from 'react'
import { useLocalSearchParams, Stack, useRouter } from 'expo-router'
import { useLibrary } from '@/context/LibraryContext'
import { Genre } from '@/services/BookSearch'
import { fetchYouTubeTitle } from '@/services/YouTubeTitleSearch'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function BookDetails() {
  const { id } = useLocalSearchParams()
  const { library, genres, addGenre, updateBookGenre, deleteGenre, availableColors, editGenre, addNote, deleteNote } = useLibrary()
  const [ editGenreModalVisible, setEditGenreModalVisible ] = useState(false)
  const [ newGenreName, setNewGenreName ] = useState("")
  const [ selectedColor, setSelectedColor ] = useState("")
  const [ editingGenre, setEditingGenre ] = useState<Genre | null>(null)
  const [ genreActionMenuVisible, setGenreActionMenuVisible ] = useState(false)
  const [ noteModalVisible, setNoteModalVisible ] = useState(false)
  const [ newNote, setNewNote ] = useState("")
  const [ isProcessingNote, setIsProcessingNote ] = useState(false)
  const router = useRouter()

  const book = library.find((b) => b.id === id)
  const currentGenre = genres.find(g => g.name === book?.userGenre) || { name: 'Loading', color: '#64748b' }
  const usedColors = genres
    .filter(g => g.id !== editingGenre?.id) // Don't count current genre color as "used" so you can re-select it
    .map(g => g.color)
  if (!book) return <View className="flex-1 items-center justify-center"><Text>Book not found</Text></View>

  const openEditModal = (genre: Genre) => {
    setEditingGenre(genre)
    setNewGenreName(genre.name)
    setSelectedColor(genre.color)
    setEditGenreModalVisible(true)
  }

  const handleSaveGenre = () => {
    const trimmedName = newGenreName.trim()
    const nameExistsOnOther = genres.find(
      (g) => g.name.toLowerCase() === trimmedName.toLowerCase() && g.id !== editingGenre?.id
    )

    if (nameExistsOnOther) {
      alert("This genre name is taken!");
      return
    }

    if (trimmedName && selectedColor) {
      if (editingGenre) {
        editGenre(editingGenre.name, { 
          ...editingGenre, 
          name: trimmedName, 
          color: selectedColor 
        })
      } else {
        const newGenre = { id: Date.now().toString(), name: trimmedName, color: selectedColor }
        addGenre(newGenre)
        updateBookGenre(book.id, trimmedName)
      }
      setEditGenreModalVisible(false)
      setEditingGenre(null)
      setNewGenreName('')
      setSelectedColor('')
    } else {
      alert("Please enter name + pick a color")
    }
  }

  const handleAddNote = async () => {
    let trimmedNote = newNote.trim()
    if (!trimmedNote) return

    setIsProcessingNote(true)
    try {
      const isYouTube = trimmedNote.includes('youtube.com') || trimmedNote.includes('youtu.be')
      if (isYouTube) {
        const title = await fetchYouTubeTitle(trimmedNote)
        if (title) trimmedNote = `${title} | ${trimmedNote}`
      } else if (trimmedNote.toLowerCase().startsWith('www.')) {
        trimmedNote = `https://${trimmedNote}`
      }
      addNote(book.id, trimmedNote)
      setNewNote("")
    } finally {
      setIsProcessingNote(false) // End loading regardless of success/fail
    }
  }

  const handleNotePress = async (note: string) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi
    const match = note.match(urlRegex)

    if (match) {
      let url = match[0];
      if (url.toLowerCase().startsWith('www.')) {
        url = `https://${url}`;
      }

      try {
        await Linking.openURL(url);
      } catch (err) {
        alert("Could not open this link. Make sure it is a valid URL.");
      }
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-800">
      <Stack.Screen options={{ headerShown: false }}/>
      <View className="flex-row items-center px-4 py-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-transparent rounded-full">
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-xl pl-4 font-bold text-white" numberOfLines={1}>
          Book Details
        </Text>
      </View>

      <ScrollView className="flex-1 bg-slate-900">
          <View className="items-center py-6 bg-slate-900">
            <View className="shadow-2xl rounded-xl overflow-hidden h-72 w-48 mt-6">
              <Image source={{ uri: book.thumbnail }} className="w-full h-full" resizeMode="cover" />
            </View>

            <Text className="text-3xl font-bold text-center my-8 mx-8"
              style={{ color: currentGenre.color }}
            >
              {book.title}
            </Text>

            <View>
              <Text className="text-lg font-bold text-center" style={{ color: currentGenre.color}}>Authors</Text>
              <Text className="text-slate-500 italic">{book.authors.join(', ')}</Text>
            </View>

            <View className="flex-row justify-around w-full mt-4 py-4">
              <View className="items-center">
                <Text className="font-bold" style={{ color: currentGenre.color}}>{book.pageCount || 'N/A'}</Text>
                <Text className="text-xs text-slate-500 uppercase">Pages</Text>
              </View>
              
              <View className="items-center">
                <Text className="font-bold" style={{ color: currentGenre.color}}>
                  {book.publishedDate ? new Date(book.publishedDate).getFullYear() : 'N/A'}
                </Text>
                <Text className="text-xs text-slate-500 uppercase">Published</Text>
              </View>
            </View>
        </View>

        <View className="flex-row flex-wrap gap-2 px-8">
          {genres.map((g) => (
            <TouchableOpacity
              key={g.id}
              onPress={() => updateBookGenre(book.id, g.name)}
              onLongPress={() => {
                if (g.name === 'Uncategorized') return;
                setEditingGenre(g); // Store the genre we are acting upon
                setGenreActionMenuVisible(true); // Open our custom icon menu
              }}
              className={`px-4 py-2 rounded-full border ${book.userGenre === g.name ? 'border-black' : 'border-transparent'}`}
              style={{ backgroundColor: g.color }}
            >
              <Text className="font-medium">{g.name}</Text>
            </TouchableOpacity>
          ))}
          
          {/* The + Button */}
          <TouchableOpacity 
            onPress={() => setEditGenreModalVisible(true)}
            className="px-4 py-2 rounded-full bg-slate-200"
          >
            <Text className="font-bold">+</Text>
          </TouchableOpacity>
        </View>

        <View className="p-6">
            <Text className="text-xl font-bold ml-2 mb-2 text-slate-500">Notes</Text>
            <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => setNoteModalVisible(true)}
                className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50"
              >
                <View className="flex flex-col">
                  {book.notes && book.notes.length > 0 ? (
                    book.notes?.map((note, index) => {
                      const parts = note.split(' | ')
                      const hasTitle = parts.length > 1
                      const displayValue = hasTitle ? parts[0] : note
                      const actualLink = hasTitle ? parts[1] : note

                      const isYouTube = actualLink.includes('youtube.com') || actualLink.includes('youtu.be')
                      const isGeneralLink = actualLink.includes('http') || actualLink.startsWith('www.')

                      if (isYouTube || isGeneralLink) {
                          return (
                            <TouchableOpacity 
                              key={index}
                              onPress={(e) => {
                                e.stopPropagation();
                                handleNotePress(actualLink);
                              }}
                              className="flex-row items-center bg-slate-800/60 px-3 py-2 rounded-xl mb-2 border border-slate-700 overflow-hidden"
                            >
                              <Ionicons 
                                name={isYouTube ? "logo-youtube" : "link-outline"} 
                                size={18} 
                                color={isYouTube ? "#ff0000" : "#60a5fa"} 
                              />
                              <Text className="text-blue-400 font-medium ml-1" numberOfLines={1}>
                                {displayValue}
                              </Text>
                            </TouchableOpacity>
                          );
                        }

                        return (
                          <Text key={index} className="italic text-xl mb-2" style={{ color: currentGenre.color }}>
                            "{note}"
                          </Text>
                        )
                    })) : (
                    <Text className="text-slate-500 italic py-2">
                      Tap to add a favorite quote, YouTube link, or thought...
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
        </View>
      </ScrollView>

        {/* Genre actions (edit/delete/etc.) modal */}
        <Modal transparent={true} visible={genreActionMenuVisible} animationType="fade" onRequestClose={() => setGenreActionMenuVisible(false)}>
          <TouchableOpacity 
            className="flex-1 bg-black/40 items-center justify-center" 
            activeOpacity={1} 
            onPress={() => setGenreActionMenuVisible(false)}
          >
            <View className="bg-white rounded-3xl p-6 w-64 shadow-xl">
              <Text className="text-center font-bold tracking-widest text-xs" style={{color: editingGenre?.color}}>
                {editingGenre?.name}
              </Text>
              
              <View className="flex-row justify-around mt-4">
                {/* EDIT BUTTON */}
                <TouchableOpacity className="items-center"
                  onPress={() => {
                    setGenreActionMenuVisible(false)
                    if (editingGenre) openEditModal(editingGenre)
                  }}
                >
                  <View className="bg-blue-100 p-4 rounded-2xl mb-2">
                    <MaterialCommunityIcons name="pencil" size={28} color="#3b82f6" />
                  </View>
                </TouchableOpacity>

                {/* DELETE BUTTON */}
                <TouchableOpacity 
                  onPress={() => {
                    setGenreActionMenuVisible(false);
                    if (editingGenre) deleteGenre(editingGenre.name);
                  }}
                  className="items-center"
                >
                  <View className="bg-red-100 p-4 rounded-2xl mb-2">
                    <MaterialCommunityIcons name="trash-can-outline" size={28} color="#ef4444" />
                  </View>
                </TouchableOpacity>

                {/* CANCEL BUTTON */}
                <TouchableOpacity 
                  onPress={() => setGenreActionMenuVisible(false)}
                  className="items-center"
                >
                  <View className="bg-slate-100 p-4 rounded-2xl mb-2">
                    <MaterialCommunityIcons name="close" size={28} color="#64748b" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Genre modal */}
        <Modal visible={editGenreModalVisible} animationType="slide" onRequestClose={() => setEditGenreModalVisible(false)}>
          <Text className="text-2xl font-bold mt-6 text-center" style={{color: editingGenre?.color}}>{editingGenre?.name}</Text>
          <View className="p-8 flex-1 bg-white">
            <TextInput 
              placeholder="Genre Name (e.g. High Fantasy)" 
              className="border-b p-2 mb-6"
              value={newGenreName}
              onChangeText={setNewGenreName}
            />
            
            <View className="flex-row flex-wrap mb-10">
              {availableColors.map(color => {
                const isUsedByOthers = usedColors.includes(color)
                const isSelected = selectedColor === color
                const isCurrentGenreColor = editingGenre?.color === color

                return (
                  <TouchableOpacity 
                    key={color}
                    onPress={() => (!isUsedByOthers || isCurrentGenreColor) && setSelectedColor(color)}
                    disabled={isUsedByOthers && !isCurrentGenreColor} // Disable button
                    style={{ 
                      backgroundColor: isUsedByOthers && !isCurrentGenreColor ? '#CBD5E1' : color,
                      width: 50, height: 50, margin: 8, borderRadius: 25,
                      opacity: isUsedByOthers && !isCurrentGenreColor ? 0.3 : 1, // Gray out
                      borderWidth: isSelected ? 3 : 0,
                      borderColor: '#000'
                    }}
                  >
                    {isUsedByOthers && !isCurrentGenreColor && (
                      <Text className="text-[10px] text-center mt-4">Taken</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            
            <TouchableOpacity 
              onPress={handleSaveGenre}
              disabled={!newGenreName.trim() || !selectedColor}
              style={{ opacity: (!newGenreName.trim() || !selectedColor) ? 0.5 : 1 }}
              className={`p-4 rounded-xl items-center ${(!newGenreName.trim() || !selectedColor) ? 'bg-slate-300' : 'bg-blue-500'}`}
            >
              <Text className="text-white font-bold text-lg">Save</Text>
            </TouchableOpacity>
          </View>
          <Button title="Cancel" onPress={() => {
            setEditGenreModalVisible(false);
            setEditingGenre(null);
          }} />
        </Modal>

        {/* Notes modal */}
        <Modal 
          visible={noteModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setNoteModalVisible(false)}
          statusBarTranslucent={true} // Cover top of screen
        >

          <View className="flex-1 justify-center items-center bg-black/80 px-6">
            <View className="w-full rounded-3xl p-6 shadow-2xl bg-slate-900">
              <Text className="text-2xl text-white font-bold text-center">My Notes</Text>

              <ScrollView className="max-h-60 my-4">
                { book.notes?.map((note, index) => {
                  const parts = note.split(' | ')
                  const isLink = note.includes(' | ')
                  const displayTitle = isLink ? parts[0] : note
                  const subText = isLink ? parts[1] : null

                  return (
                    <View key={index} className='flex-row items-center justify-between bg-white/10 p-3 rounded-xl mb-3'>
                      <View className='flex-1 mr-3'>
                        <Text className="italic text-lg" style={{ color: currentGenre.color }} numberOfLines={2}>{displayTitle}</Text>
                      
                        {subText && (
                          <Text className="text-slate-400 text-xs mt-1" numberOfLines={1}>
                            {subText}
                          </Text>
                        )}
                      </View>

                      <TouchableOpacity onPress={() => deleteNote(book.id, index)} className="ml-4 p-2">
                        <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  )})
                }
              </ScrollView>

              {/* Note Input Area */}
              <TextInput
                className="bg-white/20 rounded-xl p-4 text-white mb-4 mt-10"
                placeholder="Type a note..."
                value={newNote}
                onChangeText={setNewNote}
                multiline
              />
              
              <View className="flex-row gap-3">
                <TouchableOpacity 
                  onPress={() => setNoteModalVisible(false)}
                  className="flex-1 bg-white/20 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">Close</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleAddNote}
                  className="flex-1 bg-white py-3 rounded-xl items-center"
                  style={{ backgroundColor: currentGenre.color }}
                >
                  <Text className="text-white font-bold">Add Note</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
    </SafeAreaView>
  );
}