// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyBq6UpFTGtdYJ0Sc2yz3H_Y1SAHL7jZPtI",
//   authDomain: "maxiprueba-33c7f.firebaseapp.com",
//   projectId: "maxiprueba-33c7f",
//   storageBucket: "maxiprueba-33c7f.appspot.com",
//   messagingSenderId: "742687500987",
//   appId: "1:742687500987:web:80044930d079deb155179e",
//   measurementId: "G-K88KSZL6XX",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const firestore = getFirestore(app);
// const storage = getStorage(app);

// export { auth, firestore, storage };

// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyBq6UpFTGtdYJ0Sc2yz3H_Y1SAHL7jZPtI",
//   authDomain: "maxiprueba-33c7f.firebaseapp.com",
//   projectId: "maxiprueba-33c7f",
//   storageBucket: "maxiprueba-33c7f.appspot.com",
//   messagingSenderId: "742687500987",
//   appId: "1:742687500987:web:80044930d079deb155179e",
//   measurementId: "G-K88KSZL6XX",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const firestore = getFirestore(app);
// const storage = getStorage(app);

// export { auth, firestore, storage };

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBq6UpFTGtdYJ0Sc2yz3H_Y1SAHL7jZPtI",
  authDomain: "maxiprueba-33c7f.firebaseapp.com",
  projectId: "maxiprueba-33c7f",
  storageBucket: "maxiprueba-33c7f.appspot.com",
  messagingSenderId: "742687500987",
  appId: "1:742687500987:web:80044930d079deb155179e",
  measurementId: "G-K88KSZL6XX",
};

const app = initializeApp(firebaseConfig);

// Inicializa Auth con persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
