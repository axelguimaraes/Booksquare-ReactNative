import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Alert } from "react-native";
import { getCartItems, purchaseItems } from "../../Services/ShoppingCartService";
import { getCurrentUser } from "../../Services/AuthService";
import { getBookByIsbn } from "../../Services/BooksService";
import { getUserIdByDisplayName } from "../../Services/UsersService";
import { createTransaction } from "../../Services/TransactionsService";
import { ShoppingCartItem } from "../../Models/ShoppingCart";
import { Book } from "../../Models/Book";
import { formatPrice } from "../../Utils/format";
import uuid from 'react-native-uuid'
import Banner from "../../Components/ui/Banner";
import Button from "../../Components/ui/Button";
import ScreenHeader from "../../Components/ui/ScreenHeader";
import { LoadingView } from "../../Components/ui/StateViews";
import { Footer } from "../../Components/ui/Layout";
import { colors, radius, spacing, typography } from "../../Components/ui/theme";

const CheckoutScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState<ShoppingCartItem[] | null>(null)
  const [books, setBooks] = useState<Book[] | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const items = await getCartItems(getCurrentUser().uid);
        setCartItems(items);
        const fetchedBooks = await Promise.all(items.map((item) => getBookByIsbn(item.isbn)));
        setBooks(fetchedBooks.filter(Boolean));
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar a encomenda.");
        setCartItems((current) => current ?? []);
        setBooks([]);
      }
    };
    load();
  }, []);

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
          idReceiver: getCurrentUser().uid,
          transactionType: book.transactionType
        };

        await createTransaction(transaction).catch((error) => console.error('Error creating transaction', error));
      }

      Alert.alert("Compra concluída", "Pode consultar os livros comprados no histórico de transações do seu perfil.");
      navigation.popTo("Home");
    } catch (error) {
      console.error(error);
      Alert.alert("Não foi possível concluir a compra", "Ocorreu um erro ao processar o pagamento. Tente novamente.");
      setLoading(false);
    }
  };

  const total = (cartItems ?? []).reduce((acc, item) => acc + (item.price ?? 0), 0);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Finalizar compra" onBack={() => navigation.goBack()} />
      {cartItems === null ? (
        <LoadingView label="A carregar encomenda" />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <Banner message="O pagamento ainda é simulado: nenhum valor será cobrado." />

            <Text style={styles.sectionTitle} accessibilityRole="header">Resumo da encomenda</Text>
            <View style={styles.summary}>
              {cartItems.map((item) => (
                <View key={item.productId} style={styles.row}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                </View>
              ))}
              <View style={[styles.row, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(total)}</Text>
              </View>
            </View>
          </ScrollView>
          <Footer>
            <Button
              title={`Confirmar pagamento · ${formatPrice(total)}`}
              onPress={handleConfirmPayButton}
              loading={loading}
              disabled={books === null || cartItems.length === 0}
              style={styles.payButton}
            />
          </Footer>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  summary: {
    padding: spacing.lg,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: spacing.xs,
  },
  itemName: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    marginRight: spacing.md,
  },
  itemPrice: {
    ...typography.body,
    color: colors.text,
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  totalLabel: {
    ...typography.heading,
    color: colors.text,
  },
  totalValue: {
    ...typography.heading,
    color: colors.text,
  },
  payButton: {
    flex: 1,
  },
});

export default CheckoutScreen;
