import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCartItems, purchaseItems } from "../../Services/ShoppingCartService";
import { ShoppingCartItem } from "../../Models/ShoppingCart";
import { FIREBASE_AUTH } from "../../config/firebase";
import { Book } from "../../Models/Book";
import { getBookByIsbn } from "../../Services/BooksService";
import { Transaction } from "../../Models/Transaction";
import uuid from 'react-native-uuid'
import { getUserIdByDisplayName } from "../../Services/UsersService";
import { createTransaction } from "../../Services/TransactionsService";


const CheckoutScreen = () => {
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState([] as ShoppingCartItem[])
  const navigation = useNavigation();
  const [books, setBooks] = useState<Book[]>(null)

  useEffect(() => {
    getCartItems(FIREBASE_AUTH.currentUser.uid).then((items: ShoppingCartItem[]) => {
      if (items !== null || items.length > 0) {
        setCartItems(items);
      }
    })
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const fetchedBooks: Book[] = [];
        for (let item of cartItems) {
          const book = await getBookByIsbn(item.isbn);
          if (book) {
            fetchedBooks.push(book);
          }
        }
        setBooks(fetchedBooks);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchBooks();
  }, [cartItems]);

  const handleConfirmPayButton = async () => {
    setLoading(true);
    
    try {
      await purchaseItems(cartItems);
      
      for (const book of books) {
        const transaction = {
          id: uuid.v4().toString(),
          timestamp: Date.now(),
          book: book,
          idSender: await getUserIdByDisplayName(book.currentOwner),
          idReceiver: FIREBASE_AUTH.currentUser.uid,
          transactionType: book.transactionType
        };
  
        await createTransaction(transaction).catch((error) => console.error('Error creating transaction', error));
      }
      
      alert('Pagamento efetuado com sucesso!');
      navigation.goBack();
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('Erro ao processar pagamento!');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="grey" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ flex: 1 }} />
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.textMessage}>
          Este ecrã serve para simular o checkout e pagamento dos livros.
          Como essa funcionalidade ainda não está disponível, este ecrã serve um propósito meramente ilustrativo.
        </Text>
        {loading ? (
          <TouchableOpacity style={styles.confirmPayButton} disabled={true}>
            <ActivityIndicator size='small' color='white' />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.confirmPayButton} onPress={handleConfirmPayButton}>
            <Text style={styles.confirmPayText}>Confirmar Pagamento</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  backButton: {
    paddingRight: 20, // Added spacing to ensure proper alignment
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bodyContainer: {
    padding: 20,
    flex: 1,
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textMessage: {
    textAlign: 'center',
    color: 'grey',
    fontSize: 18
  },
  confirmPayButton: {
    backgroundColor: "#8C756A",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  confirmPayText: {
    fontWeight: "bold",
    color: "white",
  },
});

export default CheckoutScreen;
