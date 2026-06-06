// Hosur Invoice Bill - Main Application
// Created by Shri Muhammed Zabiullah Khan
// Full CRUD Operations + Settings + QR + New Bill

let db;
let currentLanguage = 'tamil';
let itemCounter = 0;
let editingInvoiceId = null;

// Global function references for HTML access
window.currentLanguage = 'tamil';
window.itemCounter = 0;

// Tamil & English Translations
const translations = {
    tamil: {
        businessTitle: "🏪 என் கடை விவரங்கள்",
        businessNameLabel: "கடை பெயர்",
        businessContactLabel: "தொடர்பு & முகவரி",
        invoicePrefixLabel: "இன்வாய்ஸ் எண் முறை",
        nextInvoiceLabel: "அடுத்த இன்வாய்ஸ் எண்",
        createInvoiceTitle: "➕ புதிய இன்வாய்ஸ்",
        editInvoiceTitle: "✏️ இன்வாய்ஸ் திருத்து",
        customerNameLabel: "வாடிக்கையாளர் பெயர்",
        customerMobileLabel: "மொபைல் எண்",
        itemsLabel: "📦 பொருட்கள்",
        itemNameHeader: "பொருள் பெயர்",
        qtyHeader: "அளவு",
        priceHeader: "விலை (₹)",
        totalHeader: "மொத்தம் (₹)",
        addItemBtnText: "பொருள் சேர்",
        subtotalLabel: "துணை மொத்தம்",
        gstLabel: "ஜிஎஸ்டி (5%)",
        totalLabel: "மொத்தம்",
        notesLabel: "குறிப்புகள்",
        saveBtnText: "💾 இன்வாய்ஸ் சேமி",
        updateBtnText: "🔄 இன்வாய்ஸ் புதுப்பி",
        cancelEditText: "❌ ரத்து செய்",
        historyTitle: "📄 என் இன்வாய்ஸ்கள்",
        noInvoicesText: "இன்னும் இன்வாய்ஸ் இல்லை. மேலே உங்கள் முதல் இன்வாய்ஸ் உருவாக்கவும்!",
        editBtnText: "திருத்து",
        deleteBtnText: "நீக்கு",
        viewBtnText: "பார்",
        confirmDelete: "இந்த இன்வாய்ஸை நீக்க வேண்டுமா?",
        deleteSuccess: "✅ இன்வாய்ஸ் நீக்கப்பட்டது!",
        updateSuccess: "✅ இன்வாய்ஸ் புதுப்பிக்கப்பட்டது!",
        businessNamePlaceholder: "உதா: ஷ்ரீ முஹம்மது சன்ஸ்",
        businessContactPlaceholder: "தொலை: 9876543210, ஹொசூர் மெயின் ரோடு",
        customerNamePlaceholder: "உதா: ராஜேஷ் டெக்ஸ்டைல்ஸ்",
        customerMobilePlaceholder: "உதா: 9876543210",
        itemNamePlaceholder: "பொருள் பெயர் (உதா: அரிசி 5கிலோ)",
        notesPlaceholder: "நன்றி! மீண்டும் வருக",
        tipText: "💡 குறிப்பு: தட்டச்சு செய்ய ஆரம்பித்தால் பரிந்துரைகள் வரும்!",
        syncText: "சின்க் செய்கிறது...",
        syncSuccess: "✅ இன்வாய்ஸ் வெற்றிகரமாக சேமிக்கப்பட்டது!",
        noItemAlert: "⚠️ தயவுசெய்து குறைந்தது ஒரு பொருளையாவது சேர்க்கவும்!",
        clearConfirm: "⚠️ எச்சரிக்கை: இது உங்கள் உலாவியில் உள்ள அனைத்து இன்வாய்ஸ்களையும் நீக்கும்!\n\nதொடரவா?",
        settingsTitle: "அமைப்புகள்",
        themeTitle: "🎨 வண்ணம்",
        dataTitle: "🗑️ தரவு மேலாண்மை",
        clearDataBtn: "எல்லா தரவையும் அழிக்க",
        aboutTitle: "ℹ️ பற்றி",
        aboutText: "ஹொசூர் இன்வாய்ஸ் - சிறு வணிகங்களுக்கான இலவச இன்வாய்ஸ் ஜெனரேட்டர்",
        showQRBtnText: "QR காட்டு",
        qrUploadTitle: "கட்டண QR குறியீடு",
        uploadQRBtn: "QR பதிவேற்று",
        removeQRBtn: "QR நீக்கு",
        paymentQRTitle: "ஸ்கேன் செய்து பணம் செலுத்துங்கள்",
        newBillBtnText: "புதிய பில்"
    },
    english: {
        businessTitle: "🏪 My Business Details",
        businessNameLabel: "Business Name",
        businessContactLabel: "Contact & Address",
        invoicePrefixLabel: "Invoice Number Pattern",
        nextInvoiceLabel: "Next Invoice Number",
        createInvoiceTitle: "➕ Create New Invoice",
        editInvoiceTitle: "✏️ Edit Invoice",
        customerNameLabel: "Customer Name",
        customerMobileLabel: "Mobile Number",
        itemsLabel: "📦 Items",
        itemNameHeader: "Item Name",
        qtyHeader: "Qty",
        priceHeader: "Price (₹)",
        totalHeader: "Total (₹)",
        addItemBtnText: "Add Item",
        subtotalLabel: "Subtotal",
        gstLabel: "GST (5%)",
        totalLabel: "Total",
        notesLabel: "Notes",
        saveBtnText: "💾 Save Invoice",
        updateBtnText: "🔄 Update Invoice",
        cancelEditText: "❌ Cancel",
        historyTitle: "📄 My Invoices",
        noInvoicesText: "No invoices yet. Create your first invoice above!",
        editBtnText: "Edit",
        deleteBtnText: "Delete",
        viewBtnText: "View",
        confirmDelete: "Are you sure you want to delete this invoice?",
        deleteSuccess: "✅ Invoice deleted!",
        updateSuccess: "✅ Invoice updated!",
        businessNamePlaceholder: "Ex: Shri Muhammed Sons",
        businessContactPlaceholder: "Phone: 9876543210, Hosur Main Road",
        customerNamePlaceholder: "Ex: Rajesh Textiles",
        customerMobilePlaceholder: "Ex: 9876543210",
        itemNamePlaceholder: "Item name (Ex: Rice 5kg)",
        notesPlaceholder: "Thank you! Visit again",
        tipText: "💡 Tip: Start typing - auto suggestions appear!",
        syncText: "Syncing...",
        syncSuccess: "✅ Invoice saved successfully!",
        noItemAlert: "⚠️ Please add at least one item!",
        clearConfirm: "⚠️ WARNING: This will delete ALL your invoices from this browser!\n\nContinue?",
        settingsTitle: "Settings",
        themeTitle: "🎨 Theme Color",
        dataTitle: "🗑️ Data Management",
        clearDataBtn: "Clear All My Data",
        aboutTitle: "ℹ️ About",
        aboutText: "Hosur Invoice - Free invoice generator for small businesses",
        showQRBtnText: "Show QR",
        qrUploadTitle: "Payment QR Code",
        uploadQRBtn: "Upload QR",
        removeQRBtn: "Remove QR",
        paymentQRTitle: "Scan to Pay",
        newBillBtnText: "New Bill"
    }
};

