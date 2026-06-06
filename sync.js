// Hosur Invoice Bill - Sync Module
// Auto-detects server (Cloudflare Tunnel / Local) and syncs when online

let SYNC_SERVER_URL = null;
let lastSyncTime = localStorage.getItem('lastSyncTime') || null;
let syncQueue = [];
let isSyncing = false;

// Server URLs - UPDATE THESE AFTER DEPLOYING CLOUDFLARE TUNNEL
const SERVER_CONFIGS = {
    // Cloudflare Tunnel URL (Add your Cloudflare URL here after deployment)
    cloudflare: null,  // Example: 'https://your-subdomain.trycloudflare.com'
    
    // Local server (only works when on same network)
    local: 'http://localhost:5000',
    
    // Ngrok alternative (if you use ngrok)
    ngrok: null  // Example: 'https://your-id.ngrok.io'
};

// Auto-detect best available server
async function detectServer() {
    // First, check if user has set a custom server URL in localStorage
    const customServer = localStorage.getItem('custom_sync_server');
    if (customServer) {
        const isOnline = await testServerConnection(customServer);
        if (isOnline) {
            SYNC_SERVER_URL = customServer;
            console.log('✅ Using custom server:', SYNC_SERVER_URL);
            return SYNC_SERVER_URL;
        }
    }
    
    // Try Cloudflare Tunnel first (if configured)
    if (SERVER_CONFIGS.cloudflare) {
        const isOnline = await testServerConnection(SERVER_CONFIGS.cloudflare);
        if (isOnline) {
            SYNC_SERVER_URL = SERVER_CONFIGS.cloudflare;
            console.log('✅ Using Cloudflare Tunnel:', SYNC_SERVER_URL);
            return SYNC_SERVER_URL;
        }
    }
    
    // Try Ngrok next (if configured)
    if (SERVER_CONFIGS.ngrok) {
        const isOnline = await testServerConnection(SERVER_CONFIGS.ngrok);
        if (isOnline) {
            SYNC_SERVER_URL = SERVER_CONFIGS.ngrok;
            console.log('✅ Using Ngrok tunnel:', SYNC_SERVER_URL);
            return SYNC_SERVER_URL;
        }
    }
    
    // Try local server last
    const isLocalOnline = await testServerConnection(SERVER_CONFIGS.local);
    if (isLocalOnline) {
        SYNC_SERVER_URL = SERVER_CONFIGS.local;
        console.log('✅ Using local server:', SYNC_SERVER_URL);
        return SYNC_SERVER_URL;
    }
    
    SYNC_SERVER_URL = null;
    console.log('⚠️ No sync server available. Running offline-only mode.');
    return null;
}

// Test if a server is reachable
async function testServerConnection(serverUrl) {
    if (!serverUrl) return false;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${serverUrl}/api/health`, {
            method: 'GET',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' }
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification flex items-center gap-2 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Update sync status in UI
function updateSyncStatus(status, message) {
    const statusDiv = document.getElementById('syncStatus');
    if (!statusDiv) return;
    
    const icons = {
        syncing: 'fa-circle-notch fa-spin',
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        offline: 'fa-cloud-slash',
        idle: 'fa-cloud'
    };
    
    const colors = {
        syncing: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        error: 'bg-yellow-100 text-yellow-800',
        offline: 'bg-gray-100 text-gray-600',
        idle: 'bg-gray-100 text-gray-600'
    };
    
    statusDiv.innerHTML = `<i class="fas ${icons[status] || icons.idle}"></i> <span>${message}</span>`;
    statusDiv.className = `mt-2 text-xs p-2 rounded ${colors[status] || colors.idle}`;
    
    // Also update the sync text element if it exists
    const syncTextSpan = document.getElementById('syncText');
    if (syncTextSpan) syncTextSpan.textContent = message;
}

// Add to sync queue
function addToSyncQueue(data) {
    syncQueue.push(data);
    localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
    
    // Try to sync immediately
    if (SYNC_SERVER_URL && !isSyncing) {
        processSyncQueue();
    }
}

// Process sync queue
async function processSyncQueue() {
    if (isSyncing) return;
    if (!SYNC_SERVER_URL) return;
    if (syncQueue.length === 0) {
        // Load from localStorage
        const savedQueue = localStorage.getItem('syncQueue');
        if (savedQueue) {
            syncQueue = JSON.parse(savedQueue);
        }
    }
    
    if (syncQueue.length === 0) return;
    
    isSyncing = true;
    updateSyncStatus('syncing', `🔄 Syncing ${syncQueue.length} item(s) to server...`);
    
    try {
        while (syncQueue.length > 0) {
            const item = syncQueue[0];
            const response = await fetch(`${SYNC_SERVER_URL}/api/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            
            if (response.ok) {
                syncQueue.shift(); // Remove synced item
                localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
            } else {
                throw new Error('Sync failed');
            }
        }
        
        updateSyncStatus('success', '✅ All data synced to server!');
        showToast('Data backed up successfully!', 'success');
        
    } catch (error) {
        console.error('Sync error:', error);
        updateSyncStatus('error', '⚠️ Server offline. Data will sync when server is back.');
        showToast('Server offline. Data saved locally.', 'error');
    } finally {
        isSyncing = false;
    }
}

