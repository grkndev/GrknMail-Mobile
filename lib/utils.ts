export const truncate = (str: string, max: number) => str.length > max ? str.slice(0, max - 1) + "…" : str;
import { ContentType } from '@/components/MailContent/types';

export interface IMailItem {
    id: string;
    title: string;
    body: string;
    sender: string;
    receivedAt: string;
    hasAttachment?: boolean;
    isStarred?: boolean;
    avatarUrl?: string;
    contentType?: ContentType;
}

// Sample content for different types
const sampleContents = {
    text: `Hi Alex,

I hope this message finds you in great spirits! I wanted to take a moment to reconnect and see how everything is progressing on your side. It's been a while since we last spoke, and I'm eager to hear about any developments or updates you might have regarding your projects.

If there's anything you're facing challenges with or if you need any assistance, please don't hesitate to reach out. I'm here to lend a hand and support you in any way I can!

I genuinely look forward to hearing from you soon and catching up on all that's been happening in your world. Let's make sure to find some time to chat!

Warm regards,
Jordan`,
    
    markdown: `# Project Update

Hi **Alex**,

I hope this message finds you in great spirits! I wanted to take a moment to reconnect and see how everything is progressing on your side.

## Recent Developments

- ✅ Completed the initial design phase
- 🔄 Working on the implementation
- 📋 Planning the testing strategy

### Next Steps

1. **Review** the current progress
2. **Schedule** a meeting for next week
3. **Prepare** the demo materials

> If there's anything you're facing challenges with or if you need any assistance, please don't hesitate to reach out.

Check out our project repository: [GitHub Project](https://github.com/example/project)

Best regards,  
*Jordan*`,

    html: `<div style="font-family: Arial, sans-serif;">
<h2 style="color: #2563eb;">Project Update</h2>

<p>Hi <strong>Alex</strong>,</p>

<p>I hope this message finds you in great spirits! I wanted to take a moment to reconnect and see how everything is progressing on your side.</p>

<h3 style="color: #059669;">Recent Developments</h3>

<ul>
<li><span style="color: #10b981;">✅</span> Completed the initial design phase</li>
<li><span style="color: #f59e0b;">🔄</span> Working on the implementation</li>
<li><span style="color: #6366f1;">📋</span> Planning the testing strategy</li>
</ul>

<h4>Next Steps</h4>

<ol>
<li><strong>Review</strong> the current progress</li>
<li><strong>Schedule</strong> a meeting for next week</li>
<li><strong>Prepare</strong> the demo materials</li>
</ol>

<blockquote style="border-left: 4px solid #e5e7eb; padding-left: 16px; color: #6b7280;">
If there's anything you're facing challenges with or if you need any assistance, please don't hesitate to reach out.
</blockquote>

<p>Check out our project repository: <a href="https://github.com/example/project" style="color: #2563eb;">GitHub Project</a></p>

<p>Best regards,<br>
<em>Jordan</em></p>
</div>`
};

// Dummy data with different content types
const dummyMail = {
    avatarUrl: 'https://github.com/grkndev.png',
    sender: 'Grkndev',
    title: 'Hello, world!',
    body: sampleContents.text,
    receivedAt: '2 hours ago',
    hasAttachment: true,
    isStarred: true,
    contentType: ContentType.TEXT,
}

export const dummyData: IMailItem[] = Array.from({ length: 50 }).map((_, index) => {
    // Distribute different content types
    let contentType: ContentType;
    let body: string;
    
    if (index % 3 === 0) {
        contentType = ContentType.HTML;
        body = sampleContents.html;
    } else if (index % 3 === 1) {
        contentType = ContentType.MARKDOWN;
        body = sampleContents.markdown;
    } else {
        contentType = ContentType.TEXT;
        body = sampleContents.text;
    }

    return {
        ...dummyMail,
        id: (index + 1).toString(),
        sender: `User ${index + 1}`,
        title: `Email Subject ${index + 1} - ${contentType.toUpperCase()}`,
        body,
        contentType,
        receivedAt: index < 5 ? 'Just now' : index < 10 ? '1 hour ago' : `${index} hours ago`,
        hasAttachment: Math.random() > 0.5,
        isStarred: Math.random() > 0.7,
    };
})