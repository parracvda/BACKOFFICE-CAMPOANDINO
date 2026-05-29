# 🚀 GUÍA PASO A PASO: INSTALACIÓN EN SERVIDOR UBUNTU

## 📦 ARCHIVOS QUE DEBES COPIAR AL SERVIDOR

Desde tu carpeta `sistemas/despachos/` debes copiar estos archivos al servidor Ubuntu:

```
sistemas/despachos/
├── sync_erp_ordenes_venta.php          ⭐ PRINCIPAL - Script de sincronización
├── test_conexion_erp.php               🧪 Para probar conexión antes
├── install_sqlserver_drivers.sh        🔧 Instalador de drivers
├── sql_setup_ordenes_venta.sql         📊 Script de base de datos
└── api/
    └── obtener_ordenes_venta.php       🌐 API (ya debe existir en servidor)
```

**✅ Credenciales YA configuradas en los archivos:**
- Usuario ERP: `jparra`
- Contraseña ERP: `ije161718`
- Servidor ERP: `172.51.0.10\ORACLENIS`

---

## 🖥️ PASOS EN EL SERVIDOR UBUNTU

### 📍 **PASO 1: COPIAR ARCHIVOS AL SERVIDOR**

#### Opción A: Usando SCP (desde tu PC con PowerShell)
```powershell
# Copiar los archivos principales
scp sync_erp_ordenes_venta.php usuario@IP_SERVIDOR:/var/www/BACKOFFICE/sistemas/despachos/
scp test_conexion_erp.php usuario@IP_SERVIDOR:/var/www/BACKOFFICE/sistemas/despachos/
scp install_sqlserver_drivers.sh usuario@IP_SERVIDOR:/var/www/BACKOFFICE/sistemas/despachos/
scp sql_setup_ordenes_venta.sql usuario@IP_SERVIDOR:/var/www/BACKOFFICE/sistemas/despachos/
```

**Reemplaza:**
- `usuario` → tu usuario SSH del servidor
- `IP_SERVIDOR` → la IP de tu servidor Ubuntu

#### Opción B: Usando FileZilla / WinSCP
1. Conectarte al servidor por SFTP
2. Navegar a `/var/www/BACKOFFICE/sistemas/despachos/`
3. Arrastrar los 4 archivos desde tu PC

#### Opción C: Editar directamente en el servidor
Si ya tienes acceso SSH al servidor, puedes crear los archivos directamente con `nano`:
```bash
nano /var/www/BACKOFFICE/sistemas/despachos/sync_erp_ordenes_venta.php
# Copiar y pegar el contenido del archivo
```

---

### 📍 **PASO 2: INSTALAR DRIVERS SQL SERVER EN UBUNTU**

```bash
# 1. Conectarte al servidor por SSH
ssh usuario@IP_SERVIDOR

# 2. Ir a la carpeta del proyecto
cd /var/www/BACKOFFICE/sistemas/despachos/

# 3. Dar permisos de ejecución al instalador
chmod +x install_sqlserver_drivers.sh

# 4. Ejecutar el instalador (requiere sudo)
sudo bash install_sqlserver_drivers.sh

# ⏳ Este proceso puede tardar 5-10 minutos
# Aparecerá:
# - "¿Continuar con la instalación? (s/n):" → Presiona: s
# - Descargará e instalará paquetes de Microsoft
# - Compilará extensiones PHP

# 5. Al finalizar debe mostrar:
# ✅ INSTALACIÓN EXITOSA
# Módulos cargados:
#   sqlsrv
#   pdo_sqlsrv
```

**⚠️ IMPORTANTE:** Si el script da error, puede ser porque:
- No tienes permisos sudo → Contacta al administrador del servidor
- La versión de Ubuntu no es compatible → Verifica con `lsb_release -a`
- PHP no está instalado → Instala primero con `sudo apt install php php-cli php-mysql`

---

### 📍 **PASO 3: CONFIGURAR VPN PRITUNL**

#### A. Si Pritunl NO está instalado en el servidor:
```bash
# 1. Instalar cliente Pritunl
sudo apt update
sudo apt install pritunl-client-electron -y

# Alternativa (si el anterior falla):
curl -fsSL https://raw.githubusercontent.com/pritunl/pritunl-client-electron/master/install.sh | sudo bash
```

#### B. Importar archivo de configuración VPN
```bash
# 1. Copiar tu archivo .ovpn al servidor
# Desde tu PC:
scp TU_ARCHIVO.ovpn usuario@IP_SERVIDOR:/home/usuario/

# 2. En el servidor, importar el archivo
sudo pritunl-client add /home/usuario/TU_ARCHIVO.ovpn

# 3. Te pedirá un nombre para el perfil, escribe: nisira-vpn
```

#### C. Conectar la VPN
```bash
# Iniciar conexión
sudo pritunl-client start nisira-vpn

# Te pedirá:
# Username: jparra
# Password: HQQl5|L7Wd4>
# PIN: 20250841

# ✅ Si se conecta correctamente, verás: Connected

# Verificar estado
sudo pritunl-client list
# Debe aparecer: nisira-vpn [Connected]

# Probar conectividad al ERP
ping -c 4 172.51.0.10
# Debe responder con: 64 bytes from 172.51.0.10...
```

