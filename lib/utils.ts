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

// Dummy data'yı interface'e uygun şekilde düzelttim
const dummyMail = {
    avatarUrl: 'https://github.com/grkndev.png',
    sender: 'Grkndev',
    title: 'Hello, world!',
    body: 'This is a test email body content that should be truncated after 50 characters for better display in the mail list.',
    receivedAt: '2 hours ago',
    hasAttachment: true,
    isStarred: true,
}

export const dummyData: IMailItem[] = Array.from({ length: 50 }).map((_, index) => ({
    ...dummyMail,
    id: (index + 1).toString(),
    sender: `User ${index + 1}`,
    title: `Email Subject ${index + 1}`,
    body: `This is email body content for message ${index + 1}. ${dummyMail.body}`,
    receivedAt: index < 5 ? 'Just now' : index < 10 ? '1 hour ago' : `${index} hours ago`,
    hasAttachment: Math.random() > 0.5,
    isStarred: Math.random() > 0.7,
}))