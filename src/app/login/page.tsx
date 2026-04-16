"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/oauth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          client_id: clientId, 
          redirect_uri: redirectUri 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  if (!clientId || !redirectUri) {
    return (
      <div className="text-center p-10 text-red-600 font-bold">
        Error: Missing OAuth Parameters. You cannot access this page directly.
      </div>
    );
  }

  // 👇 Dynamically build the register URL so we don't lose the OAuth context!
  const registerUrl = `/register?${searchParams.toString()}`;

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white text-gray-900 rounded-lg shadow-md border">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-gray-500 mt-2">Continue to your application</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full border p-2 rounded bg-white text-gray-900" placeholder="you@example.com"
            autoComplete="email" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full border p-2 rounded bg-white text-gray-900" placeholder="••••••••"
            autoComplete="current-password" 
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Verifying..." : "Sign In"}
        </button>
      </form>

      {/* 👇 Added Sign Up Link Section */}
      <div className="mt-6 text-center text-sm text-gray-600 pt-4 border-t border-gray-100">
        Don't have an account?{" "}
        <a 
          href={registerUrl} 
          className="text-blue-600 font-semibold hover:underline"
        >
          Sign up here
        </a>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}