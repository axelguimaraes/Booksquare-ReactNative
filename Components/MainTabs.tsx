import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BookListScreen from '../Screens/Home/BookListScreen';
import { TransactionType } from '../Models/Book';
import { colors } from './ui/theme';

const Tab = createMaterialTopTabNavigator();

const BuyScreen = () => <BookListScreen transactionType={TransactionType.SALE} emptyMessage="Sem livros disponíveis para comprar." />;
const RentScreen = () => <BookListScreen transactionType={TransactionType.RENTAL} emptyMessage="Sem livros disponíveis para alugar." />;
const TradeScreen = () => <BookListScreen transactionType={TransactionType.TRADE} emptyMessage="Sem livros disponíveis para trocar." />;

const Tabs = () => {
  return (
    <Tab.Navigator
      id="HomeTabs"
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIndicatorStyle: { backgroundColor: colors.primary, height: 3 },
        tabBarLabelStyle: { fontSize: 15, fontWeight: 'bold', textTransform: 'none' },
        tabBarStyle: { backgroundColor: colors.background },
        tabBarPressColor: colors.primaryLight,
      }}
    >
      <Tab.Screen name="Comprar" component={BuyScreen} />
      <Tab.Screen name="Alugar" component={RentScreen} />
      <Tab.Screen name="Trocar" component={TradeScreen} />
    </Tab.Navigator>
  );
};

export default Tabs;
