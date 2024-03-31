import { child, get, getDatabase, ref } from "firebase/database";
import { auth } from "../config/firebaseconfig";

export const getGastos = async (userId) => {
    const dbRef = ref(getDatabase());
    try {
      const snapshot = await get(
        child(dbRef, `users/${userId}/gastos/`)
      );
      console.log(dbRef)
      if (snapshot.exists()) {
        const rawData = snapshot.val().list;
        return rawData;
      } else {
        console.log("No data available");
        return []
      }
    } catch (error) {
      console.error(error);
    }
  };