const DAY_MS = 24 * 60 * 60 * 1000;
const pad = (value: number) => ('0' + value).slice(-2);

// Short relative timestamp for lists: "14:05", "Ontem", "Há 3 dias", "12/08" or "12/08/2025".
const getTimestampText = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const daysAgo = Math.round((startOfToday - startOfDate) / DAY_MS);

    if (daysAgo <= 0) {
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } else if (daysAgo === 1) {
        return 'Ontem';
    } else if (daysAgo < 7) {
        return `Há ${daysAgo} dias`;
    } else if (date.getFullYear() === now.getFullYear()) {
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
    } else {
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    }
};

export default getTimestampText