// Apply translations
function applyTranslations() {
    const t = translations[currentLanguage];
    const elements = ['businessTitle', 'businessNameLabel', 'businessContactLabel', 'invoicePrefixLabel', 
        'nextInvoiceLabel', 'createInvoiceTitle', 'customerNameLabel', 'customerMobileLabel', 'itemsLabel',
        'itemNameHeader', 'qtyHeader', 'priceHeader', 'totalHeader', 'addItemBtnText', 'subtotalLabel',
        'gstLabel', 'totalLabel', 'notesLabel', 'historyTitle', 'noInvoicesText', 'settingsTitle', 
        'themeTitle', 'dataTitle', 'clearDataBtn', 'aboutTitle', 'aboutText', 'showQRBtnText',
        'qrUploadTitle', 'uploadQRBtn', 'removeQRBtn', 'paymentQRTitle', 'newBillBtnText'];
    
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = t[id];
    });
    
    updateSaveButtonText();
    
    const placeholders = {
        businessName: t.businessNamePlaceholder,
        businessContact: t.businessContactPlaceholder,
        customerName: t.customerNamePlaceholder,
        customerMobile: t.customerMobilePlaceholder,
        tamilNotes: t.notesPlaceholder
    };
    
    for (const [id, placeholder] of Object.entries(placeholders)) {
        const el = document.getElementById(id);
        if (el) el.placeholder = placeholder;
    }
    
    const langBtn = document.getElementById('langBtnText');
    if (langBtn) langBtn.textContent = currentLanguage === 'tamil' ? 'English' : 'தமிழ்';
    
    document.querySelectorAll('.item-name').forEach(input => {
        input.placeholder = t.itemNamePlaceholder;
    });
}

function updateSaveButtonText() {
    const saveBtnSpan = document.getElementById('saveBtnText');
    const t = translations[currentLanguage];
    if (editingInvoiceId) {
        if (saveBtnSpan) saveBtnSpan.textContent = t.updateBtnText;
        const saveBtn = document.getElementById('saveInvoiceBtn');
        if (saveBtn) {
            saveBtn.classList.remove('btn-primary');
            saveBtn.classList.add('bg-orange-500', 'hover:bg-orange-600');
        }
        let cancelBtn = document.getElementById('cancelEditBtn');
        if (!cancelBtn) {
            const container = document.getElementById('saveInvoiceBtn')?.parentElement;
            if (container) {
                cancelBtn = document.createElement('button');
                cancelBtn.id = 'cancelEditBtn';
                cancelBtn.className = 'bg-gray-500 text-white px-4 py-3 rounded-xl font-bold text-sm md:text-base mt-2 w-full transition active:scale-98 flex items-center justify-center gap-2';
                cancelBtn.innerHTML = `<i class="fas fa-times"></i> <span>${t.cancelEditText}</span>`;
                cancelBtn.onclick = cancelEdit;
                container.appendChild(cancelBtn);
            }
        } else {
            cancelBtn.style.display = 'flex';
            const span = cancelBtn.querySelector('span');
            if (span) span.textContent = t.cancelEditText;
        }
    } else {
        if (saveBtnSpan) saveBtnSpan.textContent = t.saveBtnText;
        const saveBtn = document.getElementById('saveInvoiceBtn');
        if (saveBtn) {
            saveBtn.classList.remove('bg-orange-500', 'hover:bg-orange-600');
            saveBtn.classList.add('btn-primary');
        }
        const cancelBtn = document.getElementById('cancelEditBtn');
        if (cancelBtn) cancelBtn.style.display = 'none';
    }
}

