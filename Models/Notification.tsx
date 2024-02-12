import { User } from "./User";

export enum NotificationType {
    SALE = 'Venda',
    PURCHASE = 'Compra',
    TRADE = 'Troca',
    RENT = 'Aluguer',
    MESSAGE = 'Mensagem'
}

export interface Notification {
    id: number,
    message: string,
    timestamp: string,
    isRead: boolean,
    targetUserID?: number,
    notificationType: NotificationType
}