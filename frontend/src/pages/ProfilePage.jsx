import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white shadow-md rounded-xl p-6">
      <div className="flex flex-col items-center">
        <img
          src={user.avatar || "https://via.placeholder.com/120"}
          alt="avatar"
          className="w-28 h-28 rounded-full border mb-4 object-cover"
        />
        <h2 className="text-2xl font-semibold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>

        <div className="mt-4 text-sm text-gray-500">
          <p>Account Created: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
