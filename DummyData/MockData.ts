import { Book, TransactionType } from "../Models/Book";
import { Chat } from "../Models/Chat";
import { ShoppingCart } from "../Models/ShoppingCart";
import { Transaction } from "../Models/Transaction";
import { User } from "../Models/User";

// Everything the mock services read and write. Persisted as JSON, so dates are ISO strings.
export interface MockAccount {
    uid: string,
    email: string | null,
    password: string | null,
    displayName: string | null,
    photoURL: string | null,
    isAnonymous: boolean
}

export interface MockData {
    accounts: MockAccount[],
    session: string | null, // uid of the signed-in account
    users: User[],
    books: (Book & { id: string })[],
    chats: Chat[],
    shoppingCarts: ShoppingCart[],
    transactions: Transaction[]
}

export const MOCK_PASSWORD = '123456';

export const coverUrl = (isbn: number) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

// Also serves as the catalog for the mocked ISBN lookup.
export const MOCK_CATALOG = [
    { isbn: 9780451524935, title: '1984', author: 'George Orwell', year: 1949, genre: ['Ficção', 'Distopia'], description: 'Num futuro totalitário, Winston Smith trabalha a reescrever a história para o Partido, até começar a questionar o Grande Irmão.' },
    { isbn: 9780547928227, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, genre: ['Fantasia', 'Aventura'], description: 'Bilbo Baggins é arrastado para uma aventura com treze anões para recuperar um tesouro guardado pelo dragão Smaug.' },
    { isbn: 9780061120084, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, genre: ['Ficção', 'Clássico'], description: 'No sul dos Estados Unidos, Scout acompanha o pai, o advogado Atticus Finch, na defesa de um homem negro injustamente acusado.' },
    { isbn: 9780743273565, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, genre: ['Ficção', 'Clássico'], description: 'O misterioso Jay Gatsby e a sua obsessão por Daisy Buchanan, vistos pelos olhos do vizinho Nick Carraway.' },
    { isbn: 9780141439518, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, genre: ['Romance', 'Clássico'], description: 'Elizabeth Bennet e o orgulhoso Sr. Darcy enfrentam os preconceitos da sociedade inglesa do século XIX.' },
    { isbn: 9780441172719, title: 'Dune', author: 'Frank Herbert', year: 1965, genre: ['Ficção científica'], description: 'No planeta desértico Arrakis, Paul Atreides vê-se no centro de uma luta pelo controlo da especiaria mais valiosa do universo.' },
    { isbn: 9780316769488, title: 'The Catcher in the Rye', author: 'J.D. Salinger', year: 1951, genre: ['Ficção'], description: 'Holden Caulfield deambula por Nova Iorque depois de ser expulso do colégio, num retrato da alienação adolescente.' },
    { isbn: 9780062316097, title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', year: 2011, genre: ['História', 'Não ficção'], description: 'Uma visão panorâmica da história da humanidade, da revolução cognitiva à revolução científica.' },
    { isbn: 9780060850524, title: 'Brave New World', author: 'Aldous Huxley', year: 1932, genre: ['Ficção', 'Distopia'], description: 'Uma sociedade futura onde a estabilidade é garantida através da engenharia genética e do condicionamento.' },
    { isbn: 9780062315007, title: 'The Alchemist', author: 'Paulo Coelho', year: 1988, genre: ['Ficção', 'Fantasia'], description: 'Santiago, um jovem pastor andaluz, parte em busca de um tesouro e descobre a sua lenda pessoal.' },
];

const USERS = {
    demo: { userId: 'mock-user-demo', displayName: 'Demo', email: 'demo@booksquare.test' },
    ana: { userId: 'mock-user-ana', displayName: 'Ana Silva', email: 'ana@booksquare.test' },
    bruno: { userId: 'mock-user-bruno', displayName: 'Bruno Costa', email: 'bruno@booksquare.test' },
    carla: { userId: 'mock-user-carla', displayName: 'Carla Mendes', email: 'carla@booksquare.test' },
};

const listing = (isbn: number, owner: User, transactionType: TransactionType, prices: { price?: number, rentalPricePerDay?: number } = {}) => {
    return {
        id: `mock-book-${isbn}`,
        ...MOCK_CATALOG.find((book) => book.isbn === isbn),
        photos: [coverUrl(isbn)],
        transactionType,
        currentOwner: owner.displayName,
        isVisible: true,
        ...prices,
    };
};

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000);

export const createMockSeed = (): MockData => {
    const books = [
        listing(9780451524935, USERS.ana, TransactionType.SALE, { price: 8.5 }),
        listing(9780547928227, USERS.bruno, TransactionType.SALE, { price: 12 }),
        listing(9780061120084, USERS.carla, TransactionType.SALE, { price: 9.9 }),
        listing(9780743273565, USERS.demo, TransactionType.SALE, { price: 7 }),
        listing(9780141439518, USERS.ana, TransactionType.RENTAL, { rentalPricePerDay: 0.5 }),
        listing(9780441172719, USERS.bruno, TransactionType.RENTAL, { rentalPricePerDay: 0.75 }),
        listing(9780062316097, USERS.demo, TransactionType.RENTAL, { rentalPricePerDay: 0.6 }),
        listing(9780316769488, USERS.carla, TransactionType.TRADE),
        listing(9780060850524, USERS.ana, TransactionType.TRADE),
        listing(9780062315007, USERS.bruno, TransactionType.TRADE),
    ];
    const bookByIsbn = (isbn: number) => books.find((book) => book.isbn === isbn);

    const chatId = 'mock-chat-demo-ana';

    return {
        accounts: Object.values(USERS).map((user) => ({
            uid: user.userId,
            email: user.email,
            password: MOCK_PASSWORD,
            displayName: user.displayName,
            photoURL: null,
            isAnonymous: false,
        })),
        session: null,
        users: [
            { ...USERS.demo, chatID: [chatId] },
            { ...USERS.ana, chatID: [chatId] },
            { ...USERS.bruno, chatID: [] },
            { ...USERS.carla, chatID: [] },
        ],
        books,
        chats: [{
            id: chatId,
            user1: USERS.demo.userId,
            user2: USERS.ana.userId,
            messageThread: [
                {
                    messageID: 'mock-message-1',
                    senderID: USERS.demo.userId,
                    receiverID: USERS.ana.userId,
                    content: 'Olá Ana! O Pride and Prejudice ainda está disponível para alugar?',
                    timestamp: hoursAgo(5).toISOString(),
                    isRead: true,
                },
                {
                    messageID: 'mock-message-2',
                    senderID: USERS.ana.userId,
                    receiverID: USERS.demo.userId,
                    content: 'Olá! Sim, está. Podes alugar diretamente na app.',
                    timestamp: hoursAgo(4).toISOString(),
                    isRead: false,
                },
            ],
        }],
        shoppingCarts: [],
        transactions: [
            {
                id: 'mock-transaction-1',
                timestamp: hoursAgo(72).getTime(),
                book: { ...bookByIsbn(9780062316097), transactionType: TransactionType.SALE, currentOwner: USERS.carla.displayName },
                idSender: USERS.carla.userId,
                idReceiver: USERS.demo.userId,
                transactionType: TransactionType.SALE,
            },
            {
                id: 'mock-transaction-2',
                timestamp: hoursAgo(30).getTime(),
                book: bookByIsbn(9780441172719),
                idSender: USERS.bruno.userId,
                idReceiver: USERS.demo.userId,
                transactionType: TransactionType.RENTAL,
            },
        ],
    };
};
