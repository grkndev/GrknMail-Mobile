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

const dummyMail = {
    image: 'https://github.com/grkndev.png',
    author: 'Grkndev',
    subject: 'Hello, world!',
    body: 'This is a test email',
    sentAt: new Date(),
    isRead: false,
}

export const dummyData = Array.from({ length: 50 }).map((_, index) => ({
    ...dummyMail,
    id: index + 1,
}))
