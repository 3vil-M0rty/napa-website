import LiquidEther from './LiquidEther';

export default function Footer() {
    if (window.innerWidth < 768) {
        return (
            <div id="footer" style={{ width: '100%', height: '100vh', position: 'relative', backgroundColor: '#0e0c09' }}>

            </div>
        );
    } else {
        return (
            <div id="footer" style={{ width: '100%', height: '100vh', position: 'relative', backgroundColor: '#0e0c09' }}>
                <LiquidEther
                    colors={['#e4908a', '#c71919', '#970303']}
                    mouseForce={20}
                    cursorSize={80}
                    isViscous
                    viscous={10}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={true}
                    autoDemo
                    autoSpeed={5.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                    color0="#bd0d01"
                    color1="#c71919"
                    color2="#cf9797"
                />
            </div>
        );
    }
}