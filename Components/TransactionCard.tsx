import { TransactionType } from "../Models/Book";
import { Transaction } from "../Models/Transaction";
import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUserById } from "../Services/UsersService";
import { getCurrentUser } from "../Services/AuthService";
import { useEffect, useState } from "react";
import getTimestampText from "../Utils/getTimestampText";
import { getActionIcon } from "../Utils/bookLabels";
import { colors, radius, spacing, typography } from "./ui/theme";

// Describes the transaction from the signed-in user's point of view.
const describe = (type: TransactionType, isReceiver: boolean, sender: string, receiver: string) => {
  switch (type) {
    case TransactionType.SALE:
      return isReceiver ? `Comprou a ${sender}` : `Vendeu a ${receiver}`;
    case TransactionType.RENTAL:
      return isReceiver ? `Alugou a ${sender}` : `${receiver} alugou este livro`;
    default:
      return `Trocou com ${isReceiver ? sender : receiver}`;
  }
};

const TransactionCard = (transaction: Transaction) => {
  const [names, setNames] = useState<{ sender: string, receiver: string } | null>(null);

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const [sender, receiver] = await Promise.all([getUserById(transaction.idSender), getUserById(transaction.idReceiver)]);
        setNames({ sender: sender?.displayName ?? 'Utilizador desconhecido', receiver: receiver?.displayName ?? 'Utilizador desconhecido' });
      } catch (error) {
        console.error("Error fetching transaction users:", error);
        setNames({ sender: 'Utilizador desconhecido', receiver: 'Utilizador desconhecido' });
      }
    };
    fetchNames();
  }, [transaction.idSender, transaction.idReceiver]);

  const isReceiver = transaction.idReceiver === getCurrentUser()?.uid;
  const description = names ? describe(transaction.transactionType, isReceiver, names.sender, names.receiver) : 'A carregar…';
  const timestamp = getTimestampText(transaction.timestamp);

  return (
    <View style={styles.container} accessible accessibilityLabel={`${transaction.book.title}. ${description}. ${timestamp}`}>
      <View style={styles.icon}>
        <Ionicons name={getActionIcon(transaction.transactionType)} size={20} color={colors.onPrimary} />
      </View>
      <View style={styles.details}>
        <View style={styles.headerRow}>
          <Text style={styles.bookTitle} numberOfLines={1}>{transaction.book.title}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: '#f4f4f4',
    marginBottom: spacing.sm,
    borderRadius: radius.md,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookTitle: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  timestamp: {
    ...typography.small,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default TransactionCard;
