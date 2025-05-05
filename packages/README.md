# Wawa VFX

A simple and easy-to-use library for creating visual effects with Three.js and React Three Fiber.

[Live demo](https://wawa-vfx.wawasensei.dev/) - [Fireworks demo](https://fireworks.wawasensei.dev/) - [Wizard Game demo](https://wizard.wawasensei.dev/)

> This powerful VFX particle system was developed as part of the comprehensive **VFX & Advanced Rendering Chapter** in my [React Three Fiber: The Ultimate Guide to 3D Web Development](https://lessons.wawasensei.dev/courses/react-three-fiber/) course.
>
> In the course, we break down every aspect of this system, explaining the mathematics, optimization techniques, and design patterns that make it work.

https://github.com/user-attachments/assets/4c00c0e1-ae4f-4501-a648-0811c7a4ca7d

## Install

```bash
npm install wawa-vfx
```

or

```bash
yarn add wawa-vfx
```

## Usage

Wawa VFX makes it easy to create particle effects in your React Three Fiber projects. The library uses a two-component system:

- `VFXParticles`: Defines the particle system and its rendering properties
- `VFXEmitter`: Controls how and when particles are emitted into the scene

### Basic Example

```jsx
import { VFXEmitter, VFXParticles } from "wawa-vfx";

const MyEffect = () => {
  return (
    <>
      {/* Step 1: Define your particle system */}
      <VFXParticles
        name="particles" // A unique identifier for this particle system
        settings={{
          nbParticles: 100000, // Maximum number of particles to allocate
          gravity: [0, -9.8, 0], // Apply gravity (x, y, z)
          fadeSize: [0, 0], // Size fade in/out settings
          fadeOpacity: [0, 0], // Opacity fade in/out settings
          renderMode: "billboard", // "billboard" or "mesh"
          intensity: 3, // Brightness multiplier
        }}
      />

      {/* Step 2: Define your emitter */}
      <VFXEmitter
        debug // Show debug visualization
        emitter="particles" // Target the particle system by name
        settings={{
          loop: true, // Continuously emit particles (only if `spawnMode` is 'time')
          duration: 1, // Emission cycle duration in seconds
          nbParticles: 100, // Number of particles to emit per cycle
          spawnMode: "time", // Emission mode: 'time' or 'burst'
          delay: 0, // Time delay before starting emission

          // Particle lifetime range [min, max]
          particlesLifetime: [0.1, 1],

          // Position range (min/max)
          startPositionMin: [-0.1, -0.1, -0.1],
          startPositionMax: [0.1, 0.1, 0.1],

          // Rotation range (min/max)
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          // Rotation speed range (min/max)
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 0],

          // Direction range (min/max)
          directionMin: [-1, 0, -1],
          directionMax: [1, 1, 1],

          // Particle size range [min, max]
          size: [0.01, 0.25],

          // Particle speed range [min, max]
          speed: [1, 12],

          // Color at start - an array of strings for random selection
          colorStart: ["white", "skyblue"],

          // Color at end - an array of strings for random selection
          colorEnd: ["white", "pink"],
        }}
      />
    </>
  );
};
```

### Key Features

- **Easy to Use**: Create complex particle effects with minimal code
- **Flexible Customization**: Extensive settings for fine-tuning visual effects
- **Performance Optimized**: Uses instanced rendering for efficient particle systems
- **Integrated with React Three Fiber**: Works seamlessly with your existing project

### VFXParticles Properties

| Property   | Type          | Description                                      |
| ---------- | ------------- | ------------------------------------------------ |
| `name`     | string        | Unique identifier for this particle system       |
| `settings` | object        | Configuration options for particles              |
| `alphaMap` | THREE.Texture | Optional texture for particle alpha/transparency |
| `geometry` | ReactElement  | Optional custom geometry for particles           |

### VFXEmitter Properties

| Property   | Type    | Description                                 |
| ---------- | ------- | ------------------------------------------- |
| `emitter`  | string  | Name of the target particle system          |
| `settings` | object  | Configuration options for emission behavior |
| `debug`    | boolean | Show controls to adjust the settings        |

## Advanced Usage

Check out the `examples` directory for more complex implementations and techniques.

## Roadmap

Do you want to contribute to the project? Here are some ideas for future features:

- [ ] WebGPU/TSL `VFXParticles`/`VFXParticlesMaterial` versions
- [ ] Performance optimizations (Points / Sprites)
- [ ] More controls on the `VFXEmitter` component (`emit`, `emitStart`, `emitStop`, `emitByDistance`)
- [ ] More customization options for the particle system
- [ ] More rendering modes (`stretched billboard`)
- [ ] More examples and documentation

Feel free to open an issue or PR if you have any suggestions or improvements!
