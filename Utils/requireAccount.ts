import { Alert } from 'react-native';
import { getCurrentUser, logout } from '../Services/AuthService';

// Guests can browse but not buy, sell, rent, trade or message. Returns true when the user has an
// account; otherwise explains why and offers to sign in (signing out the guest session returns
// to the welcome screen).
export const requireAccount = (): boolean => {
  if (!getCurrentUser()?.isAnonymous) {
    return true;
  }

  Alert.alert(
    'Conta necessária',
    'Inicie sessão ou crie uma conta para beneficiar de todas as funcionalidades.',
    [
      { text: 'Agora não', style: 'cancel' },
      { text: 'Iniciar sessão', onPress: () => logout() },
    ]
  );
  return false;
};
