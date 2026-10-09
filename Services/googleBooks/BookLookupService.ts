// Returns the Google Books volume for an ISBN (shape: https://developers.google.com/books/docs/v1/reference/volumes).
export const getBookInfoByISBN = async (isbn) => {
  console.log('Getting book info by ISBN')
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
    const data = await response.json();
    return data.items[0]
  } catch (error) {
    console.error("Error fetching book info:", error);
    return null
  }
}
