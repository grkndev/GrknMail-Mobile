export const truncate = (str: string, max: number) => str.length > max ? str.slice(0, max - 1) + "…" : str;

export interface IMailItem {
    id: string;
    title: string;
    body: string;
    sender: string;
    receivedAt: string;
    hasAttachment?: boolean;
    isStarred?: boolean;
    avatarUrl?: string;
}
