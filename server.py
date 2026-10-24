import os
import sys
import json
import http.server
import socketserver
import webbrowser

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOCS_DIR = os.path.join(BASE_DIR, "uploads", "Documenti")
os.makedirs(DOCS_DIR, exist_ok=True)
PORT = 8092

class SombraResortHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        if any(self.path.lower().endswith(ext) for ext in ['.mp4', '.mov', '.webm', '.jpg', '.jpeg', '.png', '.webp', '.pdf', '.mp3', '.m4a', '.wav']):
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Cache-Control', 'public, max-age=3600')
        else:
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        super().do_GET()

def is_port_in_use(port):
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def open_app_url(url):
    try:
        if webbrowser.open(url):
            return
    except Exception:
        pass
    try:
        if sys.platform == 'win32':
            os.system(f'start "" "{url}"')
    except Exception:
        pass

def run_server():
    url = f"http://localhost:{PORT}/index.html"

    if is_port_in_use(PORT):
        print(f"============================================================")
        print(f"  SOMBRA RESORT Server deja actif sur le port {PORT}")
        print(f"  Ouverture de l'application : {url}")
        print(f"============================================================")
        open_app_url(url)
        return

    http.server.ThreadingHTTPServer.allow_reuse_address = True
    try:
        with http.server.ThreadingHTTPServer(("", PORT), SombraResortHandler) as httpd:
            print(f"============================================================")
            print(f"  SOMBRA RESORT S.a r.l. - Serveur Web Local Actif")
            print(f"  URL : {url}")
            print(f"  Holding de Participations - Luxembourg")
            print(f"============================================================")
            open_app_url(url)
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\nArret du serveur SOMBRA RESORT.")
                sys.exit(0)
    except OSError as e:
        print(f"Port {PORT} occupe ({e}). Ouverture du navigateur...")
        open_app_url(url)

if __name__ == '__main__':
    run_server()
