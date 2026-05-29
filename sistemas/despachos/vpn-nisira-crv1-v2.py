#!/usr/bin/env python3
import socket
import subprocess
import time
import re
import sys
import signal

# Configuración
OPENVPN_CONFIG = "/etc/openvpn/nisira-vpn.conf"
MANAGEMENT_IP = "127.0.0.1"
MANAGEMENT_PORT = 7505
USERNAME = "jparra"
PASSWORD = "HQQl5|L7Wd4>"
PIN = "20250841"

openvpn_process = None

def signal_handler(sig, frame):
    print("\n🛑 Interrupción recibida, cerrando conexión...")
    if openvpn_process:
        openvpn_process.terminate()
        openvpn_process.wait()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

def read_until(sock, timeout=10):
    """Lee del socket hasta que no haya más datos"""
    sock.settimeout(1)
    data = ""
    end_time = time.time() + timeout
    
    while time.time() < end_time:
        try:
            chunk = sock.recv(4096).decode('utf-8', errors='ignore')
            if chunk:
                data += chunk
                print(chunk, end='', flush=True)
        except socket.timeout:
            if data:
                break
    
    return data

def send_command(sock, command):
    """Envía comando al socket de gestión"""
    print(f"→ {command}")
    sock.sendall(f"{command}\n".encode('utf-8'))
    time.sleep(0.3)

try:
    print("Iniciando OpenVPN con hold y management-query-passwords...")
    openvpn_process = subprocess.Popen(
        ["openvpn", 
         "--config", OPENVPN_CONFIG,
         "--management", str(MANAGEMENT_IP), str(MANAGEMENT_PORT),
         "--management-query-passwords",
         "--management-hold"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    
    time.sleep(3)
    
    print("Conectando a interfaz de gestión...")
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((MANAGEMENT_IP, MANAGEMENT_PORT))
    
    print("Leyendo mensajes iniciales...")
    initial = read_until(sock, timeout=5)
    
    print("\nVerificando estado...")
    send_command(sock, "state")
    state = read_until(sock, timeout=3)
    
    print("\nLiberando hold para iniciar conexión...")
    send_command(sock, "hold release")
    time.sleep(2)
    
    print("Esperando solicitud de credenciales...")
    prompt = read_until(sock, timeout=15)
    
    if ">PASSWORD:Need" not in prompt:
        print("\n❌ ERROR: No se recibió solicitud de credenciales")
        print(f"Último buffer: {repr(prompt)}")
        openvpn_process.terminate()
        sys.exit(1)
    
    print("\n📝 Enviando username y password...")
    send_command(sock, f"username 'Auth' {USERNAME}")
    send_command(sock, f"password 'Auth' {PASSWORD}")
    
    print("Esperando respuesta (CRV1)...")
    response = read_until(sock, timeout=10)
    
    # Buscar el desafío CRV1
    crv1_match = re.search(r'CRV1:R:([a-f0-9]+):', response)
    if not crv1_match:
        print(f"\n❌ ERROR: No se encontró desafío CRV1")
        print(f"Respuesta: {repr(response)}")
        openvpn_process.terminate()
        sys.exit(1)
    
    challenge_id = crv1_match.group(1)
    print(f"\n🔑 Desafío CRV1 recibido: {challenge_id}")
    
    # Esperar segunda solicitud de credenciales
    print("Esperando segunda solicitud...")
    second_prompt = read_until(sock, timeout=10)
    
    if ">PASSWORD:Need" not in second_prompt:
        print(f"\n⚠️  No se recibió segunda solicitud explícita")
        print(f"Buffer: {repr(second_prompt)}")
    
    print("\n📌 Enviando PIN como respuesta CRV1...")
    crv1_response = f"CRV1::{challenge_id}::{PIN}"
    send_command(sock, f"username 'Auth' {USERNAME}")
    send_command(sock, f"password 'Auth' {crv1_response}")
    
    print("Esperando confirmación...")
    final = read_until(sock, timeout=20)
    
    if "Initialization Sequence Completed" in final or "CONNECTED,SUCCESS" in final:
        print("\n✅ CONEXIÓN VPN EXITOSA!")
        print("Manteniendo conexión activa (Ctrl+C para salir)...\n")
        
        while True:
            time.sleep(10)
            send_command(sock, "state")
            status = read_until(sock, timeout=3)
            if "CONNECTED" not in status:
                print("\n⚠️  Conexión perdida")
                break
    else:
        print(f"\n❌ ERROR: Conexión no establecida")
        print(f"Buffer final: {repr(final)}")
        openvpn_process.terminate()
        sys.exit(1)

except KeyboardInterrupt:
    print("\n🛑 Conexión cerrada por usuario")
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
finally:
    if openvpn_process:
        openvpn_process.terminate()
        openvpn_process.wait()
