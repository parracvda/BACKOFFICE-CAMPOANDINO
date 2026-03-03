# ====================================================================
# GUÍA DE INSTALACIÓN Y CONFIGURACIÓN
# Sincronización Vista uv_reporte_controlhorno2 (Hosting → Servidor Físico)
# ====================================================================

## 📋 RESUMEN
- Origen: Vista `uv_reporte_controlhorno2` en hosting (campoand_campoandino)
- Destino: Tabla `control_horno_v2` en servidor físico (campoand_campoandino_v2)
- Frecuencia: Cada 5 minutos
- Método: Sincronización incremental por fecha

## 🗂️ ARCHIVOS GENERADOS
1. create_table_controlhorno_fisico.sql - Script para crear tabla en servidor físico
2. sync_horno_origen.php - Script que se ejecuta en HOSTING
3. sync_horno_receptor.php - Script que se ejecuta en SERVIDOR FÍSICO

---

## 🚀 PASOS DE INSTALACIÓN

### PASO 1: Crear la tabla en el servidor físico
```bash
# Conectar al servidor físico
ssh jparra@192.168.2.244

# Conectar a MySQL
mysql -u jparra -p

# Escribir contraseña: parracvda_x

# Seleccionar base de datos
USE campoand_campoandino_v2;

# Ejecutar el script SQL (copiar y pegar el contenido de create_table_controlhorno_fisico.sql)
```

O si tienes el archivo en el servidor:
```bash
mysql -u jparra -pparracvda_x campoand_campoandino_v2 < create_table_controlhorno_fisico.sql
```

---

### PASO 2: Subir sync_horno_receptor.php al servidor físico
```bash
# Copiar archivo al servidor físico
scp sync_horno_receptor.php jparra@192.168.2.244:/var/www/html/

# O la ruta donde tengas tu servidor web (nginx/apache)
# Ejemplos comunes:
# /var/www/html/
# /usr/share/nginx/html/
# /home/jparra/public_html/
```

Asegúrate de que el archivo tenga permisos correctos:
```bash
ssh jparra@192.168.2.244
cd /var/www/html/
chmod 644 sync_horno_receptor.php
```

---

### PASO 3: Subir sync_horno_origen.php al HOSTING
- Usa DirectAdmin, FTP o File Manager
- Sube el archivo a: /home/campoand/public_html/ (o la ruta de tu proyecto)
- Verifica que tenga permisos de ejecución (644 o 755)

---

### PASO 4: Configurar CRON en el HOSTING

#### Opción A: Desde DirectAdmin
1. Accede a DirectAdmin
2. Ve a "Cron Jobs" o "Tareas Programadas"
3. Crea un nuevo cron con:
   - Minuto: */5 (cada 5 minutos)
   - Hora: *
   - Día: *
   - Mes: *
   - Día de la semana: *
   - Comando: 
     ```
     /usr/bin/php /home/campoand/public_html/sync_horno_origen.php
     ```

#### Opción B: Editando crontab manualmente (si tienes acceso SSH)
```bash
# Editar crontab
crontab -e

# Agregar esta línea:
*/5 * * * * /usr/bin/php /home/campoand/public_html/sync_horno_origen.php >> /home/campoand/public_html/sync_horno_cron.log 2>&1

# Guardar y salir (Ctrl+O, Enter, Ctrl+X en nano)
```

---

### PASO 5: Verificar ruta del PHP en hosting
```bash
# Conectar por SSH al hosting
which php
# O
whereis php

# Usar la ruta exacta en el cron, por ejemplo:
#                                                                                                                                                                                                                        
# /usr/bin/php8.1
# /opt/php81/bin/php
```

---

## 🔍 VERIFICACIÓN Y MONITOREO

### Archivos de log generados automáticamente:

**En el HOSTING (origen):**
- `sync_horno_run.log` - Registro de cada ejecución
- `sync_horno_count.log` - Cantidad de filas procesadas
- `sync_horno_sample.log` - Muestra de primera fila
- `sync_horno_empty.log` - Cuando no hay datos nuevos
- `sync_horno_error.log` - Errores de conexión/envío
- `sync_horno_ok.log` - Sincronizaciones exitosas
- `last_sync_horno.txt` - Última fecha sincronizada

**En el SERVIDOR FÍSICO (destino):**
- `sync_horno_error.log` - Errores al recibir/insertar
- `sync_horno_ok.log` - Datos recibidos correctamente

