interface SingleMessage {
    senderID: string,
    receiverID: string,
    content: string;
    timestamp: string;
    isRead: boolean
}

export interface Chat {
    id: string,
    messageThread: SingleMessage[]
}