function cancelEdit() {
    editingInvoiceId = null;
    clearInvoiceForm();
    updateSaveButtonText();
    const titleSpan = document.getElementById('createInvoiceTitle');
    if (titleSpan) titleSpan.textContent = translations[currentLanguage].createInvoiceTitle;
    showToast('Edit cancelled', 'info');
}

function clearInvoiceForm() {
    document.getElementById('customerName').value = '';
    document.getElementById('customerMobile').value = '';
    document.getElementById('tamilNotes').value = translations[currentLanguage].notesPlaceholder;
    const tbody = document.getElementById('itemsTable');
    if (tbody) {
        tbody.innerHTML = '';
        itemCounter = 0;
        addItemRow();
    }
    calculateAllTotals();
}

// NEW BILL FUNCTION - Called from HTML
function resetForNewBill() {
    // Clear customer fields
    document.getElementById('customerName').value = '';
    document.getElementById('customerMobile').value = '';
    
    // Reset notes to default
    const defaultNotes = currentLanguage === 'tamil' ? 'நன்றி! மீண்டும் வருக' : 'Thank you! Visit again';
    document.getElementById('tamilNotes').value = defaultNotes;
    
    // Clear items table and add one empty row
    const tbody = document.getElementById('itemsTable');
    if (tbody) {
        tbody.innerHTML = '';
        itemCounter = 0;
        addItemRow();
    }
    
    // Recalculate totals
    calculateAllTotals();
    
    // Cancel any editing mode
    if (editingInvoiceId) {
        editingInvoiceId = null;
        updateSaveButtonText();
        const titleSpan = document.getElementById('createInvoiceTitle');
        if (titleSpan) titleSpan.textContent = translations[currentLanguage].createInvoiceTitle;
    }
    
    // Show success message
    const successMsg = currentLanguage === 'tamil' ? '✅ புதிய பில்லுக்கு தயார்! வாடிக்கையாளர் விவரங்களை உள்ளிடவும்.' : '✅ Ready for new bill! Enter customer details.';
    showToast(successMsg, 'success');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle Language
function toggleLanguage() {
    currentLanguage = currentLanguage === 'tamil' ? 'english' : 'tamil';
    window.currentLanguage = currentLanguage;
    applyTranslations();
    showToast(currentLanguage === 'tamil' ? '✅ தமிழுக்கு மாற்றப்பட்டது' : '✅ Switched to English', 'success');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Settings Panel Functions
function openSettings() {
    const panel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('settingsOverlay');
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('active');
}

function closeSettings() {
    const panel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('settingsOverlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

// Theme change
function changeTheme(theme) {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('app_theme', theme);
    document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
    const activeOpt = document.querySelector(`.theme-option[data-theme="${theme}"]`);
    if (activeOpt) activeOpt.classList.add('active');
    showToast(`Theme changed to ${theme}`, 'success');
    closeSettings();
}

// QR Code Functions
function showPaymentQR() {
    const savedQR = localStorage.getItem('payment_qr');
    const modal = document.getElementById('paymentQRModal');
    const qrImage = document.getElementById('paymentQRImage');
    const noQRMessage = document.getElementById('noQRMessage');
    
    if (savedQR && qrImage) {
        qrImage.src = savedQR;
        qrImage.style.display = 'block';
        if (noQRMessage) noQRMessage.style.display = 'none';
    } else {
        if (qrImage) qrImage.style.display = 'none';
        if (noQRMessage) noQRMessage.style.display = 'block';
    }
    if (modal) modal.classList.add('active');
}

function closePaymentQRModal() {
    const modal = document.getElementById('paymentQRModal');
    if (modal) modal.classList.remove('active');
}

function handleQRUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const qrData = e.target.result;
            localStorage.setItem('payment_qr', qrData);
            const qrPreview = document.getElementById('qrPreview');
            const qrPlaceholder = document.getElementById('qrPlaceholder');
            if (qrPreview) {
                qrPreview.src = qrData;
                qrPreview.style.display = 'block';
            }
            if (qrPlaceholder) qrPlaceholder.style.display = 'none';
            showToast('QR code uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

function removeQRCode() {
    localStorage.removeItem('payment_qr');
    const qrPreview = document.getElementById('qrPreview');
    const qrPlaceholder = document.getElementById('qrPlaceholder');
    if (qrPreview) qrPreview.style.display = 'none';
    if (qrPlaceholder) qrPlaceholder.style.display = 'flex';
    showToast('QR code removed', 'info');
}

// IndexedDB Functions
async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('HosurInvoiceDB', 3);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            loadAutoCompleteData();
            resolve(db);
        };
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('invoices')) {
                const store = db.createObjectStore('invoices', { keyPath: 'id' });
                store.createIndex('date', 'date');
                store.createIndex('invoiceNo', 'invoiceNo');
            }
            if (!db.objectStoreNames.contains('business')) {
                db.createObjectStore('business', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('businessNames')) {
                db.createObjectStore('businessNames', { keyPath: 'name' });
            }
            if (!db.objectStoreNames.contains('itemNames')) {
                db.createObjectStore('itemNames', { keyPath: 'name' });
            }
            if (!db.objectStoreNames.contains('customerNames')) {
                db.createObjectStore('customerNames', { keyPath: 'name' });
            }
        };
    });
}

