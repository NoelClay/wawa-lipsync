# wawa-lipsync — 3D Chatbot PoC

**Fork of [wass08/wawa-lipsync](https://github.com/wass08/wawa-lipsync)** · Built at [에듀템](https://www.edutem.net/) internship · 2025.07

Real-time lip-sync library extended with an AWS Polly + LLM chatbot integration — a 3D avatar that speaks and moves its mouth in sync with TTS output.

---

## What I Added (fork delta)

```
User message
    │
    ▼
LLM (Gemini/LangChain)
    │  text response
    ▼
AWS Polly ──── audio (.mp3) ────────────────────┐
    │                                            │
    └── viseme JSON (timing data)                │
              │                                  ▼
              ▼                         Web Audio API
         HybridPlayer ◄──── amplitude ──── (volume)
              │
              ▼
         PollyAvatar (Three.js morph targets)
              │
              ▼
      3D character lip-sync
```

**HybridPlayer** (`src/components/HybridPlayer.jsx`) — the core I built:
- Schedules mouth shapes from Polly's pre-computed viseme timing
- Modulates movement intensity with real-time audio amplitude from wawa-lipsync
- Result: accurate timing (Polly) + natural expressiveness (audio volume)

| File | What it does |
|---|---|
| `src/ChatbotAppV2.jsx` | Main app — LLM → Polly → avatar pipeline, Polly→Wawa viseme mapping |
| `src/components/HybridPlayer.jsx` | Coordinates pre-timed visemes + live amplitude |
| `src/components/PollyAvatar.jsx` | Three.js character controller, morph target animation |
| `src/PollyApp.jsx` | AWS Polly TTS integration, viseme JSON parsing |
| `src/utils/devLog.ts` | Animation debug logger |
| `DEVELOPER_HANDOVER.md` | Full architecture doc written for team handover |

---

## Tech Stack

`React` `Three.js` `React Three Fiber` `AWS Polly` `Web Audio API` `TypeScript` `Vite`

---

## Base Library

Original wawa-lipsync by [@wass08](https://github.com/wass08/wawa-lipsync) — real-time audio analysis → FSM → viseme classification (PP, FF, TH, DD, kk, CH, SS, nn, RR, aa, E, I, O, U).
