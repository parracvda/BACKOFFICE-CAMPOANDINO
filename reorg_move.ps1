Param(
    [switch]$Apply
)

$timestamp = (Get-Date).ToString('yyyyMMdd_HHmmss')
$root = Get-Location
$backupDir = Join-Path $root "_backup_pre_reorg_$timestamp"
$logFile = Join-Path $root "reorg_move_log_$timestamp.txt"

Function Log($msg){
    $line = "$(Get-Date -Format 's') - $msg"
    $line | Out-File -FilePath $logFile -Append -Encoding utf8
}

Write-Host "Plan de reorganización (dry-run por defecto). Use -Apply para ejecutar."
Log "Inicio de reorganización. Apply=$Apply"

# Directorios a crear
$dirs = @(
    "sistemas/horas_paradas/api",
    "sistemas/requerimientos/api",
    "sistemas/horno_termico/api",
    "sistemas/mantenimiento_accesos/api",
    "sistemas/horas_paradas",
    "sistemas/requerimientos",
    "sistemas/horno_termico",
    "sistemas/mantenimiento_accesos",
    "shared",
    "public",
    "assets"
)

# Lista de movimientos: source (relative to repo root) -> destination (relative)
$moves = @(
    # Horas Paradas
    @{src='acceso.php'; dest='sistemas/horas_paradas/acceso.php'},
    @{src='acceso.js'; dest='sistemas/horas_paradas/acceso.js'},
    @{src='acceso.css'; dest='sistemas/horas_paradas/acceso.css'},
    @{src='registros.html'; dest='sistemas/horas_paradas/registros.html'},
    @{src='registros.js'; dest='sistemas/horas_paradas/registros.js'},
    @{src='registrosp.html'; dest='sistemas/horas_paradas/registrosp.html'},
    @{src='registrosp.js'; dest='sistemas/horas_paradas/registrosp.js'},
    @{src='resumen.html'; dest='sistemas/horas_paradas/resumen.html'},
    @{src='resumen.js'; dest='sistemas/horas_paradas/resumen.js'},
    @{src='reporte.html'; dest='sistemas/horas_paradas/reporte.html'},
    @{src='reporte.js'; dest='sistemas/horas_paradas/reporte.js'},
    @{src='reporteria.html'; dest='sistemas/horas_paradas/reporteria.html'},
    @{src='reporteria.js'; dest='sistemas/horas_paradas/reporteria.js'},
    @{src='grafico.html'; dest='sistemas/horas_paradas/grafico.html'},
    @{src='grafico.js'; dest='sistemas/horas_paradas/grafico.js'},
    @{src='graficodata.js'; dest='sistemas/horas_paradas/graficodata.js'},
    @{src='graficostyles.css'; dest='sistemas/horas_paradas/graficostyles.css'},
    @{src='programacion.html'; dest='sistemas/horas_paradas/programacion.html'},
    @{src='programacion.js'; dest='sistemas/horas_paradas/programacion.js'},
    @{src='guardar_motivo_cierre.php'; dest='sistemas/horas_paradas/guardar_motivo_cierre.php'},
    @{src='product_search.php'; dest='sistemas/horas_paradas/product_search.php'},
    @{src='datos.php'; dest='sistemas/horas_paradas/datos.php'},
    @{src='verificar_php.php'; dest='sistemas/horas_paradas/verificar_php.php'},
    @{src='logout.php'; dest='sistemas/horas_paradas/logout.php'},
    @{src='formulario.html'; dest='sistemas/horas_paradas/formulario.html'},
    @{src='formulario.js'; dest='sistemas/horas_paradas/formulario.js'},

    # Requerimientos
    @{src='requerimientos.php'; dest='sistemas/requerimientos/requerimientos.php'},
    @{src='requerimientos_v2.php'; dest='sistemas/requerimientos/requerimientos_v2.php'},
    @{src='requerimientos_reporte.php'; dest='sistemas/requerimientos/requerimientos_reporte.php'},
    @{src='entregasrequerimientos.php'; dest='sistemas/requerimientos/entregasrequerimientos.php'},
    @{src='entregasrequerimientos_v2.php'; dest='sistemas/requerimientos/entregasrequerimientos_v2.php'},
    @{src='print_requerimiento.php'; dest='sistemas/requerimientos/print_requerimiento.php'},
    @{src='out_entregas.html'; dest='sistemas/requerimientos/out_entregas.html'},
    @{src='debug_entregas.js'; dest='sistemas/requerimientos/debug_entregas.js'},
    @{src='aprobaciones.php'; dest='sistemas/requerimientos/aprobaciones.php'},
    @{src='aprobaciones_v2.php'; dest='sistemas/requerimientos/aprobaciones_v2.php'},
    @{src='almacenes_por_sucursal.php'; dest='sistemas/requerimientos/almacenes_por_sucursal.php'},

    # Horno termico
    @{src='registrotratamiento.php'; dest='sistemas/horno_termico/registrotratamiento.php'},
    @{src='tratamientotermico_reporte.php'; dest='sistemas/horno_termico/tratamientotermico_reporte.php'},
    @{src='guardar_tratamiento.php'; dest='sistemas/horno_termico/guardar_tratamiento.php'},
    @{src='README_SYNC_HORNO.md'; dest='sistemas/horno_termico/README_SYNC_HORNO.md'},
    @{src='sync_horno_export.php'; dest='sistemas/horno_termico/sync_horno_export.php'},
    @{src='sync_horno_origen.php'; dest='sistemas/horno_termico/sync_horno_origen.php'},
    @{src='sync_horno_pull.php'; dest='sistemas/horno_termico/sync_horno_pull.php'},
    @{src='sync_horno_receptor.php'; dest='sistemas/horno_termico/sync_horno_receptor.php'},

    # Mantenimiento accesos
    @{src='mantenimiento_accesos.php'; dest='sistemas/mantenimiento_accesos/mantenimiento_accesos.php'},
    @{src='mantenimiento_accesos.js'; dest='sistemas/mantenimiento_accesos/mantenimiento_accesos.js'},

    # APIs -> cada sistema tendrá su carpeta api/
    @{src='api_aprobar_v2.php'; dest='sistemas/requerimientos/api/api_aprobar_v2.php'},
    @{src='api_buscar_almacenregistros.php'; dest='sistemas/requerimientos/api/api_buscar_almacenregistros.php'},
    @{src='api_buscar_producto.php'; dest='sistemas/requerimientos/api/api_buscar_producto.php'},
    @{src='api_entregar_v2.php'; dest='sistemas/requerimientos/api/api_entregar_v2.php'},
    @{src='api_turno_cerrar.php'; dest='sistemas/requerimientos/api/api_turno_cerrar.php'},
    @{src='api_turno_estado.php'; dest='sistemas/requerimientos/api/api_turno_estado.php'},
    @{src='api_turno_historial.php'; dest='sistemas/requerimientos/api/api_turno_historial.php'},
    @{src='api_get_user_features.php'; dest='sistemas/mantenimiento_accesos/api/api_get_user_features.php'},
    @{src='api_set_user_feature.php'; dest='sistemas/mantenimiento_accesos/api/api_set_user_feature.php'},
    @{src='api_preview_lote.php'; dest='sistemas/horno_termico/api/api_preview_lote.php'},
    @{src='api_check_pallet.php'; dest='sistemas/horno_termico/api/api_check_pallet.php'},

    # Shared and public assets/directories
    @{src='conexion.php'; dest='shared/conexion.php'},
    @{src='funciones_v2.php'; dest='shared/funciones_v2.php'},
    @{src='funciones_turnos.php'; dest='shared/funciones_turnos.php'},
    @{src='use_remote_db'; dest='shared/use_remote_db'},
    @{src='sync_mysql_receptor.php'; dest='shared/sync_mysql_receptor.php'},
    @{src='images'; dest='shared/images'},
    @{src='exceljs'; dest='shared/exceljs'},
    @{src='FileSaver'; dest='shared/FileSaver'},
    @{src='exceljs.min.js'; dest='shared/exceljs.min.js'},
    @{src='FileSaver.min.js'; dest='shared/FileSaver.min.js'},
    @{src='dx.all.js'; dest='shared/dx.all.js'},
    @{src='dx.darkmoon.css'; dest='shared/dx.darkmoon.css'},
    @{src='polyfill.min.js'; dest='shared/polyfill.min.js'},

    # Public
    @{src='panel.html'; dest='public/panel.html'},
    @{src='panel.js'; dest='public/panel.js'},
    @{src='index.html'; dest='public/index.html'},
    @{src='styles.css'; dest='public/styles.css'},
    @{src='stylespanel.css'; dest='public/stylespanel.css'},
    @{src='registro.css'; dest='public/registro.css'}
)

