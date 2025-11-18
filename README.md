🏨 Hotel Dashboard — Vue 3 + Vuetify + Pinia + TypeScript

Un panel administrativo completo para gestionar huéspedes, habitaciones y reservas.

📌 Descripción del proyecto

Hotel Dashboard es una aplicación web tipo admin panel construida con Vue 3, Vuetify 3, Pinia, TypeScript y Chart.js.
El objetivo del proyecto es simular un sistema real de administración hotelera, permitiendo gestionar:

✔️ Reservas

✔️ Huéspedes

✔️ Habitaciones

✔️ Gráficas y métricas

✔️ Persistencia local del estado

✔️ Edición y detalle de cada entidad

Sin necesidad de un backend real, el proyecto utiliza un archivo db.json como fuente de datos y simula operaciones CRUD a través de un store global (Pinia) con persistencia en localStorage.

El resultado es un dashboard profesional, dinámico y totalmente funcional que demuestra habilidades en:

UI/UX con Vuetify

Gestión de estado global

Arquitectura escalable

Tipado estricto con TypeScript

Simulación de backend y flujo de datos realista

Diseño modular por vistas y componentes

🚀 Funcionalidades principales
🛏️ Gestión de habitaciones

Visualización de habitaciones con:

Número

Tipo

Capacidad

Piso

Amenidades

Precio

Estado (disponible, ocupada, mantenimiento)

Modal con detalle completo de la habitación

👤 Gestión de huéspedes

Listado de huéspedes con:

Nombre

Email

Teléfono

Documento

País

Número de reservas asociadas

Modal para editar la información del huésped

📅 Gestión de reservas

Crear nuevas reservas (incluye opción para registrar un huésped nuevo).

Editar reservas existentes:

Cambiar huésped asociado

Cambiar habitación, fechas, estado y total

Agregar notas

Modal de detalle con toda la información relacionada

📊 Dashboard con métricas

Incluye gráficas dinámicas generadas con Chart.js, como:

Distribución de reservas por estado

Distribución de habitaciones por estado

KPIs principales:

Habitaciones disponibles

Ocupación del hotel

Total de habitaciones

Total de huéspedes registrados

🧱 Tecnologías utilizadas

Vue 3 (Composition API + Script Setup)

TypeScript

Pinia (gestión de estado)

Vuetify 3 (UI Framework)

Chart.js + vue-chartjs

Vite

localStorage para persistencia

db.json para simular backend