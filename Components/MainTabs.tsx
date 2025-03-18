import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BuyScreen from '../Screens/Home/BuyScreen';
import RentScreen from '../Screens/Home/RentScreen';
import TradeScreen from '../Screens/Home/TradeScreen';

const Tab = createMaterialTopTabNavigator();



const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Comprar" component={BuyScreen} />
      <Tab.Screen name="Alugar" component={RentScreen} />
      <Tab.Screen name="Trocar" component={TradeScreen} />
    </Tab.Navigator>
  );
};

export default Tabs;
