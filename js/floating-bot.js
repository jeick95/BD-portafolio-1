(function() {
    const botBtn = document.createElement('a');
    const isProyecto = window.location.pathname.includes('proyecto.html');
    botBtn.href = isProyecto ? 'javascript:void(0)' : 'proyecto.html';
    botBtn.className = 'chatbot-floating';
    botBtn.id = 'floatingBot';
    botBtn.style.cssText = 'position:fixed;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#ec4899);display:flex;align-items:center;justify-content:center;cursor:grab;box-shadow:0 4px 20px rgba(99,102,241,0.5);z-index:999;text-decoration:none;left:'+(window.innerWidth-90)+'px;top:'+(window.innerHeight-100)+'px;transition:none;';
    botBtn.innerHTML = '<i class="fas fa-robot" style="color:white;font-size:1.5rem;"></i>';
    document.body.appendChild(botBtn);

    let x = window.innerWidth - 90, y = window.innerHeight - 100;
    let vx = 0.3 + Math.random() * 0.3, vy = 0.2 + Math.random() * 0.2;
    let dragging = false;

    botBtn.addEventListener('mousedown', (e) => {
        dragging = true;
        botBtn.style.cursor = 'grabbing';
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        x = e.clientX - 28;
        y = e.clientY - 28;
        botBtn.style.left = x + 'px';
        botBtn.style.top = y + 'px';
    });
    document.addEventListener('mouseup', () => {
        dragging = false;
        botBtn.style.cursor = 'grab';
    });

    function drift() {
        if (!dragging) {
            x += vx;
            y += vy;
            if (x <= 0 || x >= window.innerWidth - 56) vx *= -1;
            if (y <= 70 || y >= window.innerHeight - 56) vy *= -1;
            botBtn.style.left = x + 'px';
            botBtn.style.top = y + 'px';
        }
        requestAnimationFrame(drift);
    }

    // Trail effect
    const trail = document.createElement('div');
    trail.style.cssText = 'position:fixed;pointer-events:none;z-index:998;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,0.3),transparent);filter:blur(4px);transition:none;';
    document.body.appendChild(trail);
    let tx = x, ty = y;

    function updateTrail() {
        tx += (x - tx) * 0.05;
        ty += (y - ty) * 0.05;
        trail.style.left = (tx + 18) + 'px';
        trail.style.top = (ty + 18) + 'px';
        requestAnimationFrame(updateTrail);
    }

    drift();
    updateTrail();
})();
