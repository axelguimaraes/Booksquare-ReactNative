import { Book, TransactionType } from "../Models/Book";

const DummyBooks: Book[] = [
  {
    id: 1,
    isbn: 9780061120084,
    title: 'O Sol é Para Todos',
    description: 'O Sol é Para Todos é um romance de Harper Lee publicado em 1960. Instantaneamente bem-sucedido, amplamente lido em escolas secundárias e escolas intermediárias nos Estados Unidos, tornou-se um clássico da literatura americana moderna.',
    price: 10.99,
    photos: [
      'https://via.placeholder.com/150/foto1.jpg',
      'https://via.placeholder.com/150/foto2.jpg',
    ],
    author: 'Harper Lee',
    year: 1960,
    genre: ["Fiction"],
    transactionType: TransactionType.SALE,
  },
  {
    id: 2,
    isbn: 9788535902775,
    title: 'Orgulho e Preconceito',
    description: 'Orgulho e Preconceito é um romance romântico de Jane Austen escrito em 1813. O romance segue o desenvolvimento do personagem Elizabeth Bennet, a protagonista dinâmica do livro que aprende sobre as repercussões de julgamentos precipitados e passa a apreciar a diferença entre bondade superficial e bondade real.',
    price: 12.99,
    photos: [
      'https://via.placeholder.com/150/foto1.jpg',
      'https://via.placeholder.com/150/foto2.jpg',
    ],
    author: 'Jane Austen',
    year: 1813,
    genre: ["Romance"],
    transactionType: TransactionType.SALE,
  },
  {
    id: 3,
    isbn: 9780451524935,
    title: '1984',
    description: '1984 é um romance distópico de ficção científica escrito pelo romancista inglês George Orwell. Foi publicado em 8 de junho de 1949 pela Secker & Warburg como o nono e último livro de Orwell concluído em sua vida. Tematicamente, 1984 centra-se nas consequências do totalitarismo, vigilância em massa e regimentação repressiva de pessoas e comportamentos dentro da sociedade.',
    photos: [
      'https://via.placeholder.com/150/foto1.jpg',
      'https://via.placeholder.com/150/foto2.jpg',
    ],
    author: 'George Orwell',
    year: 1949,
    genre: ["Science Fiction"],
    transactionType: TransactionType.RENTAL
  },
  {
    id: 4,
    isbn: 9780684801520,
    title: 'O Grande Gatsby',
    description: 'O Grande Gatsby é um romance de 1925 escrito pelo escritor americano F. Scott Fitzgerald. Ambientado na era do jazz em Long Island, o romance retrata as interações do narrador Nick Carraway com o misterioso milionário Jay Gatsby e a obsessão de Gatsby com Daisy Buchanan, prima de Nick.',
    photos: [
      'https://via.placeholder.com/150/foto1.jpg',
      'https://via.placeholder.com/150/foto2.jpg',
    ],
    author: 'F. Scott Fitzgerald',
    year: 1925,
    genre: ["Fiction"],
    transactionType: TransactionType.TRADE
  },
  {
    id: 5,
    isbn: 9780142437228,
    title: 'Moby Dick',
    description: 'Moby-Dick; ou, A Baleia é um romance de 1851 escrito pelo escritor americano Herman Melville. O livro é a narrativa do marinheiro Ishmael da busca obsessiva de Ahab, capitão do navio baleeiro Pequod, por vingança contra Moby Dick, a gigante baleia cachalote branca que na viagem anterior do navio arrancou a perna de Ahab no joelho.',
    photos: [
      'https://via.placeholder.com/150/foto1.jpg',
      'https://via.placeholder.com/150/foto2.jpg',
    ],
    author: 'Herman Melville',
    year: 1851,
    genre: ["Fiction, Adventure"],
    transactionType: TransactionType.RENTAL
  },
];

export default DummyBooks;