async function loadAutoCompleteData() {
    try {
        const businessNames = await getAllFromStore('businessNames');
        const itemNames = await getAllFromStore('itemNames');
        console.log(`Loaded ${businessNames.length} business, ${itemNames.length} items`);
    } catch (error) {
        console.error('Error loading auto-complete:', error);
    }
}

async function getAllFromStore(storeName) {
    return new Promise((resolve, reject) => {
        if (!db || !db.objectStoreNames.contains(storeName)) {
            resolve([]);
            return;
        }
        const tx = db.transaction([storeName], 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

async function saveToAutoComplete(storeName, name) {
    if (!name || name.trim() === '') return;
    const cleanName = name.trim();
    return new Promise((resolve, reject) => {
        const tx = db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        const getRequest = store.get(cleanName);
        getRequest.onsuccess = () => {
            const existing = getRequest.result;
            if (existing) {
                existing.count = (existing.count || 0) + 1;
                existing.lastUsed = Date.now();
                store.put(existing);
            } else {
                store.put({ name: cleanName, count: 1, firstUsed: Date.now(), lastUsed: Date.now() });
            }
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        };
        getRequest.onerror = () => reject(getRequest.error);
    });
}

async function getSuggestions(storeName, query, limit = 5) {
    if (!query || query.length < 1) return [];
    const allItems = await getAllFromStore(storeName);
    const lowerQuery = query.toLowerCase();
    return allItems
        .filter(item => item.name.toLowerCase().includes(lowerQuery))
        .sort((a, b) => (b.count || 0) - (a.count || 0))
        .slice(0, limit)
        .map(item => item.name);
}

function createAutoComplete(inputElement, suggestions, onSelect) {
    const existingDropdown = document.getElementById(`dropdown_${inputElement.id}`);
    if (existingDropdown) existingDropdown.remove();
    if (!suggestions || suggestions.length === 0) return;
    
    const dropdown = document.createElement('div');
    dropdown.id = `dropdown_${inputElement.id}`;
    dropdown.className = 'fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto';
    const rect = inputElement.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.left = `${rect.left + window.scrollX}px`;
    dropdown.style.minWidth = `${Math.max(rect.width, 200)}px`;
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm border-b border-gray-100';
        item.innerHTML = `<span>📋 ${escapeHtml(suggestion)}</span>`;
        item.onclick = () => {
            inputElement.value = suggestion;
            onSelect(suggestion);
            dropdown.remove();
        };
        dropdown.appendChild(item);
    });
    document.body.appendChild(dropdown);
    
    const closeDropdown = (e) => {
        if (!dropdown.contains(e.target) && e.target !== inputElement) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    };
    setTimeout(() => document.addEventListener('click', closeDropdown), 100);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getDigitalFootprint() {
    let footprint = localStorage.getItem('hosur_bill_footprint');
    if (!footprint) {
        footprint = 'user_' + crypto.randomUUID() + '_' + Date.now();
        localStorage.setItem('hosur_bill_footprint', footprint);
    }
    return footprint;
}

// CRUD Operations
async function saveInvoiceToDB(invoice) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['invoices'], 'readwrite');
        const store = tx.objectStore('invoices');
        const request = store.put(invoice);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function deleteInvoiceFromDB(invoiceId) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['invoices'], 'readwrite');
        const store = tx.objectStore('invoices');
        const request = store.delete(invoiceId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function getInvoiceById(invoiceId) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['invoices'], 'readonly');
        const store = tx.objectStore('invoices');
        const request = store.get(invoiceId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getAllInvoices() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['invoices'], 'readonly');
        const store = tx.objectStore('invoices');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

async function saveBusinessInfo(info) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['business'], 'readwrite');
        const store = tx.objectStore('business');
        const request = store.put({ id: 'businessInfo', ...info });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function loadBusinessInfo() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['business'], 'readonly');
        const store = tx.objectStore('business');
        const request = store.get('businessInfo');
        request.onsuccess = () => resolve(request.result || {});
        request.onerror = () => reject(request.error);
    });
}

