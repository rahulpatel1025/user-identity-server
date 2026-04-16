import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-4">
      <div className="max-w-3xl text-center space-y-6">
        
        {/* Hero Section */}
        <h1 className="text-5xl font-extrabold tracking-tight">
          Unified <span className="text-blue-600">Identity Provider</span>
        </h1>
        
        <p className="text-lg text-gray-600">
          A custom-built, OAuth 2.0 compliant Single Sign-On (SSO) server. 
          Manage client applications, issue secure JWTs, and handle user identities from one central hub.
        </p>
        
        {/* Call to Action Buttons */}
        <div className="pt-8 flex justify-center gap-4">
          <Link 
            href="/admin" 
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            Developer Portal
          </Link>
          
          <button 
            disabled
            className="bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300 px-6 py-3 rounded-lg font-medium"
            title="We will build this next!"
          >
            User Login (Coming Soon)
          </button>
        </div>

      </div>
    </div>
  );
}