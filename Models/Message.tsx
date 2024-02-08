interface MessageThread {
    senderID: number,
    receiverID: number,
    content: string;
    timestamp: string;
    isRead: boolean
}

export interface Message {
    id: number,
    messageThread: MessageThread[]
}