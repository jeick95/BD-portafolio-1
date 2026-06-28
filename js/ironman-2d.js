(function() {
    const container = document.createElement('div');
    container.id = 'ironman2d-container';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;';

    const style = document.createElement('style');
    style.textContent = `
    #ironman2d-container {
        perspective: 1200px;
    }
    .im-scene {
        position:absolute;inset:0;
        display:flex;align-items:center;justify-content:center;
        transform-style:preserve-3d;
        transition:transform 0.15s ease-out;
    }
    .im-wrapper {
        position:relative;
        width:180px;height:300px;
        transform-style:preserve-3d;
        animation: imFloat 4s ease-in-out infinite;
    }
    @keyframes imFloat {
        0%,100%{transform:translateY(0px) rotateX(0deg)}
        25%{transform:translateY(-12px) rotateX(2deg)}
        50%{transform:translateY(-6px) rotateX(0deg)}
        75%{transform:translateY(-18px) rotateX(-2deg)}
    }

    .im-body { position:absolute;inset:0;transform-style:preserve-3d; }

    /* HEAD */
    .im-head {
        position:absolute;top:0;left:50%;transform:translateX(-50%);
        width:70px;height:60px;
        background:linear-gradient(180deg,#e52020,#b01010);
        border-radius:20px 20px 12px 12px;
        box-shadow:inset 0 -4px 8px rgba(0,0,0,0.3),0 0 20px rgba(229,32,32,0.2);
        z-index:10;
    }
    .im-head::before {
        content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);
        width:60px;height:35px;
        background:linear-gradient(180deg,#d4af37,#b8962e);
        border-radius:16px 16px 4px 4px;
        box-shadow:inset 0 -2px 4px rgba(0,0,0,0.2);
    }
    .im-head::after {
        content:'';position:absolute;bottom:2px;left:50%;transform:translateX(-50%);
        width:24px;height:6px;
        background:#d4af37;
        border-radius:3px;
        box-shadow:0 -8px 0 #d4af37,0 -16px 0 #d4af37;
    }
    .im-eye-l,.im-eye-r {
        position:absolute;top:28px;
        width:10px;height:4px;
        background:#00ccff;
        border-radius:2px;
        box-shadow:0 0 8px #00ccff,0 0 16px rgba(0,204,255,0.4);
        animation: eyeGlow 1.5s ease-in-out infinite;
    }
    .im-eye-l{left:15px}.im-eye-r{right:15px}
    @keyframes eyeGlow {
        0%,100%{box-shadow:0 0 8px #00ccff,0 0 16px rgba(0,204,255,0.4)}
        50%{box-shadow:0 0 12px #00ccff,0 0 24px rgba(0,204,255,0.6)}
    }
    .im-ear-l,.im-ear-r {
        position:absolute;top:12px;
        width:10px;height:18px;
        background:#b8962e;
        border-radius:2px;
        box-shadow:inset -2px 0 4px rgba(0,0,0,0.2);
    }
    .im-ear-l{left:-6px;transform:skewY(10deg)}
    .im-ear-r{right:-6px;transform:skewY(-10deg)}

    /* TORSO */
    .im-torso {
        position:absolute;top:58px;left:50%;transform:translateX(-50%);
        width:100px;height:110px;
        background:linear-gradient(180deg,#e52020,#c01010);
        border-radius:16px 16px 20px 20px;
        box-shadow:inset 0 -4px 8px rgba(0,0,0,0.3),0 4px 20px rgba(229,32,32,0.15);
        z-index:5;
    }
    .im-chest {
        position:absolute;top:22px;left:50%;transform:translateX(-50%);
        width:54px;height:24px;
        background:linear-gradient(180deg,#d4af37,#b8962e);
        border-radius:8px;
        box-shadow:inset 0 -2px 4px rgba(0,0,0,0.15);
    }
    .im-arc {
        position:absolute;top:26px;left:50%;transform:translateX(-50%);
        width:22px;height:22px;border-radius:50%;
        background:radial-gradient(circle,#88ddff,#00aaff 40%,#0066cc 70%,transparent);
        box-shadow:0 0 16px rgba(0,170,255,0.6),0 0 32px rgba(0,170,255,0.2);
        animation: arcPulse 2s ease-in-out infinite;
    }
    .im-arc::after {
        content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:8px;height:8px;border-radius:50%;
        background:radial-gradient(circle,#fff,#88ddff);
        box-shadow:0 0 6px rgba(255,255,255,0.8);
    }
    @keyframes arcPulse {
        0%,100%{box-shadow:0 0 16px rgba(0,170,255,0.6),0 0 32px rgba(0,170,255,0.2)}
        50%{box-shadow:0 0 24px rgba(0,170,255,0.8),0 0 48px rgba(0,170,255,0.3)}
    }
    .im-abs {
        position:absolute;bottom:12px;left:50%;transform:translateX(-50%);
        width:70%;height:30px;
        display:flex;gap:6px;justify-content:center;align-items:flex-end;
    }
    .im-ab {
        width:8px;border-radius:4px 4px 0 0;
        background:linear-gradient(180deg,#d4af37,#b8962e);
        box-shadow:inset -1px 0 2px rgba(0,0,0,0.1);
        animation: abFlex 3s ease-in-out infinite;
    }
    .im-ab:nth-child(1){height:12px;animation-delay:0s}
    .im-ab:nth-child(2){height:18px;animation-delay:0.2s}
    .im-ab:nth-child(3){height:22px;animation-delay:0.4s}
    .im-ab:nth-child(4){height:26px;animation-delay:0.6s}
    .im-ab:nth-child(5){height:22px;animation-delay:0.8s}
    .im-ab:nth-child(6){height:18px;animation-delay:1.0s}
    .im-ab:nth-child(7){height:12px;animation-delay:1.2s}
    @keyframes abFlex {
        0%,100%{height:var(--h,12px)}
        50%{height:calc(var(--h,12px) + 6px)}
    }

    /* SHOULDERS */
    .im-shoulder-l,.im-shoulder-r {
        position:absolute;top:60px;
        width:34px;height:28px;
        background:linear-gradient(180deg,#d4af37,#b8962e);
        border-radius:50%;
        box-shadow:inset -2px 0 4px rgba(0,0,0,0.15);
        z-index:4;
    }
    .im-shoulder-l{left:20px;transform:rotate(-10deg)}
    .im-shoulder-r{right:20px;transform:rotate(10deg)}

    /* ARMS */
    .im-arm-l,.im-arm-r {
        position:absolute;top:78px;
        width:18px;height:100px;
        transform-origin:top center;
        z-index:3;
    }
    .im-arm-l{left:8px;animation: armSwingL 3s ease-in-out infinite}
    .im-arm-r{right:8px;animation: armSwingR 3s ease-in-out infinite}
    @keyframes armSwingL {
        0%,100%{transform:rotate(15deg)}
        50%{transform:rotate(-5deg)}
    }
    @keyframes armSwingR {
        0%,100%{transform:rotate(-15deg)}
        50%{transform:rotate(5deg)}
    }
    .im-arm-upper {
        width:100%;height:42px;
        background:linear-gradient(180deg,#e52020,#c01010);
        border-radius:6px 6px 4px 4px;
        box-shadow:inset 0 -2px 4px rgba(0,0,0,0.2);
    }
    .im-arm-ring {
        width:100%;height:8px;
        background:#d4af37;
        border-radius:2px;
        box-shadow:0 2px 4px rgba(0,0,0,0.15);
    }
    .im-arm-fore {
        width:100%;height:36px;
        background:linear-gradient(180deg,#e52020,#b01010);
        border-radius:4px 4px 6px 6px;
        box-shadow:inset 0 -2px 4px rgba(0,0,0,0.2);
    }
    .im-hand {
        width:100%;height:14px;
        background:linear-gradient(180deg,#d4af37,#a08020);
        border-radius:3px 3px 6px 6px;
        margin-top:-2px;
        box-shadow:0 0 8px rgba(255,136,0,0.3);
    }
    .im-rep {
        position:absolute;bottom:0;left:50%;transform:translateX(-50%);
        width:8px;height:8px;border-radius:50%;
        background:radial-gradient(circle,#ffaa00,#ff6600);
        box-shadow:0 0 8px rgba(255,136,0,0.6);
        animation: repGlow 1.2s ease-in-out infinite;
    }
    @keyframes repGlow {
        0%,100%{box-shadow:0 0 8px rgba(255,136,0,0.6)}
        50%{box-shadow:0 0 16px rgba(255,136,0,0.9)}
    }

    /* LEGS */
    .im-leg-l,.im-leg-r {
        position:absolute;top:162px;
        width:18px;height:100px;
        transform-origin:top center;
        z-index:2;
    }
    .im-leg-l{left:30px;animation: legSwing 2.5s ease-in-out infinite}
    .im-leg-r{right:30px;animation: legSwing 2.5s ease-in-out infinite 1.25s}
    @keyframes legSwing {
        0%,100%{transform:rotate(3deg)}
        50%{transform:rotate(-3deg)}
    }
    .im-leg-upper {
        width:100%;height:40px;
        background:linear-gradient(180deg,#e52020,#c01010);
        border-radius:6px 6px 4px 4px;
        box-shadow:inset 0 -2px 4px rgba(0,0,0,0.2);
    }
    .im-leg-knee {
        width:100%;height:14px;
        background:radial-gradient(ellipse at center,#d4af37,#b8962e);
        border-radius:50%;
        box-shadow:0 -2px 4px rgba(0,0,0,0.1);
    }
    .im-leg-lower {
        width:100%;height:38px;
        background:linear-gradient(180deg,#e52020,#b01010);
        border-radius:4px 4px 6px 6px;
        box-shadow:inset 0 -2px 4px rgba(0,0,0,0.2);
    }
    .im-foot {
        width:24px;height:10px;
        background:linear-gradient(180deg,#d4af37,#a08020);
        border-radius:4px;margin:-2px -3px;
        box-shadow:0 2px 6px rgba(0,0,0,0.2);
    }
    .im-jet {
        position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);
        width:10px;height:14px;
        background:linear-gradient(180deg,#ff8800,transparent);
        border-radius:0 0 6px 6px;
        box-shadow:0 0 12px rgba(255,136,0,0.5);
        animation: jetFlame 0.6s ease-in-out infinite alternate;
    }
    @keyframes jetFlame {
        0%{height:10px;opacity:0.6}
        100%{height:18px;opacity:1}
    }

    /* PARTICLES */
    .im-particle {
        position:absolute;pointer-events:none;
        width:4px;height:4px;border-radius:50%;
        background:radial-gradient(circle,#ff6644,#ff4400);
        box-shadow:0 0 6px rgba(255,68,0,0.4);
        animation: particleFloat 4s ease-out infinite;
        opacity:0;
    }
    @keyframes particleFloat {
        0%{opacity:0.8;transform:translate(0,0) scale(1)}
        100%{opacity:0;transform:translate(var(--px,30px),var(--py,-30px)) scale(0);}
    }

    /* MOUSE TRAIL GLOW */
    .im-glow {
        position:absolute;pointer-events:none;
        width:200px;height:200px;border-radius:50%;
        background:radial-gradient(circle,rgba(229,32,32,0.08),transparent 70%);
        transform:translate(-50%,-50%);
        transition:all 0.3s ease;
    }
    `;
    document.head.appendChild(style);
    document.body.appendChild(container);

    const scene = document.createElement('div');
    scene.className = 'im-scene';
    container.appendChild(scene);

    const wrapper = document.createElement('div');
    wrapper.className = 'im-wrapper';
    scene.appendChild(wrapper);

    const body = document.createElement('div');
    body.className = 'im-body';

    // Head
    const head = document.createElement('div');
    head.className = 'im-head';
    head.innerHTML = '<div class="im-ear-l"></div><div class="im-ear-r"></div><div class="im-eye-l"></div><div class="im-eye-r"></div>';
    body.appendChild(head);

    // Shoulders
    body.innerHTML += '<div class="im-shoulder-l"></div><div class="im-shoulder-r"></div>';

    // Torso
    const torso = document.createElement('div');
    torso.className = 'im-torso';
    torso.innerHTML = '<div class="im-chest"></div><div class="im-arc"></div><div class="im-abs">'.repeat(1)+
        '<div class="im-ab" style="--h:12px"></div><div class="im-ab" style="--h:18px"></div><div class="im-ab" style="--h:22px"></div><div class="im-ab" style="--h:26px"></div><div class="im-ab" style="--h:22px"></div><div class="im-ab" style="--h:18px"></div><div class="im-ab" style="--h:12px"></div></div>';
    body.appendChild(torso);

    // Arms
    [-1,1].forEach(s => {
        const arm = document.createElement('div');
        arm.className = s < 0 ? 'im-arm-l' : 'im-arm-r';
        arm.innerHTML = '<div class="im-arm-upper"></div><div class="im-arm-ring"></div><div class="im-arm-fore"></div><div class="im-hand"><div class="im-rep"></div></div>';
        body.appendChild(arm);
    });

    // Legs
    [-1,1].forEach(s => {
        const leg = document.createElement('div');
        leg.className = s < 0 ? 'im-leg-l' : 'im-leg-r';
        leg.innerHTML = '<div class="im-leg-upper"></div><div class="im-leg-knee"></div><div class="im-leg-lower"></div><div class="im-foot"><div class="im-jet"></div></div>';
        body.appendChild(leg);
    });

    wrapper.appendChild(body);

    // Glow
    const glow = document.createElement('div');
    glow.className = 'im-glow';
    glow.style.left = '50%';
    glow.style.top = '55%';
    container.appendChild(glow);

    // Particles
    function createParticle() {
        const p = document.createElement('div');
        p.className = 'im-particle';
        const rect = wrapper.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        p.style.left = (cx + (Math.random()-0.5)*60) + 'px';
        p.style.top = (cy + (Math.random()-0.5)*40) + 'px';
        p.style.setProperty('--px', (Math.random()-0.5)*80 + 'px');
        p.style.setProperty('--py', (Math.random()-0.5)*60 + 'px');
        p.style.animationDuration = (2 + Math.random()*2) + 's';
        container.appendChild(p);
        setTimeout(() => p.remove(), 4000);
    }

    setInterval(createParticle, 300);

    // MOUSE PARALLAX - 3D effect
    let mx = 0, my = 0;
    let tx = 0, ty = 0;

    document.addEventListener('mousemove', e => {
        const rx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ry = (e.clientY / window.innerHeight - 0.5) * 2;
        mx = rx * 12;
        my = ry * -8;
    });

    function animate() {
        tx += (mx - tx) * 0.05;
        ty += (my - ty) * 0.05;
        scene.style.transform = `rotateY(${tx}deg) rotateX(${ty}deg) translateZ(20px)`;
        const gx = 50 + tx * 2;
        const gy = 55 + ty * 2;
        glow.style.left = gx + '%';
        glow.style.top = gy + '%';
        requestAnimationFrame(animate);
    }
    animate();

    // RESIZE - reposition particles origin
    window.addEventListener('resize', () => {});

    // Cleanup on page unload (in case of SPA)
    window.addEventListener('beforeunload', () => {
        container.remove();
    });
})();
