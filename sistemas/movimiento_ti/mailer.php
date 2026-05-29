<?php
// ════════════════════════════════════════════════════════════════
// mailer.php — Envío de correo vía SMTP nativo (sin librerías)
// Compatible PHP 7.4+
// ════════════════════════════════════════════════════════════════

/**
 * Enviar un correo con SMTP nativo
 * @return true|string  true si éxito, string con error si falla
 */
function enviarCorreo(array $cfg, $to, $subject, $htmlBody, array $adjuntos = []) {
    $host       = $cfg['host'];
    $port       = intval($cfg['port']);
    $encryption = strtolower($cfg['encryption'] ?? 'tls');
    $username   = $cfg['username'];
    $password   = $cfg['password'];
    $fromEmail  = $cfg['from_email'];
    $fromName   = $cfg['from_name']  ?? 'Campo Andino TI';
    $bcc        = $cfg['bcc']        ?? '';
    $timeout    = intval($cfg['timeout'] ?? 15);

    if (empty($password) || $password === 'REEMPLAZAR_AQUI') {
        return enviarCorreoFallback($to, $subject, $htmlBody, $fromEmail, $fromName);
    }

    try {
        // Contexto SSL: desactivar verificación de certificado (hosting compartido usa cert del servidor, no del dominio)
        $sslCtx = stream_context_create([
            'ssl' => [
                'verify_peer'       => false,
                'verify_peer_name'  => false,
                'allow_self_signed' => true,
            ]
        ]);

        if ($encryption === 'ssl') {
            $socket = @stream_socket_client("ssl://{$host}:{$port}", $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $sslCtx);
        } else {
            $socket = @stream_socket_client("tcp://{$host}:{$port}", $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT);
        }
        if (!$socket) return "No se pudo conectar a {$host}:{$port} — {$errstr} ({$errno})";

        stream_set_timeout($socket, $timeout);

        $read = smtpRead($socket);
        if (substr($read, 0, 1) !== '2') return "SMTP: saludo inesperado: {$read}";

        $ehloHost = substr(strrchr($fromEmail, '@'), 1) ?: 'campoandino.com';

        smtpCmd($socket, "EHLO {$ehloHost}");
        smtpReadAll($socket);

        if ($encryption === 'tls') {
            smtpCmd($socket, "STARTTLS");
            $tls = smtpRead($socket);
            if (substr($tls, 0, 1) !== '2') return "STARTTLS rechazado: {$tls}";
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                // Reintentar sin verificación estricta
                stream_context_set_option($socket, 'ssl', 'verify_peer', false);
                stream_context_set_option($socket, 'ssl', 'verify_peer_name', false);
                if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                    return "No se pudo activar TLS";
                }
            }
            smtpCmd($socket, "EHLO {$ehloHost}");
            smtpReadAll($socket);
        }

        smtpCmd($socket, "AUTH LOGIN");
        smtpRead($socket);
        smtpCmd($socket, base64_encode($username));
        smtpRead($socket);
        smtpCmd($socket, base64_encode($password));
        $auth = smtpRead($socket);
        if (substr($auth, 0, 1) !== '2') return "AUTH fallida: {$auth}";

        smtpCmd($socket, "MAIL FROM:<{$fromEmail}>");
        $r = smtpRead($socket);
        if (substr($r, 0, 1) !== '2') return "MAIL FROM rechazado: {$r}";

        $recipients = smtpParseEmails($to);
        if (!empty($bcc)) $recipients = array_merge($recipients, smtpParseEmails($bcc));
        foreach ($recipients as $rcpt) {
            smtpCmd($socket, "RCPT TO:<{$rcpt}>");
            $r = smtpRead($socket);
            if (substr($r, 0, 1) !== '2') return "RCPT TO rechazado para {$rcpt}: {$r}";
        }

        smtpCmd($socket, "DATA");
        smtpRead($socket);

        $boundary   = 'CAMPOANDINO_' . bin2hex(random_bytes(8));
        $date       = date('r');
        $fromLine   = "=?UTF-8?B?" . base64_encode($fromName) . "?= <{$fromEmail}>";
        $subjectB64 = "=?UTF-8?B?" . base64_encode($subject)  . "?=";

        $msg  = "Date: {$date}\r\n";
        $msg .= "From: {$fromLine}\r\n";
        $msg .= "To: {$to}\r\n";
        if (!empty($bcc)) $msg .= "Bcc: {$bcc}\r\n";
        $msg .= "Subject: {$subjectB64}\r\n";
        $msg .= "MIME-Version: 1.0\r\n";
        $msg .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n\r\n";

        $msg .= "--{$boundary}\r\n";
        $msg .= "Content-Type: text/html; charset=UTF-8\r\n";
        $msg .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $msg .= chunk_split(base64_encode($htmlBody)) . "\r\n";

        foreach ($adjuntos as $adj) {
            $msg .= "--{$boundary}\r\n";
            $msg .= "Content-Type: {$adj['mime']}; name=\"{$adj['nombre']}\"\r\n";
            $msg .= "Content-Transfer-Encoding: base64\r\n";
            $msg .= "Content-Disposition: attachment; filename=\"{$adj['nombre']}\"\r\n\r\n";
            $b64 = (bool)preg_match('/^[A-Za-z0-9+\/]+=*$/', trim($adj['data']))
                   ? $adj['data'] : base64_encode($adj['data']);
            $msg .= chunk_split($b64) . "\r\n";
        }

        $msg .= "--{$boundary}--\r\n\r\n.\r\n";

        fwrite($socket, $msg);
        $r = smtpRead($socket);
        if (substr($r, 0, 1) !== '2') return "DATA rechazado: {$r}";

        smtpCmd($socket, "QUIT");
        fclose($socket);
        return true;

    } catch (Exception $e) {
        return $e->getMessage();
    }
}

function smtpCmd($socket, $cmd) {
    fwrite($socket, $cmd . "\r\n");
}

function smtpRead($socket) {
    $res = '';
    while ($line = fgets($socket, 515)) {
        $res .= $line;
        if (strlen($line) >= 4 && $line[3] === ' ') break;
    }
    return trim($res);
}

function smtpReadAll($socket) {
    $res = '';
    stream_set_blocking($socket, false);
    usleep(300000);
    while ($line = fgets($socket, 515)) { $res .= $line; }
    stream_set_blocking($socket, true);
    return $res;
}

function smtpParseEmails($str) {
    preg_match_all('/[\w.+-]+@[\w.-]+\.\w+/', $str, $m);
    return $m[0] ?? [];
}

function enviarCorreoFallback($to, $subject, $htmlBody, $fromEmail, $fromName) {
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <{$fromEmail}>\r\n";
    $ok = @mail($to, "=?UTF-8?B?" . base64_encode($subject) . "?=", $htmlBody, $headers);
    return $ok ? true : "mail() fallo. Configura SMTP en mail_config.php";
}
