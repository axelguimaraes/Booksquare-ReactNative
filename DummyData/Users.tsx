import { User } from "../Models/User";

const DummyUsers: User[] = [
    {
        id: 1,
        username: "user1",
        email: "user1@example.com",
        password: "password1",
        messagesID: [1, 2]
    },
    {
        id: 2,
        username: "user2",
        email: "user2@example.com",
        password: "password2",
        messagesID: [3, 4]
    }
]

export default DummyUsers