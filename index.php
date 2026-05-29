<?php
// Redirige la raíz hacia el entrypoint público.
// Cuando subas el ZIP al `public_html`, este `index.php` permite abrir directamente la UI.
header('Location: public/index.html', true, 302);
exit;
