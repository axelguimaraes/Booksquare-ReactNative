export interface Message {
    id: number,
    senderID: number,
    receiverID: number,
    timestamp: string,
    content: string,
    isRead: boolean
}