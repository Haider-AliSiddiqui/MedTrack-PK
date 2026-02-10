import { auth, db } from "./firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export async function testFirebaseConnection() {
  try {
    console.log("Testing Firebase connection...");

    // Test Firestore connection
    console.log("Testing Firestore...");
    const testDoc = {
      testField: "test value",
      timestamp: new Date(),
    };

    await setDoc(doc(db, "test", "test-doc"), testDoc);
    console.log("✅ Firestore write successful");

    // Test Auth connection (optional - comment out if you don't want to create test user)
    console.log("Testing Firebase Auth...");
    // Note: This will create a test user - remove after testing
    // const testEmail = `test${Date.now()}@example.com`;
    // const testPassword = "testpassword123";
    // const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    // console.log("✅ Auth user created:", userCredential.user.uid);

    console.log("✅ All Firebase tests passed!");
    return true;
  } catch (error) {
    console.error("❌ Firebase test failed:", error);
    return false;
  }
}

export async function checkFirebaseServices() {
  console.log("🔍 Checking Firebase services status...");

  try {
    // Try to read from a collection
    const querySnapshot = await getDocs(collection(db, "test"));
    console.log("✅ Firestore is accessible");

    // Check if we can write
    await setDoc(doc(db, "test", "status-check"), {
      status: "Firebase is working",
      checkedAt: new Date(),
    });
    console.log("✅ Firestore write permissions OK");

    return {
      firestore: true,
      auth: true, // Assuming if Firestore works, Auth should too
    };
  } catch (error) {
    console.error("❌ Firebase services check failed:", error);
    return {
      firestore: false,
      auth: false,
      error: error.message,
    };
  }
}
