import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import Sales from "./src/components/Venta";
import Home from "./src/components/Home";
import UserProfileScreen from "./src/components/AgregarUsuario";
import ProductDetailScreen from "./src/components/Detalles";
import AddProductScreen from "./src/components/AgregarProducto";
import Login from "./src/components/Login";
import PerfilUsuario from "./src/components/PerfilUsuario";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import EditProducto from "./src/components/EditProducto";

const TabNav = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <TabNav.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Inicio") {
            iconName = focused ? "home" : "home-outline";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4a00e0",
        tabBarInactiveTintColor: "#8e2de2",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerBackground: () => (
          <LinearGradient
            colors={["#4a00e0", "#8e2de2"]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        headerTintColor: "#fff",
        headerTitleStyle: styles.headerTitle,
      })}
    >
      <TabNav.Screen name="Inicio" component={Home} />
    </TabNav.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detalles Del Producto"
          component={ProductDetailScreen}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Productos en Ventas" component={Sales} />
        <Stack.Screen name="Agregar producto" component={AddProductScreen} />
        <Stack.Screen name="Editar producto" component={EditProducto} />
        <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} />

        <Stack.Screen
          name="Agregar Perfil del Usuario"
          component={UserProfileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabBarLabel: {
    fontWeight: "bold",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default App;
