// Requests without a key share a global daily quota that is often used up (HTTP 429), so an own
// key can be set in .env.local (see .env.example).
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY;

// Returns the Google Books volume for an ISBN (shape: https://developers.google.com/books/docs/v1/reference/volumes),
// or null when no book has that ISBN. Throws when the request itself fails, so callers can tell
// "not found" apart from "could not search".
export const getBookInfoByISBN = async (isbn) => {
  console.log('Getting book info by ISBN')
  const keyParam = API_KEY ? `&key=${API_KEY}` : '';
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}${keyParam}`)
  if (!response.ok) {
    throw new Error(`Google Books request failed with status ${response.status}`)
  }
  const data = await response.json();
  return data.items?.[0] ?? null
}
