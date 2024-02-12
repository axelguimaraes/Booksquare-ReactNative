const getTimestampText = (timestamp) => {
    const date = new Date(timestamp);
    const currentDate = new Date();

    const sameDay = date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear();
    const sameWeek = Math.abs(date.getTime() - currentDate.getTime()) <= 6 * 24 * 60 * 60 * 1000; // within 6 days
    const sameYear = date.getFullYear() === currentDate.getFullYear();

    if (sameDay) {
        return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
    } else if (sameWeek) {
        const daysAgo = Math.ceil((currentDate.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
        return `há ${daysAgo} dia(s)`;
    } else if (sameYear) {
        return `${date.getDate()}/${('0' + (date.getMonth() + 1)).slice(-2)}`;
    } else {
        return `${('0' + (date.getMonth() + 1)).slice(-2)}:${date.getFullYear()}`;
    }
};

export default getTimestampText