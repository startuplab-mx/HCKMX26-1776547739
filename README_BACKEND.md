# 🚀 Jopi Backend - Documentación de API

Esta es la guía de los endpoints necesarios para que la aplicación Jopi sea completamente funcional y sincronizada en la nube.

## 📡 Endpoints Base

### 1. Perfil y Progreso del Usuario (`/user`)
*   **GET `/user/profile`**: Obtiene los datos del explorador (username, xp, chips, streak, rank).
*   **PATCH `/user/stats`**: Actualiza XP, Chispas o Racha tras completar misiones.
*   **GET `/user/inventory`**: Lista de IDs de objetos comprados y equipados.
*   **POST `/user/equip`**: Cambia el skin o accesorio actual del avatar.

### 2. Cursos y Lecciones (`/courses`)
*   **GET `/courses`**: Lista de todos los cursos disponibles con sus metadatos (título, color, progreso base).
*   **GET `/courses/{id}/lessons`**: Obtiene el contenido detallado de un curso (videos, preguntas, teoría).
*   **POST `/courses/{id}/progress`**: Registra que el usuario completó una lección específica.

### 3. Tienda Galáctica (`/store`)
*   **GET `/store/catalog`**: Lista de objetos disponibles para comprar (skins, accesorios, servicios).
*   **POST `/store/purchase`**: Procesa la compra de un objeto validando el saldo de chispas en el servidor.

### 4. Comunidad y Social (`/community`)
*   **GET `/community/leaderboard`**: Obtiene el ranking global o de amigos filtrado por XP.
*   **GET `/community/search?q={query}`**: Busca exploradores por nombre de usuario.
*   **GET `/community/missions`**: Lista de misiones grupales activas.
*   **POST `/community/missions/{id}/join`**: Une al usuario a una misión de equipo.

---

## 🛠️ Estructuras de Datos (JSON)

### Usuario
```json
{
  "id": "UUID",
  "username": "crack_mx",
  "xp": 2500,
  "chips": 450,
  "streak": 12,
  "level_idx": 3,
  "avatar": {
    "helmet_color": "#FFFFFF",
    "visor_color": "#00FFFF",
    "equipped_skin_id": "skin_gamer",
    "equipped_accessory_id": "acc_cap"
  }
}
```

### Lección (TikTok Style)
```json
{
  "id": "UUID",
  "type": "theory | question | video",
  "title": "Introducción a la Gravedad",
  "content": "...",
  "video_url": "https://...",
  "reward_xp": 15
}
```

## 🔐 Seguridad
Se recomienda el uso de **JWT (JSON Web Tokens)** en el encabezado `Authorization: Bearer <token>` para todas las peticiones privadas.