# Crear carpetas
foreach($d in $dirs){
    $full = Join-Path $root $d
    if(-not (Test-Path $full)){
        Write-Host "Crear dir: $d"
        Log "Crear dir: $d"
        if($Apply){ New-Item -ItemType Directory -Path $full -Force | Out-Null }
    }
}

# Si se aplica, crear backup
if($Apply){
    Write-Host "Creando directorio de backup: $backupDir"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Log "Directorio backup creado: $backupDir"
}

# Mostrar o ejecutar movimientos
foreach($m in $moves){
    $src = Join-Path $root $m.src
    $dest = Join-Path $root $m.dest
    if(-not (Test-Path $src)){
        Write-Host "ADVERTENCIA: Origen no existe: $($m.src)"
        Log "Origen no existe: $($m.src)"
        continue
    }
    $destDir = Split-Path $dest -Parent
    if(-not (Test-Path $destDir)){
        Write-Host "Crear dir destino: $destDir"
        Log "Crear dir destino: $destDir"
        if($Apply){ New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    }

    if($Apply){
        # copiar a backup
        $backupPath = Join-Path $backupDir $m.src.Replace('/','_')
        Copy-Item -Path $src -Destination $backupPath -Recurse -Force
        Log "Backup: $src -> $backupPath"

        Move-Item -Path $src -Destination $dest -Force
        Write-Host "Movido: $($m.src) -> $($m.dest)"
        Log "Movido: $($m.src) -> $($m.dest)"
    } else {
        Write-Host "[DRY] $($m.src) -> $($m.dest)"
    }
}

Write-Host "Listo. Revisa $logFile y la carpeta de backup si aplicaste -Apply."
Log "Fin de reorganización"
