import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ThreeDHero() {
  const mountRef = useRef(null);
  const tshirtRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); 
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false; // Disable zoom for hero to allow scrolling

    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.AmbientLight(0x404040, 2);
    scene.add(light2);

    const loader = new GLTFLoader();
    loader.load(
      '/models/tshirt.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.8, 1.8, 1.8);
        model.position.y = -1;
        scene.add(model);
        tshirtRef.current = model;
        setLoading(false);
      },
      undefined,
      () => {
        // Fallback
        loader.load('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF/SheenChair.gltf', (gltf) => {
          const m = gltf.scene; m.scale.set(1.5, 1.5, 1.5); m.position.y = -0.5; scene.add(m); tshirtRef.current = m; setLoading(false);
        });
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      if (tshirtRef.current) tshirtRef.current.rotation.y += 0.005;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }}>
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <small style={{ color: '#888', letterSpacing: '2px' }}>LOADING 3D ENGINE...</small>
        </div>
      )}
    </div>
  );
}
