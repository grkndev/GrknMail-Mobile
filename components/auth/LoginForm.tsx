// import { View } from "./View";
// import { Text } from "./Text";
import { useAuth } from "@/context/auth";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import SignInWithGoogleButton from "./SignInWithGoogleButton";
// import { SignInWithAppleButton } from "./SignInWithAppleButton";

export default function LoginForm() {
  const { signIn, isLoading } = useAuth();
  const theme = useColorScheme();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* <Image
          source={
            theme === "dark"
              ? require("@/assets/images/icon-white.png")
              : require("@/assets/images/icon-dark.png")
          }
          style={styles.logo}
        /> */}

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Welcome to Your App
            </Text>
            <Text style={styles.description}>
              Experience seamless authentication{"\n"}
              powered by Expo.{"\n"}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <SignInWithGoogleButton onPress={signIn} disabled={isLoading} />
            {/* <SignInWithAppleButton /> */}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  titleContainer: {
    alignItems: "center",
    gap: 12,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 32,
  },
  contentContainer: {
    width: "100%",
    gap: 32,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  description: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
});