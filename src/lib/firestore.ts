import { collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";

/* 🔹 Medicine Type */
export interface Medicine {
  id: string;
  name: string;
  status: "Available" | "Out of Stock" | "Low";
  pharmacyName: string;
  location: string;
  phone: string;
  city: string;
}

/* 🔹 Pharmacy Type */
export interface Pharmacy {
  id: string;
  pharmacyName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
  state: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  role: "pharmacy";
  createdAt: Date;
}

/* 🔹 Get all medicines from Firestore (from all pharmacies' subcollections) */
export async function getMedicines(): Promise<Medicine[]> {
  try {
    // First, get all pharmacies
    const pharmaciesSnapshot = await getDocs(collection(db, "pharmacies"));
    const pharmacies = pharmaciesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Pharmacy, "id">),
    }));

    // Then, fetch medicines from each pharmacy's subcollection
    const allMedicines: Medicine[] = [];
    for (const pharmacy of pharmacies) {
      const medicinesSnapshot = await getDocs(collection(db, `pharmacies/${pharmacy.id}/medicines`));
      const medicines = medicinesSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        status: doc.data().status,
        pharmacyName: pharmacy.pharmacyName,
        location: `${pharmacy.address}, ${pharmacy.city}`,
        phone: pharmacy.phone,
        city: pharmacy.city,
      }));
      allMedicines.push(...medicines);
    }

    return allMedicines;
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return [];
  }
}

/* 🔹 Get medicines for a specific pharmacy from subcollection */
export async function getMedicinesForPharmacy(pharmacyId: string): Promise<Medicine[]> {
  try {
    const querySnapshot = await getDocs(collection(db, `pharmacies/${pharmacyId}/medicines`));

    const medicines: Medicine[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Medicine, "id">),
    }));

    return medicines;
  } catch (error) {
    console.error("Error fetching medicines for pharmacy:", error);
    return [];
  }
}

/* 🔹 Add a new medicine to a pharmacy's subcollection */
export async function addMedicine(pharmacyId: string, medicine: Omit<Medicine, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, `pharmacies/${pharmacyId}/medicines`), medicine);
    return docRef.id;
  } catch (error) {
    console.error("Error adding medicine:", error);
    throw error;
  }
}

/* 🔹 Update an existing medicine in a pharmacy's subcollection */
export async function updateMedicine(pharmacyId: string, medicineId: string, updates: Partial<Medicine>): Promise<void> {
  try {
    await updateDoc(doc(db, `pharmacies/${pharmacyId}/medicines`, medicineId), updates);
  } catch (error) {
    console.error("Error updating medicine:", error);
    throw error;
  }
}

/* 🔹 Delete a medicine from a pharmacy's subcollection */
export async function deleteMedicine(pharmacyId: string, medicineId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, `pharmacies/${pharmacyId}/medicines`, medicineId));
  } catch (error) {
    console.error("Error deleting medicine:", error);
    throw error;
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
  state: string;
  licenseNumber: string;
  licenseExpiryDate: string;
}): Promise<void> {
  try {
    console.log("Starting pharmacy registration for:", pharmacyData.email);
    console.log("Pharmacy data received:", pharmacyData);

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
      password: pharmacyData.password,
      address: pharmacyData.address,
      city: pharmacyData.city,
      state: pharmacyData.state,
      licenseNumber: pharmacyData.licenseNumber,
      licenseExpiryDate: pharmacyData.licenseExpiryDate,
      role: "pharmacy",
      createdAt: new Date(),
    };

    console.log("Pharmacy document to save:", pharmacyDoc);
    console.log("Saving pharmacy data to Firestore collection 'pharmacies'...");
    await setDoc(doc(db, "pharmacies", user.uid), pharmacyDoc);
    console.log("Pharmacy data saved successfully to Firestore");

    // Verify the data was saved
    console.log("Registration completed successfully");

  } catch (error) {
    console.error("Error registering pharmacy:", error);
    console.error("Error details:", error);
    throw error;
  }
}
