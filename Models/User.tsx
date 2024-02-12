export interface User {
    id: number,
    username: string,
    email: string,
    password: string,
    profilePhoto?: string,
    transactionsID?: number[],
    messagesID?: number[]
}