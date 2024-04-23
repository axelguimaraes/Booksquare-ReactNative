export interface User {
    userId: string,
    displayName: string,
    email: string,
    profilePhoto?: string,
    transactionsID?: string[],
    chatID?: string[]
}