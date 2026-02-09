import React, { createContext, useContext, useState, useEffect } from 'react'
import { Book } from '../services/BookSearch'
import AsyncStorage from '@react-native-async-storage/async-storage'

type LibraryContextType = {
  library: Book[];
  addBook: (book: Book) => void;
};

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [library, setLibrary] = useState<Book[]>([]);

  // 1. Load data from disk on startup
  useEffect(() => {
    const loadLibrary = async () => {
      const storedData = await AsyncStorage.getItem('@my_library');
      if (storedData) setLibrary(JSON.parse(storedData));
    };
    loadLibrary();
  }, [])

  // 2. Modified Add function that saves to disk
  const addBook = async (book: Book) => {
    if (!library.find(b => b.id === book.id)) {
      const updatedLibrary = [...library, book];
      setLibrary(updatedLibrary);
      await AsyncStorage.setItem('@my_library', JSON.stringify(updatedLibrary));
    }
  }

  return (
    <LibraryContext.Provider value={{ library, addBook }}>
      {children}
    </LibraryContext.Provider>
  )
}

export const useLibrary = () => {
  const context = useContext(LibraryContext)
  if (!context) throw new Error("useLibrary must be used within LibraryProvider")
  return context
}