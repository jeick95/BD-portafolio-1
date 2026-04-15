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
            localStorage.setItem('rememberedPassword', password);
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
        }

        showNotification('Login exitoso', 'success');
        
        const { data: profile } = await supabase
            .from('perfiles')
            .select('rol')
            .eq('id', data.user.id)
            .single();

        const adminEmails = ['luffyjeick95074ku@gmail.com', 'aranda@gmail.com', 't01256d@ms.upla.edu.pe', 'jeick95@gmail.com'];
        
        if (profile?.rol === 'admin' || adminEmails.includes(email)) {
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

        const adminEmails = ['luffyjeick95074ku@gmail.com', 'aranda@gmail.com', 't01256d@ms.upla.edu.pe', 'jeick95@gmail.com'];

        // Obtener usuario actual de Supabase Auth
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && adminEmails.includes(user.email)) {
            return true;
        }

        // Si el usuario está en sessionStorage, verificar su email
        const sessionUser = JSON.parse(sessionStorage.getItem('user'));
        if (sessionUser && sessionUser.email && adminEmails.includes(sessionUser.email)) {
            return true;
        }

        // Intentar obtener el perfil desde la base de datos (si la tabla existe)
        try {
            const { data, error } = await supabase
                .from('perfiles')
                .select('rol, email')
                .eq('id', userId)
                .single();
            
            if (!error && data) {
                return data.rol === 'admin' || adminEmails.includes(data.email);
            }
        } catch (e) {
            // La tabla perfiles puede no existir, continuar con verificación por email
        }

        return false;
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
