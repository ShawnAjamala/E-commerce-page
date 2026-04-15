import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, setUserRole } from "../firebase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
        navigate("/dashboard");
      } else {
        const userCred = await registerUser(email, password);
        await setUserRole(userCred.user.uid, role);
        navigate("/dashboard");
      }
    } catch (err) {
      let message = err.message;
      if (message.includes("auth/email-already-in-use")) message = "Email already in use";
      else if (message.includes("auth/invalid-email")) message = "Invalid email address";
      else if (message.includes("auth/wrong-password")) message = "Wrong password";
      else if (message.includes("auth/user-not-found")) message = "No account found with this email";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-blue-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">MyTherapy</h1>
          <p className="text-blue-600">Your safe space for mental wellness</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-full transition font-medium ${
              isLogin
                ? "bg-blue-500 text-white shadow-md"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-full transition font-medium ${
              !isLogin
                ? "bg-blue-500 text-white shadow-md"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-blue-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-blue-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-blue-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="patient">Patient</option>
                <option value="therapist">Therapist</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 text-sm p-2 rounded-lg text-center border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-blue-600 transition transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-blue-500 text-sm">
          {isLogin ? "New to MyTherapy? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-700 underline hover:no-underline font-medium"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}