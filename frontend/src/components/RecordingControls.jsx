import React, { useState, useRef } from "react";
import axios from "axios";

const RecordingControls = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef(null);

  // 🔹 Start recording using the camera & mic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      const localChunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) localChunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(localChunks, { type: "video/webm" });
        await uploadRecording(blob);
        setChunks([]);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setChunks(localChunks);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Failed to access camera or mic. Check permissions.");
    }
  };

  // 🔹 Stop recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  // 🔹 Upload recording to backend
  const uploadRecording = async (blob) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("recording", blob, "session.webm");

      const response = await axios.post("/api/recordings/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`✅ Uploaded successfully! Playback URL: ${response.data.playbackUrl}`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card bg-base-200 p-6 my-8">
      <h3 className="text-lg font-semibold mb-4">🎥 Recording Controls</h3>
      <video ref={videoRef} className="rounded-lg w-full mb-4" muted />
      <div className="flex gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={uploading}
            className="btn btn-success"
          >
            Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} className="btn btn-error">
            Stop Recording
          </button>
        )}
        {uploading && <span className="loading loading-spinner"></span>}
      </div>
    </div>
  );
};

export default RecordingControls;
