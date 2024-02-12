import { Message } from "../Models/Message";

const Messages: Message[] = [
    {
        id: 1,
        messageThread: [
            {
                senderID: 1,
                receiverID: 2,
                content: 'Olá, como você está?',
                timestamp: '2024-01-28T10:00:00',
                isRead: true
            },
            {
                senderID: 2,
                receiverID: 1,
                content: 'Oi, estou bem. E você?',
                timestamp: '2024-01-28T10:05:00',
                isRead: true
            },
            {
                senderID: 1,
                receiverID: 2,
                content: 'Também obrigado',
                timestamp: '2024-01-28T10:05:10',
                isRead: true
            }
        ]
    },
    {
        id: 2,
        messageThread: [
            {
                senderID: 1,
                receiverID: 3,
                content: 'Olá?',
                timestamp: '2024-01-28T10:00:00',
                isRead: false
            }
        ]
    },
];

export default Messages;
