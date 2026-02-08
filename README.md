# DeepSaffix API — Instrucciones rápidas

Para levantar la API localmente y probar los endpoints de `usuarios` y `simulacros`, usando las colecciones de Postman incluidas en `postman/`.

Requisitos
- Postgres (la conexión está en `.env` como `DATABASE_URL`), por seguridad esta se encuentra previamente puesta en .gitignore tendran que crearla en caso de no tenerla y pondran esta linea de codigo:
``` .env
DATABASE_URL="postgresql://postgres:<sucontraseña>@localhost:5432/<nombrebdPostgreSQL>?schema=public"
```
Pasos para ejecutar localmente

1. Instalar dependencias

```bash
npm install
```

2. Generar el client de Prisma para generar las tablas dentro de PostgreSQL

```bash
npx prisma generate
```

3. Aplicar migraciones (en desarrollo usar `migrate dev` si quieren crear la DB automáticamente)

```bash
npx prisma migrate deploy
# o en desarrollo
# npx prisma migrate dev
```

4. Levantar la API en modo desarrollo

```bash
npm run start:dev
```
**API Endpoints**

---

### Usuarios

* `POST /usuarios` — Crear usuario
* `GET /usuarios` — Listar usuarios
* `GET /usuarios/:id` — Obtener usuario por ID
* `PATCH /usuarios/:id` — Actualizar usuario por ID
* `DELETE /usuarios/:id` — Eliminar usuario por ID
* `PATCH /usuarios/:id/desactivar` — Desactivar usuario

---

### Simulacros (Simulation)

* `POST /simulation` — Crear un simulacro junto con sus preguntas y opciones en una sola petición
* `GET /simulation` — Listar simulacros
* `GET /simulation/:id` — Obtener simulacro por ID (incluye preguntas y opciones)
* `POST /simulation/:id/intentos` — Iniciar intento de simulacro para un usuario
* `POST /simulation/intentos/:id/respuestas` — Enviar respuestas de un intento
* `POST /simulation/intentos/:id/finalizar` — Finalizar intento y calcular resultado
* `GET /simulation/usuarios/:userId/intentos` — Listar intentos de simulacros realizados por un usuario

---

### Perfil Académico

* `POST /perfil-academico/:id_usuario` — Crear perfil académico de un usuario
* `GET /perfil-academico/:id_usuario` — Obtener perfil académico por ID de usuario
* `PATCH /perfil-academico/:id_usuario` — Actualizar perfil académico
* `DELETE /perfil-academico/:id_usuario` — Eliminar perfil académico

---

**Colecciones de Postman**

Ubicación: carpeta `/postman`

* `Usuarios.postman_collection.json` — Requests para gestión de usuarios
* `Simulation.postman_collection.json` — Requests para simulacros e intentos
* `PerfilAcademico.postman_collection.json` — Requests para perfiles académicos

Estas colecciones evitan crear los requests manualmente.

---

**Importar en Postman**

1. Abrir Postman → **Import** → seleccionar archivo JSON desde `postman/`.
2. Configurar la variable de colección `base_url` (por defecto: `http://localhost:3000`).
3. Ejecutar las requests. Verificar que:

   * La API esté en ejecución.
   * El archivo `.env` contenga `DATABASE_URL`.

---

**Ejecución con Newman (sin Postman)**

Requiere estar en el directorio raíz del proyecto.

Instalación:

```bash
# Global
npm install -g newman

# Local (dev)
npm install --save-dev newman
```

Ejecución:

```bash
# Usuarios
npx newman run postman/Usuarios.postman_collection.json --env-var "base_url=http://localhost:3000"

# Perfiles académicos
npx newman run postman/PerfilAcademico.postman_collection.json --env-var "base_url=http://localhost:3000"

# Simulacros
npx newman run postman/Simulation.postman_collection.json --env-var "base_url=http://localhost:3000"
```

Ejemplo body (POST /simulacros)

```json
{
  "nombre": "Simulacro 1",
  "descripcion": "Prueba",
  "duracion_minutos": 60,
  "preguntas": [
    {
      "enunciado": "¿Cuál es 2+2?",
      "tipo_pregunta": "UNICA",
      "nivel_dificultad": "BAJO",
      "opciones": [
        { "texto_opcion": "3", "es_correcta": false },
        { "texto_opcion": "4", "es_correcta": true }
      ]
    }
  ]
}
```

Ejemplo body (POST /usuarios)

```json
{
  "nombre": "Clara",
  "apellido": "Martinez",
  "correo": "clara.martinez@example.com",
  "contraseña": "Password123."
}

Ejemplo de body (POST /perfil-academico/:id_usuario)
```
```json
{
  "programa_academico": "Ingeniería de Sistemas",
  "semestre": 6
}
```
--------------------------------------------------------------------------------
**Realizar test de SIMULACRO**

Después de crear los simulacros, es posible ejecutar un test para simular la realización de uno.

---

### 1. Iniciar un intento de simulacro

Si trabajan desde la consola (PowerShell), usen:

```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/simulacros/1/intentos' -Method Post -ContentType 'application/json' -Body '{"id_usuario":1}' | ConvertTo-Json -Depth 5
```

**Importante:**
`/simulacros/1` → Reemplacen **1** por el ID del simulacro que desean realizar.

Este comando simula el **inicio de la prueba**.

---

### 2. Enviar respuestas del simulacro

```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/simulacros/intentos/1/respuestas' -Method Post -ContentType 'application/json' -Body '{"selected_option_ids":[1,2,3]}' | ConvertTo-Json -Depth 5
```

**Donde:**

* `intentos/1` → ID del intento generado al iniciar el simulacro.
* `"selected_option_ids":[1,2,3]` → IDs de las opciones seleccionadas como respuesta.

Los IDs de opciones pueden consultarse en la base de datos PostgreSQL (pgAdmin).

---

### 3. Finalizar el intento

```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/simulacros/intentos/1/finalizar' -Method Post | ConvertTo-Json -Depth 5
```

Este comando marca el intento como **terminado**.

Con esto se genera la información necesaria para las siguientes historias de usuario.

---

### 4. Listar intentos de un usuario

Para consultar los intentos realizados por un usuario específico (ejemplo: usuario ID 1):

```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/simulacros/usuarios/1/intentos' -Method Get | ConvertTo-Json -Depth 5
```

**Nota:**
Reemplacen el **ID del usuario** según corresponda.

Este endpoint devuelve un listado con todos los intentos del usuario, incluyendo los detalles del simulacro asociado a cada uno.
