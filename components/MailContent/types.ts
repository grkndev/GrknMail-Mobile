export enum ContentType {
  TEXT = 'text',
  HTML = 'html',
  MARKDOWN = 'markdown'
}

export interface MailContentProps {
  content: string;
  contentType?: ContentType;
  className?: string;
  style?: any;
}

export interface ContentDetectionResult {
  type: ContentType;
  confidence: number;
} 