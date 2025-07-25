# Wawa Lipsync - Developer Handover Guide

## 📋 Current System Overview

### **Core Features**
1. **Real-time Lip Synchronization** - Analyzes audio frequency bands to detect mouth shapes
2. **Pre-computed Viseme Playback** - Uses AWS Polly timing data for accurate speech animation
3. **Hybrid Animation System** - Combines real-time audio analysis with pre-timed viseme data
4. **Dynamic Amplitude Control** - Audio volume affects mouth movement intensity
5. **3D Character Animation** - Morph target-based facial animation using Three.js

### **Tech Stack**
- **Core Library**: TypeScript (`packages/wawa-lipsync/`)
- **Demo App**: React + Vite + Three.js (`examples/lipsync-demo/`)
- **3D Engine**: React Three Fiber + Drei
- **Audio Processing**: Web Audio API
- **Character Format**: GLTF/GLB with morph targets

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Audio Input   │───▶│  Lipsync Engine  │───▶│  3D Character   │
│  (HTML Audio)   │    │ (Feature Extract)│    │ (Morph Targets) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AWS Polly     │───▶│  HybridPlayer    │───▶│  Animation      │
│ (Viseme Timing) │    │  (Coordinator)   │    │   System        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **Key Components**
1. **Lipsync Class** (`packages/wawa-lipsync/src/lipsync.ts`) - Core audio analysis
2. **HybridPlayer** (`examples/lipsync-demo/src/components/HybridPlayer.jsx`) - Coordination layer
3. **PollyAvatar** (`examples/lipsync-demo/src/components/PollyAvatar.jsx`) - 3D character controller
4. **ChatbotAppV2** (`examples/lipsync-demo/src/ChatbotAppV2.jsx`) - Main application

---

## 🔧 Common Modification Scenarios

### **1. Adding New Visemes**

**📂 Where to modify:**
- `packages/wawa-lipsync/src/visemes.ts` - Add new viseme enum
- `examples/lipsync-demo/src/ChatbotAppV2.jsx` - Update mapping table (lines 9-64)
- `examples/lipsync-demo/src/components/PollyAvatar.jsx` - Update animation logic (lines 120-125)

**📝 Steps:**
```typescript
// 1. Add to visemes.ts
enum VISEMES {
  // ... existing visemes
  NEW_VISEME = "viseme_NEW_VISEME",
}

// 2. Update mapping in ChatbotAppV2.jsx
const pollyToWawaVisemeMap = {
  // ... existing mappings
  'new_sound': VISEMES.NEW_VISEME,
};

// 3. Ensure 3D model has matching morph target named "viseme_NEW_VISEME"
```

### **2. Adjusting Animation Intensity**

**📂 Where to modify:**
- `examples/lipsync-demo/src/components/PollyAvatar.jsx` (lines 108-114)

**📝 Parameter explanations:**
```javascript
const baseInfluence = 0.6;           // Base mouth movement (0.0 = invisible, 1.0 = normal)
const dynamicInfluence = amplitude * 1.0; // Audio multiplier (higher = more dramatic)
const maxInfluence = 3.0;            // Maximum exaggeration limit
```

### **3. Changing Animation Smoothness**

**📂 Where to modify:**
- `examples/lipsync-demo/src/components/PollyAvatar.jsx` (line 117, 124)

**📝 Speed control:**
```javascript
lerpMorphTarget(viseme, targetInfluence, 0.2); // 0.1 = slower, 0.5 = faster
```

### **4. Modifying Audio Analysis**

**📂 Where to modify:**
- `packages/wawa-lipsync/src/lipsync.ts` (lines 75-83 for frequency bands)

**📝 Frequency band adjustment:**
```javascript
this.bands = [
  { start: 50, end: 200 },    // Low frequencies - affect jaw movement
  { start: 200, end: 400 },   // F1 formant - vowel detection
  { start: 400, end: 800 },   // F1 mid - tongue position
  // ... modify ranges for different sensitivity
];
```

### **5. Adding New TTS Providers**

**📂 Where to modify:**
- `examples/lipsync-demo/src/ChatbotAppV2.jsx` (lines 72-85 for API call)
- Create new mapping table for different phoneme formats

**📝 Template:**
```javascript
// Add new provider mapping
const newProviderToWawaVisemeMap = {
  'provider_phoneme1': VISEMES.PP,
  'provider_phoneme2': VISEMES.FF,
  // ... map all provider phonemes to wawa visemes
};

// Update API call
const response = await fetch('http://new-provider-endpoint', {
  // ... new provider configuration
});
```

---

## 🎭 Character Replacement Guide

### **3D Model Requirements**

**✅ Must Have:**
1. **GLTF/GLB format** with embedded morph targets
2. **Exact morph target names** matching `VISEMES` enum:
   ```
   viseme_sil, viseme_PP, viseme_FF, viseme_TH, viseme_DD,
   viseme_kk, viseme_CH, viseme_SS, viseme_nn, viseme_RR,
   viseme_aa, viseme_E, viseme_I, viseme_O, viseme_U
   ```
3. **Head mesh named** `Wolf3D_Head` (or update reference in `PollyAvatar.jsx:193`)
4. **Skeleton structure** compatible with animations

