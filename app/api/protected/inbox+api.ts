import { tokenCache } from "@/lib/auth/cache";
import { withAuth } from "@/lib/auth/middleware";
import { BASE_GMAIL_API_URL } from "@/lib/constants";
import { getCategoryQuery, getHeader, getMessageCategory, getPriority, parseEmailHeader } from "@/lib/utils";

export const GET = withAuth(async (req, user) => {
    const accessToken = await tokenCache?.getToken("accessToken")

    if (!accessToken) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
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
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (!response.ok) throw new Error("Failed to fetch messages")
        const data = await response.json()
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
                    Authorization: `Bearer ${accessToken}`
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



    } catch (error) {
        console.log("Error fetching messages", error)
        return Response.json({ error: "Failed to fetch messages" }, { status: 500 })
    }
});