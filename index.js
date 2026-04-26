require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware para ver qué está pasando
app.use((req, res, next) => {
    console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Multer mejorada
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // Límite de 50MB por video
});

// --- PANEL DE ADMINISTRACIÓN ---
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// --- USUARIO Y PROGRESO ---
app.get('/user/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*, user_badges(badge_id)')
        .eq('id', req.params.id)
        .single();
    if (error) return res.status(404).json({ error: 'User not found' });
    res.json(data);
});

app.patch('/user/:id/stats', async (req, res) => {
    const { xp, chips, streak, level_idx } = req.body;
    const { data, error } = await supabase.from('profiles').upsert({ id: req.params.id, xp, chips, streak, level_idx }).select();
    if (error) return res.status(400).json(error);
    res.json(data[0]);
});

// --- TIENDA Y CURSOS ---
app.get('/courses', async (req, res) => {
    const { data, error } = await supabase.from('courses').select('*, lessons(*)');
    if (error) return res.status(400).json(error);
    res.json(data || []);
});

app.get('/lessons', async (req, res) => {
    const { course_id } = req.query;
    
    let query = supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true });

    if (course_id) {
        query = query.eq('course_id', course_id);
    }
    
    const { data, error } = await query;
    if (error) return res.status(400).json(error);
    
    const formatted = [{
        id: course_id || "global_set",
        title: "Misiones del Curso",
        questions: data.map(l => ({
            id: l.id,
            title: l.title,
            command: l.command || "Jopi dice:",
            hint: l.description || "",
            options: l.options || ["Opción A", "Opción B", "Opción C", "Opción D"],
            correct_answer: l.correct_answer || 0,
            icon: l.type === 'video' ? "play.circle.fill" : "questionmark.circle.fill",
            video_url: l.video_url
        }))
    }];

    res.json(formatted);
});

app.post('/admin/create-course', async (req, res) => {
    const { title, icon, color_hex } = req.body;
    const { data, error } = await supabase.from('courses').insert({ title, icon, color_hex, total_lessons: 0 }).select();
    if (error) return res.status(400).json(error);
    res.json(data[0]);
});

// 🚀 SUBIDA DE TUTORIAL DEFINITIVA
app.post('/admin/upload-tutorial', upload.single('video'), async (req, res) => {
    console.log("📥 Recibiendo petición de subida...");
    const { title, description, course_id, order_index } = req.body;
    const file = req.file;

    if (!file) {
        console.error("❌ No se recibió ningún archivo de video.");
        return res.status(400).json({ error: 'No video file provided' });
    }

    try {
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${course_id}/${Date.now()}.${fileExt}`;

        console.log(`📤 Subiendo a Supabase: ${fileName}...`);
        
        // 1. Subir al Storage
        const { data: storageData, error: storageError } = await supabase.storage
            .from('tutorials')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (storageError) {
            console.error("❌ Error en Supabase Storage:", storageError);
            return res.status(500).json({ error: `Storage Error: ${storageError.message}` });
        }

        // 2. Generar URL Pública
        const { data: { publicUrl } } = supabase.storage
            .from('tutorials')
            .getPublicUrl(fileName);

        console.log(`🔗 URL generada: ${publicUrl}`);

        // 3. Insertar en la DB
        const { data: lessonData, error: dbError } = await supabase
            .from('lessons')
            .insert({
                course_id,
                title,
                description,
                order_index: parseInt(order_index) || 1,
                video_url: publicUrl,
                type: 'video'
            })
            .select();

        if (dbError) {
            console.error("❌ Error al guardar en DB:", dbError);
            return res.status(500).json({ error: `Database Error: ${dbError.message}` });
        }

        console.log("✅ ¡Misión completada con éxito!");
        res.json({ message: 'Success', lesson: lessonData[0] });

    } catch (err) {
        console.error("💥 Error inesperado:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 Jopi Backend running at http://localhost:${port}`);
    console.log(`👨‍🚀 Admin Panel: http://localhost:${port}/admin`);
});
