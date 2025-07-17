import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { PollyExperience } from "./components/PollyExperience";
import { Loader } from "@react-three/drei";
import { LipSyncPlayer } from "./components/LipSyncPlayer";
import { VISEMES } from "wawa-lipsync";

// Example data that would come from AWS Polly
const audioUrl = "/audios/test_kor.mp3";
const visemes = [
  {"time":6,"type":"viseme","value":VISEMES.aa},
  {"time":81,"type":"viseme","value":VISEMES.DD},
  {"time":119,"type":"viseme","value":VISEMES.DD},
  {"time":183,"type":"viseme","value":VISEMES.I},
  {"time":233,"type":"viseme","value":VISEMES.E},
  {"time":283,"type":"viseme","value":VISEMES.kk},
  {"time":358,"type":"viseme","value":VISEMES.aa},
  {"time":423,"type":"viseme","value":VISEMES.SS},
  {"time":521,"type":"viseme","value":VISEMES.E},
  {"time":619,"type":"viseme","value":VISEMES.I},
  {"time":661,"type":"viseme","value":VISEMES.O},
  {"time":850,"type":"viseme","value":VISEMES.sil},
  {"time":1039,"type":"viseme","value":VISEMES.O},
  {"time":1168,"type":"viseme","value":VISEMES.CH},
  {"time":1235,"type":"viseme","value":VISEMES.I},
  {"time":1293,"type":"viseme","value":VISEMES.PP},
  {"time":1411,"type":"viseme","value":VISEMES.aa},
  {"time":1472,"type":"viseme","value":VISEMES.DD},
  {"time":1507,"type":"viseme","value":VISEMES.DD},
  {"time":1546,"type":"viseme","value":VISEMES.I},
  {"time":1617,"type":"viseme","value":VISEMES.DD},
  {"time":1665,"type":"viseme","value":VISEMES.O},
  {"time":1754,"type":"viseme","value":VISEMES.SS},
  {"time":1840,"type":"viseme","value":VISEMES.E},
  {"time":1870,"type":"viseme","value":VISEMES.kk},
  {"time":1929,"type":"viseme","value":VISEMES.SS},
  {"time":2006,"type":"viseme","value":VISEMES.E},
  {"time":2074,"type":"viseme","value":VISEMES.kk},
  {"time":2134,"type":"viseme","value":VISEMES.aa},
  {"time":2196,"type":"viseme","value":VISEMES.DD},
  {"time":2251,"type":"viseme","value":VISEMES.I},
  {"time":2311,"type":"viseme","value":VISEMES.PP},
  {"time":2376,"type":"viseme","value":VISEMES.SS},
  {"time":2452,"type":"viseme","value":VISEMES.E},
  {"time":2515,"type":"viseme","value":VISEMES.kk},
  {"time":2587,"type":"viseme","value":VISEMES.I},
  {"time":2630,"type":"viseme","value":VISEMES.PP},
  {"time":2680,"type":"viseme","value":VISEMES.DD},
  {"time":2717,"type":"viseme","value":VISEMES.I},
  {"time":2776,"type":"viseme","value":VISEMES.DD},
  {"time":2868,"type":"viseme","value":VISEMES.aa},
  {"time":3151,"type":"viseme","value":VISEMES.sil},
  {"time":3545,"type":"viseme","value":VISEMES.PP},
  {"time":3638,"type":"viseme","value":VISEMES.E},
  {"time":3715,"type":"viseme","value":VISEMES.SS},
  {"time":3793,"type":"viseme","value":VISEMES.I},
  {"time":3839,"type":"viseme","value":VISEMES.DD},
  {"time":3939,"type":"viseme","value":VISEMES.I},
  {"time":4003,"type":"viseme","value":VISEMES.DD},
  {"time":4112,"type":"viseme","value":VISEMES.aa},
  {"time":4238,"type":"viseme","value":VISEMES.I},
  {"time":4301,"type":"viseme","value":VISEMES.PP},
  {"time":4465,"type":"viseme","value":VISEMES.sil},
  {"time":4858,"type":"viseme","value":VISEMES.kk},
  {"time":4920,"type":"viseme","value":VISEMES.E},
  {"time":4967,"type":"viseme","value":VISEMES.DD},
  {"time":5031,"type":"viseme","value":VISEMES.DD},
  {"time":5060,"type":"viseme","value":VISEMES.O},
  {"time":5181,"type":"viseme","value":VISEMES.U},
  {"time":5249,"type":"viseme","value":VISEMES.E},
  {"time":5288,"type":"viseme","value":VISEMES.DD},
  {"time":5356,"type":"viseme","value":VISEMES.DD},
  {"time":5419,"type":"viseme","value":VISEMES.I},
  {"time":5668,"type":"viseme","value":VISEMES.sil},
  {"time":6062,"type":"viseme","value":VISEMES.SS},
  {"time":6184,"type":"viseme","value":VISEMES.aa},
  {"time":6242,"type":"viseme","value":VISEMES.DD},
  {"time":6291,"type":"viseme","value":VISEMES.I},
  {"time":6332,"type":"viseme","value":VISEMES.kk},
  {"time":6388,"type":"viseme","value":VISEMES.kk},
  {"time":6441,"type":"viseme","value":VISEMES.E},
  {"time":6552,"type":"viseme","value":VISEMES.kk},
  {"time":6598,"type":"viseme","value":VISEMES.I},
  {"time":6627,"type":"viseme","value":VISEMES.PP},
  {"time":6726,"type":"viseme","value":VISEMES.DD},
  {"time":6769,"type":"viseme","value":VISEMES.I},
  {"time":6830,"type":"viseme","value":VISEMES.DD},
  {"time":6905,"type":"viseme","value":VISEMES.E},
  {"time":7046,"type":"viseme","value":VISEMES.I},
  {"time":7235,"type":"viseme","value":VISEMES.O},
  {"time":7385,"type":"viseme","value":VISEMES.sil},
  {"time":7778,"type":"viseme","value":VISEMES.kk},
  {"time":7856,"type":"viseme","value":VISEMES.E},
  {"time":7935,"type":"viseme","value":VISEMES.I},
  {"time":8026,"type":"viseme","value":VISEMES.kk},
  {"time":8176,"type":"viseme","value":VISEMES.I},
  {"time":8214,"type":"viseme","value":VISEMES.DD},
  {"time":8256,"type":"viseme","value":VISEMES.I},
  {"time":8289,"type":"viseme","value":VISEMES.DD},
  {"time":8371,"type":"viseme","value":VISEMES.PP},
  {"time":8426,"type":"viseme","value":VISEMES.E},
  {"time":8498,"type":"viseme","value":VISEMES.kk},
  {"time":8595,"type":"viseme","value":VISEMES.O},
  {"time":8652,"type":"viseme","value":VISEMES.SS},
  {"time":8730,"type":"viseme","value":VISEMES.I},
  {"time":8771,"type":"viseme","value":VISEMES.PP},
  {"time":8924,"type":"viseme","value":VISEMES.E},
  {"time":9130,"type":"viseme","value":VISEMES.sil},
  {"time":9524,"type":"viseme","value":VISEMES.aa},
  {"time":9657,"type":"viseme","value":VISEMES.DD},
  {"time":9731,"type":"viseme","value":VISEMES.I},
  {"time":10088,"type":"viseme","value":VISEMES.sil},
  {"time":10482,"type":"viseme","value":VISEMES.DD},
  {"time":10554,"type":"viseme","value":VISEMES.I},
  {"time":10596,"type":"viseme","value":VISEMES.DD},
  {"time":10641,"type":"viseme","value":VISEMES.aa},
  {"time":10694,"type":"viseme","value":VISEMES.DD},
  {"time":10725,"type":"viseme","value":VISEMES.DD},
  {"time":10775,"type":"viseme","value":VISEMES.aa},
  {"time":10835,"type":"viseme","value":VISEMES.DD},
  {"time":10880,"type":"viseme","value":VISEMES.DD},
  {"time":10980,"type":"viseme","value":VISEMES.aa},
  {"time":11190,"type":"viseme","value":VISEMES.sil},
  {"time":11584,"type":"viseme","value":VISEMES.DD},
  {"time":11621,"type":"viseme","value":VISEMES.I},
  {"time":11715,"type":"viseme","value":VISEMES.DD},
  {"time":11753,"type":"viseme","value":VISEMES.I},
  {"time":11828,"type":"viseme","value":VISEMES.DD},
  {"time":11877,"type":"viseme","value":VISEMES.DD},
  {"time":11927,"type":"viseme","value":VISEMES.I},
  {"time":12178,"type":"viseme","value":VISEMES.sil},
  {"time":12572,"type":"viseme","value":VISEMES.SS},
  {"time":12720,"type":"viseme","value":VISEMES.aa},
  {"time":12757,"type":"viseme","value":VISEMES.DD},
  {"time":12795,"type":"viseme","value":VISEMES.U},
  {"time":12844,"type":"viseme","value":VISEMES.DD},
  {"time":12913,"type":"viseme","value":VISEMES.O},
  {"time":13091,"type":"viseme","value":VISEMES.PP},
  {"time":13319,"type":"viseme","value":VISEMES.sil}
];

function PollyApp() {
  const [viseme, setViseme] = useState(VISEMES.sil);

  return (
    <>
      <Loader />
      <LipSyncPlayer 
        audioUrl={audioUrl} 
        visemes={visemes} 
        onVisemeChange={setViseme} 
      />
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
