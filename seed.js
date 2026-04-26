require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function seed() {
    console.log("🚀 Iniciando el Gran Seed Estelar...");

    // --- 1. LIMPIEZA PREVIA (Opcional, para evitar duplicados en desarrollo) ---
    // console.log("🧹 Limpiando base de datos...");
    // await supabase.from('lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    // await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // --- 2. CREACIÓN DE MEDALLAS (BADGES) ---
    console.log("🏅 Creando catálogo de medallas...");
    const { error: bError } = await supabase.from('badges').upsert([
        { id: "first_mission", title: "Primer Salto", description: "Completaste tu primera misión educativa.", icon: "rocket", color_hex: "007AFF" },
        { id: "xp_1000", title: "Batería llena", description: "Alcanzaste tus primeros 1000 de energía.", icon: "bolt.fill", color_hex: "FFCC00" },
        { id: "streak_7", title: "Constancia Estelar", description: "Mantuviste tu racha por 7 días seguidos.", icon: "flame.fill", color_hex: "FF9500" },
        { id: "streak_30", title: "Navegante Experto", description: "Un mes entero sin apagar motores.", icon: "star.fill", color_hex: "AF52DE" },
        { id: "social_ally", title: "Aliado Galáctico", description: "Te uniste a tu primera misión en equipo.", icon: "person.2.fill", color_hex: "34C759" }
    ]);
    if (bError) console.error("❌ Error medallas:", bError);

    // --- 3. CREACIÓN DE CURSOS ---
    console.log("📚 Creando cursos...");
    const { data: courses, error: cError } = await supabase.from('courses').upsert([
        { title: "Crea tu primera App", icon: "apps.iphone", color_hex: "00FFFF", total_lessons: 3 },
        { title: "Mundo Python", icon: "terminal", color_hex: "34C759", total_lessons: 2 },
        { title: "Robots Galácticos", icon: "cpu", color_hex: "007AFF", total_lessons: 1 }
    ]).select();

    if (cError) return console.error("❌ Error cursos:", cError);

    // --- 4. CREACIÓN DE LECCIONES (Tutoriales) ---
    console.log("🎬 Añadiendo tutoriales a los cursos...");
    const videoURL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; // Video de prueba

    const lessonsToInsert = [];
    courses.forEach(course => {
        if (course.title === "Crea tu primera App") {
            lessonsToInsert.push(
                { course_id: course.id, title: "Bienvenida a Xcode", description: "Configura tu primera cabina de mando.", video_url: videoURL, order_index: 1 },
                { course_id: course.id, title: "Vistas y Botones", description: "Crea tu primera interfaz táctil.", video_url: videoURL, order_index: 2 },
                { course_id: course.id, title: "Lógica Swift", description: "Dale cerebro a tu aplicación.", video_url: videoURL, order_index: 3 }
            );
        } else {
            lessonsToInsert.push(
                { course_id: course.id, title: "Iniciando Motores", description: "Aprende los conceptos básicos.", video_url: videoURL, order_index: 1 }
            );
        }
    });

    const { error: lError } = await supabase.from('lessons').upsert(lessonsToInsert);
    if (lError) console.error("❌ Error lecciones:", lError);

    // --- 5. MISIONES EN EQUIPO ---
    console.log("🤝 Creando misiones grupales...");
    const { error: tmError } = await supabase.from('team_missions').upsert([
        { title: "🛰️ Mensaje Espacial", description: "Conecta las antenas de la galaxia con otros exploradores.", reward_xp: 500, max_members: 5, icon: "antenna.radiowaves.left.and.right" },
        { title: "🏗️ Base Lunar", description: "Construye un nuevo domo de entrenamiento en grupo.", reward_xp: 1200, max_members: 10, icon: "house.fill" },
        { title: "☄️ Meteorito Dorado", description: "Analiza el fragmento raro antes de que se desintegre.", reward_xp: 2500, max_members: 3, icon: "sparkles" }
    ]);
    if (tmError) console.error("❌ Error misiones grupales:", tmError);

    console.log("\n✨ ¡La base de datos ha sido poblada con éxito! ✨");
    console.log("Tip: Ahora entra a la app y verás todo el contenido real.");
}

seed();
