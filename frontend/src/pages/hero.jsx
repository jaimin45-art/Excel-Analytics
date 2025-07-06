import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center bg-blue-100 p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        <div className="text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Welcome to <span className="text-blue-700">Excel Analytics</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700">
            Unlock insights. Analyze smarter. Make better decisions with your data.<br />
            Dive into the world of data with confidence. Whether you're a business owner,
            analyst, student, or just someone who loves making informed decisions — this is
            the platform where numbers come alive. Transform dull spreadsheets into powerful
            insights, visualize trends, and make smarter, faster, and better choices with your data.
          </p>

          <div className="space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition duration-300"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="border border-blue-700 text-blue-700 px-6 py-3 rounded-xl hover:bg-blue-100 transition duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="/image excel.jpeg"
            alt="Excel Analysis"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
