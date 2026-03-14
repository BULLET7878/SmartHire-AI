import { useEffect, useState } from 'react';

const CursorTrail = () => {
    const [trails, setTrails] = useState([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        let lastUpdate = 0;
        const handleMouseMove = (e) => {
            const now = Date.now();
            if (now - lastUpdate < 30) return; // limit to ~30fps update rate
            lastUpdate = now;

            setMousePos({ x: e.clientX, y: e.clientY });

            // Add new trail particle
            const newTrail = {
                id: Date.now() + Math.random(),
                x: e.clientX,
                y: e.clientY,
            };

            setTrails((prevTrails) => [...prevTrails, newTrail]);

            // Remove trail after animation
            setTimeout(() => {
                setTrails((prevTrails) => prevTrails.filter((t) => t.id !== newTrail.id));
            }, 800);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            {trails.map((trail) => (
                <div
                    key={trail.id}
                    className="pointer-events-none fixed z-[9999]"
                    style={{
                        left: trail.x,
                        top: trail.y,
                    }}
                >
                    {/* Animated circle */}
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400/50 rounded-full animate-trail-fade" />

                    {/* Horizontal line */}
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-r from-transparent via-blue-300/60 to-transparent animate-trail-expand" />

                    {/* Vertical line */}
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 h-8 w-[1px] bg-gradient-to-b from-transparent via-purple-300/60 to-transparent animate-trail-expand" />
                </div>
            ))}
        </>
    );
};

export default CursorTrail;
