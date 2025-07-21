import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { PollyExperience } from "./components/PollyExperience";
import { Loader } from "@react-three/drei";
import { LipSyncPlayer } from "./components/LipSyncPlayer";
import { VISEMES } from "wawa-lipsync";

const audioUrl = "/audios/response.mp3";
const visemeUrl = "/viseme/response.json";

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

function PollyApp() {
  const [viseme, setViseme] = useState(VISEMES.sil);
  const [visemes, setVisemes] = useState([]);

  useEffect(() => {
    const fetchAndMapVisemes = async () => {
      try {
        const response = await fetch(visemeUrl);
        const text = await response.text();
        const rawVisemes = text.trim().split('\n').map(line => JSON.parse(line));

        // 매핑 로직 적용
        const mappedVisemes = rawVisemes.map(item => {
          const wawaViseme = pollyToWawaVisemeMap[item.value] || VISEMES.sil;
          return { ...item, value: wawaViseme };
        });

        setVisemes(mappedVisemes);
      } catch (error) {
        console.error("Viseme 데이터를 불러오고 매핑하는 데 실패했습니다:", error);
      }
    };

    fetchAndMapVisemes();
  }, []);

  return (
    <>
      <Loader />
      {visemes.length > 0 ? (
        <LipSyncPlayer 
          audioUrl={audioUrl} 
          visemes={visemes} 
          onVisemeChange={setViseme} 
        />
      ) : (
        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, color: 'white' }}>
          Viseme 데이터 로딩 및 매핑 중...
        </div>
      )}
      <div className="flex-1 bg-gradient-to-b from-blue-400 to-blue-200 h-full w-full absolute">
        <Canvas shadows camera={{ position: [0, 1.7, 2], fov: 45 }}>
          <Suspense>
            <PollyExperience viseme={viseme} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default PollyApp;

