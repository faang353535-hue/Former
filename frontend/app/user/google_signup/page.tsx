'use client';

export default function GoogleSignup() {
    const handleGoogleSignup = () => {
        // Redirect user to backend signup start route
        window.location.href = 'http://localhost:5000/auth/google/start?redirect=/';
     };

    return (
        <main className="flex flex-col items-center justify-center ">
            <button
                onClick={handleGoogleSignup}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
                Sign up with Google  
            </button>  
        </main>
    );
}
