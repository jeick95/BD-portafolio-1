async function registerUser(email, password, nombre, carrera) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password, // <-- ¡Aquí faltaba una coma!
            options: {
                data: {
                    nombre: nombre // Pasamos 'nombre' para que el trigger SQL lo lea de raw_user_meta_data
                }
            }
        });

        if (error) throw error;

        showNotification('Registro exitoso. Revisa tu correo para confirmar.', 'success');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return { success: true };
    } catch (error) {
        showNotification('Error al registrar: ' + error.message, 'error');
        return { success: false, error: error.message };
    }
}

async function loginUser(email, password, rememberMe) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        showNotification('Login exitoso', 'success');
        
        const { data: profile } = await supabase
            .from('perfiles')
            .select('rol')
            .eq('id', data.user.id)
            .single();

        if (profile?.rol === 'admin' || email === 'luffyjeick95074ku@gmail.com' || email === 'aranda@gmail.com') {
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        } else {
            setTimeout(() => window.location.href = 'index.html', 1000);
        }

        return { success: true };
    } catch (error) {
        showNotification('Error al iniciar sesión: ' + error.message, 'error');
        return { success: false, error: error.message };
    }
}

async function logoutUser() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        sessionStorage.clear();
        showNotification('Sesión cerrada', 'success');
        setTimeout(() => window.location.href = 'login.html', 1000);
    } catch (error) {
        showNotification('Error al cerrar sesión: ' + error.message, 'error');
    }
}

async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

async function getUserProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) throw error;
        return { success: true, profile: data };
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        return { success: false, error: error.message };
    }
}

async function updateUserProfile(userId, updates) {
    try {
        const { data, error } = await supabase
            .from('perfiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        
        showNotification('Perfil actualizado', 'success');
        return { success: true, data };
    } catch (error) {
        showNotification('Error al actualizar: ' + error.message, 'error');
        return { success: false, error: error.message };
    }
}

async function isAdmin(userId) {
    try {
        if (!userId) return false;

        const adminEmails = ['luffyjeick95074ku@gmail.com', 'aranda@gmail.com', 't01256d@ms.upla.edu.pe'];

        // Intentar obtener el perfil desde la base de datos
        const { data, error } = await supabase
            .from('perfiles')
            .select('rol, email')
            .eq('id', userId)
            .single();
        
        // Si hay un error (ej. no existe la fila en perfiles), verificamos contra el usuario actual de Auth
        if (error) {
            const { data: { user } } = await supabase.auth.getUser();
            return user && adminEmails.includes(user.email);
        }

        return data && (data.rol === 'admin' || adminEmails.includes(data.email));
    } catch (error) {
        console.error("Error verificando rol:", error.message);
        return false;
    }
}

function checkAuth() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function fillRememberedEmail() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }
}

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        sessionStorage.setItem('user', JSON.stringify(session.user));
    } else if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('user');
    }
});

window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getCurrentUser = getCurrentUser;
window.getUserProfile = getUserProfile;
window.updateUserProfile = updateUserProfile;
window.isAdmin = isAdmin;
window.checkAuth = checkAuth;
window.fillRememberedEmail = fillRememberedEmail;
