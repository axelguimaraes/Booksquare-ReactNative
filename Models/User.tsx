import { Message } from "./Message";
import { Transaction } from "./Transaction";

export interface User {
    id: number,
    username: string,
    email: string,
    password: string,
    profilePhoto?: string,
    transactions?: Transaction[],
    messages?: Message
}