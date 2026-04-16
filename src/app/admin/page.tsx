"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [appName, setAppName] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [credentials, setCredentials] = useState<any>(null);

  const registerApp = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        appName, 
        redirectUris: [redirectUri] // Storing as array per our schema
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setCredentials({
        clientId: data.client.clientId,
        clientSecret: data.clientSecret,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border">
      <h1 className="text-2xl font-bold mb-6">Developer Portal</h1>
      
      {!credentials ? (
        <form onSubmit={registerApp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">App Name</label>
            <input 
              type="text" required value={appName} onChange={e => setAppName(e.target.value)}
              className="w-full border p-2 rounded" placeholder="e.g., My Cool Startup"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Allowed Redirect URI</label>
            <input 
              type="url" required value={redirectUri} onChange={e => setRedirectUri(e.target.value)}
              className="w-full border p-2 rounded" placeholder="http://localhost:3001/callback"
            />
          </div>
          <button type="submit" className="bg-black text-white px-4 py-2 rounded">
            Register Client App
          </button>
        </form>
      ) : (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h2 className="text-xl font-bold text-green-800 mb-2">App Registered!</h2>
          <p className="text-sm text-red-600 font-bold mb-4">⚠️ Copy your Client Secret now. You will not be able to see it again!</p>
          
          <div className="space-y-2">
            <p><strong>Client ID:</strong> <code className="bg-gray-200 p-1 rounded">{credentials.clientId}</code></p>
            <p><strong>Client Secret:</strong> <code className="bg-gray-200 p-1 rounded">{credentials.clientSecret}</code></p>
          </div>
        </div>
      )}
    </div>
  );
}