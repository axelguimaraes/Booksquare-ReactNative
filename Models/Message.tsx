import { User } from "./User"

export interface Message {
    id: number,
    sender: User,
    receiver: User,
    timestamp: string,
    content: string
}