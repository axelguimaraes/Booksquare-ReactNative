import { Notification, NotificationType } from "../Models/Notification";

const DummyNotifications: Notification[] = [
    {
        id: 1,
        message: "Você tem uma nova mensagem de Usuário",
        timestamp: "2024-01-28T08:00:00Z",
        isRead: false,
        targetUserID: 123,
        notificationType: NotificationType.MESSAGE,
    },
    {
        id: 2,
        message: "Seu item foi vendido",
        timestamp: "2024-01-27T12:30:00Z",
        isRead: true,
        notificationType: NotificationType.SALE,
    },
    {
        id: 3,
        message: "Novo pedido de compra recebido",
        timestamp: "2024-01-26T15:45:00Z",
        isRead: false,
        notificationType: NotificationType.PURCHASE,
    },
    {
        id: 4,
        message: "Item alugado com sucesso",
        timestamp: "2024-01-25T09:20:00Z",
        isRead: true,
        notificationType: NotificationType.RENT,
    },
    {
        id: 5,
        message: "Novo item listado para troca",
        timestamp: "2024-01-24T18:00:00Z",
        isRead: false,
        notificationType: NotificationType.TRADE,
    }
];

export default DummyNotifications;