async function getNextInvoiceNumber() {
    const invoices = await getAllInvoices();
    const prefix = document.getElementById('invoicePrefix').value;
    const numbers = invoices
        .filter(inv => inv.invoiceNo && inv.invoiceNo.startsWith(prefix))
        .map(inv => {
            const num = parseInt(inv.invoiceNo.replace(prefix, ''));
            return isNaN(num) ? 0 : num;
        });
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
    return prefix + String(maxNum + 1).padStart(3, '0');
}

function calculateAllTotals() {
    let subtotal = 0;
    const rows = document.querySelectorAll('#itemsTable tr');
    rows.forEach((row) => {
        const qtyInput = row.querySelector('.item-qty');
        const priceInput = row.querySelector('.item-price');
        const totalSpan = row.querySelector('.item-total');
        if (qtyInput && priceInput) {
            const qty = parseFloat(qtyInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            const total = qty * price;
            if (totalSpan) totalSpan.innerText = total.toFixed(2);
            subtotal += total;
        }
    });
    const gst = subtotal * 0.05;
    const total = subtotal + gst;
    const subtotalEl = document.getElementById('subtotal');
    const gstEl = document.getElementById('gstAmount');
    const grandTotalEl = document.getElementById('grandTotal');
    if (subtotalEl) subtotalEl.innerText = subtotal.toFixed(2);
    if (gstEl) gstEl.innerText = gst.toFixed(2);
    if (grandTotalEl) grandTotalEl.innerText = total.toFixed(2);
    return { subtotal, gst, total };
}

function addRowEventListeners(row, rowId) {
    const qtyInput = row.querySelector('.item-qty');
    const priceInput = row.querySelector('.item-price');
    const nameInput = row.querySelector('.item-name');
    const t = translations[currentLanguage];
    
    if (nameInput) {
        nameInput.placeholder = t.itemNamePlaceholder;
        nameInput.addEventListener('input', async (e) => {
            calculateAllTotals();
            const query = e.target.value;
            if (query.length >= 1) {
                const suggestions = await getSuggestions('itemNames', query, 6);
                createAutoComplete(nameInput, suggestions, async (selected) => {
                    await saveToAutoComplete('itemNames', selected);
                });
            }
        });
        nameInput.addEventListener('blur', async () => {
            if (nameInput.value.trim()) await saveToAutoComplete('itemNames', nameInput.value.trim());
        });
    }
    if (qtyInput) qtyInput.addEventListener('input', calculateAllTotals);
    if (priceInput) priceInput.addEventListener('input', calculateAllTotals);
    calculateAllTotals();
}

function addItemRow() {
    const tbody = document.getElementById('itemsTable');
    if (!tbody) return;
    const rowId = itemCounter++;
    const t = translations[currentLanguage];
    
    const newRow = document.createElement('tr');
    newRow.id = `itemRow_${rowId}`;
    newRow.innerHTML = `
        <td class="border p-1 md:p-2">
            <input type="text" class="item-name w-full p-2 border rounded-lg text-base" 
                   placeholder="${t.itemNamePlaceholder}" autocomplete="off"
                   style="font-size: 16px; width: 100%; min-width: 140px;">
        </td>
        <td class="border p-1 md:p-2">
            <input type="number" class="item-qty w-full p-2 border rounded-lg text-base" 
                   value="1" step="0.5" min="0" style="font-size: 16px; text-align: center;">
        </td>
        <td class="border p-1 md:p-2">
            <input type="number" class="item-price w-full p-2 border rounded-lg text-base" 
                   value="0" step="1" min="0" style="font-size: 16px; text-align: center;">
        </td>
        <td class="border p-1 md:p-2 text-center">
            <span class="item-total font-mono font-bold" style="font-size: 16px;">0</span>
        </td>
        <td class="border p-1 md:p-2 text-center">
            <button type="button" onclick="removeItemRow(${rowId})" 
                    class="text-red-600 hover:text-red-800 text-2xl font-bold px-2">&times;</button>
        </td>
    `;
    tbody.appendChild(newRow);
    addRowEventListeners(newRow, rowId);
    
    const newNameInput = newRow.querySelector('.item-name');
    if (newNameInput) newNameInput.focus();
}

function removeItemRow(rowId) {
    const row = document.getElementById(`itemRow_${rowId}`);
    if (row) {
        row.remove();
        calculateAllTotals();
        const remainingRows = document.querySelectorAll('#itemsTable tr').length;
        if (remainingRows === 0) addItemRow();
    }
}

function initializeFirstRow() {
    const tbody = document.getElementById('itemsTable');
    if (!tbody) return;
    tbody.innerHTML = '';
    itemCounter = 0;
    addItemRow();
}

// Edit Invoice
async function editInvoice(invoiceId) {
    const invoice = await getInvoiceById(invoiceId);
    if (!invoice) return;
    
    editingInvoiceId = invoiceId;
    
    document.getElementById('businessName').value = invoice.businessName;
    document.getElementById('businessContact').value = invoice.businessContact;
    document.getElementById('customerName').value = invoice.customerName;
    document.getElementById('customerMobile').value = invoice.customerMobile || '';
    document.getElementById('tamilNotes').value = invoice.tamilNotes;
    
    const tbody = document.getElementById('itemsTable');
    tbody.innerHTML = '';
    itemCounter = 0;
    
    invoice.items.forEach((item, index) => {
        const rowId = itemCounter++;
        const newRow = document.createElement('tr');
        newRow.id = `itemRow_${rowId}`;
        newRow.innerHTML = `
            <td class="border p-1 md:p-2">
                <input type="text" class="item-name w-full p-2 border rounded-lg text-base" 
                       value="${escapeHtml(item.name)}" autocomplete="off"
                       style="font-size: 16px; width: 100%; min-width: 140px;">
            </td>
            <td class="border p-1 md:p-2">
                <input type="number" class="item-qty w-full p-2 border rounded-lg text-base" 
                       value="${item.qty}" step="0.5" min="0" style="font-size: 16px; text-align: center;">
            </td>
            <td class="border p-1 md:p-2">
                <input type="number" class="item-price w-full p-2 border rounded-lg text-base" 
                       value="${item.price}" step="1" min="0" style="font-size: 16px; text-align: center;">
            </td>
            <td class="border p-1 md:p-2 text-center">
                <span class="item-total font-mono font-bold" style="font-size: 16px;">${(item.qty * item.price).toFixed(2)}</span>
            </td>
            <td class="border p-1 md:p-2 text-center">
                <button type="button" onclick="removeItemRow(${rowId})" 
                        class="text-red-600 hover:text-red-800 text-2xl font-bold px-2">&times;</button>
            </td>
        `;
        tbody.appendChild(newRow);
        addRowEventListeners(newRow, rowId);
    });
    
    if (invoice.items.length === 0) addItemRow();
    calculateAllTotals();
    
    const titleSpan = document.getElementById('createInvoiceTitle');
    if (titleSpan) titleSpan.textContent = translations[currentLanguage].editInvoiceTitle;
    updateSaveButtonText();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Editing invoice ${invoice.invoiceNo}`, 'info');
}

// Delete Invoice
async function deleteInvoice(invoiceId) {
    const t = translations[currentLanguage];
    if (confirm(t.confirmDelete)) {
        await deleteInvoiceFromDB(invoiceId);
        await loadInvoices();
        showToast(t.deleteSuccess, 'success');
        if (editingInvoiceId === invoiceId) cancelEdit();
    }
}

// Save or Update Invoice
async function saveInvoice() {
    const businessName = document.getElementById('businessName').value || 'My Business';
    const businessContact = document.getElementById('businessContact').value || 'Contact Info';
    const customerName = document.getElementById('customerName').value || 'Guest';
    const customerMobile = document.getElementById('customerMobile').value || '';
    const tamilNotes = document.getElementById('tamilNotes').value || 'நன்றி! மீண்டும் வருக';
    const t = translations[currentLanguage];
    
    if (businessName && businessName !== 'My Business') {
        await saveToAutoComplete('businessNames', businessName);
    }
    if (customerName && customerName !== 'Guest') {
        await saveToAutoComplete('customerNames', customerName);
    }
    
    const items = [];
    const rows = document.querySelectorAll('#itemsTable tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const nameInput = row.querySelector('.item-name');
        const qtyInput = row.querySelector('.item-qty');
        const priceInput = row.querySelector('.item-price');
        if (!nameInput || !qtyInput || !priceInput) continue;
        const name = nameInput.value.trim();
        const qty = parseFloat(qtyInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        if (name !== '' && (qty > 0 || price > 0)) {
            items.push({ name, qty, price, total: qty * price });
            await saveToAutoComplete('itemNames', name);
        }
    }
    
    if (items.length === 0) {
        alert(t.noItemAlert);
        return;
    }
    
    const { subtotal, gst, total } = calculateAllTotals();
    const date = new Date().toLocaleDateString('en-IN');
    
    let invoice;
    
    if (editingInvoiceId) {
        const existingInvoice = await getInvoiceById(editingInvoiceId);
        invoice = {
            ...existingInvoice,
            businessName, businessContact, customerName, customerMobile,
            items, subtotal: subtotal.toFixed(2), gst: gst.toFixed(2), total: total.toFixed(2),
            tamilNotes, updatedAt: new Date().toISOString()
        };
        await saveInvoiceToDB(invoice);
        showToast(t.updateSuccess, 'success');
        editingInvoiceId = null;
        cancelEdit();
    } else {
        const invoiceNo = await getNextInvoiceNumber();
        invoice = {
            id: Date.now(), invoiceNo, date, businessName, businessContact,
            customerName, customerMobile, items,
            subtotal: subtotal.toFixed(2), gst: gst.toFixed(2), total: total.toFixed(2),
            tamilNotes, footprint: getDigitalFootprint(), timestamp: new Date().toISOString()
        };
        await saveInvoiceToDB(invoice);
        document.getElementById('customerName').value = '';
        document.getElementById('customerMobile').value = '';
        const nextNum = await getNextInvoiceNumber();
        const nextNumSpan = document.getElementById('nextInvoiceNumber');
        if (nextNumSpan) nextNumSpan.innerText = nextNum;
        showToast(t.syncSuccess, 'success');
    }
    
    await saveBusinessInfo({ businessName, businessContact });
    await loadInvoices();
    generatePrintPDF(invoice);
    if (typeof syncToServer === 'function') syncToServer();
}

function generatePrintPDF(invoice) {
    const printWindow = window.open('', '_blank');
    const itemsHtml = invoice.items.map(item => `
        <tr><td style="border:1px solid #000;padding:8px;">${escapeHtml(item.name)}</td>
        <td style="border:1px solid #000;padding:8px;text-align:center;">${item.qty}</td>
        <td style="border:1px solid #000;padding:8px;text-align:right;">₹${item.price.toFixed(2)}</td>
        <td style="border:1px solid #000;padding:8px;text-align:right;">₹${item.total.toFixed(2)}</td>
        </tr>
    `).join('');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html><head><title>Invoice ${invoice.invoiceNo}</title>
        <meta charset="UTF-8">
        <style>
            *{font-family:'Noto Sans Tamil',Arial,sans-serif;}
            body{padding:20px;margin:0;}
            .invoice-box{max-width:800px;margin:auto;border:2px solid #000;padding:20px;}
            .header{text-align:center;border-bottom:2px solid #000;margin-bottom:20px;}
            .customer-details{margin-bottom:20px;background:#f5f5f5;padding:10px;}
            table{width:100%;border-collapse:collapse;margin:20px 0;}
            th,td{border:1px solid #000;padding:8px;}
            th{background:#f0f0f0;}
            .footer{margin-top:20px;text-align:center;font-style:italic;}
            @media print{body{padding:0;}}
        </style>
        </head><body>
        <div class="invoice-box">
            <div class="header"><h2>${escapeHtml(invoice.businessName)}</h2>
            <p>${escapeHtml(invoice.businessContact)}</p><h3>TAX INVOICE</h3></div>
            <div><strong>Invoice No:</strong> ${invoice.invoiceNo}<br><strong>Date:</strong> ${invoice.date}</div>
            <div class="customer-details"><strong>Customer:</strong> ${escapeHtml(invoice.customerName)}<br>
            ${invoice.customerMobile ? `<strong>Mobile:</strong> ${invoice.customerMobile}` : ''}</div>
            <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>${itemsHtml}</tbody></table>
            <div style="text-align:right;"><p>Subtotal: ₹${invoice.subtotal}</p>
            <p>GST (5%): ₹${invoice.gst}</p><h3>Total: ₹${invoice.total}</h3></div>
            <div class="footer"><p>${escapeHtml(invoice.tamilNotes)}</p>
            <p>Powered by Hosur Invoice Bill</p></div>
        </div>
        <script>window.print();setTimeout(()=>window.close(),1000);<\/script>
        </body></html>
    `);
    printWindow.document.close();
}

