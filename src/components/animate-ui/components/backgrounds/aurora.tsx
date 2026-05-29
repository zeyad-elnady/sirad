'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface AuroraBackgroundProps {
  className?: string;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ className }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // Set size to match the container
    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(1.0); // Cap pixel ratio to 1.0 for massive performance boost on high-DPI displays

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '0';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.pointerEvents = 'none';

    currentMount.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(width, height) }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;
        #define NUM_OCTAVES 3

        float rand(vec2 n) { 
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); 
        }

        float noise(vec2 p){ 
          vec2 ip=floor(p);
          vec2 u=fract(p);
          u=u*u*(3.0-2.0*u);
          float res=mix(
            mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
            mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),
            u.y
          );
          return res*res; 
        }

        float fbm(vec2 x) { 
          float v=0.0;
          float a=0.3;
          vec2 shift=vec2(100);
          mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.50));
          for(int i=0;i<NUM_OCTAVES;++i){
            v+=a*noise(x);
            x=rot*x*2.0+shift;
            a*=0.4;
          }
          return v;
        }

        void main() {
          vec2 p = ((gl_FragCoord.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6., -4., 4., 6.);
          vec4 o = vec4(0.);
          float f = 2. + fbm(p + vec2(iTime * 5., 0.)) * .5;
          
          // Theme colors mapping:
          // c1: Sirad Bio-Digital Lime (#B6FF33) -> RGB(0.713, 1.0, 0.2)
          // c2: Very deep rich green/black background -> RGB(0.02, 0.08, 0.02)
          // c3: Sirad Secondary Lavender (#c6bfff) -> RGB(0.776, 0.749, 1.0)
          vec3 c1 = vec3(0.713, 1.0, 0.2);
          vec3 c2 = vec3(0.02, 0.08, 0.02);
          vec3 c3 = vec3(0.776, 0.749, 1.0);

          for(float i=0.; i++<20.;){
            vec2 v = p + cos(i * i + (iTime + p.x * .08) * .025 + i * vec2(13., 11.)) * 3.5;
            float tailNoise = fbm(v + vec2(iTime * .5, i)) * .3 * (1. - (i / 20.));
            
            // Generate shifting colors inside the theme
            float blend1 = sin(i * 0.2 + iTime * 0.4) * 0.5 + 0.5;
            float blend2 = cos(i * 0.3 + iTime * 0.3) * 0.5 + 0.5;
            
            // Mix original color accents (lime green dominant, lavender subtle highlights)
            vec3 auroraColor = mix(mix(c2, c1, blend1), c3, blend2 * 0.25);
            vec4 auroraColors = vec4(auroraColor, 1.0);
            
            vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * .8)) / length(max(v, vec2(v.x * f * .015, v.y * 1.5)));
            float thinnessFactor = smoothstep(0., 1., i / 20.) * .6;
            o += currentContribution * (1. + tailNoise * .8) * thinnessFactor;
          }
          
          o = tanh(pow(o / 100., vec4(1.6)));
          
          // Output with ambient boost
          gl_FragColor = o * 1.6;
        }
      `
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    let isIntersecting = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
    }, { threshold: 0.01 });
    intersectionObserver.observe(currentMount);

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Skip rendering if offscreen to save 100% CPU/GPU resources
      if (!isIntersecting) return;

      // Control speed
      material.uniforms.iTime.value = time * 0.0005; 
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      const w = currentMount.clientWidth || window.innerWidth;
      const h = currentMount.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      material.uniforms.iResolution.value.set(w, h);
    };

    // Use ResizeObserver for accurate sizing inside container
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(currentMount);

    window.addEventListener('resize', handleResize);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, []);

  return <div ref={mountRef} className={className} style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }} />;
};
