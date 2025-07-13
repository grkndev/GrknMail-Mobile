import { tokenCache } from "@/lib/auth/cache";
import { withAuth } from "@/lib/auth/middleware";

// Example protected data
const mockData = {
    secretMessage: "This is protected data!",
    timestamp: new Date().toISOString(),
};

export const GET = withAuth(async (req, user) => {
    const storedAccessToken = await tokenCache?.getToken("accessToken");
    console.log("storedAccessToken", storedAccessToken)
    // You can use the authenticated user info in your response
    return Response.json({
        data: mockData,
        user: {
            name: user.name,
            email: user.email,
            token: user.google_token,
            accessToken: storedAccessToken || null
        },
    });
});