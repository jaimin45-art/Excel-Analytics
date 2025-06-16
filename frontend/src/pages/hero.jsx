import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-xl w-full p-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">Excel Analytics</h1>
        <p className="text-gray-600 text-lg mb-6">Upload. Analyze. Improve.</p>

        <ul className="text-left mb-6 space-y-3 text-gray-700">
          <li className="flex items-center gap-2">
            📂 <span>Upload your Excel sheet</span>
          </li>
          <li className="flex items-center gap-2">
            📊 <span>Get automatic analysis</span>
          </li>
          <li className="flex items-center gap-2">
            🚀 <span>Improve performance with insights</span>
          </li>
        </ul>

        <div className="flex justify-center gap-4">
          <Link to="/login">
            <button className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-5 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