### **Replacement Steps**

**📂 Files to update:**
1. Replace model file in `examples/lipsync-demo/public/models/`
2. Update `examples/lipsync-demo/src/components/PollyAvatar.jsx`:

```javascript
// Line 18-20: Update model path
const { nodes, materials, scene } = useGLTF(
  "/models/YOUR_NEW_MODEL.glb"  // Change this
);

// Lines 145-209: Update mesh names if different
<skinnedMesh
  name="YOUR_HEAD_MESH_NAME"     // Update if different from Wolf3D_Head
  geometry={nodes.YOUR_HEAD_MESH_NAME.geometry}
  // ... rest of configuration
/>
```

### **⚠️ Critical Notes**
- **Morph target names must match exactly** - case sensitive
- **Vertex count must remain consistent** across all morph targets
- **Mesh topology** should not change between base and morph targets
- **Test all 15 visemes** before deployment

---

## 🤖 VRM Integration Considerations

### **Current System vs VRM**

| Aspect | Current (GLTF) | VRM Format |
|--------|----------------|------------|
| Format | `.glb` files | `.vrm` files |
| Morph Targets | Custom names | BlendShape names |
| Loading | `useGLTF` hook | VRM-specific loader |
| Animation | Direct morph target access | BlendShape proxy |

### **Required Changes for VRM**

**📂 New dependencies needed:**
```bash
npm install @pixiv/three-vrm
```

**📂 Files requiring major updates:**

#### **1. PollyAvatar.jsx - Complete rewrite needed**
```javascript
// Current: Direct morph target access
child.morphTargetInfluences[index] = value;

// VRM: BlendShape proxy access
vrmModel.blendShapeProxy.setValue('viseme_aa', value);
```

#### **2. VRM BlendShape Mapping**
VRM uses different naming conventions:
```javascript
// Create mapping from wawa visemes to VRM blendshapes
const wawaToVrmBlendShapeMap = {
  [VISEMES.sil]: 'neutral',
  [VISEMES.aa]: 'a',
  [VISEMES.I]: 'i',
  [VISEMES.U]: 'u',
  [VISEMES.E]: 'e',
  [VISEMES.O]: 'o',
  // ... map all 15 visemes
};
```

#### **3. Loader Changes**
```javascript
// Replace useGLTF with VRM loader
import { VRM } from '@pixiv/three-vrm';

const loadVRM = async (url) => {
  const gltf = await new GLTFLoader().loadAsync(url);
  const vrm = await VRM.from(gltf);
  return vrm;
};
```

### **VRM Implementation Strategy**

**🔄 Migration Path:**
1. **Phase 1**: Create VRM-compatible component alongside existing system
2. **Phase 2**: Implement dual-format support with feature flags
3. **Phase 3**: Test thoroughly with VRM avatars
4. **Phase 4**: Replace GLTF system or maintain both

**⚠️ VRM Challenges:**
- **BlendShape standardization** varies between VRM creators
- **Performance differences** - VRM has additional overhead
- **Animation compatibility** - existing animations may need updates
- **Morph target limits** - VRM may have fewer available shapes

---

## 🔍 Debugging Guide

### **Common Issues & Solutions**

#### **1. Audio Not Playing**
```javascript
// Check: Audio context state
console.log('Audio Context State:', lipsync.audioContext.state);

// Fix: Resume audio context on user interaction
lipsync.audioContext.resume();
```

#### **2. Morph Targets Not Working**
```javascript
// Debug: Check morph target dictionary
console.log('Available morphs:', nodes.Wolf3D_Head.morphTargetDictionary);
console.log('Current influences:', nodes.Wolf3D_Head.morphTargetInfluences);

// Verify: All 15 visemes exist in model
Object.values(VISEMES).forEach(viseme => {
  const index = nodes.Wolf3D_Head.morphTargetDictionary[viseme];
  console.log(`${viseme}: ${index !== undefined ? 'OK' : 'MISSING'}`);
});
```

#### **3. Performance Issues**
```javascript
// Monitor: Frame rate and features
console.log('Features extracted:', features?.volume);
console.log('Current viseme:', viseme);

// Optimize: Reduce FFT size for better performance
const lipsync = new Lipsync({ fftSize: 1024 }); // Instead of 2048
```

### **Development Tools**
- **Leva Controls**: Already integrated for real-time parameter tuning
- **Dev Logs**: Enable in `devLog.ts` for detailed debugging
- **Browser DevTools**: Audio context inspection in Application tab

---

## 📚 Additional Resources

### **Documentation**
- [Three.js Morph Targets](https://threejs.org/docs/#api/en/objects/Mesh.morphTargetInfluences)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)

### **Testing Workflow**
1. **Audio Processing**: Test with various audio formats and quality
2. **Viseme Accuracy**: Verify each of 15 visemes animates correctly
3. **Performance**: Monitor FPS during playback
4. **Cross-browser**: Test in Chrome, Firefox, Safari
5. **Mobile**: Verify touch interaction and performance

This document should cover most modification scenarios. For complex changes involving the core audio analysis algorithms, refer to the phonetic literature and consider consulting with audio processing specialists.