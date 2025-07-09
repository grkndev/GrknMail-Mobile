import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { WebView } from 'react-native-webview';
import { ContentType, MailContentProps } from './types';
import { detectContentType, sanitizeHtml } from './utils';

const { width: screenWidth } = Dimensions.get('window');

const MailContent: React.FC<MailContentProps> = ({
    content,
    contentType,
    className = '',
    style = {}
}) => {
    const [webViewHeight, setWebViewHeight] = useState(200);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    
    if (!content) {
        return (
            <View className={`p-4 ${className}`} style={style}>
                <Text className="text-gray-500 text-center italic">No content available</Text>
            </View>
        );
    }

    // Auto-detect content type if not provided
    const detectedType = contentType || detectContentType(content).type;

    const renderContent = () => {
        switch (detectedType) {
            case ContentType.HTML:
                return renderHtmlContent();
            case ContentType.MARKDOWN:
                return renderMarkdownContent();
            case ContentType.TEXT:
            default:
                return renderTextContent();
        }
    };

    const renderTextContent = () => (
        <Text className="text-base text-gray-900 leading-6" style={style}>
            {content}
        </Text>
    );

    const renderMarkdownContent = () => (
        <Markdown
            style={markdownStyles}
            rules={{
                // Custom rules for better mobile rendering
                heading1: (node, children) => (
                    <Text key={node.key} className="text-2xl font-bold text-gray-900 mb-3">
                        {children}
                    </Text>
                ),
                heading2: (node, children) => (
                    <Text key={node.key} className="text-xl font-bold text-gray-900 mb-2">
                        {children}
                    </Text>
                ),
                heading3: (node, children) => (
                    <Text key={node.key} className="text-lg font-semibold text-gray-900 mb-2">
                        {children}
                    </Text>
                ),
                paragraph: (node, children) => (
                    <Text key={node.key} className="text-base text-gray-900 leading-6 mb-3">
                        {children}
                    </Text>
                ),
                strong: (node, children) => (
                    <Text key={node.key} className="font-bold">
                        {children}
                    </Text>
                ),
                em: (node, children) => (
                    <Text key={node.key} className="italic">
                        {children}
                    </Text>
                ),
            }}
        >
            {content}
        </Markdown>
    );

    const handleWebViewMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'HEIGHT_CHANGE') {
                setWebViewHeight(Math.max(data.height, 100));
            }
        } catch (error) {
            console.warn('WebView message parsing error:', error);
        }
    }, []);

    const renderHtmlContent = () => {
        const sanitizedHtml = sanitizeHtml(content);

        const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <meta charset="UTF-8">
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #111827;
            margin: 0;
            padding: 16px;
            background-color: transparent;
            word-wrap: break-word;
            overflow-wrap: break-word;
            -webkit-text-size-adjust: 100%;
        }
        
        img {
            max-width: 100% !important;
            height: auto !important;
            display: block;
            margin: 8px 0;
        }
        
        a {
            color: #3b82f6;
            text-decoration: none;
            word-break: break-word;
        }
        
        a:hover, a:active {
            text-decoration: underline;
        }
        
        p {
            margin: 0 0 12px 0;
            word-wrap: break-word;
        }
        
        h1, h2, h3, h4, h5, h6 {
            margin: 16px 0 8px 0;
            font-weight: bold;
            line-height: 1.3;
        }
        
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        h3 { font-size: 18px; }
        h4 { font-size: 16px; }
        h5 { font-size: 14px; }
        h6 { font-size: 12px; }
        
        ul, ol {
            margin: 8px 0;
            padding-left: 24px;
        }
        
        li {
            margin: 4px 0;
        }
        
        blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 16px;
            margin: 16px 0;
            color: #6b7280;
            font-style: italic;
        }
        
        code {
            background-color: #f3f4f6;
            padding: 2px 4px;
            border-radius: 4px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 14px;
            word-break: break-all;
        }
        
        pre {
            background-color: #f3f4f6;
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        pre code {
            background-color: transparent;
            padding: 0;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
            font-size: 14px;
            overflow-x: auto;
            display: block;
            white-space: nowrap;
        }
        
        th, td {
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            text-align: left;
            word-wrap: break-word;
        }
        
        th {
            background-color: #f9fafb;
            font-weight: bold;
        }
        
        /* Email specific styles */
        .email-header {
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 16px;
            margin-bottom: 16px;
        }
        
        .email-signature {
            border-top: 1px solid #e5e7eb;
            padding-top: 16px;
            margin-top: 16px;
            font-size: 14px;
            color: #6b7280;
        }
        
        /* Responsive tables */
        @media (max-width: 600px) {
            table {
                font-size: 12px;
            }
            
            th, td {
                padding: 6px 8px;
            }
        }
        
        /* Fix for Outlook specific HTML */
        .mso-hide {
            display: none !important;
        }
        
        /* Remove default margins from email clients */
        .ExternalClass * {
            line-height: 100%;
        }
    </style>
</head>
<body>
    <div id="content">
        ${sanitizedHtml}
    </div>
    
    <script>
        function updateHeight() {
            const content = document.getElementById('content');
            const height = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'HEIGHT_CHANGE',
                    height: height
                }));
            }
        }
        
        // Update height when DOM is ready
        document.addEventListener('DOMContentLoaded', updateHeight);
        
        // Update height when images load
        document.addEventListener('load', updateHeight, true);
        
        // Update height when window resizes
        window.addEventListener('resize', updateHeight);
        
        // Fallback height update
        setTimeout(updateHeight, 100);
        setTimeout(updateHeight, 500);
        setTimeout(updateHeight, 1000);
        
        // Handle link clicks
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'LINK_CLICK',
                        url: e.target.href
                    }));
                }
            }
        });
    </script>
