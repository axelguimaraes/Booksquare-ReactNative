export interface SingleMessage {
    messageID: string
    senderID: string,
    receiverID: string,
    content: string;
    timestamp: string;
    isRead: boolean
}

export interface Chat {
    id: string,
    user1: string,
    user2: string,
    messageThread: SingleMessage[]
}