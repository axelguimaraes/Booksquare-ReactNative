import { User } from "../Models/User";

// Dummy data
import DummyUsers from "../DummyData/Users";

// Get user by ID
const getUserById = (userId: number): User | undefined => {
    return DummyUsers.find(user => user.id === userId);
};

// Get all users
const getAllUsers = (): User[] => {
    return DummyUsers;
};

// Add user
const addUser = (user: User): void => {
    DummyUsers.push(user);
};

// Update user
const updateUser = (updatedUser: User): void => {
    const index = DummyUsers.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
        DummyUsers[index] = updatedUser;
    }
};

// Delete user
const deleteUser = (userId: number): void => {
    const index = DummyUsers.findIndex(user => user.id === userId);
    if (index !== -1) {
        DummyUsers.splice(index, 1);
    }
};

export { getUserById, getAllUsers, addUser, updateUser, deleteUser };
