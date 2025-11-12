import React from "react";
import RecordingControls from "../components/RecordingControls";
import { Link } from "react-router-dom";

const RecordingPage = () => {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center p-8">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🎥 Video Recording</h1>
          <Link
            to="/"
            className="btn btn-outline btn-sm"
          >
            ← Back to Home
          </Link>
        </div>

        <p className="opacity-70 mb-6">
          Record your camera and microphone sessions, then automatically upload them to the server.
        </p>

        <RecordingControls />
      </div>
    </div>
  );
};

export default RecordingPage;
