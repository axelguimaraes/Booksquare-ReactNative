import { Notification, NotificationType } from "../Models/Notification";

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

const DummyNotifications: Notification[] = [
    {
        id: 1,
        message: "Tem uma nova mensagem de Ana Silva",
        timestamp: hoursAgo(1),
        isRead: false,
        targetUserID: 123,
        notificationType: NotificationType.MESSAGE,
    },
    {
        id: 2,
        message: "O seu livro foi vendido",
        timestamp: hoursAgo(20),
        isRead: true,
        notificationType: NotificationType.SALE,
    },
    {
        id: 3,
        message: "Recebeu um novo pedido de compra",
        timestamp: hoursAgo(50),
        isRead: false,
        notificationType: NotificationType.PURCHASE,
    },
    {
        id: 4,
        message: "Livro alugado com sucesso",
        timestamp: hoursAgo(80),
        isRead: true,
        notificationType: NotificationType.RENT,
    },
    {
        id: 5,
        message: "Foi publicado um novo livro para troca",
        timestamp: hoursAgo(200),
        isRead: false,
        notificationType: NotificationType.TRADE,
    }
];

export default DummyNotifications;
