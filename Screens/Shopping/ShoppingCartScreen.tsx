import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  getCartItems,
  removeFromCart,
  clearCart,
} from "../../Services/ShoppingCartService";
import { getCurrentUser } from "../../Services/AuthService";
import { ShoppingCartItem } from "../../Models/ShoppingCart";
import { formatPrice } from "../../Utils/format";
import Button from "../../Components/ui/Button";
import IconButton from "../../Components/ui/IconButton";
import ScreenHeader from "../../Components/ui/ScreenHeader";
import { EmptyState, LoadingView } from "../../Components/ui/StateViews";
import { Footer } from "../../Components/ui/Layout";
import { colors, spacing, typography } from "../../Components/ui/theme";

const ShoppingCartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState<ShoppingCartItem[] | null>(null);
  const currentUser = getCurrentUser();

  const loadCartItems = async () => {
    try {
      setCartItems(await getCartItems(currentUser.uid));
    } catch (error) {
      console.error(error);
      setCartItems((current) => current ?? []);
    }
  };

  // Reload when coming back, e.g. after a purchase.
  useFocusEffect(
    useCallback(() => {
      loadCartItems();
    }, [])
  );

  const handleRemoveItem = async (productId: string) => {
    setCartItems((current) => current.filter((item) => item.productId !== productId));
    try {
      await removeFromCart(currentUser.uid, productId);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      Alert.alert("Erro", "Não foi possível remover o livro do carrinho.");
      loadCartItems();
    }
  };

  const handleEmptyCart = () => {
    Alert.alert("Esvaziar carrinho?", "Todos os livros serão removidos do carrinho.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Esvaziar",
        style: "destructive",
        onPress: async () => {
          try {
            await clearCart(currentUser.uid);
            setCartItems([]);
          } catch (error) {
            console.error("Error clearing cart:", error);
            Alert.alert("Erro", "Não foi possível esvaziar o carrinho.");
          }
        },
      },
    ]);
  };

  const renderContent = () => {
    if (cartItems === null) {
      return <LoadingView label="A carregar carrinho" />;
    }

    if (cartItems.length === 0) {
      return (
        <EmptyState
          icon="cart-outline"
          title="O seu carrinho está vazio"
          message="Os livros à venda que adicionar ao carrinho aparecem aqui."
          action={{ label: "Explorar livros", onPress: () => navigation.navigate("Home", undefined, { pop: true }) }}
        />
      );
    }

    // Calculate total price of all items in cart
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price ?? 0), 0);
    const count = `${cartItems.length} ${cartItems.length === 1 ? "livro" : "livros"}`;

    return (
      <>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.productId}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.item} accessible={false}>
              <Ionicons name="book-outline" size={24} color={colors.primary} />
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
              <IconButton
                icon="trash-outline"
                color={colors.textSecondary}
                onPress={() => handleRemoveItem(item.productId)}
                accessibilityLabel={`Remover ${item.name} do carrinho`}
              />
            </View>
          )}
        />
        <Footer style={styles.footer}>
          <View style={styles.totalRow} accessible accessibilityLabel={`Total, ${count}: ${formatPrice(totalPrice)}`}>
            <Text style={styles.totalLabel}>Total ({count})</Text>
            <Text style={styles.totalText}>{formatPrice(totalPrice)}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button variant="secondary" title="Esvaziar" onPress={handleEmptyCart} style={styles.button} />
            <Button title="Finalizar compra" onPress={() => navigation.navigate("CheckoutScreen")} style={styles.button} />
          </View>
        </Footer>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Carrinho de compras" onBack={() => navigation.goBack()} />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 64,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
  },
  itemName: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    marginLeft: spacing.md,
  },
  itemPrice: {
    ...typography.body,
    fontWeight: "bold",
    color: colors.text,
    marginLeft: spacing.sm,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: spacing.lg,
  },
  footer: {
    flexDirection: "column",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  totalText: {
    ...typography.title,
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
});

export default ShoppingCartScreen;