async function loadInvoices() {
    const invoices = await getAllInvoices();
    const container = document.getElementById('invoicesList');
    const countSpan = document.getElementById('invoiceCount');
    const t = translations[currentLanguage];
    
    if (countSpan) countSpan.innerText = `(${invoices.length})`;
    
    if (invoices.length === 0) {
        if (container) container.innerHTML = `<div class="text-center text-gray-500 py-8"><i class="fas fa-file-invoice text-4xl mb-2 opacity-50"></i><p>${t.noInvoicesText}</p></div>`;
        return;
    }
    
    const sortedInvoices = invoices.sort((a, b) => b.id - a.id);
    container.innerHTML = sortedInvoices.map(inv => `
        <div class="invoice-item border rounded-xl p-3 hover:shadow-md transition bg-white">
            <div class="flex flex-wrap justify-between items-center gap-2">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="font-bold text-blue-700">${inv.invoiceNo}</span>
                    <span class="text-gray-600">${escapeHtml(inv.customerName)}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="font-bold text-green-700">₹${inv.total}</span>
                    <span class="text-xs text-gray-500">${inv.date}</span>
                </div>
            </div>
            <div class="text-xs text-gray-400 mt-1">${inv.items.length} item(s) | ${escapeHtml(inv.items[0]?.name || '')}${inv.items.length > 1 ? ` +${inv.items.length - 1} more` : ''}</div>
            <div class="flex gap-2 mt-3 pt-2 border-t">
                <button onclick="viewInvoiceDetails(${inv.id})" class="flex-1 bg-blue-500 text-white px-2 py-1.5 rounded-lg text-xs hover:bg-blue-600 transition">
                    <i class="fas fa-eye"></i> ${t.viewBtnText}
                </button>
                <button onclick="editInvoice(${inv.id})" class="flex-1 bg-yellow-500 text-white px-2 py-1.5 rounded-lg text-xs hover:bg-yellow-600 transition">
                    <i class="fas fa-edit"></i> ${t.editBtnText}
                </button>
                <button onclick="deleteInvoice(${inv.id})" class="flex-1 bg-red-500 text-white px-2 py-1.5 rounded-lg text-xs hover:bg-red-600 transition">
                    <i class="fas fa-trash"></i> ${t.deleteBtnText}
                </button>
            </div>
        </div>
    `).join('');
    
    const nextNum = await getNextInvoiceNumber();
    const nextNumSpan = document.getElementById('nextInvoiceNumber');
    if (nextNumSpan) nextNumSpan.innerText = nextNum;
}

