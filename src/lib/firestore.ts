import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";

/* 🔹 Medicine Type */
export interface Medicine {
  id: string;
  name: string;
  status: "Available" | "Out of Stock" | "Low";
}

/* 🔹 Pharmacy Type */
export interface Pharmacy {
  id: string;
  pharmacyName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  licenseNumber: string;
  role: "pharmacy";
  createdAt: Date;
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

/* 🔹 Register pharmacy with Firebase Auth and Firestore */
export async function registerPharmacy(pharmacyData: {
  pharmacyName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
  licenseNumber: string;
}): Promise<void> {
  try {
    console.log("Starting pharmacy registration for:", pharmacyData.email);

    // Create user with Firebase Auth
    console.log("Creating Firebase Auth user...");
    const userCredential = await createUserWithEmailAndPassword(auth, pharmacyData.email, pharmacyData.password);
    const user = userCredential.user;
    console.log("Firebase Auth user created:", user.uid);

    // Save pharmacy data to Firestore
    const pharmacyDoc: Pharmacy = {
      id: user.uid,
      pharmacyName: pharmacyData.pharmacyName,
      ownerName: pharmacyData.ownerName,
      email: pharmacyData.email,
      phone: pharmacyData.phone,
      address: pharmacyData.address,
      city: pharmacyData.city,
      licenseNumber: pharmacyData.licenseNumber,
      role: "pharmacy",
      createdAt: new Date(),
    };

    console.log("Saving pharmacy data to Firestore...");
    await setDoc(doc(db, "users", user.uid), pharmacyDoc);
    console.log("Pharmacy data saved successfully to Firestore");

  } catch (error) {
    console.error("Error registering pharmacy:", error);
    throw error;
  }
}