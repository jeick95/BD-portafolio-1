const SUPABASE_URL = 'https://dcntccncakaaftphyrkh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjbnRjY25jYWthYWZ0cGh5cmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDQxOTQsImV4cCI6MjA5MTYyMDE5NH0.KQWERzDIFD1e0FljbgO0Xq3kW8qeFzhVxawiBUoiPlU';

// Inicializamos el cliente usando el objeto global 'supabase' cargado desde el CDN
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
    try {
        // Aseguramos que apunte a 'perfiles' como indica el script SQL
        const { data, error } = await supabaseClient.from('perfiles').select('*', { count: 'exact', head: true });
        if (error) throw error;
        console.log('✅ Conexión exitosa a Supabase');
        showNotification('Conexión exitosa', 'success');
        return true;
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        showNotification('Error de conexión: ' + error.message, 'error');
        return false;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// === Jeick AI Hover Intelligence ===
(function(){
    // Inject styles
    const style=document.createElement('style');
    style.textContent=`
    .jeick-hb{position:fixed;z-index:99999;background:linear-gradient(135deg,#6366f1,#06b6d4);color:#fff;padding:.45rem .85rem;border-radius:20px;font-size:.78rem;font-family:'Inter',system-ui,sans-serif;box-shadow:0 4px 20px rgba(99,102,241,.45);cursor:pointer;opacity:0;transform:translateY(8px) scale(.92);transition:all .3s cubic-bezier(.34,1.56,.64,1);pointer-events:none;white-space:nowrap;display:flex;align-items:center;gap:.35rem;user-select:none;backdrop-filter:blur(8px)}
    .jeick-hb.show{opacity:1;transform:translateY(0) scale(1);pointer-events:all}
    .jeick-hb:hover{box-shadow:0 6px 28px rgba(99,102,241,.6);transform:translateY(-1px) scale(1.03)}
    .jeick-hb::after{content:'';position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #6366f1}
    .jeick-hb-icon{font-size:.9rem}
    @keyframes jeickPulse{0%,100%{box-shadow:0 4px 20px rgba(99,102,241,.45)}50%{box-shadow:0 4px 28px rgba(99,102,241,.7)}}
    .jeick-hb.show{animation:jeickPulse 2s ease-in-out infinite}
    `;
    document.head.appendChild(style);

    let timer=null,el=null,bubble=null;

    function makeBubble(label,topic){
        const b=document.createElement('div');
        b.className='jeick-hb';
        b.innerHTML='<span class="jeick-hb-icon">🔍</span><span>Saber m&aacute;s sobre <strong>'+label+'</strong></span>';
        b.addEventListener('click',function(e){
            e.stopPropagation();askJeick(topic||label);hide();
        });
        document.body.appendChild(b);
        return b;
    }

    function show(target){
        hide();
        const label=target.getAttribute('data-jeick')||target.textContent.trim().slice(0,35);
        const topic=target.getAttribute('data-jeick-q')||label;
        bubble=makeBubble(label,topic);
        requestAnimationFrame(()=>{
            bubble.classList.add('show');
            const r=target.getBoundingClientRect(),br=bubble.getBoundingClientRect();
            let l=r.left+r.width/2-br.width/2,tr=r.top-br.height-14;
            if(l<8)l=8;if(l+br.width>window.innerWidth-8)l=window.innerWidth-br.width-8;
            if(tr<8)tr=r.bottom+14;
            bubble.style.left=l+'px';bubble.style.top=tr+'px';
        });
    }

    function hide(){
        if(bubble){bubble.classList.remove('show');
            setTimeout(()=>{if(bubble){bubble.remove();bubble=null}},350);
        }
    }

    function askJeick(q){
        const isProyecto=window.location.pathname.includes('proyecto.html');
        if(isProyecto&&typeof cbToggle==='function'){
            cbToggle();
            setTimeout(()=>{
                const inp=document.getElementById('cbInput');
                if(inp){inp.value=q;if(typeof cbSendMsg==='function')cbSendMsg()}
            },500);
        }else{
            window.location.href='proyecto.html?jeick='+encodeURIComponent(q);
        }
    }

    document.addEventListener('mouseover',function(e){
        const t=e.target.closest('[data-jeick]');
        if(t&&t!==el){
            el=t;clearTimeout(timer);
            timer=setTimeout(()=>{if(el&&document.contains(el))show(el)},1200);
        }
    });

    document.addEventListener('mouseout',function(e){
        const t=e.target.closest('[data-jeick]');
        if(t){
            const rel=e.relatedTarget;
            if(rel&&(t.contains(rel)||(bubble&&bubble.contains(rel))))return;
            clearTimeout(timer);el=null;hide();
        }
    });

    // Handle ?jeick= query param on proyecto.html
    document.addEventListener('DOMContentLoaded',function(){
        const p=new URLSearchParams(window.location.search),q=p.get('jeick');
        if(q&&typeof cbToggle==='function'){
            setTimeout(()=>{
                cbToggle();
                setTimeout(()=>{
                    const inp=document.getElementById('cbInput');
                    if(inp){inp.value=q;if(typeof cbSendMsg==='function')cbSendMsg()}
                },500);
            },400);
        }
    });
})();

// Exportamos el cliente para que el resto de archivos lo usen
window.supabase = supabaseClient;
window.testConnection = testConnection;
window.showNotification = showNotification;
