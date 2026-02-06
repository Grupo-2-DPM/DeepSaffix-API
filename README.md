# DeepSaffix API — Instrucciones rápidas

En este README explico cómo levantar la API localmente y cómo probar los endpoints de `usuarios` y `simulation` usando las colecciones de Postman incluidas en `postman/`.

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

Endpoints principales (implementados)
- `/usuarios`
- `POST /simulation` — crear un `Simulacro` con sus `preguntas` y `opciones` en la misma petición
- `GET /simulation` — listar simulacros
- `GET /simulation/:id` — obtener simulacro por id (incluye preguntas y opciones)

! Colecciones Postman
- Usuarios: `postman/Usuarios.postman_collection.json` — solicitudes para crear usuarios.
- Simulation: `postman/Simulation.postman_collection.json` — crear/listar/obtener simulacros.

Esto es para que no tengan que estar creando los usuarios manualmente dentro de Postman, la carpeta se llama /postman y habra dos archivos en uno encontraran los usuarios y en el otro encontraran los simulacros. 

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

-Para simulacros:
npx newman run postman/Simulation.postman_collection.json --env-var "base_url=http://localhost:3000"


Ejemplo body (POST /simulation)

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
--------------------------------------------------------------------------------
Realizar test SIMULACRO:

Despues de crear los simulacros ahora podran realizar un test para simular la realizacion de un simulacro,
para ello.

!! Si trabajan sobre la consola (PowerShell) pondran este comando:

Invoke-RestMethod -Uri 'http://localhost:3000/simulation/1/attempts' -Method Post -ContentType 'application/json' -Body '{"id_usuario":1}' | ConvertTo-Json -Depth 5

! Recuerden que simulation/1 <- aqui pondran el id del simulacro a realizar

Esto lo que hara es simular el inicio de la prueba, ahora para simular las respuestas usaran este comando:

Invoke-RestMethod -Uri 'http://localhost:3000/simulation/attempts/1/answers' -Method Post -ContentType 'application/json' -Body '{"selected_option_ids":[1,2,3]}' | ConvertTo-Json -Depth 5

Donde:
selected_option_ids":[1,2,3]  Seran las opciones de respuesta, estos ids de pregunta los podran ver en la base de datos de postgreSQL (pgadmin)

Ahora con el comando:

Invoke-RestMethod -Uri 'http://localhost:3000/simulation/attempts/1/finish' -Method Post | ConvertTo-Json -Depth 5

Podran "terminar" intento

Con esto ya tendran la data necesaria para las siguientes historias de usuario.

--------------------------------------------------------------------------------
Para listar los intentos realizados por un usuario especifico podran usar el siguiente comando, que en el ejemplo se usará para el usuario con id 1:

Invoke-RestMethod -Uri 'http://localhost:3000/simulation/users/1/attempts' -Method Get | ConvertTo-Json -Depth 5

! Recuerden cambiar el id del usuario por el que quieran consultar los intentos realizados.

Esto les devolvera un listado con todos los intentos realizados por ese usuario, incluyendo detalles del simulacro asociado a cada intento.
