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

// Exportamos el cliente para que el resto de archivos lo usen
window.supabase = supabaseClient;
window.testConnection = testConnection;
window.showNotification = showNotification;
