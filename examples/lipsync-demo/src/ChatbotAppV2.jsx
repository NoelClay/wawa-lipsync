import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { Loader } from "@react-three/drei";
import { PollyExperience } from "./components/PollyExperience";
import { HybridPlayer } from "./components/HybridPlayer"; // HybridPlayer import
import { VISEMES } from "wawa-lipsync";

// Polly Viseme을 wawa-lipsync VISEMES로 매핑하는 개선된 테이블
const pollyToWawaVisemeMap = {
  // --- 자음 (Consonants) ---
  // 입술을 닫는 소리
  'p': VISEMES.PP, 'b': VISEMES.PP, 'm': VISEMES.PP,

  // 혀끝을 윗잇몸에 대는 소리
  't': VISEMES.DD, 'd': VISEMES.DD,

  // 혀끝을 윗잇몸에 대는 비음/설측음 (개선된 매핑)
  'n': VISEMES.nn, 'l': VISEMES.nn,

  // 목구멍 안쪽에서 내는 소리
  'k': VISEMES.kk, 'g': VISEMES.kk, 'h': VISEMES.kk, 'N': VISEMES.kk,

  // 윗니와 아랫입술을 사용하는 소리
  'f': VISEMES.FF, 'v': VISEMES.FF,

  // 혀를 이 사이에 넣는 소리
  'T': VISEMES.TH, 'D': VISEMES.TH,

  // 혀와 잇몸의 마찰 소리
  's': VISEMES.SS, 'z': VISEMES.SS,

  // 혀를 입천장에 넓게 대는 소리
  'S': VISEMES.CH, 'Z': VISEMES.CH, 'tS': VISEMES.CH, 'dZ': VISEMES.CH,

  // 혀를 말아 올리는 소리
  'r': VISEMES.RR,

  // --- 모음 (Vowels) & 반모음 (Glides) ---
  // 입을 크게 벌리는 소리 (ah, ay, ow)
  'a': VISEMES.aa, 'A': VISEMES.aa, '@': VISEMES.aa, 'aI': VISEMES.aa, 'aU': VISEMES.aa,

  // 입을 옆으로 벌리는 소리 (eh, ae)
  'e': VISEMES.E,  'E': VISEMES.E,  'V': VISEMES.E,

  // 입을 좁게 벌리는 소리 (ee, ih, y)
  'i': VISEMES.I,  'I': VISEMES.I, 'j': VISEMES.I,

  // 입술을 둥글게 모으는 소리 (oh, oy)
  'o': VISEMES.O,  'O': VISEMES.O, 'oU': VISEMES.O, 'OI': VISEMES.O,

  // 입술을 앞으로 내미는 소리 (oo, uh, w)
  'u': VISEMES.U,  'U': VISEMES.U, 'w': VISEMES.U,

  // --- 기타 ---
  // 무음
  'sil': VISEMES.sil,

  // 일부 X-SAMPA 값 호환성 유지
  // 참고: 아래 값들은 표준 Polly 음소는 아니지만, 호환성을 위해 유지할 수 있습니다.
  '{': VISEMES.aa, // 'cat'의 'a'와 유사
  'eI': VISEMES.E,  // 'say'의 'ei'
  '3`': VISEMES.E, // 'nurse'의 'ur'
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
