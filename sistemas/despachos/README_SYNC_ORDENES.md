# 📦 Sistema de Sincronización de Órdenes de Venta - ERP Nisira

Sistema de sincronización automática de órdenes de venta desde el ERP Nisira (SQL Server) hacia MySQL local, permitiendo consultas rápidas sin depender de la VPN.

---

## 🎯 ARQUITECTURA DE LA SOLUCIÓN

```
┌─────────────────┐       VPN Pritunl        ┌──────────────────┐
│ Ubuntu Server   │ ◄────────────────────► │ ERP Nisira       │
│ (Sincronizador) │   172.51.0.10\ORACLENIS │ SQL Server       │
└────────┬────────┘                          └──────────────────┘
         │
         │ Cada 10 minutos (cron)
         │ Copia datos
         ▼
┌─────────────────┐
│ MySQL Local     │
│ campoandino DB  │
└────────┬────────┘
         │
         │ API REST
         ▼
┌─────────────────┐
│ BACKOFFICE      │
│ Usuarios        │
└─────────────────┘
```

**✅ Ventajas:**
- Datos actualizados cada 10 minutos
- Sistema funciona sin VPN activa para usuarios finales
- Consultas súper rápidas (leen de MySQL local)
- Robusto: Si el servidor de sync falla, el sistema sigue con datos previos

---

## 📋 REQUISITOS EN UBUNTU SERVER

### 1️⃣ Software Base
```bash
# Verificar versión de PHP (mínimo 7.4)
php -v

# Instalar Apache/Nginx + PHP + MySQL (si no están)
sudo apt update
sudo apt install php php-cli php-mysql php-mbstring php-xml php-curl -y
```

### 2️⃣ Drivers SQL Server para PHP (CRÍTICO)

Ubuntu necesita drivers especiales para conectarse a SQL Server:

```bash
# Paso 1: Agregar repositorio de Microsoft
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
sudo curl https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/prod.list | sudo tee /etc/apt/sources.list.d/mssql-release.list

# Paso 2: Instalar driver ODBC y herramientas
sudo apt update
sudo ACCEPT_EULA=Y apt install msodbcsql18 mssql-tools18 unixodbc-dev -y

# Paso 3: Instalar extensiones PHP para SQL Server
sudo pecl install sqlsrv pdo_sqlsrv

# Paso 4: Habilitar extensiones en PHP
sudo bash -c 'echo "extension=sqlsrv.so" >> /etc/php/$(php -r "echo PHP_MAJOR_VERSION.\".\".PHP_MINOR_VERSION;")/cli/php.ini'
sudo bash -c 'echo "extension=pdo_sqlsrv.so" >> /etc/php/$(php -r "echo PHP_MAJOR_VERSION.\".\".PHP_MINOR_VERSION;")/cli/php.ini'

# Paso 5: Verificar instalación
php -m | grep sqlsrv
# Debe mostrar: sqlsrv y pdo_sqlsrv
```

### 3️⃣ Configurar VPN Pritunl

```bash
# Importar archivo de configuración VPN
sudo pritunl-client add /ruta/al/archivo.ovpn

# Conectar con credenciales
sudo pritunl-client start
# Usuario: jparra
# Contraseña: HQQl5|L7Wd4>
# PIN: 20250841

# Verificar conexión VPN
sudo pritunl-client list

# Probar conectividad al ERP
ping 172.51.0.10
```

**⚠️ IMPORTANTE:** La VPN debe estar activa antes de ejecutar el script de sincronización.

---

## 🚀 INSTALACIÓN PASO A PASO

### PASO 1: Crear Tabla en MySQL

```bash
# Conectar a MySQL
mysql -u root -p campoand_campoandino

# Ejecutar script SQL
mysql -u root -p campoand_campoandino < /ruta/a/sql_setup_ordenes_venta.sql
```

O importar manualmente el contenido de `sql_setup_ordenes_venta.sql`

### PASO 2: Configurar Credenciales del ERP

Editar archivo `sync_erp_ordenes_venta.php`:

```php
// ===========================
// CONFIGURACIÓN ERP SQL SERVER
// ===========================
$erp_config = [
    'host' => '172.51.0.10\ORACLENIS',  
    'port' => '1433',
    'database' => 'campoandino',
    'username' => 'USUARIO_REAL_ERP',      // ⚠️ CAMBIAR
    'password' => 'CONTRASEÑA_REAL_ERP',   // ⚠️ CAMBIAR
    'charset' => 'UTF-8'
];
```

**🔒 Recomendación de Seguridad:**
Solicitar al administrador del ERP un usuario de **SOLO LECTURA** para la sincronización.

### PASO 3: Ajustar Consulta SQL del ERP

El script tiene una consulta genérica en la función `obtenerOrdenesVentaERP()`. **DEBES ajustarla** según la estructura real de tu ERP Nisira:

```php
// ⚠️ AJUSTAR según tablas reales del ERP
$sql = "
    SELECT TOP 1000
        OV.NumeroOrden AS orden_venta,
        CLI.RazonSocial AS cliente,
        CLI.RUC AS ruc_cliente,
        -- ... ajustar nombres de tablas y columnas
    FROM OrdenesVenta OV  -- ⚠️ Verificar nombre real
    LEFT JOIN Clientes CLI ON ...
    WHERE OV.Estado IN ('Pendiente', 'Aprobada')
";
```

