import { Message } from "../Models/Message";

const Messages: Message[] = [
    {
        id: 1,
        senderID: 1,
        receiverID: 2,
        timestamp: '2024-01-28T10:00:00',
        content: 'Hello, how are you?',
        isRead: true
    },
    {
        id: 2,
        senderID: 2,
        receiverID: 1,
        timestamp: '2024-01-28T10:05:00',
        content: 'Hi, I\'m good. How about you?',
        isRead: false
    },
];

export default Messages;
