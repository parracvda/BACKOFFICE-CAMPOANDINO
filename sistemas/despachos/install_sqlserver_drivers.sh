#!/bin/bash
# Script de instalación rápida de drivers SQL Server para Ubuntu
# Ejecutar con: sudo bash install_sqlserver_drivers.sh

echo "=========================================="
echo "Instalación Drivers SQL Server para PHP"
echo "Ubuntu Server - Campo Andino"
echo "=========================================="

# Detectar versión de Ubuntu
OS_VERSION=$(lsb_release -rs)
echo "✓ Ubuntu versión detectada: $OS_VERSION"

# Detectar versión de PHP
PHP_VERSION=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
echo "✓ PHP versión detectada: $PHP_VERSION"

# Preguntar si continuar
read -p "¿Continuar con la instalación? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Instalación cancelada."
    exit 0
fi

echo ""
echo "→ Paso 1: Instalando dependencias base..."
apt update
apt install -y curl apt-transport-https gnupg2 unixodbc-dev

echo ""
echo "→ Paso 2: Agregando repositorio de Microsoft..."
curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
curl https://packages.microsoft.com/config/ubuntu/${OS_VERSION}/prod.list > /etc/apt/sources.list.d/mssql-release.list

echo ""
echo "→ Paso 3: Instalando drivers ODBC para SQL Server..."
apt update
ACCEPT_EULA=Y apt install -y msodbcsql18 mssql-tools18

echo ""
echo "→ Paso 4: Instalando PHP pear y dev (para compilar extensiones)..."
apt install -y php-pear php${PHP_VERSION}-dev

echo ""
echo "→ Paso 5: Compilando e instalando extensiones PHP sqlsrv y pdo_sqlsrv..."
pecl channel-update pecl.php.net
printf "\n" | pecl install sqlsrv
printf "\n" | pecl install pdo_sqlsrv

echo ""
echo "→ Paso 6: Habilitando extensiones en php.ini..."

# Detectar ubicación de php.ini para CLI
PHP_INI_CLI=$(php -r "echo php_ini_loaded_file();")
echo "   PHP CLI ini: $PHP_INI_CLI"

# Agregar extensiones si no existen
if ! grep -q "extension=sqlsrv.so" "$PHP_INI_CLI"; then
    echo "extension=sqlsrv.so" >> "$PHP_INI_CLI"
    echo "   ✓ Agregada extensión sqlsrv"
else
    echo "   ✓ Extensión sqlsrv ya existe"
fi

if ! grep -q "extension=pdo_sqlsrv.so" "$PHP_INI_CLI"; then
    echo "extension=pdo_sqlsrv.so" >> "$PHP_INI_CLI"
    echo "   ✓ Agregada extensión pdo_sqlsrv"
else
    echo "   ✓ Extensión pdo_sqlsrv ya existe"
fi

# Si hay Apache, también configurar para Apache
if [ -d "/etc/php/${PHP_VERSION}/apache2" ]; then
    PHP_INI_APACHE="/etc/php/${PHP_VERSION}/apache2/php.ini"
    echo "   PHP Apache ini: $PHP_INI_APACHE"
    
    if ! grep -q "extension=sqlsrv.so" "$PHP_INI_APACHE"; then
        echo "extension=sqlsrv.so" >> "$PHP_INI_APACHE"
        echo "   ✓ Agregada extensión sqlsrv para Apache"
    fi
    
    if ! grep -q "extension=pdo_sqlsrv.so" "$PHP_INI_APACHE"; then
        echo "extension=pdo_sqlsrv.so" >> "$PHP_INI_APACHE"
        echo "   ✓ Agregada extensión pdo_sqlsrv para Apache"
    fi
    
    echo ""
    echo "→ Reiniciando Apache..."
    systemctl restart apache2
fi

echo ""
echo "=========================================="
echo "→ VERIFICACIÓN DE INSTALACIÓN"
echo "=========================================="

# Verificar módulos cargados
SQLSRV_LOADED=$(php -m | grep sqlsrv | wc -l)
PDO_SQLSRV_LOADED=$(php -m | grep pdo_sqlsrv | wc -l)

if [ $SQLSRV_LOADED -gt 0 ] && [ $PDO_SQLSRV_LOADED -gt 0 ]; then
    echo "✅ INSTALACIÓN EXITOSA"
    echo ""
    echo "Módulos cargados:"
    php -m | grep sqlsrv
    echo ""
    echo "Versiones:"
    php -r "echo 'sqlsrv: ' . phpversion('sqlsrv') . PHP_EOL;"
    php -r "echo 'pdo_sqlsrv: ' . phpversion('pdo_sqlsrv') . PHP_EOL;"
else
    echo "❌ ERROR: Las extensiones no se cargaron correctamente"
    echo ""
    echo "Módulos PHP disponibles:"
    php -m
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ INSTALACIÓN COMPLETADA"
echo "=========================================="
echo ""
echo "Próximos pasos:"
echo "1. Configurar VPN Pritunl"
echo "2. Editar sync_erp_ordenes_venta.php con credenciales del ERP"
echo "3. Ajustar consulta SQL según estructura real del ERP"
echo "4. Probar sincronización: php sync_erp_ordenes_venta.php"
echo "5. Configurar cron job para ejecución automática"
echo ""
echo "Ver documentación completa en: README_SYNC_ORDENES.md"
echo ""
