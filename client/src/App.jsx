import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./index.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [language, setLanguage] = useState("en");
  const [output, setOutput] = useState("Say a command or press a button to start.");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const languageRef = useRef("en");

  useEffect(() => {
    startCamera();
    startVoiceRecognition();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setOutput("Camera access denied. Please allow camera permission.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
  };

  const captureFrame = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 800, 600);
    return canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
  };

  const speak = (text, lang) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    if (lang === "hi") {
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang === "hi-IN");
      if (hindiVoice) {
        utter.voice = hindiVoice;
        utter.lang = "hi-IN";
      } else {
        utter.lang = "hi-IN";
      }
    } else {
      utter.lang = "en-US";
    }
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    languageRef.current = lang;
  };

  const callAPI = async (endpoint) => {
    const currentLang = languageRef.current;
    setLoading(true);
    setOutput("Analyzing... please wait.");
    speak("Analyzing, please wait.", currentLang);
    try {
      const image = captureFrame();
      const res = await axios.post(`${API_URL}/api/${endpoint}`, {
        image,
        language: currentLang
      });
      const text = res.data.description;
      setOutput(text);
      speak(text, currentLang);
    } catch {
      setOutput("Something went wrong. Please try again.");
      speak("Something went wrong. Please try again.", "en");
    }
    setLoading(false);
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      recognition.start();
    };
    recognition.onresult = (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.toLowerCase().trim();
      if (transcript.includes("describe")) callAPI("describe");
      else if (transcript.includes("read")) callAPI("document");
      else if (transcript.includes("simplify")) callAPI("simplify");
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div className="app">
      <h1>👁 Sarthial</h1>
      <p className="subtitle">AI Accessibility Assistant</p>

      <div className="lang-toggle">
        <button
          onClick={() => handleLanguageChange("en")}
          className={language === "en" ? "active" : ""}
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageChange("hi")}
          className={language === "hi" ? "active" : ""}
        >
          HI
        </button>
      </div>

      {/* Neon Eyes Above Camera */}
      <div className="eyes-bg">
        <div className="neon-eye">
          <div className="neon-eye-wrap">
            <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10,30 Q60,-20 110,30 Q60,80 10,30 Z"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <div className="pupil-dot"></div>
        </div>
        <div className="neon-eye">
          <div className="neon-eye-wrap">
            <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10,30 Q60,-20 110,30 Q60,80 10,30 Z"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <div className="pupil-dot"></div>
        </div>
      </div>

      {/* Camera */}
      <div className="camera-box">
        <video ref={videoRef} autoPlay playsInline muted />
      </div>

      <div className="output-box">
        <p className={loading ? "analyzing" : ""}>
          {loading ? "⏳ Analyzing..." : output}
        </p>
      </div>

      <div className={`status ${listening ? "active" : ""}`}>
        {listening ? "🎙 Listening..." : "🔇 Mic off"}
      </div>

      <div className="buttons">
        <button onClick={() => callAPI("describe")}>👁 Describe</button>
        <button onClick={() => callAPI("document")}>📄 Read</button>
        <button onClick={() => callAPI("simplify")}>✨ Simplify</button>
      </div>
    </div>
  );
}

export default App;