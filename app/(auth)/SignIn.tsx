import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/context/auth";
import { useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
// import ProfileCard from "@/components/ProfileCard";
// import ProtectedRequestCard from "@/components/ProtectedRequestCard";
export default function HomeScreen() {
    const { user, isLoading, signOut, fetchWithAuth } = useAuth();
    const [protectedData, setProtectedData] = useState<any>(null);

    if (isLoading) {
        return (
            <View
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
                <ActivityIndicator />
            </View>
        );
    }

    if (!user) {
        return <LoginForm />;
    }

    async function getProtectedData() {
        const response = await fetchWithAuth("/api/protected/data", {
            method: "GET",
        });
        const data = await response.json();
        setProtectedData(data);
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
            }}
        >
            <Text>{user.sub}</Text>
            <Text>{user.name}</Text>
            <Text>{user.email}</Text>
            <Button title="Get Protected Data" onPress={getProtectedData} />
            <Text>{JSON.stringify(protectedData, null, 2)}</Text>

            <Button title="Logout" onPress={signOut} />

        </View>
    );
}