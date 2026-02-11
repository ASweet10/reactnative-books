import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View, Text, Image, ScrollView, Modal, TextInput, TouchableOpacity, Button, Alert } from 'react-native'
import { useState } from 'react'
import { useLocalSearchParams, Stack } from 'expo-router'
import { useLibrary } from '@/context/LibraryContext'
import { LinearGradient } from 'expo-linear-gradient'
import { Genre } from '@/services/BookSearch'

export default function BookDetails() {
  const { id } = useLocalSearchParams()
  const { library, genres, addGenre, updateBookGenre, deleteGenre, availableColors, editGenre } = useLibrary()
  const [ modalVisible, setModalVisible ] = useState(false)
  const [ newGenreName, setNewGenreName ] = useState("")
  const [ selectedColor, setSelectedColor ] = useState("")
  const [ editingGenre, setEditingGenre ] = useState<Genre | null>(null)
  const [ actionMenuVisible, setActionMenuVisible ] = useState(false)

  const book = library.find((b) => b.id === id)
  const currentGenre = genres.find(g => g.name === book?.userGenre) || genres[0]
  const usedColors = genres
    .filter(g => g.id !== editingGenre?.id) // Don't count current genre color as "used" so you can re-select it
    .map(g => g.color)
  if (!book) return <View className="flex-1 items-center justify-center"><Text>Book not found</Text></View>

  const openEditModal = (genre: Genre) => {
    setEditingGenre(genre)
    setNewGenreName(genre.name)
    setSelectedColor(genre.color)
    setModalVisible(true)
  }

  const openCreateModal = () => {
    setEditingGenre(null);
    setNewGenreName('');
    setSelectedColor('');
    setModalVisible(true);
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
        // Logic for Creating (your existing code)
        const newGenre = { id: Date.now().toString(), name: trimmedName, color: selectedColor }
        addGenre(newGenre)
        updateBookGenre(book.id, trimmedName)
      }
      setModalVisible(false)
      setEditingGenre(null)
      setNewGenreName('')
      setSelectedColor('')
    } else {
      alert("Please enter name + pick a color")
    }
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <Stack.Screen options={{ title: book.title, headerTitleStyle: { fontSize: 14 } }} />

        <View className="items-center py-6 bg-slate-50">
          <Text className="text-5xl font-bold text-center"
            style={{ color: currentGenre.color }}
          >
            {book.title}
          </Text>
          <Text className="text-slate-500 italic">{book.authors.join(', ')}</Text>

          <View className="shadow-2xl rounded-xl overflow-hidden h-72 w-48 mt-8">
            <Image source={{ uri: book.thumbnail }} className="w-full h-full" resizeMode="cover" />
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
              setActionMenuVisible(true); // Open our custom icon menu
            }}
            className={`px-4 py-2 rounded-full border ${book.userGenre === g.name ? 'border-black' : 'border-transparent'}`}
            style={{ backgroundColor: g.color }}
          >
            <Text className="font-medium">{g.name}</Text>
          </TouchableOpacity>
        ))}
        
        {/* The + Button */}
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="px-4 py-2 rounded-full bg-slate-200"
        >
          <Text className="font-bold">+</Text>
        </TouchableOpacity>
      </View>

      {/* Rabbit Hole / Notes Section */}
      <View className="p-6">
        <View className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <Text className="text-blue-800 font-bold mb-2">🕳️ The Rabbit Hole</Text>
          <Text className="text-blue-600 text-sm">Found via: [Your Stat Logic Here]</Text>
        </View>

        <Text className="text-lg font-bold mt-8 mb-2">My Thoughts</Text>
        <Text className="text-slate-600 leading-6">
          {book.description || "No description available."}
        </Text>
      </View>
      
      {/* Genre actions (edit/delete/etc.) modal */}
      <Modal transparent={true} visible={actionMenuVisible} animationType="fade" onRequestClose={() => setActionMenuVisible(false)}>
        <TouchableOpacity 
          className="flex-1 bg-black/40 items-center justify-center" 
          activeOpacity={1} 
          onPress={() => setActionMenuVisible(false)}
        >
          <View className="bg-white rounded-3xl p-6 w-64 shadow-xl">
            <Text className="text-center font-bold tracking-widest text-xs" style={{color: editingGenre?.color}}>
              {editingGenre?.name}
            </Text>
            
            <View className="flex-row justify-around mt-4">
              {/* EDIT BUTTON */}
              <TouchableOpacity className="items-center"
                onPress={() => {
                  setActionMenuVisible(false)
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
                  setActionMenuVisible(false);
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
                onPress={() => setActionMenuVisible(false)}
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

      {/* Edit genre modal */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
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
          setModalVisible(false);
          setEditingGenre(null);
        }} />
      </Modal>
    </ScrollView>
  );
}