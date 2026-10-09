import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import TopBar from "../../Components/TopBar";
import BottomBar from "../../Components/BottomBar";
import TransactionCard from "../../Components/TransactionCard";
import { getCurrentUser, logout } from "../../Services/AuthService";
import { getAllUserTransactions } from "../../Services/TransactionsService";
import { AuthUser } from "../../Models/User";
import { Transaction } from "../../Models/Transaction";
import Avatar from "../../Components/ui/Avatar";
import Button from "../../Components/ui/Button";
import { EmptyState } from "../../Components/ui/StateViews";
import { colors, radius, spacing, typography } from "../../Components/ui/theme";

const UserProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);

  // Re-read on focus so changes made on the edit screen show up right away.
  useFocusEffect(
    useCallback(() => {
      const current = getCurrentUser();
      setUser(current ? { ...current } : null);
      if (current && !current.isAnonymous) {
        getAllUserTransactions(current.uid)
          .then((list) => setTransactions([...list].sort((a, b) => b.timestamp - a.timestamp)))
          .catch((error) => {
            console.error("Error fetching transactions:", error);
            setTransactions([]);
          });
      }
    }, [])
  );

  const handleLogout = () => {
    Alert.alert("Terminar sessão?", "Terá de voltar a iniciar sessão para usar a sua conta.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Terminar sessão", style: "destructive", onPress: () => logout() },
    ]);
  };

  if (!user || user.isAnonymous) {
    return (
      <View style={styles.container}>
        <TopBar navigation={navigation} />
        <EmptyState
          icon="person-circle-outline"
          title="Utilizador convidado"
          message="Inicie sessão ou crie uma conta para beneficiar de todas as funcionalidades."
          action={{ label: "Iniciar sessão ou criar conta", onPress: () => logout() }}
        />
        <BottomBar navigation={navigation} />
      </View>
    );
  }

  const header = (
    <>
      <Text style={styles.screenTitle} accessibilityRole="header">Perfil</Text>
      <View style={styles.profileContainer}>
        <Avatar uri={user.photoURL} size={88} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user.displayName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>
      <Button
        variant="secondary"
        title="Editar perfil"
        icon="create-outline"
        onPress={() => navigation.navigate("EditProfileScreen")}
        style={styles.editButton}
      />
      <Text style={styles.sectionTitle} accessibilityRole="header">Histórico de transações</Text>
    </>
  );

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <FlatList
        data={transactions ?? []}
        renderItem={({ item }) => <TransactionCard {...item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={header}
        ListEmptyComponent={
          transactions === null ? (
            <ActivityIndicator color={colors.primary} style={styles.listMessage} accessibilityLabel="A carregar transações" />
          ) : (
            <Text style={styles.listMessage}>Ainda não tem transações. Quando comprar, alugar ou trocar um livro, aparece aqui.</Text>
          )
        }
        ListFooterComponent={
          <Button variant="danger" title="Terminar sessão" icon="log-out-outline" onPress={handleLogout} style={styles.logoutButton} />
        }
      />
      <BottomBar navigation={navigation} />
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
  screenTitle: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.md,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  name: {
    ...typography.heading,
    color: colors.text,
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editButton: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  listMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    paddingVertical: spacing.lg,
  },
  logoutButton: {
    marginTop: spacing.xl,
  },
});

export default UserProfileScreen;