#### ⚠️ **MUY IMPORTANTE:** Configurar reconexión automática
```bash
# Para que la VPN se reconecte si se cae o al reiniciar el servidor

# Crear servicio systemd
sudo nano /etc/systemd/system/pritunl-autoconnect.service

# Pegar este contenido:
```
```ini
[Unit]
Description=Pritunl VPN Auto-connect
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/pritunl-client start nisira-vpn
ExecStop=/usr/bin/pritunl-client stop nisira-vpn
Restart=always
RestartSec=10
User=root

[Install]
WantedBy=multi-user.target
```
```bash
# Guardar: Ctrl+X → Y → Enter

# Habilitar el servicio
sudo systemctl enable pritunl-autoconnect.service
sudo systemctl start pritunl-autoconnect.service

# Verificar que esté corriendo
sudo systemctl status pritunl-autoconnect.service
```

---

### 📍 **PASO 4: CREAR TABLA EN MYSQL DEL SERVIDOR**

```bash
# 1. Conectar a MySQL
mysql -u root -p
# Ingresa la contraseña de MySQL del servidor

# 2. Seleccionar base de datos
USE campoand_campoandino;

# 3. Copiar y pegar el contenido de sql_setup_ordenes_venta.sql
# O ejecutarlo directamente:
exit;  # Salir de MySQL primero

# Ejecutar el script SQL
mysql -u root -p campoand_campoandino < sql_setup_ordenes_venta.sql

# ✅ Debe crear la tabla sin errores
```

---

### 📍 **PASO 5: PROBAR CONEXIÓN AL ERP**

```bash
# Con la VPN conectada, ejecutar:
cd /var/www/BACKOFFICE/sistemas/despachos/
php test_conexion_erp.php

# ✅ Si todo está bien, verás:
# ========================================
# TEST DE CONEXIÓN AL ERP NISIRA
# ========================================
# → Verificando extensiones PHP...
#    ✓ sqlsrv: 5.x.x
#    ✓ pdo_sqlsrv: 5.x.x
# → Probando conexión con PDO...
#    ✅ CONEXIÓN EXITOSA con PDO (150ms)
#    → Base de datos activa: campoandino
#    → Versión SQL Server: Microsoft SQL...
#    → Tablas encontradas relacionadas con órdenes/ventas:
#       • dbo.Productos (BASE TABLE)
#       • dbo.Clientes (BASE TABLE)
#       • ... etc

# ✅ TEST FINALIZADO EXITOSAMENTE

# ❌ Si da error:
# 1. Verifica que la VPN esté conectada: sudo pritunl-client list
# 2. Verifica ping al ERP: ping 172.51.0.10
# 3. Verifica extensiones PHP: php -m | grep sqlsrv
```

---

### 📍 **PASO 6: AJUSTAR CONSULTA SQL PARA TU TABLA DE PRODUCTOS**

Como me dijiste que por ahora solo tienes acceso a la tabla de maestro de productos, vamos a ajustar el script:

```bash
# Editar el archivo de sincronización
nano /var/www/BACKOFFICE/sistemas/despachos/sync_erp_ordenes_venta.php

# Busca la función obtenerOrdenesVentaERP() (alrededor de línea 75)
# Reemplaza la consulta SQL por una consulta a tu tabla de productos

# EJEMPLO (ajusta según lo que viste en test_conexion_erp.php):
```
```sql
SELECT TOP 100
    codigo AS orden_venta,           -- Temporal, usamos código de producto
    nombre AS cliente,                -- Temporal, nombre de producto
    '' AS ruc_cliente,
    GETDATE() AS fecha_orden,
    categoria AS condicion_venta,     -- O el campo que tengas
    estado AS estado,
    almacen AS origen,                -- Si tienes este campo
    '' AS destino,
    'PEN' AS moneda,
    precio AS total,
    descripcion AS observaciones
FROM Productos                        -- Tu tabla real
WHERE activo = 1
ORDER BY codigo DESC
```
```bash
# Guardar: Ctrl+X → Y → Enter
```

**💡 NOTA:** Como es solo para prueba, después ajustaremos esto para obtener las órdenes de venta reales.

---

### 📍 **PASO 7: EJECUTAR PRIMERA SINCRONIZACIÓN MANUAL**

```bash
# Ejecutar el script de sincronización
php sync_erp_ordenes_venta.php

# ✅ Debe mostrar:
# ========================================
# Sincronización ERP Órdenes de Venta
# 2026-03-18 21:30:00
# ========================================
# ✓ Conexión a SQL Server exitosa (PDO)
# → Consultando órdenes de venta del ERP...
# ✓ Obtenidas 50 órdenes
# → Sincronizando a MySQL...
# --- Resultados de sincronización ---
# ✓ Insertados: 50
# ✓ Actualizados: 0
# ✓ Sincronización completada en 2.34s
# ========================================

# Verificar datos en MySQL
mysql -u root -p -e "SELECT * FROM campoand_campoandino.erp_ordenes_venta LIMIT 5;"

# Debe mostrar los datos sincronizados
```

