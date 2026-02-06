// Define the shape of the data we care about
export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  description: string;
}

export const searchBooks = async (query: string): Promise<Book[]> => {
  if (!query) return []
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&printType=books`
    )
    const data = await response.json()
    
    // Google Books returns a complex object; we map it to our simpler Book interface
    return data.items?.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ['Unknown Author'],
      thumbnail: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'), // Always use https for iOS
      description: item.volumeInfo.description
    })) || [];
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
}