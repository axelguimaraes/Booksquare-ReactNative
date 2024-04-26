import { TransactionType } from "../Models/Book";
import { Transaction } from "../Models/Transaction";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { getUserById } from "../Services/UsersService";
import { useEffect, useState } from "react";
import getTimestampText from "../Utils/getTimestampText";

const TransactionCard = (transaction: Transaction) => {
  const [loading, setLoading] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchTransactions = async () => {
      try {
        const sender = await getUserById(transaction.idSender);
        const receiver = await getUserById(transaction.idReceiver);
        setSenderName(sender.displayName);
        setReceiverName(receiver.displayName);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (transaction.transactionType == TransactionType.RENTAL) {
    return (
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size={50} color="grey" />
          ) : (
            <>
              <Text style={styles.bookTitle}>{transaction.book.title}</Text>
              <Text>
                Alugado a <Text style={styles.username}>{receiverName}</Text> por <Text style={styles.username}>{senderName}</Text> às {getTimestampText(transaction.timestamp)}
              </Text>

            </>
          )}
        </View>
      );
  }

  if (transaction.transactionType == TransactionType.SALE) {
    return (
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size={50} color="grey" />
          ) : (
            <>
              <Text style={styles.bookTitle}>{transaction.book.title}</Text>
              <Text>
                Vendido a <Text style={styles.username}>{receiverName}</Text> por <Text style={styles.username}>{senderName}</Text> às {getTimestampText(transaction.timestamp)}
              </Text>
              
            </>
          )}
        </View>
      );
  }

  if (transaction.transactionType == TransactionType.TRADE) {
    return (
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size={50} color="grey" />
          ) : (
            <>
              <Text style={styles.bookTitle}>{transaction.book.title}</Text>
              <Text>
                Trocado a <Text style={styles.username}>{receiverName}</Text> por <Text style={styles.username}>{senderName}</Text> às {getTimestampText(transaction.timestamp)}
              </Text>
              
            </>
          )}
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 10,
    backgroundColor: '#f4f4f4',
    marginBottom: 10,
    borderRadius: 10
  },
  bookTitle: {
    fontWeight: 'bold',
    fontSize: 20
  },
  username: {
    fontStyle: 'italic',
    color: '#8C756A'
  }
});

export default TransactionCard;
