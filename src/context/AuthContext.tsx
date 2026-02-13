"use client";

import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";

type UserRole = "user" | "pharmacy" | "admin" | null;

interface AuthContextType {
    user: FirebaseUser | null;
    role: UserRole;
    eid: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
});

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // First check "pharmacies" collection for pharmacy users
                let snap = await getDoc(doc(db, "pharmacies", firebaseUser.uid));
                if (snap.exists()) {
                    setRole(snap.data().role);
                } else {
                    // If not in "pharmacies", check "users" collection
                    snap = await getDoc(doc(db, "users", firebaseUser.uid));
                    if (snap.exists()) {
                        setRole(snap.data().role);
                    } else {
                        setRole("user"); // default
                    }
                }
            } else {
                setRole(null);
            }

            setLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
