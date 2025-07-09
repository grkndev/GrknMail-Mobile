import { ContentDetectionResult, ContentType } from './types';

/**
 * Detects the content type of a given string
 * @param content - The content string to analyze
 * @returns ContentDetectionResult with type and confidence level
 */
export function detectContentType(content: string): ContentDetectionResult {
  if (!content || typeof content !== 'string') {
    return { type: ContentType.TEXT, confidence: 1 };
  }

  const trimmedContent = content.trim();

  // Check for HTML content
  const htmlPatterns = [
    /<[a-z][\s\S]*>/i,           // HTML tags
    /&[a-zA-Z0-9]+;/,            // HTML entities like &nbsp;, &#8217;
    /<!DOCTYPE/i,                // DOCTYPE declaration
    /<html/i,                    // HTML document
    /<head/i,                    // Head section
    /<body/i,                    // Body section
    /<div/i,                     // Div elements
    /<span/i,                    // Span elements
    /<p>/i,                      // Paragraph elements
    /<br\s*\/?>/i,               // Line breaks
    /<img/i,                     // Image tags
    /<a\s+href/i,                // Link tags with href
    /<table/i,                   // Table elements
  ];

  const htmlMatches = htmlPatterns.reduce((count, pattern) => {
    return count + (pattern.test(trimmedContent) ? 1 : 0);
  }, 0);

  // Strong HTML indicators
  if (htmlMatches >= 3 || 
      trimmedContent.includes('<!DOCTYPE') || 
      trimmedContent.includes('<html') ||
      (trimmedContent.includes('<div') && trimmedContent.includes('</div>')) ||
      (trimmedContent.includes('<p>') && trimmedContent.includes('</p>'))) {
    return { type: ContentType.HTML, confidence: 0.95 };
  }

  // Check for Markdown content
  const markdownPatterns = [
    /^#{1,6}\s/m,                // Headers
    /\*\*.*?\*\*/,               // Bold text
    /\*.*?\*/,                   // Italic text
    /\[.*?\]\(.*?\)/,            // Links
    /^[-*+]\s/m,                 // Unordered lists
    /^\d+\.\s/m,                 // Ordered lists
    /```[\s\S]*?```/,            // Code blocks
    /`.*?`/,                     // Inline code
    /^>/m,                       // Blockquotes
    /^\|.*\|/m,                  // Tables
    /!\[.*?\]\(.*?\)/,           // Images
    /---+/,                      // Horizontal rules
  ];

  const markdownMatches = markdownPatterns.reduce((count, pattern) => {
    return count + (pattern.test(trimmedContent) ? 1 : 0);
  }, 0);

  // Strong markdown indicators
  if (markdownMatches >= 3 ||
      /^#{1,6}\s.*$/m.test(trimmedContent) ||
      /```[\s\S]*?```/.test(trimmedContent) ||
      /^\|.*\|.*$/m.test(trimmedContent)) {
    return { type: ContentType.MARKDOWN, confidence: 0.9 };
  }

  // Medium confidence checks
  if (htmlMatches >= 2) {
    return { type: ContentType.HTML, confidence: 0.7 };
  }

  if (markdownMatches >= 2) {
    return { type: ContentType.MARKDOWN, confidence: 0.7 };
  }

  // Low confidence checks
  if (htmlMatches === 1) {
    return { type: ContentType.HTML, confidence: 0.5 };
  }

  if (markdownMatches === 1) {
    return { type: ContentType.MARKDOWN, confidence: 0.4 };
  }

  // Default to plain text
  return { type: ContentType.TEXT, confidence: 1 };
}

/**
 * Sanitizes HTML content for safe rendering
 * @param html - The HTML content to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Remove dangerous elements and attributes
  let sanitized = html
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove style tags and their content (optional, you might want to keep some)
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove object and embed tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Remove form elements that might be problematic
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/<input\b[^>]*>/gi, '')
    .replace(/<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi, '')
    .replace(/<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi, '')
    .replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, '')
    // Remove dangerous event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^>\s]+/gi, '')
    // Remove javascript: URLs
    .replace(/javascript\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    // Remove potentially dangerous attributes
    .replace(/\s(contenteditable|draggable|spellcheck)\s*=\s*["'][^"']*["']/gi, '')
    // Clean up meta tags that might cause issues
    .replace(/<meta\s+http-equiv\s*=\s*["']?refresh["']?[^>]*>/gi, '')
    // Remove link tags that might import external stylesheets
    .replace(/<link\s+rel\s*=\s*["']?stylesheet["']?[^>]*>/gi, '')
    // Remove base tags that might change URL resolution
    .replace(/<base\b[^>]*>/gi, '');

  // Fix common email HTML issues
  sanitized = sanitized
    // Remove Outlook specific elements
    .replace(/<!--\[if[^>]*>[\s\S]*?<!\[endif\]-->/gi, '')
    .replace(/<v:[^>]*>[\s\S]*?<\/v:[^>]*>/gi, '')
    .replace(/<o:[^>]*>[\s\S]*?<\/o:[^>]*>/gi, '')
    // Remove mso (Microsoft Office) specific styles
    .replace(/mso-[^:;]*:[^;]*;?/gi, '')
    // Clean up excessive whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Ensure images have proper attributes
  sanitized = sanitized.replace(/<img([^>]*?)>/gi, (match, attrs) => {
    // Add loading="lazy" and ensure proper sizing
    if (!attrs.includes('loading=')) {
      attrs += ' loading="lazy"';
    }
    if (!attrs.includes('style=') && !attrs.includes('width=') && !attrs.includes('height=')) {
      attrs += ' style="max-width: 100%; height: auto;"';
    }
    return `<img${attrs}>`;
  });

  // Ensure links open in new window and are safe
  sanitized = sanitized.replace(/<a\s+([^>]*?)>/gi, (match, attrs) => {
    // Add target="_blank" and rel="noopener noreferrer" for security
    if (!attrs.includes('target=')) {
      attrs += ' target="_blank"';
    }
    if (!attrs.includes('rel=')) {
      attrs += ' rel="noopener noreferrer"';
    }
    return `<a ${attrs}>`;
  });

  return sanitized;
}

/**
 * Extracts plain text from HTML content
 * @param html - The HTML content
 * @returns Plain text string
 */
export function extractTextFromHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validates if content is safe for rendering
 * @param content - The content to validate
 * @returns Boolean indicating if content is safe
 */
export function isContentSafe(content: string): boolean {
  if (!content || typeof content !== 'string') {
    return false;
  }

  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<form/i,
    /<input/i,
    /data:(?!image)/i, // Allow data URLs only for images
  ];

  return !dangerousPatterns.some(pattern => pattern.test(content));
}

/**
 * Estimates the reading time for content
 * @param content - The content to analyze
 * @returns Estimated reading time in minutes
 */
export function estimateReadingTime(content: string): number {
  if (!content || typeof content !== 'string') {
    return 0;
  }

  const plainText = extractTextFromHtml(content);
  const words = plainText.split(/\s+/).length;
  const averageWordsPerMinute = 200;
  
  return Math.ceil(words / averageWordsPerMinute);
}