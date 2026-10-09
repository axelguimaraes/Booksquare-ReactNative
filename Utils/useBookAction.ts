import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Book, TransactionType } from '../Models/Book';
import { StackNavigationParamsList } from '../Navigation/UserStack';
import { getCurrentUser } from '../Services/AuthService';
import { addToCart } from '../Services/ShoppingCartService';
import { requireAccount } from './requireAccount';

// The main action for a listing: add to cart (sale), or open the rent / trade form.
export const useBookAction = () => {
  const navigation = useNavigation<StackNavigationProp<StackNavigationParamsList>>();

  return (book: Book) => {
    if (!requireAccount()) {
      return;
    }

    switch (book.transactionType) {
      case TransactionType.SALE:
        addToCart(getCurrentUser().uid, book).catch((error) => console.error('Error adding to cart:', error));
        break;
      case TransactionType.RENTAL:
        navigation.navigate('RentForm', { book });
        break;
      case TransactionType.TRADE:
        navigation.navigate('TradeForm', { book });
        break;
    }
  };
};
