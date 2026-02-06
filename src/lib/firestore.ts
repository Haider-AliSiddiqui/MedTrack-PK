import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/* 🔹 Medicine Type */
export interface Medicine {
  id: string;
  name: string;
  status: "Available" | "Out of Stock" | "Low";
}

/* 🔹 Get all medicines from Firestore */
export async function getMedicines(): Promise<Medicine[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "medicines"));

    const medicines: Medicine[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Medicine, "id">),
    }));

    return medicines;
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return [];
  }
}
