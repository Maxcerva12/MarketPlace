import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { firestore, auth } from "../config/firebaseConfig";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import AddProductScreen from "./AgregarProducto";
import PerfilUsuario from "./PerfilUsuario";
import { LinearGradient } from "expo-linear-gradient";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

const TabNav = createBottomTabNavigator();

const SalesContent = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = onSnapshot(
      collection(firestore, "articulos"),
      (snapshot) => {
        const fetchedProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setIsLoading(false);
      }
    );

    // Obtener información del usuario
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    };
    fetchUserData();

    return () => unsubscribe();
  }, []);

  const applyFilters = () => {
    let filtered = products;
    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }
    setFilteredProducts(filtered);
  };

  return (
    <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Todas las Categorías" value="" />
            <Picker.Item label="Tecnología" value="tecnologia" />
            <Picker.Item label="Ropa" value="ropa" />
            <Picker.Item label="Hogar" value="hogar" />
            <Picker.Item label="Moto" value="moto" />
            <Picker.Item label="Carro" value="carro" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={applyFilters}>
          <Text style={styles.filterButtonText}>Aplicar Filtros</Text>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productContainer}
                onPress={() =>
                  navigation.navigate("Detalles Del Producto", {
                    productId: item.id,
                  })
                }
              >
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                  />
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.productPrice}>${item.price} COP</Text>
                </View>
              </TouchableOpacity>
            )}
            columnWrapperStyle={styles.productRow}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const SalesScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <TabNav.Navigator
      initialRouteName="Ventas"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Ventas") {
            iconName = focused ? "storefront" : "storefront-outline";
          } else if (route.name === "Subir Producto") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Tu perfil") {
            iconName = focused ? "person" : "person-outline";
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
      <TabNav.Screen
        name="Ventas"
        component={SalesContent}
        options={{
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Text style={styles.headerText}>Ventas</Text>
              {user && (
                <View style={styles.userInfo}>
                  {user.fotoUrl ? (
                    <Image
                      source={{ uri: user.fotoUrl }}
                      style={styles.userImage}
                    />
                  ) : (
                    <View style={styles.placeholderImage} />
                  )}
                  <Text style={styles.userName}>{user.nombre}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <TabNav.Screen name="Subir Producto" component={AddProductScreen} />
      <TabNav.Screen name="Tu perfil" component={PerfilUsuario} />
    </TabNav.Navigator>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   padding: 10,
  //   backgroundColor: "#f0f0f0",
  // },

  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },

  // filterContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: 15,
  // },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  placeholderImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e1e1e1",
    marginRight: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#736F72",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: "#12100E",
  },
  picker: {
    color: "#fff",
    height: 50,
  },

  pickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    marginBottom: 10,
  },
  productContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: "48%", // Asegura que los productos ocupen aproximadamente la mitad del ancho
  },

  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 10,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4a00e0",
  },

  productRow: {
    justifyContent: "space-between",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  filterButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  filterButtonText: {
    color: "#4a00e0",
    fontWeight: "bold",
  },
});

export default SalesScreen;
