import { withAuth } from "@/lib/auth/middleware";
import { BASE_GMAIL_API_URL } from "@/lib/constants";
import { BASE_URL } from "@/lib/constants/auth";
import { getCategoryQuery, getHeader, getMessageCategory, getPriority, parseEmailHeader } from "@/lib/utils";
import * as jose from "jose";

// Helper function to refresh Google tokens if needed
async function refreshGoogleTokenIfNeeded(user: any, authHeader: string) {
    const googleExpiresAt = user.google_expires_at;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    
    // Check if Google token expires within 5 minutes
    if (googleExpiresAt && googleExpiresAt <= currentTimestamp + 300) {
        // console.log("Google token expired or expiring soon, refreshing...");
        
        // Call our refresh endpoint to get new tokens
        const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authHeader,
            },
            body: JSON.stringify({
                platform: "native",
            }),
        });
        
        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            return refreshData.accessToken ? refreshData.accessToken : null;
        }
    }
    
    return null;
}

export const GET = withAuth(async (req, user) => {
    // Use Google access token from JWT payload for Gmail API calls
    let googleAccessToken = (user as any).google_access_token;

    if (!googleAccessToken) {
        return Response.json({ error: "Google access token not found" }, { status: 401 })
    }

    // Check if we need to refresh the Google token
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
        const refreshedToken = await refreshGoogleTokenIfNeeded(user, authHeader);
        if (refreshedToken) {
                         // Extract the new Google token from the refreshed JWT
             try {
                 const decoded = jose.decodeJwt(refreshedToken);
                 googleAccessToken = (decoded as any).google_access_token || googleAccessToken;
             } catch (error) {
                 console.error("Failed to decode refreshed token:", error);
             }
        }
    }
   
    const query = getCategoryQuery("INBOX")
    try {
        const fetchUrl = new URL(`${BASE_GMAIL_API_URL}/users/me/messages`)
        const fetchUrlQuery = new URLSearchParams()
        fetchUrlQuery.set("q", `in:inbox ${query}`)
        fetchUrlQuery.set("maxResults", '50')
        fetchUrlQuery.set("includeSpamTrash", "false")
        fetchUrl.search = fetchUrlQuery.toString()


        const response = await fetch(fetchUrl.toString(), {
            headers: {
                Authorization: `Bearer ${googleAccessToken}`
            }
        })

        if (!response.ok) {
            // If Gmail API returns 401, try to refresh token one more time
            if (response.status === 401 && authHeader) {
                                 const refreshedToken = await refreshGoogleTokenIfNeeded(user, authHeader);
                 if (refreshedToken) {
                     try {
                         const decoded = jose.decodeJwt(refreshedToken);
                         const newGoogleAccessToken = (decoded as any).google_access_token;
                        
                        if (newGoogleAccessToken) {
                            // Retry the request with the new token
                            const retryResponse = await fetch(fetchUrl.toString(), {
                                headers: {
                                    Authorization: `Bearer ${newGoogleAccessToken}`
                                }
                            });
                            
                            if (retryResponse.ok) {
                                const retryData = await retryResponse.json();
                                // Use the retry data for the rest of the function
                                return processMessagesResponse(retryData, newGoogleAccessToken);
                            }
                        }
                    } catch (error) {
                        console.error("Failed to decode refreshed token on retry:", error);
                    }
                }
            }
            
            throw new Error(`Failed to fetch messages: ${response.status}`);
        }
        
        const data = await response.json();
        return processMessagesResponse(data, googleAccessToken);

    } catch (error) {
        // console.log("Error fetching messages", error)
        return Response.json({ error: "Failed to fetch messages" }, { status: 500 })
    }
});

// Helper function to process messages response
async function processMessagesResponse(data: any, googleAccessToken: string) {
    if (!data.messages || data.messages.length === 0) {
        return Response.json({
            messages: [],
            nextPageToken: data.nextPageToken,
            resultSizeEstimate: data.resultSizeEstimate || 0,
            category: "INBOX",
            type: 'inbox'
        });
    }

    const messagePromises = data.messages.map((message: any) =>
        fetch(`${BASE_GMAIL_API_URL}/users/me/messages/${message.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date&metadataHeaders=To&metadataHeaders=Cc&metadataHeaders=Bcc`, {
            headers: {
                Authorization: `Bearer ${googleAccessToken}`
            }
        }).then(res => {
            if (!res.ok) {
                throw new Error(`Message fetch error: ${res.status}`)
            }
            return res.json()
        })
    )
    const messages = await Promise.all(messagePromises)

    const formattedMessages = messages.map((message: any) => {
        const headers = message.payload.headers || []

        const fromHeader = getHeader("From", headers)
        const subjectHeader = getHeader('Subject', headers)
        const dateHeader = getHeader('Date', headers)
        const toHeader = getHeader('To', headers)
        const ccHeader = getHeader('Cc', headers)
        const bccHeader = getHeader('Bcc', headers)

        const sender = parseEmailHeader(fromHeader)
        return {
            id: message.id,
            threadId: message.threadId,
            labelIds: message.labelIds || [],
            snippet: message.snippet || '',
            historyId: message.historyId,
            internalDate: message.internalDate,
            sizeEstimate: message.sizeEstimate,

            // Formatlanmış veriler
            from_name: sender.name,
            from_email: sender.email,
            subject: subjectHeader || '(Konu yok)',
            date: dateHeader,
            to: toHeader,
            cc: ccHeader,
            bcc: bccHeader,

            // Tarih formatları
            rawDate: dateHeader,
            formattedDate: dateHeader ? new Date(dateHeader).toLocaleString('tr-TR') : '',
            timestamp: dateHeader ? new Date(dateHeader).getTime() : 0,

            // Kategori ve etiketler
            category: getMessageCategory(message.labelIds),
            priority: getPriority(message.labelIds),

            // Durumlar
            isUnread: message.labelIds?.includes('UNREAD') || false,
            isImportant: message.labelIds?.includes('IMPORTANT') || false,
            isStarred: message.labelIds?.includes('STARRED') || false,

            // Inbox'a özel özellikler
            isInInbox: true,
            hasAttachments: message.payload?.parts?.some((part: any) => part.filename) || false,

            // Thread bilgisi
            threadLength: 1 // Bu değer thread detayından alınabilir
        }
    })

    const sortedMessages = formattedMessages.sort((a, b) => b.timestamp - a.timestamp)

    return Response.json({
        messages: sortedMessages,
        nextPageToken: data.nextPageToken,
        resultSizeEstimate: data.resultSizeEstimate || 0,
        category: "INBOX",
        type: 'inbox'
    })
}