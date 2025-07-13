export const truncate = (str: string, max: number) => str.length > max ? str.slice(0, max - 1) + "…" : str;
import { ContentType } from '@/components/MailContent/types';
// import crypto from 'crypto';
import * as crypto from 'expo-crypto';

export interface IMailItem {
  id: string,
  threadId: string,
  labelIds: string[],
  snippet: string,
  historyId: string,
  internalDate: string,
  sizeEstimate: number,

  // Formatlanmış veriler
  from_name: string,
  from_email: string,
  subject: string,
  date: string,
  to: string,
  cc: string,
  bcc: string,

  // Tarih formatları
  rawDate: string,
  formattedDate: string,
  timestamp: number,

  // Kategori ve etiketler
  category: string,
  priority: string,

  // Durumlar
  isUnread: boolean,
  isImportant: boolean,
  isStarred: boolean,

  // Inbox'a özel özellikler
  isInInbox: true,
  hasAttachments: boolean

  // Thread bilgisi
  threadLength: 1 // Bu değer thread detayından alınabilir
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

export const getCategoryQuery = (category: string) => {
  switch (category.toLowerCase()) {
    case 'primary':
      return 'category:primary'
    case 'social':
      return 'category:social'
    case 'promotions':
      return 'category:promotions'
    case 'updates':
      return 'category:updates'
    case 'forums':
      return 'category:forums'
    case 'unread':
      return 'is:unread'
    case 'important':
      return 'is:important'
    case 'starred':
      return 'is:starred'
    default:
      return 'category:primary'
  }
}
export const getMessageCategory = (labelIds: string[]) => {
  if (labelIds?.includes('CATEGORY_SOCIAL')) return 'social'
  if (labelIds?.includes('CATEGORY_PROMOTIONS')) return 'promotions'
  if (labelIds?.includes('CATEGORY_UPDATES')) return 'updates'
  if (labelIds?.includes('CATEGORY_FORUMS')) return 'forums'
  return 'primary'
}

export const getPriority = (labelIds: string[]) => {
  if (labelIds?.includes('IMPORTANT')) return 'high'
  if (labelIds?.includes('STARRED')) return 'starred'
  return 'normal'
}

export const parseEmailHeader = (emailString: string) => {
  if (!emailString) return { name: '', email: '' }

  const match = emailString.match(/^(.+?)\s*<(.+?)>$/)
  if (match) {
    return {
      name: match[1].replace(/"/g, '').trim(),
      email: match[2].trim()
    }
  }
  return {
    name: emailString.includes('@') ? '' : emailString,
    email: emailString.includes('@') ? emailString : ''
  }
}


export const getHeader = (name: string, headers: any[]) => {
  const header = headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())
  return header?.value || ''
}

// Generate a unique boundary for MIME multipart
export const generateBoundary = () => {
  return `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Build email message in RFC 2822 format with MIME multipart support
export const buildEmailMessage = (attachments: any[], to: string[], cc: string[], bcc: string[], subject: string, emailBody: string) => {
  const hasAttachments = attachments && attachments.length > 0
  const boundary = hasAttachments ? generateBoundary() : null

  let message = ""

  // Recipients
  message += `To: ${to.join(', ')}\r\n`

  if (cc && cc.length > 0) {
    message += `Cc: ${cc.join(', ')}\r\n`
  }

  if (bcc && bcc.length > 0) {
    message += `Bcc: ${bcc.join(', ')}\r\n`
  }

  // Subject
  message += `Subject: ${subject}\r\n`

  // MIME Headers
  message += `MIME-Version: 1.0\r\n`

  if (hasAttachments) {
    message += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n`
  } else {
    message += `Content-Type: text/html; charset=utf-8\r\n`
  }

  message += `\r\n`

  if (hasAttachments) {
    // Add body as first part
    message += `--${boundary}\r\n`
    message += `Content-Type: text/html; charset=utf-8\r\n`
    message += `Content-Transfer-Encoding: 7bit\r\n`
    message += `\r\n`
  }

  // Body - Convert markdown-like formatting to basic HTML
  let htmlBody = emailBody
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>') // Links
    .replace(/\n/g, '<br>') // Line breaks

  message += htmlBody

  if (hasAttachments) {
    message += `\r\n`

    // Add each attachment
    attachments.forEach((attachment: any) => {
      message += `--${boundary}\r\n`
      message += `Content-Type: ${attachment.type}; name="${attachment.name}"\r\n`
      message += `Content-Transfer-Encoding: base64\r\n`
      message += `Content-Disposition: attachment; filename="${attachment.name}"\r\n`
      message += `\r\n`

      // Add base64 data with line breaks every 76 characters (RFC requirement)
      const base64Data = attachment.data
      const chunks = base64Data.match(/.{1,76}/g) || []
      message += chunks.join('\r\n')
      message += `\r\n`
    })

    // Close boundary
    message += `--${boundary}--\r\n`
  }

  return message
}

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove data:mime/type;base64, prefix
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

export const MD5 = async (email: string) => {
  return await crypto.digestStringAsync(crypto.CryptoDigestAlgorithm.MD5, email)
}
export const getGravatarUrl = (email: string) => {
  return 'http://www.gravatar.com/avatar/' + MD5(email) + '.jpg?s=80';
}
// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

// Mapper function to convert Gmail API response to IMailItem format
export const mapGmailToMailItem = (gmailMessage: any): IMailItem => {
  return {
    id: gmailMessage.id,
    threadId: gmailMessage.threadId,
    labelIds: gmailMessage.labelIds,
    snippet: gmailMessage.snippet,
    historyId: gmailMessage.historyId,
    internalDate: gmailMessage.internalDate,
    sizeEstimate: gmailMessage.sizeEstimate,
    subject: gmailMessage.subject || '(Konu yok)',
    from_name: gmailMessage.from_name || gmailMessage.from_email || 'Bilinmeyen',
    from_email: gmailMessage.from_email || 'Bilinmeyen',
    date: gmailMessage.date || 'Bilinmeyen tarih',
    to: gmailMessage.to || 'Bilinmeyen',
    cc: gmailMessage.cc || 'Bilinmeyen',
    bcc: gmailMessage.bcc || 'Bilinmeyen',
    rawDate: gmailMessage.rawDate || 'Bilinmeyen tarih',
    formattedDate: gmailMessage.formattedDate || 'Bilinmeyen tarih',
    timestamp: gmailMessage.timestamp || 0,
    hasAttachments: gmailMessage.hasAttachments || false,
    isStarred: gmailMessage.isStarred || false,
    category: gmailMessage.category || 'primary',
    priority: gmailMessage.priority || 'normal',
    isUnread: gmailMessage.isUnread || false,
    isImportant: gmailMessage.isImportant || false,
    isInInbox: gmailMessage.isInInbox || false,
    threadLength: gmailMessage.threadLength || 1,
    // avatarUrl: undefined, // Gmail API doesn't provide avatar URLs
    // contentType: ContentType.TEXT, // Default to text, can be enhanced later
  }
}