// Main sync function - called after saving invoice
async function syncToServer() {
    if (!SYNC_SERVER_URL) {
        await detectServer();
        if (!SYNC_SERVER_URL) {
            updateSyncStatus('offline', '📴 Server offline. Data saved locally only.');
            return;
        }
    }
    
    if (!navigator.onLine) {
        updateSyncStatus('offline', '📴 No internet. Data will sync when online.');
        return;
    }
    
    try {
        updateSyncStatus('syncing', '🔄 Preparing to sync...');
        
        const invoices = await getAllInvoices();
        const footprint = getDigitalFootprint();
        const businessInfo = await loadBusinessInfo();
        
        const payload = {
            footprint: footprint,
            device: 'web',
            lastSync: lastSyncTime,
            business: businessInfo,
            invoices: invoices,
            total_invoices: invoices.length,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            language: currentLanguage || 'tamil'
        };
        
        // Add to queue and process
        addToSyncQueue(payload);
        
        lastSyncTime = new Date().toISOString();
        localStorage.setItem('lastSyncTime', lastSyncTime);
        
    } catch (error) {
        console.error('Sync preparation error:', error);
        updateSyncStatus('error', '⚠️ Sync error. Will retry later.');
    }
}

// Force sync all pending data
async function forceSync() {
    if (!SYNC_SERVER_URL) {
        await detectServer();
    }
    await processSyncQueue();
}

// Set custom server URL (for Cloudflare Tunnel)
function setCustomServerUrl(url) {
    if (url && url.trim()) {
        localStorage.setItem('custom_sync_server', url.trim());
        SYNC_SERVER_URL = null;
        detectServer().then(() => {
            showToast('Server URL updated!', 'success');
            syncToServer();
        });
    } else {
        localStorage.removeItem('custom_sync_server');
        SYNC_SERVER_URL = null;
        detectServer();
    }
}

// Get current server status
async function getServerStatus() {
    if (!SYNC_SERVER_URL) {
        await detectServer();
    }
    
    return {
        online: SYNC_SERVER_URL !== null,
        url: SYNC_SERVER_URL,
        pending_syncs: syncQueue.length
    };
}

// Auto-sync every 3 minutes
setInterval(() => {
    if (navigator.onLine && SYNC_SERVER_URL) {
        syncToServer();
    }
}, 180000); // 3 minutes

// Sync when coming online
window.addEventListener('online', () => {
    updateSyncStatus('syncing', 'Back online. Syncing...');
    detectServer().then(() => syncToServer());
});

// Initial detection after page load
setTimeout(async () => {
    await detectServer();
    await syncToServer();
}, 3000);

// Export functions for debugging (optional)
window.syncUtils = {
    detectServer,
    forceSync,
    setCustomServerUrl,
    getServerStatus,
    syncToServer
};

console.log('🔄 Sync module loaded. Server detection active.');