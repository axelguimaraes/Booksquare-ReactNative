// Turns Firebase Auth error codes (also used by the mock auth) into messages for the user.
const messages: Record<string, string> = {
  'auth/invalid-credential': 'Email ou palavra-passe incorretos.',
  'auth/wrong-password': 'Email ou palavra-passe incorretos.',
  'auth/user-not-found': 'Email ou palavra-passe incorretos.',
  'auth/invalid-email': 'O email introduzido não é válido.',
  'auth/missing-password': 'Introduza a palavra-passe.',
  'auth/email-already-in-use': 'Já existe uma conta com este email.',
  'auth/weak-password': 'A palavra-passe deve ter pelo menos 6 caracteres.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/too-many-requests': 'Demasiadas tentativas. Aguarde um pouco e tente novamente.',
  'auth/network-request-failed': 'Sem ligação à internet. Verifique a ligação e tente novamente.',
  'auth/requires-recent-login': 'Por segurança, termine sessão e volte a entrar antes de fazer esta alteração.',
};

export const getAuthErrorMessage = (error: any): string =>
  messages[error?.code] ?? 'Ocorreu um erro inesperado. Tente novamente.';
