# Respuestas a preguntas Teóricas

---

**1. Arquitectura hexagonal en Laravel con Angular en frontend**

Para implementar la arquitectura hexagonal en Laravel, organizo el backend en capas claras: el dominio contiene la lógica de negocio pura, independiente de Laravel; los puertos son interfaces que definen contratos para repositorios, servicios externos, etc.; y los adaptadores son las implementaciones concretas que usan Eloquent, APIs o colas. Laravel facilita esto con contratos y servicios. En Angular, el frontend consume APIs bien definidas y desacopladas del backend, lo que permite independencia en desarrollo y despliegue.

Los beneficios son claros: el backend es mantenible, testeable y flexible para cambios tecnológicos, mientras que el frontend Angular puede evolucionar sin depender directamente de detalles internos de Laravel, favoreciendo la escalabilidad y modularidad del sistema completo.

---

**2. Inyección de dependencias en Laravel y Angular**

Laravel usa un contenedor de servicios que resuelve dependencias automáticamente, generalmente mediante inyección por constructor en controladores o servicios. La configuración se hace en providers y bindings en el contenedor. Angular también usa inyección por constructor, pero orientado a componentes y servicios frontend, con decoradores como `@Injectable`.

La diferencia clave está en que Laravel maneja dependencias backend y ciclo de vida de objetos servidor, mientras Angular lo hace en el navegador, con scopes de componentes y módulos. En ambos casos, la inyección por constructor es la práctica recomendada para claridad, testabilidad y control.

---

**3. Manejo de entornos en Laravel y sincronización con Angular**

En Laravel, se manejan entornos con archivos `.env` para cada contexto (local, staging, production), donde configuro bases de datos, cachés, etc. En Angular, uso archivos de entorno (`environment.ts`, `environment.prod.ts`) para definir URLs y configuraciones específicas.

La sincronización se logra definiendo variables comunes, como URLs de API o tokens, y pasando estas configuraciones en tiempo de build o deploy. Por ejemplo, Angular apunta a la API backend según el entorno, y Laravel garantiza que la configuración corresponda a ese ambiente, manteniendo coherencia entre frontend y backend.

---

**4. Monitoreo con Laravel Horizon/Telescope y Angular**

Laravel Horizon permite monitorear colas y jobs en producción, mostrando tiempos, errores y estado. Laravel Telescope da insights en tiempo real de solicitudes, consultas DB, excepciones y logs. En Angular, se pueden integrar herramientas como Google Analytics, Sentry o monitoreo personalizado para rastrear rendimiento, errores y uso.

Complementariamente, monitorearía en Laravel métricas de backend críticas como rendimiento de colas, consultas lentas y excepciones, mientras que en Angular me enfocaría en tiempos de carga, errores frontend y experiencia de usuario. Esto da una visión completa del sistema.

---

**5. Lazy loading en Angular y beneficios con backend Laravel**

Lazy loading en Angular se implementa dividiendo la aplicación en módulos que se cargan bajo demanda usando rutas con `loadChildren`. Esto reduce el bundle inicial y acelera la carga.

Con un backend Laravel, esta estrategia permite que el frontend cargue rápido y solicite datos al backend solo cuando sea necesario, optimizando el uso de recursos, mejorando la escalabilidad y la experiencia del usuario en aplicaciones grandes y complejas.

---

**6. Optimización de rendimiento en Angular y Laravel**

Para optimizar la carga inicial y la experiencia continua, en Angular aplico lazy loading, preloading selectivo, uso ChangeDetectionStrategy OnPush y manejo eficiente observables. En Laravel, optimizo consultas con Eloquent eager loading, cacheo de respuestas, optimización de middleware y uso adecuado de colas.

Además, implemento compresión HTTP, CDN para assets, y monitoreo constante para detectar cuellos de botella. La comunicación eficiente entre Angular y Laravel, con APIs REST bien diseñadas y paginación, asegura que la aplicación escale y mantenga buen rendimiento a medida que crece.

---

## Información sobre el proyecto

El backend está desplegado en un servidor de Railway, atendiendo peticiones para Postman (los archivos de colección y environment están en la carpeta `postman` del proyecto). Está desarrollado en Laravel aplicando Arquitectura Hexagonal y DDD, dividiendo la lógica en bounded contexts del sistema de Logística.

Se implementaron funcionalidades clave como registro, inicio de sesión, manejo de roles y permisos, y control de acceso a funcionalidades según roles.

El frontend Angular está desplegado en: https://logistics-sinergia.vercel.app/auth/login. Está desarrollado usando standalone components, con una estructura organizada en carpetas `core`, `shared` y `features`, que contiene la lógica de negocio del sistema.

---

**Credenciales de acceso para la plataforma de logistica**

Usuario Administrador: 
- Correo: jhonatan@example.com
- Contraseña: password123

Cabe resaltar que el administrador tiene acceso basicamente al sistema maestro de logística, este se encarga de gestionar todo lo concerniente a clientes, productos, destinos (puertos o bodegas), unidades de transporte y entregas para los clientes.

Usuario Cliente: 
- Correo: angel@example.com
- Contraseña: password123

El usuario puede unicamente puede registrarse en el sistema como cliente, una vez autenticado puede hacer un pedido (delivery para la empresa) y asimismo puede listar todos los pedidos que tiene a su nombre.

El sistema se basa en la solución como MVP con funcionalidades básicas que cubren los requerimientos planteados en la prueba.

---

## Configuración del Backend Laravel

Después de clonar el repositorio, sigue estos pasos para configurar y levantar el backend Laravel en tu entorno local:

1. **Instalar dependencias**

```bash
composer install
```

2. **Configurar variables de entorno**
Copia el archivo .env.example a .env y ajusta las variables necesarias (base de datos, cache, etc.):

```bash
cp .env.example .env
```

3. **Comandos a ejecutar**

```bash
php artisan key:generate
```

```bash
php artisan migrate
```

```bash
php artisan db:seed
```

```bash
php artisan serve
```

Con esto, el backend Laravel debería estar listo y corriendo en http://localhost:8000 o el puerto que indique el comando.


## Configuración del Frontend Angular

Después de clonar el repositorio, sigue estos pasos para configurar y levantar la aplicación Angular en tu entorno local:

1. **Instalar dependencias**
Después de clonar el repositorio, sigue estos pasos para configurar y levantar la aplicación Angular en tu entorno local:

```bash
npm install
```

2. **Variables de entorno**
Asegúrate de tener configurados los archivos de entorno (environment.ts, environment.prod.ts) con las URLs y configuraciones correctas para tu backend.
Aunque es probable que ya tengas las variables de entorno ya que para esta prueba en especifico lo determiné que estuvieran presentes a la hora de bajar el repositorio compartido.

3. **Iniciar el proyecto**
```bash
ng serve
```

## Testing

Se implementaron pruebas unitarias enfocadas en los puntos críticos del sistema, como la autenticación y gestión de usuarios. Por ejemplo, en el caso de uso de login, se validan escenarios clave como:

- Inicio de sesión exitoso con credenciales correctas.
- Manejo de excepción cuando el usuario no existe.
- Manejo de excepción cuando la contraseña es inválida.

Estas pruebas usan PHPUnit y mocks para aislar dependencias, garantizando la calidad y robustez de la lógica de negocio central del backend.




