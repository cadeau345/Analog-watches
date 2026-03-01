import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("User document not found in Firestore");
        await signOut(auth);
        return;
      }

      const userData = userSnap.data();

      if (userData.role !== "admin") {
        alert("You are not authorized as admin");
        await signOut(auth);
        return;
      }

      localStorage.setItem("isAdmin", "true");
      navigate("/admin");

    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-lg w-full"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded-lg w-full"
        />

        <button
          type="submit"
          className="bg-black text-white py-3 w-full rounded-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;