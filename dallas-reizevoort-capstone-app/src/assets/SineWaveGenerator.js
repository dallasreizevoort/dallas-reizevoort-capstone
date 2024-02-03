import React, { useRef, useEffect } from 'react';

const SineWaveGenerator = (props) => {
  const canvasRef = useRef(null);
  let waves = props.waves || [];
  let speed = props.speed || 10;
  let amplitude = props.amplitude || 50;
  let wavelength = props.wavelength || 50;
  let segmentLength = props.segmentLength || 10;
  let lineWidth = props.lineWidth || 2;
  let strokeStyle = props.strokeStyle || 'rgba(255, 255, 255, 0.2)';

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ... (Rest of your sine wave drawing logic)

    const animate = () => {
      // ... (Animation logic)
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return <canvas ref={canvasRef} {...props} />;
};

export default SineWaveGenerator;
