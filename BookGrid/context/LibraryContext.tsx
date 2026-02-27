import React, { createContext, useContext, useState, useEffect } from 'react'
import { Book, Genre } from '../services/BookSearch'
import AsyncStorage from '@react-native-async-storage/async-storage'

const COLOR_PALETTE = [
  'rgba(239, 68, 68, 0.4)',  // Red
  'rgba(59, 130, 246, 0.4)', // Blue
  'rgba(16, 185, 129, 0.4)', // Green
  'rgba(245, 158, 11, 0.4)', // Orange
  'rgba(168, 85, 247, 0.4)', // Purple
  'rgba(236, 72, 153, 0.4)', // Pink
]

type LibraryContextType = {
  library: Book[]
  genres: Genre[]
  addBook: (book: Book) => void
  addGenre: (genre: Genre) => void
  removeBook: (bookId: string) => void
  updateBookGenre: (bookId: string, genreName: string) => void
  deleteGenre: (genreName: string) => void
  editGenre: (oldName: string, updatedGenre: Genre) => void
  availableColors: string[]
  addNote: (bookId: string, note: string) => void
  deleteNote: (bookId: string, noteIndex: number) => void
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const availableColors = COLOR_PALETTE
  const [library, setLibrary] = useState<Book[]>([])
  const [genres, setGenres] = useState<Genre[]>([
    { id: Date.now().toString(), name: 'None', color: 'rgba(148, 163, 184, 0.2)' }
  ])

  useEffect(() => {
    const saveGenres = async () => {
      try {
        await AsyncStorage.setItem('genres', JSON.stringify(genres))
      } catch (e) { console.error("Failed to save genres", e) }
    }
    saveGenres()
  }, [genres])

  useEffect(() => {
    const loadLibrary = async () => {
      const savedLibrary = await AsyncStorage.getItem('@my_library')
      const savedGenres = await AsyncStorage.getItem('@genres')
      if (savedLibrary) setLibrary(JSON.parse(savedLibrary))

      if (savedGenres) setGenres(JSON.parse(savedGenres))
    }
    loadLibrary()
  }, [])

  {/*  Flush local storage
  useEffect(() => {
    AsyncStorage.clear()
  }, [])
  */}

  const addGenre = async (newGenre: Genre) => {
    const updated = [...genres, newGenre]
    setGenres(updated)
    await AsyncStorage.setItem('@genres', JSON.stringify(updated))
  }

  const updateBookGenre = async (bookId: string, genreName: string) => {
    const updatedLibrary = library.map(book =>
      book.id === bookId ? { ...book, userGenre: genreName } : book
    )
    setLibrary(updatedLibrary)
    await AsyncStorage.setItem('@my_library', JSON.stringify(updatedLibrary))
  }

  const deleteGenre = async (genreName: string) => {
    const updatedGenres = genres.filter(g => g.name !== genreName)
    setGenres(updatedGenres)
    await AsyncStorage.setItem('@genres', JSON.stringify(updatedGenres))

    const updatedLibrary: Book[] = library.map(book => 
      book.userGenre === genreName ? { ...book, userGenre: undefined } : book
    )
    setLibrary(updatedLibrary)
    await AsyncStorage.setItem('@my_library', JSON.stringify(updatedLibrary))
  }

  const editGenre = async (oldName: string, updatedGenre: Genre) => {
    // 1. Update the Genres list
    const updatedGenres = genres.map(g => g.name === oldName ? updatedGenre : g)
    setGenres(updatedGenres)
    await AsyncStorage.setItem('@genres', JSON.stringify(updatedGenres))

    // 2. Update all books that were using the old name
    const updatedLibrary = library.map(book => 
      book.userGenre === oldName 
        ? { ...book, userGenre: updatedGenre.name }
        : book
    )
    setLibrary(updatedLibrary)
    await AsyncStorage.setItem('@my_library', JSON.stringify(updatedLibrary))
  }

  const addBook = async (book: Book) => {
    if (!library.find(b => b.id === book.id)) {
      const updatedLibrary = [...library, book]
      setLibrary(updatedLibrary)
      await AsyncStorage.setItem('@my_library', JSON.stringify(updatedLibrary))
    }
  }

  const removeBook = async (bookId: string) => {
    const updatedLibrary = library.filter(b => b.id !== bookId)
    setLibrary(updatedLibrary)
    await AsyncStorage.setItem('@my_library', JSON.stringify(updatedLibrary))
  }

  const addNote = (bookId: string, note: string) => {
    setLibrary(prev => prev.map(book =>
      book.id === bookId
      ? { ...book, notes: [...(book.notes || []), note] }
      : book
    ))
  }

  const deleteNote = (bookId: string, noteIndex: number) => {
    setLibrary(prev => prev.map(book =>
      book.id === bookId
        ? { ...book, notes: book.notes?.filter((_, i) => i !== noteIndex) }
        : book
    ))
  }

  return (
    <LibraryContext.Provider value={{ library, genres, availableColors, addBook, removeBook, addGenre, updateBookGenre, deleteGenre, editGenre, addNote, deleteNote }}>
      {children}
    </LibraryContext.Provider>
  )
}

export const useLibrary = () => {
  const context = useContext(LibraryContext)
  if (!context) throw new Error("useLibrary must be used within LibraryProvider")
  return context
}