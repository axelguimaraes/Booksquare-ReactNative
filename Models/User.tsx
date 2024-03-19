export interface User {
    id: string,
    displayName: string,
    email: string,
    profilePhoto?: string,
    transactionsID?: string[],
    chatID?: string[]
}