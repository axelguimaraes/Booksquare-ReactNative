import { Message } from '../Models/Message';
import Messages from '../DummyData/Messages';

const getMessagesByUserId = (userId: number): Message[] => {
    // Filter messages by userId (assuming idSender or idReceiver matches the userId)
    return Messages.filter(message => message.sender.id === userId || message.receiver.id === userId);
};

const sendMessage = (message: Message): void => {
    // Example implementation: add the new message to the messages array
    Messages.push(message);
};

export { getMessagesByUserId, sendMessage };
