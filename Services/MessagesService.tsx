import { Message } from '../Models/Message';
import Messages from '../DummyData/Messages';
import { getUserById } from './UsersService';

const getMessagesByUserId = (userId: number): Message[] => {
    const user = getUserById(userId); // Fetch the user by ID using the getUsersById function
    if (user) {
        // Filter messages by userId (assuming idSender or idReceiver matches the userId)
        return Messages.filter(message => message.senderID === userId || message.receiverID === userId);
    }
    return []; // Return an empty array if user not found
};

const sendMessage = (message: Message): void => {
    // Example implementation: add the new message to the messages array
    Messages.push(message);
};

export { getMessagesByUserId, sendMessage };
