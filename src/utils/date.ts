import type { Timestamp } from 'firebase/firestore';

function isTimestampLike(value: unknown): value is { toDate: () => Date } {
    return !!value && typeof (value as { toDate?: unknown }).toDate === 'function';
}

export const formatTimestamp = (timestamp: Timestamp | Date | string | number | null | undefined): string => {
    if (!timestamp) return '';

    const date = isTimestampLike(timestamp) ? timestamp.toDate() : new Date(timestamp as Date | string | number);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    // Return formatted date for older messages
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatNewsTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};
