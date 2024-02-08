import { Message } from "../Models/Message";
import { User } from "../Models/User";

const user1: User = {
    id: 1,
    username: "senderUsername",
    email: "sender@example.com",
    password: "password123",
    profilePhoto: "sender_profile_photo.jpg",
};

const user2: User = {
    id: 2,
    username: "receiverUsername",
    email: "receiver@example.com",
    password: "password456",
    profilePhoto: "receiver_profile_photo.jpg",
};

const Messages: Message[] = [
    {
        id: 1,
        sender: user1,
        receiver: user2,
        timestamp: '2024-01-28T10:00:00',
        content: 'Hello, how are you?'
    },
    {
        id: 2,
        sender: user2,
        receiver: user1,
        timestamp: '2024-01-28T10:05:00',
        content: 'Hi, I\'m good. How about you?'
    },
];

export default Messages;