### Comandos para monitorear:
```bash
# Ver últimas ejecuciones en HOSTING
tail -f /ruta/sync_horno_ok.log

# Ver errores en HOSTING
tail -f /ruta/sync_horno_error.log

# Verificar última fecha sincronizada
cat /ruta/last_sync_horno.txt

# Ver ejecuciones del cron
grep CRON /var/log/syslog | grep sync_horno

# En servidor físico, ver logs
ssh jparra@192.168.2.244
tail -f /var/www/html/sync_horno_ok.log
```

---

## 🧪 PRUEBA MANUAL

### Ejecutar manualmente para probar:
```bash
# En HOSTING
php /ruta/completa/sync_horno_origen.php

# Deberías ver "OK" si funciona correctamente
```

### Verificar datos en servidor físico:
```bash
ssh jparra@192.168.2.244
mysql -u jparra -pparracvda_x campoand_campoandino_v2

SELECT COUNT(*) FROM control_horno_v2;
SELECT * FROM control_horno_v2 ORDER BY fecha_sincronizacion DESC LIMIT 10;
```

---

## ⚙️ AJUSTES IMPORTANTES

### Cambiar el TOKEN de seguridad:
1. Edita `sync_horno_origen.php` línea ~18
2. Edita `sync_horno_receptor.php` línea ~10
3. Usa el mismo token en ambos archivos
4. Ejemplo: `$TOKEN_VALIDO = 'Mi_T0k3n_5up3r_53gur0_2026_xyz123';`

### Ajustar frecuencia del CRON:
- Cada 5 min: `*/5 * * * *`
- Cada 10 min: `*/10 * * * *`
- Cada 15 min: `*/15 * * * *`
- Cada hora: `0 * * * *`
- Cada día a las 2am: `0 2 * * *`

### Timeout y optimización:
Si tienes muchos registros, ajusta en sync_horno_origen.php:
```php
CURLOPT_TIMEOUT => 120  // Aumentar a 120 segundos
```

---

## 🔧 TROUBLESHOOTING

### Error: "Token inválido"
- Verifica que el token sea idéntico en ambos archivos

### Error: conexión rechazada a 192.168.2.244
- Verifica que el servidor web esté corriendo: `sudo systemctl status apache2` o `nginx`
- Verifica firewall: `sudo ufw allow 80/tcp`
- Verifica que la IP sea accesible desde el hosting

### No se sincronizan datos
- Revisa `sync_horno_error.log` y `sync_horno_empty.log`
- Verifica que haya datos nuevos en la vista después de la última fecha en `last_sync_horno.txt`
- Ejecuta manualmente para ver errores en tiempo real

### Cron no se ejecuta
- Verifica logs del sistema: `grep CRON /var/log/syslog`
- Verifica permisos del archivo PHP: `chmod 755 sync_horno_origen.php`
- Verifica ruta del PHP: `which php`

---

## 📊 ESTRUCTURA DE LA TABLA

```sql
control_horno_v2
├── id (PK, AUTO_INCREMENT)
├── fecha_tratamiento (DATE) - De la vista
├── estacion (VARCHAR) - De la vista
├── lote (VARCHAR) - De la vista
├── codigo_pallet (VARCHAR) - De la vista
├── codigo (VARCHAR) - De la vista
├── producto (VARCHAR) - De la vista
├── cantidad_und (DECIMAL) - De la vista
├── cantidad_m3 (DECIMAL) - De la vista
├── fecha_sincronizacion (DATETIME) - Automático
└── ultima_actualizacion (DATETIME) - Automático

UNIQUE KEY: (fecha_tratamiento, estacion, lote, codigo_pallet, codigo)
```

---

## 📞 DATOS DE CONEXIÓN

**Servidor Físico (Local):**
- IP: 192.168.2.244
- Usuario SSH: jparra
- Contraseña: parracvda_x
- Base de datos: campoand_campoandino_v2
- Usuario MySQL: jparra
- Contraseña MySQL: parracvda_x

**Hosting (DirectAdmin):**
- Base de datos: campoand_campoandino
- Usuario MySQL: jparra (o campoand_sistemas2)
- Contraseña: parracvda_x

---

¡Listo! La sincronización debería funcionar automáticamente cada 5 minutos.
