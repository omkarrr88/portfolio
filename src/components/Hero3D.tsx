import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedVisualizer() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={2} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1, 64, 64]} scale={2}>
                <MeshDistortMaterial
                    color="#14b8a6"
                    attach="material"
                    distort={0.4}
                    speed={1.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
}

export default function Hero3D() {
    return (
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen pointer-events-none">
            <Canvas camera={{ position: [0, 0, 8] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#f59e0b" />
                <directionalLight position={[-10, -10, -5]} intensity={1} color="#14b8a6" />
                <AnimatedVisualizer />
            </Canvas>
        </div>
    );
}