async function viewInvoiceDetails(invoiceId) {
    const invoice = await getInvoiceById(invoiceId);
    if (invoice) generatePrintPDF(invoice);
}

async function clearAllData() {
    const t = translations[currentLanguage];
    if (confirm(t.clearConfirm)) {
        const tx = db.transaction(['invoices', 'business', 'businessNames', 'itemNames', 'customerNames'], 'readwrite');
        tx.objectStore('invoices').clear();
        tx.objectStore('business').clear();
        tx.objectStore('businessNames').clear();
        tx.objectStore('itemNames').clear();
        tx.objectStore('customerNames').clear();
        await tx.done;
        cancelEdit();
        document.getElementById('customerName').value = '';
        document.getElementById('customerMobile').value = '';
        document.getElementById('businessName').value = '';
        document.getElementById('businessContact').value = '';
        initializeFirstRow();
        await loadInvoices();
        calculateAllTotals();
        await loadAutoCompleteData();
        showToast('✅ All data cleared!', 'info');
        closeSettings();
    }
}

async function setupBusinessNameAutoComplete() {
    const businessInput = document.getElementById('businessName');
    if (!businessInput) return;
    businessInput.addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length >= 1) {
            const suggestions = await getSuggestions('businessNames', query, 5);
            createAutoComplete(businessInput, suggestions, async (selected) => {
                await saveToAutoComplete('businessNames', selected);
            });
        }
    });
    businessInput.addEventListener('blur', async () => {
        if (businessInput.value.trim()) await saveToAutoComplete('businessNames', businessInput.value.trim());
    });
}

