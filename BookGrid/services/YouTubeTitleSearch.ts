const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY

export const fetchYouTubeTitle = async (url: string) => {
    if (!YOUTUBE_API_KEY) {
        console.warn("YouTube API Key is missing! Check your .env file.");
        return null;
    }
    
  // Regex to extract the ID from various YouTube URL formats
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = (match && match[7].length === 11) ? match[7] : null

  if (!videoId) return null

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`
    )
    const data = await response.json()
    return data.items[0]?.snippet?.title || null
  } catch (error) {
    console.error("YouTube Fetch Error:", error)
    return null
  }
}