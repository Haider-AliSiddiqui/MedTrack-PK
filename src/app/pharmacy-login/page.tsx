"use client";

export default function PharmacyLogin() {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login successful!");
    // Redirect to dashboard
    window.location.href = "/pharmacy-dashboard";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Pharmacy Login</h2>
        <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-4" required />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded mb-4" required />
        <button type="submit" className="w-full bg-teal-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