async function setupCustomerNameAutoComplete() {
    const customerInput = document.getElementById('customerName');
    if (!customerInput) return;
    customerInput.addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length >= 1) {
            const suggestions = await getSuggestions('customerNames', query, 5);
            createAutoComplete(customerInput, suggestions, async (selected) => {
                await saveToAutoComplete('customerNames', selected);
            });
        }
    });
    customerInput.addEventListener('blur', async () => {
        if (customerInput.value.trim()) await saveToAutoComplete('customerNames', customerInput.value.trim());
    });
}

// Load saved theme on page load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('app_theme');
    if (savedTheme) {
        document.body.classList.add(`theme-${savedTheme}`);
    }
}

// Load saved QR on page load
function loadSavedQR() {
    const savedQR = localStorage.getItem('payment_qr');
    if (savedQR) {
        const qrPreview = document.getElementById('qrPreview');
        const qrPlaceholder = document.getElementById('qrPlaceholder');
        if (qrPreview) {
            qrPreview.src = savedQR;
            qrPreview.style.display = 'block';
        }
        if (qrPlaceholder) qrPlaceholder.style.display = 'none';
    }
}

// Event Listeners
document.getElementById('businessName')?.addEventListener('input', async (e) => {
    const info = await loadBusinessInfo();
    info.businessName = e.target.value;
    await saveBusinessInfo(info);
});

document.getElementById('businessContact')?.addEventListener('input', async (e) => {
    const info = await loadBusinessInfo();
    info.businessContact = e.target.value;
    await saveBusinessInfo(info);
});

document.getElementById('invoicePrefix')?.addEventListener('change', async (e) => {
    localStorage.setItem('invoicePrefix', e.target.value);
    await loadInvoices();
    calculateAllTotals();
});

// Make functions global for HTML access
window.toggleLanguage = toggleLanguage;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.changeTheme = changeTheme;
window.showPaymentQR = showPaymentQR;
window.closePaymentQRModal = closePaymentQRModal;
window.handleQRUpload = handleQRUpload;
window.removeQRCode = removeQRCode;
window.resetForNewBill = resetForNewBill;
window.addItemRow = addItemRow;
window.removeItemRow = removeItemRow;
window.saveInvoice = saveInvoice;
window.editInvoice = editInvoice;
window.deleteInvoice = deleteInvoice;
window.viewInvoiceDetails = viewInvoiceDetails;
window.clearAllData = clearAllData;

// Initialize
(async function init() {
    try {
        loadSavedTheme();
        loadSavedQR();
        await initDB();
        await applyTranslations();
        const business = await loadBusinessInfo();
        if (business.businessName) document.getElementById('businessName').value = business.businessName;
        if (business.businessContact) document.getElementById('businessContact').value = business.businessContact;
        const savedPrefix = localStorage.getItem('invoicePrefix');
        if (savedPrefix && document.getElementById('invoicePrefix')) {
            document.getElementById('invoicePrefix').value = savedPrefix;
        }
        initializeFirstRow();
        await loadInvoices();
        calculateAllTotals();
        await setupBusinessNameAutoComplete();
        await setupCustomerNameAutoComplete();
        console.log('✅ Hosur Invoice Bill Ready | All Features Working');
    } catch (error) {
        console.error('Init error:', error);
        alert('Error loading app. Please refresh.');
    }
})();