**📌 Cómo saber los nombres reales:**
1. Conectarte al SQL Server del ERP con SQL Server Management Studio
2. Explorar la base de datos `campoandino`
3. Identificar tablas de órdenes de venta y clientes
4. Ajustar la consulta según la estructura real

### PASO 4: Probar Sincronización Manual

```bash
# Activar VPN primero
sudo pritunl-client start

# Ejecutar script manualmente
cd /ruta/a/BACKOFFICE/sistemas/despachos
php sync_erp_ordenes_venta.php

# Revisar salida
# Debe mostrar: ✓ Conexión exitosa, ✓ X órdenes sincronizadas
```

### PASO 5: Configurar Cron Job (Ejecución Automática)

```bash
# Editar crontab
sudo crontab -e

# Agregar línea para ejecutar cada 10 minutos
*/10 * * * * /usr/bin/php /var/www/BACKOFFICE/sistemas/despachos/sync_erp_ordenes_venta.php >> /var/log/sync_erp.log 2>&1

# Guardar y salir (Ctrl+X, Y, Enter)
```

**Explicación del cron:**
- `*/10 * * * *` = Cada 10 minutos
- `php /ruta/script.php` = Ejecutar script
- `>> /var/log/sync_erp.log` = Guardar log
- `2>&1` = Capturar errores también

**Ver logs:**
```bash
tail -f /var/log/sync_erp.log
```

### PASO 6: Verificar API desde el Frontend

Abrir navegador y probar:
```
http://localhost/BACKOFFICE/sistemas/despachos/api/obtener_ordenes_venta.php
```

Debe devolver JSON con órdenes sincronizadas:
```json
{
  "success": true,
  "total": 15,
  "data": [
    {
      "orden_venta": "OV-2026-0001",
      "cliente": "Comercial ABC S.A.C.",
      "fecha_orden_formato": "15/03/2026",
      ...
    }
  ]
}
```

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### ❌ Error: "No hay extensiones de SQL Server disponibles"
```bash
# Verificar extensiones instaladas
php -m | grep sqlsrv

# Si no aparece, reinstalar:
sudo pecl install sqlsrv pdo_sqlsrv
sudo bash -c 'echo "extension=sqlsrv.so" >> /etc/php/8.1/cli/php.ini'  # Ajustar versión
```

### ❌ Error: "No se pudo conectar al ERP"
```bash
# 1. Verificar VPN activa
sudo pritunl-client list
# Estado debe ser: Connected

# 2. Probar conectividad
ping 172.51.0.10
telnet 172.51.0.10 1433

# 3. Verificar credenciales en sync_erp_ordenes_venta.php
```

### ❌ Error: "Access denied for user..."
- Revisar usuario y contraseña del ERP en `$erp_config`
- Verificar que el usuario tenga permisos de lectura en la DB

### ❌ Cron no ejecuta
```bash
# Ver logs del sistema
sudo tail -f /var/log/syslog | grep CRON

# Verificar sintaxis del cron
crontab -l

# Probar ejecución manual
/usr/bin/php /ruta/completa/al/script.php
```

---

## 📊 MONITOREO Y MANTENIMIENTO

### Ver última sincronización
```sql
SELECT orden_venta, cliente, fecha_sincronizacion 
FROM erp_ordenes_venta 
ORDER BY fecha_sincronizacion DESC 
LIMIT 10;
```

### Limpiar órdenes antiguas (más de 6 meses)
```sql
DELETE FROM erp_ordenes_venta 
WHERE fecha_orden < DATE_SUB(NOW(), INTERVAL 6 MONTH);
```

### Ver estadísticas
```sql
SELECT 
    COUNT(*) as total_ordenes,
    SUM(CASE WHEN activo=1 THEN 1 ELSE 0 END) as activas,
    MAX(fecha_sincronizacion) as ultima_sync
FROM erp_ordenes_venta;
```

---

## 🔐 SEGURIDAD

1. **Usuario ERP:** Solicitar usuario de solo lectura (SELECT)
2. **API:** La API está sin autenticación. Para producción, considera agregar:
   ```php
   // En api/obtener_ordenes_venta.php
   session_start();
   if (!isset($_SESSION['usuario'])) {
       http_response_code(401);
       echo json_encode(['success' => false, 'mensaje' => 'No autenticado']);
       exit;
   }
   ```
3. **Logs:** Revisar periódicamente `/var/log/sync_erp.log`

---

## 📈 PRÓXIMOS PASOS (OPCIONAL)

1. **Sincronizar más tablas:** Clientes, Productos, Almacenes
2. **Dashboard de monitoreo:** Panel para ver estado de sincronización
3. **Alertas:** Enviar email si la sincronización falla
4. **Cache:** Implementar Redis para consultas más rápidas

---

## 👨‍💻 SOPORTE

**Desarrollado por:** GitHub Copilot  
**Fecha:** Marzo 2026  
**Contacto:** jparra (Campo Andino)

**Archivos del sistema:**
- `sql_setup_ordenes_venta.sql` - Estructura de tablas
- `sync_erp_ordenes_venta.php` - Script de sincronización
- `api/obtener_ordenes_venta.php` - API REST
- `registro.php` - Formulario con combo de órdenes
- `README_SYNC_ORDENES.md` - Este documento

---

👍 **¡Listo para producción!** El sistema funcionará automáticamente cada 10 minutos.
