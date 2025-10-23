import React, { useRef, useEffect } from 'react';


const LiquidBackground = ({ primaryColor, gradientColor1, gradientColor2, theme }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const scale = 0.5; // Render at 50% resolution
    let width = canvas.width = window.innerWidth * scale;
    let height = canvas.height = window.innerHeight * scale;

    const mouse = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX * scale;
      mouse.y = e.clientY * scale;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth * scale;
      height = canvas.height = window.innerHeight * scale;
    };

    window.addEventListener('resize', handleResize);

    class Ball {
      constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x > width + this.radius) this.x = -this.radius;
        if (this.x < -this.radius) this.x = width + this.radius;
        if (this.y > height + this.radius) this.y = -this.radius;
        if (this.y < -this.radius) this.y = height + this.radius;

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * 2;
          this.y += Math.sin(angle) * 2;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const balls = [];
    const numBalls = 5; // Reduced number of balls
    const colors = [primaryColor];
    if (gradientColor1) colors.push(gradientColor1);
    if (gradientColor2) colors.push(gradientColor2);

    for (let i = 0; i < numBalls; i++) {
      balls.push(new Ball(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 20 + 15, // Smaller balls
        colors[i % colors.length]
      ));
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      ctx.filter = 'blur(20px)'; // Reduced blur
      balls.forEach(ball => {
        ball.update();
        ball.draw();
      });
      ctx.filter = 'none';

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [primaryColor, gradientColor1, gradientColor2, theme]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, width: '100%', height: '100%' }} />;
};

export default LiquidBackground;
