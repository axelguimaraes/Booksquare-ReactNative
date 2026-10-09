import { coverUrl, MOCK_CATALOG } from "../../DummyData/MockData";

// Answers in the Google Books volume shape. ISBNs outside the mock catalog get a placeholder
// book, so any barcode can be used to try the add-book flow.
export const getBookInfoByISBN = async (isbn) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const book = MOCK_CATALOG.find((entry) => String(entry.isbn) === String(isbn).trim());

  return {
    id: `mock-volume-${isbn}`,
    volumeInfo: {
      title: book?.title ?? `Livro ${isbn}`,
      authors: [book?.author ?? 'Autor desconhecido'],
      description: book?.description ?? 'Livro de exemplo gerado pela pesquisa por ISBN simulada.',
      categories: book?.genre ?? [],
      publishedDate: String(book?.year ?? new Date().getFullYear()),
      imageLinks: { thumbnail: coverUrl(Number(isbn)) },
    },
  };
}
