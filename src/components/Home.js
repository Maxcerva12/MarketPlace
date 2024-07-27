import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const animation = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.background}>
      <Animated.View style={[styles.container, { opacity: animation }]}>
        <BlurView intensity={80} style={styles.blurContainer}>
          <Text style={styles.logo}>M</Text>
          <Text style={styles.title}>Marketplace</Text>
          <Text style={styles.subtitle}>Tu espacio para comprar y vender</Text>

          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
          >
            <Icon
              name="log-in-outline"
              size={24}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.registerButton]}
            onPress={() => navigation.navigate("Agregar Perfil del Usuario")}
          >
            <Icon
              name="person-add-outline"
              size={24}
              color="#4a00e0"
              style={styles.buttonIcon}
            />
            <Text style={[styles.buttonText, styles.registerText]}>
              Registrarse
            </Text>
          </Pressable>
        </BlurView>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurContainer: {
    width: width * 0.9,
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    overflow: "hidden",
  },
  logo: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: "#eee",
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  registerButton: {
    backgroundColor: "#fff",
  },
  registerText: {
    color: "#4a00e0",
  },
});

export default HomeScreen;