---

### 📍 **PASO 8: CONFIGURAR CRON (EJECUCIÓN AUTOMÁTICA)**

```bash
# Editar crontab
sudo crontab -e

# Si es la primera vez, te preguntará el editor, elige: nano (opción 1)

# Agregar esta línea AL FINAL del archivo:
*/10 * * * * /usr/bin/php /var/www/BACKOFFICE/sistemas/despachos/sync_erp_ordenes_venta.php >> /var/log/sync_erp.log 2>&1

# Esto significa:
# */10 = Cada 10 minutos
# /usr/bin/php = Ejecutar PHP
# /ruta/al/script.php = Tu script
# >> /var/log/sync_erp.log = Guardar salida en log
# 2>&1 = Incluir errores también

# Guardar: Ctrl+X → Y → Enter

# Verificar que se guardó
sudo crontab -l

# ✅ Debe mostrar tu línea agregada
```

---

### 📍 **PASO 9: MONITOREAR EJECUCIONES**

```bash
# Ver logs en tiempo real
tail -f /var/log/sync_erp.log

# Verás cada 10 minutos:
# ========================================
# Sincronización ERP Órdenes de Venta
# ...
# ✓ Sincronización completada
# ========================================

# Presiona Ctrl+C para salir

# Ver últimas 50 líneas del log
tail -n 50 /var/log/sync_erp.log

# Ver si el cron está ejecutándose
grep CRON /var/log/syslog | tail -n 20

# Verificar procesos PHP activos
ps aux | grep sync_erp
```

---

## 🎯 RESUMEN RÁPIDO

```bash
# ===== EN TU PC (Windows) =====
# 1. Copiar archivos al servidor
scp sync_erp_ordenes_venta.php usuario@IP:/var/www/BACKOFFICE/sistemas/despachos/
scp test_conexion_erp.php usuario@IP:/var/www/BACKOFFICE/sistemas/despachos/
scp install_sqlserver_drivers.sh usuario@IP:/var/www/BACKOFFICE/sistemas/despachos/
scp sql_setup_ordenes_venta.sql usuario@IP:/var/www/BACKOFFICE/sistemas/despachos/

# ===== EN EL SERVIDOR UBUNTU =====
# 2. Instalar drivers SQL Server
sudo bash install_sqlserver_drivers.sh

# 3. Configurar VPN
sudo pritunl-client add TU_ARCHIVO.ovpn
sudo pritunl-client start nisira-vpn
# (ingresar: jparra / HQQl5|L7Wd4> / 20250841)

# 4. Crear tabla en MySQL
mysql -u root -p campoand_campoandino < sql_setup_ordenes_venta.sql

# 5. Probar conexión
php test_conexion_erp.php

# 6. Ajustar consulta SQL en sync_erp_ordenes_venta.php
nano sync_erp_ordenes_venta.php
# (modificar consulta según tu tabla de productos)

# 7. Primera sincronización
php sync_erp_ordenes_venta.php

# 8. Configurar cron
sudo crontab -e
# Agregar: */10 * * * * /usr/bin/php /var/www/BACKOFFICE/sistemas/despachos/sync_erp_ordenes_venta.php >> /var/log/sync_erp.log 2>&1

# 9. Monitorear
tail -f /var/log/sync_erp.log
```

---

## ❓ PREGUNTAS FRECUENTES

### ¿Necesito tener la VPN activa en mi PC?
**No.** Solo el servidor Ubuntu necesita la VPN. Los usuarios finales NO necesitan VPN para usar el sistema BACKOFFICE.

### ¿Qué pasa si el servidor se reinicia?
Si configuraste el servicio systemd (Paso 3C), la VPN se reconectará automáticamente.

### ¿Cómo sé si el cron está funcionando?
Ver los logs: `tail -f /var/log/sync_erp.log`

### ¿Puedo cambiar la frecuencia de sincronización?
Sí, edita el cron:
- Cada 5 minutos: `*/5 * * * *`
- Cada 30 minutos: `*/30 * * * *`
- Cada hora: `0 * * * *`

### ¿Cómo detengo la sincronización?
```bash
# Detener cron (comentar la línea)
sudo crontab -e
# Agregar # al inicio de la línea cron

# O detener VPN
sudo pritunl-client stop nisira-vpn
```

---

## 📞 SOPORTE

Si tienes problemas:
1. **Revisa logs:** `tail -f /var/log/sync_erp.log`
2. **Verifica VPN:** `sudo pritunl-client list`
3. **Verifica extensiones:** `php -m | grep sqlsrv`
4. **Prueba conexión:** `php test_conexion_erp.php`

---

**Creado:** 18 de Marzo de 2026  
**Sistema:** Campo Andino - BACKOFFICE  
**Desarrollado por:** GitHub Copilot
