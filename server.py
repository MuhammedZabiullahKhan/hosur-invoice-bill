#!/usr/bin/env python3
"""
Hosur Invoice Bill - Sync Server
Run this on your Linux laptop
Compatible with Cloudflare Tunnel, Ngrok, or local network
Created by Shri Muhammed Zabiullah Khan
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
from pathlib import Path
import hashlib
import threading

app = Flask(__name__)
CORS(app)  # Allow all origins for Cloudflare Tunnel

# Storage directory for all users
DATA_DIR = Path.home() / "hosur_invoice_backups"
DATA_DIR.mkdir(exist_ok=True)

# Log file
LOG_FILE = DATA_DIR / "sync_log.txt"

def log_message(msg):
    """Log messages with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] {msg}\n"
    print(log_entry.strip())
    with open(LOG_FILE, 'a') as f:
        f.write(log_entry)

def get_user_file(footprint):
    """Get file path for a specific user (by digital footprint)"""
    # Create a safe filename from footprint
    footprint_hash = hashlib.md5(footprint.encode()).hexdigest()[:16]
    safe_name = f"user_{footprint_hash}"
    return DATA_DIR / f"{safe_name}.json"

@app.route('/api/health', methods=['GET', 'HEAD'])
def health():
    """Health check endpoint for Cloudflare Tunnel"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'server': 'Hosur Invoice Bill Sync Server',
        'version': '1.0.0'
    })

@app.route('/api/sync', methods=['POST', 'OPTIONS'])
def sync():
    """Main sync endpoint - receives all invoice data"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    
    try:
        data = request.json
        footprint = data.get('footprint')
        
        if not footprint:
            return jsonify({'error': 'No footprint'}), 400
        
        user_file = get_user_file(footprint)
        
        # Load existing data
        existing = {}
        if user_file.exists():
            with open(user_file, 'r') as f:
                existing = json.load(f)
        
        # Merge new data
        existing['last_sync'] = datetime.now().isoformat()
        existing['footprint'] = footprint
        existing['business'] = data.get('business', {})
        existing['last_seen'] = datetime.now().isoformat()
        existing['user_agent'] = data.get('user_agent', 'unknown')
        existing['language'] = data.get('language', 'unknown')
        
        # Merge invoices (avoid duplicates by id)
        new_invoices = data.get('invoices', [])
        existing_invoices = existing.get('invoices', [])
        existing_ids = {inv['id'] for inv in existing_invoices}
        
        new_count = 0
        for inv in new_invoices:
            if inv['id'] not in existing_ids:
                existing_invoices.append(inv)
                new_count += 1
        
        existing['invoices'] = existing_invoices
        existing['total_invoices'] = len(existing_invoices)
        
        # Save back
        with open(user_file, 'w', encoding='utf-8') as f:
            json.dump(existing, f, indent=2, ensure_ascii=False)
        
        log_message(f"✅ Synced: {footprint[:20]}... | New: {new_count} | Total: {len(existing_invoices)}")
        
        return jsonify({
            'status': 'success',
            'synced': new_count,
            'total': len(existing_invoices),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        log_message(f"❌ Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/fetch', methods=['POST'])
def fetch():
    """Fetch all invoices for a footprint (for restoring)"""
    try:
        data = request.json
        footprint = data.get('footprint')
        
        if not footprint:
            return jsonify({'error': 'No footprint'}), 400
        
        user_file = get_user_file(footprint)
        
        if user_file.exists():
            with open(user_file, 'r', encoding='utf-8') as f:
                user_data = json.load(f)
            return jsonify({
                'status': 'success',
                'invoices': user_data.get('invoices', []),
                'business': user_data.get('business', {}),
                'last_backup': user_data.get('last_sync')
            })
        else:
            return jsonify({'status': 'ok', 'invoices': [], 'business': {}})
            
    except Exception as e:
        log_message(f"❌ Fetch error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def stats():
    """Get server statistics"""
    users = list(DATA_DIR.glob("user_*.json"))
    total_invoices = 0
    total_users = len(users)
    
    for user_file in users:
        try:
            with open(user_file, 'r') as f:
                data = json.load(f)
                total_invoices += data.get('total_invoices', 0)
        except:
            pass
    
    return jsonify({
        'total_users': total_users,
        'total_invoices': total_invoices,
        'data_dir': str(DATA_DIR),
        'last_backup': datetime.now().isoformat(),
        'server_status': 'running'
    })

@app.route('/api/list-recent', methods=['GET'])
def list_recent():
    """List recent 10 users (admin endpoint)"""
    users = list(DATA_DIR.glob("user_*.json"))
    recent_users = []
    
    for user_file in sorted(users, key=os.path.getmtime, reverse=True)[:10]:
        try:
            with open(user_file, 'r') as f:
                data = json.load(f)
                recent_users.append({
                    'footprint': data.get('footprint', 'unknown')[:30],
                    'business': data.get('business', {}).get('businessName', 'Unknown'),
                    'invoices': data.get('total_invoices', 0),
                    'last_seen': data.get('last_seen', 'never'),
                    'last_sync': data.get('last_sync', 'never')
                })
        except:
            pass
    
    return jsonify({'recent_users': recent_users})

if __name__ == '__main__':
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║   🏪 HOSUR INVOICE BILL - SYNC SERVER                        ║
    ║   Created by Shri Muhammed Zabiullah Khan                   ║
    ║                                                              ║
    ║   📍 Location: Hosur, Krishnagiri District, Tamil Nadu      ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    
    📁 Data directory: {DATA_DIR}
    🌐 Server running on: http://0.0.0.0:5000
    
    🔗 FOR CLOUDFLARE TUNNEL:
       Run in another terminal: cloudflared tunnel --url http://localhost:5000
    
    📊 Stats endpoint: http://localhost:5000/api/stats
    ❤️  Health check: http://localhost:5000/api/health
    
    Press Ctrl+C to stop the server
    
    """)
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)