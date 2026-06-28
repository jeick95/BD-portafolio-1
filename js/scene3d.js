(function() {
    if (typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    document.body.prepend(container);
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x404060, 0.4);
    scene.add(ambient);
    const mainLight = new THREE.DirectionalLight(0xffeedd, 1.5);
    mainLight.position.set(5, 10, 7);
    scene.add(mainLight);
    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.6);
    fillLight.position.set(-5, 0, 5);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xff4444, 0.8);
    rimLight.position.set(0, -3, -8);
    scene.add(rimLight);

    // === BACKGROUND GEOMETRIC SHAPES ===
    const shapes = [];

    function addShape(geo, color, metalness, emissive, x, y, z, scale) {
        const mat = new THREE.MeshPhysicalMaterial({
            color, metalness, roughness: 0.2,
            emissive, emissiveIntensity: 0.2,
            transparent: true, opacity: 0.3,
            wireframe: Math.random() > 0.5,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        mesh.scale.set(scale, scale, scale);
        scene.add(mesh);
        shapes.push(mesh);
        return mesh;
    }

    addShape(new THREE.TorusKnotGeometry(0.6, 0.2, 64, 8), 0x6366f1, 0.7, 0x312e81, -3, 2, -6, 1);
    addShape(new THREE.IcosahedronGeometry(0.5, 0), 0xec4899, 0.5, 0x831843, 3.5, 1, -7, 1);
    addShape(new THREE.OctahedronGeometry(0.4), 0x06b6d4, 0.6, 0x0e7490, -2, -1, -8, 1);
    addShape(new THREE.DodecahedronGeometry(0.35), 0x10b981, 0.5, 0x065f46, 4, -0.5, -6, 1);

    // === IRON MAN 3D ===
    const redMetallic = new THREE.MeshPhysicalMaterial({
        color: 0xcc2222, metalness: 0.85, roughness: 0.25,
        clearcoat: 0.3, clearcoatRoughness: 0.2,
        emissive: 0x441111, emissiveIntensity: 0.1,
    });
    const goldMetallic = new THREE.MeshPhysicalMaterial({
        color: 0xd4af37, metalness: 0.9, roughness: 0.2,
        clearcoat: 0.4, clearcoatRoughness: 0.15,
        emissive: 0x332200, emissiveIntensity: 0.1,
    });
    const eyeMat = new THREE.MeshPhysicalMaterial({ color: 0x00ccff, emissive: 0x00ccff, emissiveIntensity: 3 });
    const arcMat = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 3,
        transparent: true, opacity: 0.95, side: THREE.DoubleSide,
    });
    const arcCoreMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, emissive: 0x88ddff, emissiveIntensity: 4 });
    const repMat = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 3, transparent: true, opacity: 0.8 });

    const ironman = new THREE.Group();

    // Torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 1.0, 12), redMetallic);
    torso.position.y = 0; torso.scale.x = 1.1;
    ironman.add(torso);

    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.15), goldMetallic);
    chestPlate.position.set(0, 0.25, 0.55);
    ironman.add(chestPlate);

    // Arc Reactor
    const arc = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.2, 32), arcMat);
    arc.position.set(0, 0.25, 0.7);
    ironman.add(arc);
    const arcInner = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), arcCoreMat);
    arcInner.position.set(0, 0.25, 0.7);
    ironman.add(arcInner);

    const arcGlow = new THREE.PointLight(0x00aaff, 3, 8);

    // Shoulders
    [-1, 1].forEach(s => {
        const sh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), goldMetallic);
        sh.position.set(s * 0.85, 0.65, 0); ironman.add(sh);
        const pd = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.5), redMetallic);
        pd.position.set(s * 0.85, 0.8, 0); ironman.add(pd);
    });

    // Arms
    const arms = [];
    [-1, 1].forEach(s => {
        const arm = new THREE.Group();
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.55, 8), redMetallic);
        upper.position.y = -0.25; arm.add(upper);
        const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 8), goldMetallic);
        ring.position.y = -0.5; arm.add(ring);
        const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.5, 8), redMetallic);
        fore.position.y = -0.75; arm.add(fore);
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), goldMetallic);
        hand.position.y = -1.0; arm.add(hand);
        const rep = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), repMat);
        rep.position.set(0, -1.1, 0.05); arm.add(rep);
        arm.position.set(s * 0.85, 0.4, 0);
        arm.rotation.z = s * 0.3;
        ironman.add(arm);
        arms.push(arm);
    });

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), goldMetallic);
    head.position.set(0, 0.95, 0); head.scale.set(1, 1.1, 0.9);
    ironman.add(head);
    const facePlate = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.1), redMetallic);
    facePlate.position.set(0, 0.9, 0.3);
    ironman.add(facePlate);
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.02), eyeMat);
    eyeL.position.set(-0.1, 0.95, 0.32); ironman.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.02), eyeMat);
    eyeR.position.set(0.1, 0.95, 0.32); ironman.add(eyeR);

    // Legs
    [-1, 1].forEach(s => {
        const leg = new THREE.Group();
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.5, 8), redMetallic);
        upper.position.y = -0.25; leg.add(upper);
        const knee = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), goldMetallic);
        knee.position.y = -0.5; knee.scale.set(1, 0.6, 1); leg.add(knee);
        const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.5, 8), redMetallic);
        lower.position.y = -0.75; leg.add(lower);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.35), goldMetallic);
        foot.position.set(0, -1.0, 0.1); leg.add(foot);
        const rep = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshPhysicalMaterial({
            color: 0xff8800, emissive: 0xff8800, emissiveIntensity: 2, transparent: true, opacity: 0.7
        }));
        rep.position.set(0, -1.0, -0.15); leg.add(rep);
        leg.position.set(s * 0.25, -0.5, 0);
        ironman.add(leg);
    });

    ironman.position.set(0, 1.5, -4);
    ironman.scale.set(0.6, 0.6, 0.6);
    scene.add(ironman);
    scene.add(arcGlow);

    camera.position.set(0, 1, 5);

    // Flight Particles
    const pCount = 200;
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pos[i] = (Math.random() - 0.5) * 6;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
        color: 0xff4400, size: 0.03, transparent: true, opacity: 0.4,
        blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Background stars
    const starCount = 800;
    const sPos = new Float32Array(starCount * 3);
    const sCol = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
        sPos[i] = (Math.random() - 0.5) * 40;
        sCol[i] = Math.random() > 0.5 ? 0.4 + Math.random() * 0.6 : 0.9;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    sGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));
    const sMat = new THREE.PointsMaterial({
        size: 0.04, transparent: true, opacity: 0.6,
        vertexColors: true, blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(sGeo, sMat);
    scene.add(stars);

    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.008;

        // Iron Man figure-8 flight
        const cx = Math.sin(time * 0.4) * 2.5;
        const cz = Math.sin(time * 0.6) * 2.5 * 0.6;
        const cy = 1.5 + Math.sin(time * 0.5) * 0.4;
        ironman.position.x = cx;
        ironman.position.z = cz - 1;
        ironman.position.y = cy;

        const lx = Math.sin(time * 0.4 + 0.05) * 2.5;
        const lz = Math.sin(time * 0.6 + 0.05) * 2.5 * 0.6 - 1;
        ironman.lookAt(lx, cy, lz);
        ironman.rotation.z = Math.sin(time * 0.8) * 0.05;
        ironman.rotation.x = Math.sin(time * 0.6) * 0.03;

        arms[0].rotation.x = Math.sin(time * 0.6) * 0.2;
        arms[1].rotation.x = Math.sin(time * 0.6 + Math.PI) * 0.2;

        arc.material.emissiveIntensity = 2 + Math.sin(time * 3) * 1;
        arcInner.material.emissiveIntensity = 3 + Math.sin(time * 4) * 2;
        eyeL.material.emissiveIntensity = 2 + Math.sin(time * 2) * 1;
        eyeR.material.emissiveIntensity = 2 + Math.sin(time * 2 + 0.3) * 1;

        arcGlow.position.copy(ironman.position);
        arcGlow.position.y += 0.25;

        // Particles follow
        const pPos = particles.geometry.attributes.position.array;
        for (let i = 0; i < pCount * 3; i += 3) {
            pPos[i] += (ironman.position.x + (Math.random() - 0.5) * 3 - pPos[i]) * 0.01;
            pPos[i + 1] += (ironman.position.y - 0.5 + (Math.random() - 0.5) * 2 - pPos[i + 1]) * 0.01;
            pPos[i + 2] += (ironman.position.z + (Math.random() - 0.5) * 3 - pPos[i + 2]) * 0.01;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Background shapes rotate
        shapes.forEach((s, i) => {
            s.rotation.x += 0.003 * (i + 1);
            s.rotation.y += 0.005 * (i + 1);
            s.position.y += Math.sin(time * 0.3 + i) * 0.002;
        });

        stars.rotation.y += 0.0003;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