</body>
</html>`;

        if (hasError) {
            return (
                <View className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <Text className="text-red-600 text-center">
                        HTML içeriği yüklenirken hata oluştu
                    </Text>
                    <Text className="text-red-500 text-sm text-center mt-2">
                        İçerik metin olarak gösteriliyor
                    </Text>
                    <Text className="text-gray-700 mt-4" style={{ fontFamily: 'monospace' }}>
                        {content}
                    </Text>
                </View>
            );
        }

        return (
            <View style={{ width: screenWidth - 32 }}>
                {isLoading && (
                    <View className="absolute inset-0 bg-white bg-opacity-75 items-center justify-center z-10">
                        <ActivityIndicator size="small" color="#3b82f6" />
                        <Text className="text-gray-500 text-sm mt-2">İçerik yükleniyor...</Text>
                    </View>
                )}
                
                <WebView
                    source={{ html: htmlTemplate }}
                    style={{ 
                        height: webViewHeight,
                        backgroundColor: 'transparent',
                        opacity: isLoading ? 0 : 1
                    }}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    javaScriptEnabled={true}
                    domStorageEnabled={false}
                    startInLoadingState={false}
                    mixedContentMode="compatibility"
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    onMessage={handleWebViewMessage}
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    onError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                    onHttpError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                    onShouldStartLoadWithRequest={(request) => {
                        // Only allow the initial HTML load
                        if (request.url === 'about:blank' || request.url.startsWith('data:')) {
                            return true;
                        }
                        
                        // Handle external links
                        if (request.url.startsWith('http://') || request.url.startsWith('https://')) {
                            // Here you can handle external links (e.g., open in browser)
                            console.log('External link clicked:', request.url);
                            return false;
                        }
                        
                        return false;
                    }}
                />
            </View>
        );
    };

    return (
        <View className={`${className}`} style={style}>
            {renderContent()}
        </View>
    );
};

// Markdown styles configuration
const markdownStyles = {
    body: {
        fontSize: 16,
        lineHeight: 24,
        color: '#111827',
    },
    heading1: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        color: '#111827',
        marginBottom: 12,
    },
    heading2: {
        fontSize: 20,
        fontWeight: 'bold' as const,
        color: '#111827',
        marginBottom: 8,
    },
    heading3: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: '#111827',
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#111827',
        marginBottom: 12,
    },
    strong: {
        fontWeight: 'bold' as const,
    },
    em: {
        fontStyle: 'italic' as const,
    },
    link: {
        color: '#3b82f6',
    },
    list_item: {
        marginBottom: 4,
    },
    bullet_list: {
        marginBottom: 12,
    },
    ordered_list: {
        marginBottom: 12,
    },
    code_inline: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
        fontFamily: 'monospace' as const,
        fontSize: 14,
    },
    code_block: {
        backgroundColor: '#f3f4f6',
        padding: 12,
        borderRadius: 8,
        fontFamily: 'monospace' as const,
        fontSize: 14,
    },
    blockquote: {
        borderLeftWidth: 4,
        borderLeftColor: '#e5e7eb',
        paddingLeft: 16,
        marginVertical: 16,
        color: '#6b7280',
    },
};

export default MailContent;