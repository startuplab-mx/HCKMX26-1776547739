# Jopi - App Educativa Espacial

![Jopi Logo](https://via.placeholder.com/150) <!-- Reemplaza con el logo real -->

Jopi es una aplicación educativa interactiva con un tema espacial, diseñada para hacer el aprendizaje divertido y atractivo. Los usuarios, conocidos como "exploradores", completan lecciones, ganan experiencia (XP), chispas (moneda virtual) y desbloquean logros mientras exploran el universo del conocimiento.

## ✨ Características

- **Lecciones Interactivas**: Contenido educativo en formato de teoría, preguntas y videos, similar a TikTok.
- **Sistema de Progreso**: Gana XP, chispas y mantén rachas diarias para subir de nivel.
- **Avatar Personalizable**: Edita tu avatar con skins y accesorios comprados en la tienda galáctica.
- **Cursos y Misiones**: Explora cursos temáticos y completa misiones diarias y grupales.
- **Comunidad**: Conecta con otros exploradores, ve rankings y únete a misiones de equipo.
- **Tienda Galáctica**: Compra skins, accesorios y servicios con chispas.
- **Notificaciones y Feedback**: Recibe recordatorios y celebraciones por tus logros.
- **Modo Oscuro/Claro**: Personaliza el tema de la app.

## 🛠️ Tecnologías

- **Frontend**: SwiftUI (iOS/macOS)
- **Backend**: API REST (ver [README_BACKEND.md](README_BACKEND.md))
- **Plataformas**: iOS 17+, macOS 14+
- **Lenguaje**: Swift 5.9+

## 📋 Requisitos

- Xcode 15.0 o superior
- iOS 17.0+ o macOS 14.0+
- Cuenta de desarrollador Apple (para distribución)

## 🚀 Instalación y Ejecución

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/jopi.git
   cd jopi
   ```

2. **Abre el proyecto en Xcode**:
   - Abre `jopi.xcodeproj` en Xcode.

3. **Instala dependencias** (si aplica):
   - El proyecto usa SwiftUI nativo, sin dependencias externas adicionales.

4. **Ejecuta la app**:
   - Selecciona un simulador o dispositivo.
   - Presiona `Cmd + R` para compilar y ejecutar.

## 📖 Uso

1. **Registro/Inicio de Sesión**: Crea una cuenta o inicia sesión.
2. **Onboarding**: Completa la introducción inicial.
3. **Explora**: Navega por la pestaña de Inicio, Cursos, Comunidad, etc.
4. **Aprende**: Completa lecciones para ganar XP y chispas.
5. **Personaliza**: Edita tu avatar y compra en la tienda.
6. **Conecta**: Únete a la comunidad y compite en rankings.

## 🗂️ Estructura del Proyecto

```
jopi/
├── Assets.xcassets/          # Recursos gráficos
├── DesignSystem/             # Sistema de diseño (colores, tipografía, componentes)
├── Managers/                 # Gestores (notificaciones, TTS, feedback)
├── Models/                   # Modelos de datos y servicios API
├── Resources/                # Archivos JSON (lecciones, etc.)
├── Screens/                  # Vistas principales
│   ├── Lesson/               # Vista de lecciones
│   └── ...                   # Otras vistas
├── ContentView.swift         # Vista raíz
└── jopiApp.swift             # Punto de entrada de la app
```

## 🔗 Backend

Para el funcionamiento completo, conecta con el backend. Consulta la documentación en [README_BACKEND.md](README_BACKEND.md).

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1. Fork el proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`).
4. Push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- **Autor**: Alejandro Grimaldo
- **Email**: tu-email@example.com
- **GitHub**: [tu-usuario](https://github.com/tu-usuario)

---

¡Explora el universo del conocimiento con Jopi! 🌌🚀