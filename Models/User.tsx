export interface User {
    userId: string,
    displayName: string,
    email: string,
    profilePhoto?: string,
    transactionsID?: string[],
    chatID?: string[]
}

// The signed-in account, as exposed by AuthService (a subset of Firebase's User).
export interface AuthUser {
    uid: string,
    displayName: string | null,
    email: string | null,
    photoURL: string | null,
    isAnonymous: boolean
}
