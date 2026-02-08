# DeepSaffix API — Instrucciones rápidas

En este README explico cómo levantar la API localmente y cómo probar los endpoints de `usuarios` y `simulacros` usando las colecciones de Postman incluidas en `postman/`.

Requisitos
- Postgres (la conexión está en `.env` como `DATABASE_URL`), por seguridad esta se encuentra previamente puesta en .gitignore tendran que crearla en caso de no tenerla y pondran esta linea de codigo:

DATABASE_URL="postgresql://postgres:<sucontraseña>@localhost:5432/<nombrebdPostgreSQL>?schema=public"

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

Endpoints Usuarios
- `POST /usuarios` — crear usuario
- `GET /usuarios` — listar usuarios
- `GET /usuarios/:id` — obtener usuario por id
- `PATCH /usuarios/:id` — actualizar usuario por id
- `DELETE /usuarios/:id` — eliminar usuario por id
- `PATCH /usuarios/:id/desactivar` — desactivar usuario por id

Endpoints Simulacros
- `POST /simulation` — crear un `Simulacro` con sus `preguntas` y `opciones` en la misma petición
- `GET /simulation` — listar simulation
- `GET /simulation/:id` — obtener simulacro por id (incluye preguntas y opciones)
- `POST /simulation/:id/intentos` — iniciar un intento de simulacro para un usuario
- `POST /simulation/intentos/:id/respuestas` — enviar respuestas para
- `POST /simulation/intentos/:id/finalizar` — finalizar intento y calcular resultado
- `GET /simulation/usuarios/:userId/intentos` — listar intentos de simulation realizados por un usuario

Endpoints Perfil Académico
- `POST /perfil-academico/:id_usuario'` — crear perfil académico para un usuario 
- `GET /perfil-academico/:id_usuario` — obtener perfil académico por id de usuario
- `PATCH /perfil-academico/:id_usuario` — actualizar perfil académico por id de usuario
- `DELETE /perfil-academico/:id_usuario` — eliminar perfil académico por id de usuario

! Colecciones Postman
- Usuarios: `postman/Usuarios.postman_collection.json` — solicitudes para crear usuarios.
- Simulation (Simulacros): `postman/Simulation.postman_collection.json` — crear/listar/obtener simulacros.
- Perfil Académico: `postman/PerfilAcademico.postman_collection.json` — soliitud para crear los perfiles academicos de los usuarios.

Esto es para que no tengan que estar creando los usuarios manualmente dentro de Postman, la carpeta se llama /postman y habra tres archivos en uno encontraran los usuarios, en otro encontraran los simulacros y el otro los perfiles académicos. 

!Cómo importar en Postman 
1. Abrir Postman → Import → elegir archivo → seleccionar cualquiera de los JSON en `postman/`.
2. Configurar la variable `base_url` en la colección (por defecto `http://localhost:3000`).
3. Ejecutar requests (asegura que la API esté corriendo y que `.env` tenga `DATABASE_URL`).

!Ojo si no quieren hacer el import a postman deberan instalar newman que les permitira ejecutar los dos archivos de la carpeta directamente desde la consola, deberan estar en el directorio raiz para hacerlo, esto se hace de la siguiente forma:

Instalacion:
#Global
npm install -g newman

#Local
npm install --save-dev newma

Ejecucion:
- Para usuarios:
npx newman run postman/Usuarios.postman_collection.json --env-var "base_url=http://localhost:3000"

- Para perfiles academicos:
npx newman run postman/Perfil.postman_collection.json --env-var "base_url=http://localhost:3000"

-Para simulacros:
npx newman run postman/Simulation.postman_collection.json --env-var "base_url=http://localhost:3000"


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

```json
{
  "programa_academico": "Ingeniería de Sistemas",
  "semestre": 6
}
```
--------------------------------------------------------------------------------
Realizar test SIMULACRO:

Despues de crear los simulacros ahora podran realizar un test para simular la realizacion de un simulacro,
para ello.

!! Si trabajan sobre la consola (PowerShell) pondran este comando:

Invoke-RestMethod -Uri 'http://localhost:3000/simulacros/1/intentos' -Method Post -ContentType 'application/json' -Body '{"id_usuario":1}' | ConvertTo-Json -Depth 5

! Recuerden que simulation/1 <- aqui pondran el id del simulacro a realizar

Esto lo que hara es simular el inicio de la prueba, ahora para simular las respuestas usaran este comando:

Invoke-RestMethod -Uri 'http://localhost:3000/simulacros/intentos/1/respuestas' -Method Post -ContentType 'application/json' -Body '{"selected_option_ids":[1,2,3]}' | ConvertTo-Json -Depth 5

Donde:
selected_option_ids":[1,2,3]  Seran las opciones de respuesta, estos ids de pregunta los podran ver en la base de datos de postgreSQL (pgadmin)

Ahora con el comando:

Invoke-RestMethod -Uri 'http://localhost:3000/simulacros/intentos/1/finalizar' -Method Post | ConvertTo-Json -Depth 5

Podran "terminar" intento

Con esto ya tendran la data necesaria para las siguientes historias de usuario.

Para listar los intentos realizados por un usuario especifico podran usar el siguiente comando, que en el ejemplo se usará para el usuario con id 1:

Invoke-RestMethod -Uri 'http://localhost:3000/simulacros/usuarios/1/intentos' -Method Get | ConvertTo-Json -Depth 5

! Recuerden cambiar el id del usuario por el que quieran consultar los intentos realizados.

Esto les devolvera un listado con todos los intentos realizados por ese usuario, incluyendo detalles del simulacro asociado a cada intento.
