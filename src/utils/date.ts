export const formatDateForInput = (date: string): string => {
    const d = new Date(date);
    return d.toISOString().split('T')[0] + 'T' + d.toISOString().split('T')[1].slice(0, 5);
};

export const formatDateForDisplay = (date: string): string => {
    return new Date(date).toLocaleString();
};