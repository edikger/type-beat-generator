import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";

export default function Home() {
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState({
    videoWidth: 1920,
    videoHeight: 1080,
    backgroundColor: "#000000",
    addWaveform: false,
    waveformColor: "#ffffff",
    addTitle: false,
    title: "Type Beat",
    titleColor: "#ffffff",
    titleFont: "Arial",
    titleSize: 40,
    imageEffect: "none", // 'none', 'pulse', 'slowZoom'
  });

  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes("audio")) {
      setAudioFile(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes("image")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generateVideo = async () => {
    if (!audioFile || !imageFile) {
      alert("Please select both audio and image files");
      return;
    }

    setGenerating(true);
    setProgress(0);

    try {
      // Create an offscreen audio element with the selected audio file
      const audioEl = document.createElement("audio");
      audioEl.src = URL.createObjectURL(audioFile);
      audioRef.current = audioEl;

      // Wait for audio metadata to load
      await new Promise((resolve) => {
        audioEl.addEventListener("loadedmetadata", resolve);
        audioEl.load();
      });

      // Set up canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = settings.videoWidth;
      canvas.height = settings.videoHeight;

      // Load image
      const img = new Image();
      img.src = imagePreview;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Set up media recorder with audio track from audio element
      const canvasStream = canvas.captureStream(30);

      // Use audio element to get audio track
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const audioDestination = audioContext.createMediaStreamDestination();
      const audioSource = audioContext.createMediaElementSource(audioEl);

      // Create analyzer for waveform if needed
      let analyser, dataArray;
      if (settings.addWaveform) {
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        audioSource.connect(analyser);
        analyser.connect(audioDestination);
      } else {
        audioSource.connect(audioDestination);
      }

      // Combine video stream from canvas with audio stream
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks(),
      ]);

      // Set up media recorder with combined stream
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: "video/webm",
        videoBitsPerSecond: 5000000,
      });

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);
        setGenerating(false);
        setProgress(100);
      };

      // Start recording
      mediaRecorder.start(100);
      audioEl.currentTime = 0;
      audioEl.play();

      // Animation function
      const draw = () => {
        if (audioEl.ended || audioEl.paused) {
          mediaRecorder.stop();
          cancelAnimationFrame(animationRef.current);
          return;
        }

        // Clear canvas with background color
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate image positioning (centered with black bars)
        const imgSize = Math.min(settings.videoHeight, settings.videoHeight);
        const imgX = (settings.videoWidth - imgSize) / 2;
        const imgY = (settings.videoHeight - imgSize) / 2;

        // Apply image effects
        let scale = 1;
        if (settings.imageEffect === "pulse") {
          const time = audioEl.currentTime;
          scale = 1 + Math.sin(time * 2) * 0.02;
        } else if (settings.imageEffect === "slowZoom") {
          const progress = audioEl.currentTime / audioEl.duration;
          scale = 1 + progress * 0.1;
        }

        // Draw the image
        const drawWidth = imgSize * scale;
        const drawHeight = imgSize * scale;
        const drawX = imgX - (drawWidth - imgSize) / 2;
        const drawY = imgY - (drawHeight - imgSize) / 2;
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

        // Draw waveform if enabled
        if (settings.addWaveform && analyser) {
          analyser.getByteFrequencyData(dataArray);

          const barWidth = 4;
          const barSpacing = 2;
          const barCount = Math.floor(
            settings.videoWidth / (barWidth + barSpacing)
          );
          const barHeightMultiplier = settings.videoHeight / 512;

          ctx.fillStyle = settings.waveformColor;

          for (let i = 0; i < barCount; i++) {
            const index = Math.floor((i * dataArray.length) / barCount);
            const value = dataArray[index];
            const barHeight = value * barHeightMultiplier;
            const x = i * (barWidth + barSpacing);
            const y = settings.videoHeight - barHeight;

            // Draw bars at bottom of video
            ctx.fillRect(x, y, barWidth, barHeight);
          }
        }

        // Draw title if enabled
        if (settings.addTitle) {
          ctx.fillStyle = settings.titleColor;
          ctx.font = `${settings.titleSize}px ${settings.titleFont}`;
          ctx.textAlign = "center";
          ctx.fillText(settings.title, settings.videoWidth / 2, 80);
        }

        // Update progress
        const currentProgress = Math.floor(
          (audioEl.currentTime / audioEl.duration) * 100
        );
        setProgress(currentProgress);

        animationRef.current = requestAnimationFrame(draw);
      };

      animationRef.current = requestAnimationFrame(draw);

      // Handle end of audio
      audioEl.addEventListener("ended", () => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
        cancelAnimationFrame(animationRef.current);
      });
    } catch (error) {
      console.error("Error generating video:", error);
      setGenerating(false);
      alert("Error generating video: " + error.message);
    }
  };

  return (
    <Layout>
      <Head>
        <title>
          Type Beat Video Generator - Create YouTube Music Videos Easily
        </title>
        <meta
          name="description"
          content="Create professional type beat videos for YouTube with custom audio, images, waveform visualizations and effects - all in your browser."
        />
        <meta
          name="keywords"
          content="type beat, video generator, youtube music videos, audio visualizer, music producer tools"
        />
      </Head>

      <h1 className="text-4xl font-bold text-center mb-8">
        Type Beat Video Generator
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* File Upload Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Upload Files</h2>

          <div className="space-y-6">
            <div>
              <label className="block mb-2">Audio Track (MP3)</label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                className="w-full p-2 bg-gray-700 rounded cursor-pointer"
              />
              {audioFile && (
                <p className="mt-2 text-green-400">✓ {audioFile.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">
                Cover Image (1024×1024 recommended)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 bg-gray-700 rounded cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-green-400 mb-2">✓ {imageFile.name}</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-40 object-cover mx-auto"
                  />
                </div>
              )}
            </div>

            <button
              onClick={generateVideo}
              disabled={generating || !audioFile || !imageFile}
              className={`w-full py-3 rounded-lg font-bold 
                ${
                  generating || !audioFile || !imageFile
                    ? "bg-gray-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {generating ? "Generating..." : "Generate Video"}
            </button>

            {generating && (
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center mt-2">{progress}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Video Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1">Background Color</label>
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) =>
                  handleSettingChange("backgroundColor", e.target.value)
                }
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="addWaveform"
                checked={settings.addWaveform}
                onChange={(e) =>
                  handleSettingChange("addWaveform", e.target.checked)
                }
                className="mr-2 h-5 w-5"
              />
              <label htmlFor="addWaveform">Add Audio Waveform</label>
            </div>

            {settings.addWaveform && (
              <div>
                <label className="block mb-1">Waveform Color</label>
                <input
                  type="color"
                  value={settings.waveformColor}
                  onChange={(e) =>
                    handleSettingChange("waveformColor", e.target.value)
                  }
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="addTitle"
                checked={settings.addTitle}
                onChange={(e) =>
                  handleSettingChange("addTitle", e.target.checked)
                }
                className="mr-2 h-5 w-5"
              />
              <label htmlFor="addTitle">Add Title Text</label>
            </div>

            {settings.addTitle && (
              <div className="space-y-3">
                <div>
                  <label className="block mb-1">Title Text</label>
                  <input
                    type="text"
                    value={settings.title}
                    onChange={(e) =>
                      handleSettingChange("title", e.target.value)
                    }
                    className="w-full p-2 bg-gray-700 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">Title Color</label>
                  <input
                    type="color"
                    value={settings.titleColor}
                    onChange={(e) =>
                      handleSettingChange("titleColor", e.target.value)
                    }
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block mb-1">Title Size</label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={settings.titleSize}
                    onChange={(e) =>
                      handleSettingChange("titleSize", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                  <span>{settings.titleSize}px</span>
                </div>
              </div>
            )}

            <div>
              <label className="block mb-1">Image Effect</label>
              <select
                value={settings.imageEffect}
                onChange={(e) =>
                  handleSettingChange("imageEffect", e.target.value)
                }
                className="w-full p-2 bg-gray-700 rounded"
              >
                <option value="none">None</option>
                <option value="pulse">Pulse</option>
                <option value="slowZoom">Slow Zoom</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Video Resolution</label>
              <select
                value={`${settings.videoWidth}x${settings.videoHeight}`}
                onChange={(e) => {
                  const [width, height] = e.target.value.split("x").map(Number);
                  handleSettingChange("videoWidth", width);
                  handleSettingChange("videoHeight", height);
                }}
                className="w-full p-2 bg-gray-700 rounded"
              >
                <option value="1280x720">HD (1280×720)</option>
                <option value="1920x1080">Full HD (1920×1080)</option>
                <option value="2560x1440">2K (2560×1440)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview/Output Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Output</h2>

          {videoBlob ? (
            <div className="space-y-4">
              <div>
                <video
                  src={URL.createObjectURL(videoBlob)}
                  controls
                  className="w-full rounded"
                ></video>
              </div>

              <div>
                <a
                  href={URL.createObjectURL(videoBlob)}
                  download="type-beat-video.webm"
                  className="block w-full py-3 bg-green-600 hover:bg-green-700 text-center rounded-lg font-bold"
                >
                  Download Video
                </a>
              </div>

              <p className="text-sm text-gray-400 mt-2">
                Note: The video is in WebM format. For YouTube upload, this
                format is directly supported. If you need other formats,
                consider converting the file after download.
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <svg
                className="w-24 h-24 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-center">
                {generating
                  ? "Generating your video..."
                  : "Your video preview will appear here after generation"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
