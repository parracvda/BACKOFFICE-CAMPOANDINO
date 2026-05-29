# Solución a Problemas de Sincronización de Stock

## Problema Identificado

Algunos productos no se migran correctamente desde Google Sheets a la tabla `stock_materiales`, como el código **303020060** que existe en el CSV pero no aparece en la base de datos.

## ✅ Diagnóstico Realizado

El script de diagnóstico confirmó que:
- ✅ El código **303020060** SÍ está en el CSV de Google (3 registros encontrados)
- ✅ El CSV tiene 4056 líneas con 793 códigos únicos
- ✅ Todas las filas tienen las 20 columnas esperadas
- ❌ El problema inicial era un **timeout de conexión** a la base de datos

## 🔧 Problema de Conexión Solucionado

El script original usaba la IP incorrecta (`201.148.104.227` en lugar de `201.148.104.83`). Los scripts han sido corregidos para usar la configuración centralizada de `shared/conexion.php`.

## Scripts Disponibles

### 1. 🧪 `test_conexion.php` - **EJECUTAR PRIMERO**

Prueba múltiples configuraciones de conexión para identificar cuál funciona en tu hosting.

**Uso:**
```
https://tu-hosting.com/sistemas/requerimientos/test_conexion.php?token=SECRETO
```

**Te mostrará:**
- ✅ Cuál método de conexión funciona
- 📊 Cuántos registros hay actualmente en stock_materiales
- ✅ Si el código 303020060 existe en la DB
- 📍 Información del servidor

### 2. 🔍 `diagnostico_producto.php` - Diagnóstico Individual

Verifica un código específico en CSV y DB sin hacer cambios.

**Uso:**
```
diagnostico_producto.php?token=SECRETO&codigo=303020060
```

### 3. 📊 `comparar_stock.php` - Comparador Completo

Lista TODOS los productos que están en CSV pero no en DB.

**Uso:**
```
comparar_stock.php?token=SECRETO
```

### 4. 🚀 `sync_stock_materiales_mejorado.php` - Sincronización Completa

Script principal con logging completo (usa configuración de `conexion.php`).

**Uso:**
```
sync_stock_materiales_mejorado.php?token=SECRETO
```

### 5. 🏠 `sync_stock_localhost.php` - Sincronización con Localhost

Versión alternativa que usa `localhost` directamente (por si la IP remota no funciona).

**Uso:**
```
sync_stock_localhost.php?token=SECRETO
```

## 📋 Pasos a Seguir (EN ORDEN)

### Paso 1: Probar Conexión
```
test_conexion.php?token=SECRETO
```

Este script probará:
- Conexión usando `conexion.php`
- Conexión directa a `201.148.104.83`
- Conexión a `localhost`
- Conexión a `127.0.0.1`

**Identifica cuál método funciona** y usa el script correspondiente.

### Paso 2: Ejecutar Sincronización

**Opción A** - Si funciona con `conexion.php`:
```
sync_stock_materiales_mejorado.php?token=SECRETO
```

**Opción B** - Si solo funciona con `localhost`:
```
sync_stock_localhost.php?token=SECRETO
```

### Paso 3: Verificar Resultado

El script te mostrará:
- ✅ Registros insertados
- ❌ Errores encontrados
- 🔍 Si el código 303020060 se insertó correctamente
- 📊 Total de registros en la DB

### Paso 4: Revisar Logs

Descarga del hosting:
- `cron_sync.log` - Log general
- `cron_sync_errors.log` - Errores específicos con línea y código

## 🔍 Monitorear Más Códigos

Para monitorear más productos, edita la línea 129 en el script de sincronización:

```php
$codigosBuscados = ['303020060', 'OTRO_CODIGO', 'OTRO_MAS'];
```

El script te alertará si esos códigos:
- Aparecen en el CSV
- Se insertan correctamente
- Tienen errores SQL

## ⚠️ Solución de Problemas de Conexión

### Error: "Connection timed out"

Si ves el error `mysqli::__construct(): (HY000/2002): Connection timed out`, significa que el servidor no puede conectarse a la IP de la base de datos.

**Soluciones:**

1. **Usa `test_conexion.php` primero** para identificar qué configuración funciona
2. **Si la BD está en el mismo servidor del hosting**, usa `sync_stock_localhost.php`
3. **Si necesitas IP remota**, verifica:
   - Firewall del servidor MySQL
   - Permisos del usuario desde la IP del hosting
   - Puerto 3306 abierto
   - Whitelist de IPs en el panel de hosting

### Verificar configuración actual

En phpMyAdmin o MySQL, ejecuta:
```sql
-- Ver desde dónde puede conectarse el usuario
SELECT user, host FROM mysql.user WHERE user = 'campoand_sistemas2';

-- Si el host es 'localhost', solo puede conectar localmente
-- Si es '%', puede conectar desde cualquier IP
-- Si es una IP específica, solo desde esa IP
```

## 📊 Verificación Manual en phpMyAdmin

```sql
-- Ver si existe el código
SELECT * FROM stock_materiales WHERE Codigo = '303020060';

-- Ver cuántos registros hay
SELECT COUNT(*) FROM stock_materiales;

-- Ver códigos únicos
SELECT COUNT(DISTINCT Codigo) FROM stock_materiales;

-- Ver productos duplicados por código
SELECT Codigo, COUNT(DISTINCT Producto) as variaciones 
FROM stock_materiales 
GROUP BY Codigo 
HAVING variaciones > 1;
```

## 🚀 Actualizar Power Automate

Una vez identificado el script que funciona, actualiza la URL en Power Automate:

**Si funciona con conexion.php:**
```
https://tu-hosting.com/sistemas/requerimientos/sync_stock_materiales_mejorado.php?token=SECRETO
```

**Si solo funciona con localhost:**
```
https://tu-hosting.com/sistemas/requerimientos/sync_stock_localhost.php?token=SECRETO
```

## 📁 Archivos de Log Generados

Los scripts generan estos archivos en el hosting:
- `cron_sync.log` - Registro general con timestamps
- `cron_sync_errors.log` - Errores detallados (línea, código, mensaje SQL)
- `productos_faltantes_YYYYMMDD_HHMMSS.txt` - Lista exportada por comparar_stock.php

## 💡 Tips Importantes

1. **Siempre ejecuta `test_conexion.php` primero** si cambias de servidor o hosting
2. **Los logs persisten entre ejecuciones** - puedes revisarlos para ver el historial
3. **El TRUNCATE borra toda la tabla** antes de insertar - asegúrate que el CSV esté completo
4. **Cada script tiene token de seguridad** - nunca lo compartas públicamente
