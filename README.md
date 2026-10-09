# Booksquare - Books E-Commerce App

![Booksquare](./assets/banner.png "Banner")
Booksquare is a mobile application built with React Native that facilitates buying, selling, and trading of books. Whether you're a book lover looking to expand your collection, or you want to declutter your shelves by selling or trading books, Booksquare provides a convenient platform for book enthusiasts to connect.

## Features

- **Browse Books:** Explore a wide range of books across various genres.
- **Search Functionality:** Easily find specific books by title, author, or genre.
- **User Authentication:** Secure authentication system for users to create accounts and log in.
- **Buy Books:** Purchase books from other users.
- **Sell Books:** List books for sale with detailed descriptions and pricing.
- **Trade Books:** Exchange books with other users based on mutual agreements.
- **User Profiles:** View profiles of other users to see their listings and ratings.
- **Messaging System:** Communicate with other users to discuss transactions.
- **Notifications:** Receive notifications for new messages, offers, and transactions.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/username/booksquare.git
    ```

2. Navigate to the project directory:

    ```bash
    cd booksquare
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the Metro server, then press `i` (iOS simulator) or `a` (Android emulator) to open the app in Expo Go:

    ```bash
    npx expo start
    ```

    To build and run a development build instead:

    ```bash
    npx expo run:android   # For Android
    npx expo run:ios       # For iOS
    ```

## Configuration and mock data

The app runs without any configuration: when the Firebase variables are missing, every feature uses local mock data (seeded from [DummyData/MockData.ts](DummyData/MockData.ts)) instead of Firebase. Sign in with `demo@booksquare.test` / `123456`, or create a new account.

To use Firebase, or to choose per feature between mocks and real data, copy [.env.example](.env.example) to `.env.local` and fill it in. Each `EXPO_PUBLIC_MOCK_*` flag (auth, users, books, cart, chat, transactions, storage, book lookup) takes `true` or `false`. Restart with `npx expo start --clear` after changing it. The app logs which features are mocked at startup.

Under the hood, each service in [Services/](Services/) picks between its Firebase implementation ([Services/firebase/](Services/firebase/)) and its mock ([Services/mock/](Services/mock/)) based on [config/dataSources.ts](config/dataSources.ts).

## Technologies Used

- **React Native:** Frontend framework for building cross-platform mobile apps.
- **Firebase:** Backend services for user authentication, database, and storage.
- **React Navigation:** Routing and navigation library for React Native apps.
- **Expo:** Development toolchain for building and deploying React Native apps.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- This project was inspired by the passion for books and the desire to create a platform for book lovers to connect and share their love for reading.
- Special thanks to the React Native community for providing valuable resources and support for building mobile applications.