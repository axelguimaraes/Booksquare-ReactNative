import { Notification, NotificationType } from "../Models/Notification";

const DummyNotifications: Notification[] = [
    {
        id: 1,
        message: "You have a new message from User",
        timestamp: "2024-01-28T08:00:00Z",
        isRead: false,
        targetUserID: 123,
        notificationType:  NotificationType.MESSAGE,
    },
    {
        id: 2,
        message: "Your item has been sold",
        timestamp: "2024-01-27T12:30:00Z",
        isRead: true,
        notificationType:  NotificationType.SALE,
    },
    {
        id: 3,
        message: "New purchase request received",
        timestamp: "2024-01-26T15:45:00Z",
        isRead: false,
        notificationType:  NotificationType.PURCHASE,
    },
    {
        id: 4,
        message: "Item rented successfully",
        timestamp: "2024-01-25T09:20:00Z",
        isRead: true,
        notificationType:  NotificationType.RENT,
    },
    {
        id: 5,
        message: "New item listed for trade",
        timestamp: "2024-01-24T18:00:00Z",
        isRead: false,
        notificationType:  NotificationType.TRADE,
    }
];

export default DummyNotifications;
