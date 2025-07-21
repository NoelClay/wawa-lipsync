import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { Loader } from "@react-three/drei";
import { PollyExperience } from "./components/PollyExperience";
import { HybridPlayer } from "./components/HybridPlayer"; // HybridPlayer import
import { VISEMES } from "wawa-lipsync";

// Polly Viseme을 wawa-lipsync VISEMES로 매핑하는 테이블
const pollyToWawaVisemeMap = {
  'p': VISEMES.PP, 'b': VISEMES.PP, 'm': VISEMES.PP,
  't': VISEMES.DD, 'd': VISEMES.DD, 'n': VISEMES.DD,
  'k': VISEMES.kk, 'g': VISEMES.kk, 'h': VISEMES.kk, 'N': VISEMES.kk,
  'f': VISEMES.FF, 'v': VISEMES.FF,
  'T': VISEMES.TH, 'D': VISEMES.TH,
  's': VISEMES.SS, 'z': VISEMES.SS,
  'S': VISEMES.CH, 'dZ': VISEMES.CH, 'tS': VISEMES.CH, 'Z': VISEMES.CH,
  'l': VISEMES.nn,
  'r': VISEMES.RR, 'r': VISEMES.RR,
  'a': VISEMES.aa, 'A': VISEMES.aa, '@': VISEMES.aa, '{': VISEMES.aa, 'aI': VISEMES.aa, 'aU': VISEMES.aa,
  'e': VISEMES.E,  'E': VISEMES.E,  'V': VISEMES.E, 'eI': VISEMES.E, '3`': VISEMES.E,
  'i': VISEMES.I,  'I': VISEMES.I, 'j': VISEMES.I,
  'o': VISEMES.O,  'O': VISEMES.O, 'oU': VISEMES.O, 'OI': VISEMES.O,
  'u': VISEMES.U,  'U': VISEMES.U, 'w': VISEMES.U,
  'sil': VISEMES.sil,
  // X-SAMPA에만 있는 일부 값 추가
  '@`': VISEMES.aa,
};

function ChatbotAppV2() {
  const [viseme, setViseme] = useState(VISEMES.sil);
  const [amplitude, setAmplitude] = useState(0); // amplitude 상태 추가
  const [audioUrl, setAudioUrl] = useState(null);
  const [visemes, setVisemes] = useState([]);
  const [text, setText] = useState("Hello, this is a test message.");

  const handleSendMessage = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const { audio: audio_base64, visemes: rawVisemes } = data;

      // Base64 오디오 디코딩
      const audioBlob = new Blob([Uint8Array.from(atob(audio_base64), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Viseme 매핑
      const mappedVisemes = rawVisemes.map(item => ({
        ...item,
        value: pollyToWawaVisemeMap[item.value] || VISEMES.sil,
      }));

      setVisemes(mappedVisemes);
      setAudioUrl(audioUrl);

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <Loader />
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, background: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px' }}>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          style={{ width: '350px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
          placeholder="Enter text to speak..."
        />
        <button onClick={handleSendMessage} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
          Send
        </button>
      </div>

      {audioUrl && visemes.length > 0 && (
        <HybridPlayer 
          audioUrl={audioUrl} 
          visemes={visemes} 
          onVisemeChange={setViseme} 
          onAmplitudeChange={setAmplitude} // amplitude 전달
        />
      )}

      <div className="flex-1 bg-gradient-to-b from-green-400 to-green-200 h-full w-full absolute">
        <Canvas shadows camera={{ position: [0, 1.7, 2.5], fov: 45 }}>
          <Suspense>
            <PollyExperience viseme={viseme} amplitude={amplitude} /> {/* amplitude 전달 */}
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default ChatbotAppV2;
