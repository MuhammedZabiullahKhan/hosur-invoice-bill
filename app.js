// Hosur Invoice Bill - Complete Application
// Created by Shri Muhammed Zabiullah Khan

let db;
let currentLanguage = 'tamil';
let itemCounter = 0;
let editingInvoiceId = null;

// Complete Translations
const translations = {
    tamil: {
        // Header
        appTitle: "🏪 ஹொசூர் இன்வாய்ஸ் பில்",
        subtitle: "Hosur Invoice Bill",
        createdBy: "by Shri Muhammed Zabiullah Khan",
        
        // Buttons
        showQR: "QR காட்டு",
        settings: "அமைப்புகள்",
        newBill: "புதிய பில்",
        addItem: "பொருள் சேர்",
        saveInvoice: "💾 இன்வாய்ஸ் சேமி & அச்சிடு",
        updateInvoice: "🔄 இன்வாய்ஸ் புதுப்பி & அச்சிடு",
        cancel: "ரத்து செய்",
        uploadQR: "QR பதிவேற்று",
        removeQR: "QR நீக்கு",
        clearAllData: "எல்லா தரவையும் அழிக்க",
        
        // Business Section
        businessTitle: "🏪 என் கடை விவரங்கள்",
        businessName: "கடை பெயர்",
        businessContact: "தொடர்பு & முகவரி",
        invoicePrefix: "இன்வாய்ஸ் எண் முறை",
        nextInvoice: "அடுத்த இன்வாய்ஸ் எண்",
        
        // Customer Section
        createInvoice: "➕ புதிய இன்வாய்ஸ்",
        editInvoiceTitle: "✏️ இன்வாய்ஸ் திருத்து",
        customerName: "வாடிக்கையாளர் பெயர்",
        customerMobile: "மொபைல் எண்",
        
        // Items Section
        itemsLabel: "📦 பொருட்கள்",
        itemName: "பொருள் பெயர்",
        qty: "அளவு",
        price: "விலை (₹)",
        total: "மொத்தம் (₹)",
        
        // Summary
        subtotal: "துணை மொத்தம்",
        gst: "ஜிஎஸ்டி (5%)",
        grandTotal: "மொத்தம்",
        
        // Notes
        notes: "குறிப்புகள் (தமிழ்)",
        
        // History
        historyTitle: "📄 என் இன்வாய்ஸ்கள்",
        noInvoices: "இன்னும் இன்வாய்ஸ் இல்லை. மேலே உங்கள் முதல் இன்வாய்ஸ் உருவாக்கவும்!",
        
        // Actions
        view: "பார்",
        edit: "திருத்து",
        delete: "நீக்கு",
        
        // Settings Panel
        settingsTitle: "அமைப்புகள்",
        paymentQRTitle: "உங்கள் கட்டண QR குறியீடு",
        paymentQRDesc: "உங்கள் GPay/PhonePe/Paytm QR ஐ பதிவேற்றவும்",
        themeTitle: "🎨 வண்ண தீம்",
        dataTitle: "🗑️ தரவு மேலாண்மை",
        aboutTitle: "ℹ️ பற்றி",
        aboutText: "ஹொசூர் இன்வாய்ஸ் பில் - சிறு வணிகங்களுக்கான இலவச இன்வாய்ஸ் ஜெனரேட்டர்",
        supportEmail: "0gbtechintel@gmail.com",
        
        // QR Modal
        scanToPay: "ஸ்கேன் செய்து பணம் செலுத்துங்கள்",
        scanInstruction: "GPay, PhonePe அல்லது Paytm மூலம் ஸ்கேன் செய்யவும்",
        close: "மூடு",
        noQR: "கட்டண QR இல்லை. அமைப்புகளில் சேர்க்கவும்.",
        
        // Placeholders
        businessNamePlaceholder: "உதா: ஷ்ரீ முஹம்மது சன்ஸ்",
        businessContactPlaceholder: "தொலை: 9876543210, ஹொசூர் மெயின் ரோடு",
        customerNamePlaceholder: "உதா: ராஜேஷ் டெக்ஸ்டைல்ஸ்",
        customerMobilePlaceholder: "உதா: 9876543210",
        itemNamePlaceholder: "பொருள் பெயர் (உதா: அரிசி 5கிலோ)",
        notesPlaceholder: "நன்றி! மீண்டும் வருக",
        
        // Tips
        tipText: "💡 குறிப்பு: தட்டச்சு செய்ய ஆரம்பித்தால் பரிந்துரைகள் வரும்!",
        
        // Alerts
        confirmDelete: "இந்த இன்வாய்ஸை நீக்க வேண்டுமா?",
        deleteSuccess: "✅ இன்வாய்ஸ் நீக்கப்பட்டது!",
        updateSuccess: "✅ இன்வாய்ஸ் புதுப்பிக்கப்பட்டது!",
        saveSuccess: "✅ இன்வாய்ஸ் சேமிக்கப்பட்டது!",
        noItemAlert: "⚠️ தயவுசெய்து குறைந்தது ஒரு பொருளையாவது சேர்க்கவும்!",
        clearConfirm: "⚠️ எச்சரிக்கை: இது உங்கள் உலாவியில் உள்ள அனைத்து இன்வாய்ஸ்களையும் நீக்கும்!\n\nதொடரவா?",
        themeChanged: "வண்ண தீம் மாற்றப்பட்டது",
        qrUploadSuccess: "QR குறியீடு வெற்றிகரமாக பதிவேற்றப்பட்டது!",
        qrRemoved: "QR குறியீடு நீக்கப்பட்டது",
        newBillReady: "✅ புதிய பில்லுக்கு தயார்! வாடிக்கையாளர் விவரங்களை உள்ளிடவும்."
    },
    english: {
        // Header
        appTitle: "🏪 Hosur Invoice Bill",
        subtitle: "Hosur Invoice Bill",
        createdBy: "by Shri Muhammed Zabiullah Khan",
        
        // Buttons
        showQR: "Show QR",
        settings: "Settings",
        newBill: "New Bill",
        addItem: "Add Item",
        saveInvoice: "💾 Save Invoice & Print",
        updateInvoice: "🔄 Update Invoice & Print",
        cancel: "Cancel",
        uploadQR: "Upload QR",
        removeQR: "Remove QR",
        clearAllData: "Clear All My Data",
        
        // Business Section
        businessTitle: "🏪 My Business Details",
        businessName: "Business Name",
        businessContact: "Contact & Address",
        invoicePrefix: "Invoice Number Pattern",
        nextInvoice: "Next Invoice Number",
        
        // Customer Section
        createInvoice: "➕ Create New Invoice",
        editInvoiceTitle: "✏️ Edit Invoice",
        customerName: "Customer Name",
        customerMobile: "Mobile Number",
        
        // Items Section
        itemsLabel: "📦 Items",
        itemName: "Item Name",
        qty: "Qty",
        price: "Price (₹)",
        total: "Total (₹)",
        
        // Summary
        subtotal: "Subtotal",
        gst: "GST (5%)",
        grandTotal: "Total",
        
        // Notes
        notes: "Notes",
        
        // History
        historyTitle: "📄 My Invoices",
        noInvoices: "No invoices yet. Create your first invoice above!",
        
        // Actions
        view: "View",
        edit: "Edit",
        delete: "Delete",
        
        // Settings Panel
        settingsTitle: "Settings",
        paymentQRTitle: "Your Payment QR Code",
        paymentQRDesc: "Upload your GPay/PhonePe/Paytm QR code",
        themeTitle: "🎨 Theme Color",
        dataTitle: "🗑️ Data Management",
        aboutTitle: "ℹ️ About",
        aboutText: "Hosur Invoice Bill - Free invoice generator for small businesses",
        supportEmail: "0gbtechintel@gmail.com",
        
        // QR Modal
        scanToPay: "Scan to Pay",
        scanInstruction: "Scan with GPay, PhonePe, or Paytm to pay",
        close: "Close",
        noQR: "No payment QR uploaded. Please add in settings.",
        
        // Placeholders
        businessNamePlaceholder: "Ex: Shri Muhammed Sons",
        businessContactPlaceholder: "Phone: 9876543210, Hosur Main Road",
        customerNamePlaceholder: "Ex: Rajesh Textiles",
        customerMobilePlaceholder: "Ex: 9876543210",
        itemNamePlaceholder: "Item name (Ex: Rice 5kg)",
        notesPlaceholder: "Thank you! Visit again",
        
        // Tips
        tipText: "💡 Tip: Start typing - auto suggestions appear!",
        
        // Alerts
        confirmDelete: "Are you sure you want to delete this invoice?",
        deleteSuccess: "✅ Invoice deleted!",
        updateSuccess: "✅ Invoice updated!",
        saveSuccess: "✅ Invoice saved!",
        noItemAlert: "⚠️ Please add at least one item!",
        clearConfirm: "⚠️ WARNING: This will delete ALL your invoices from this browser!\n\nContinue?",
        themeChanged: "Theme changed",
        qrUploadSuccess: "QR code uploaded successfully!",
        qrRemoved: "QR code removed",
        newBillReady: "✅ Ready for new bill! Enter customer details."
    }
};

// Apply all translations to HTML
function applyTranslations() {
    const t = translations[currentLanguage];
    
    // Header
    setText('appTitle', t.appTitle);
    setText('subtitleText', t.subtitle);
    setText('createdByText', t.createdBy);
    
    // Buttons
    setText('showQRBtn', t.showQR);
    setText('settingsBtn', t.settings);
    setText('newBillBtn', t.newBill);
    setText('addItemBtn', t.addItem);
    setText('saveBtnText', editingInvoiceId ? t.updateInvoice : t.saveInvoice);
    setText('uploadQRBtn', t.uploadQR);
    setText('removeQRBtn', t.removeQR);
    setText('clearDataBtn', t.clearAllData);
    
    // Business Section
    setText('businessTitle', t.businessTitle);
    setText('businessNameLabel', t.businessName);
    setText('businessContactLabel', t.businessContact);
    setText('invoicePrefixLabel', t.invoicePrefix);
    setText('nextInvoiceLabel', t.nextInvoice);
    
    // Customer Section
    setText('createInvoiceTitle', editingInvoiceId ? t.editInvoiceTitle : t.createInvoice);
    setText('customerNameLabel', t.customerName);
    setText('customerMobileLabel', t.customerMobile);
    
    // Items Section
    setText('itemsLabel', t.itemsLabel);
    setText('itemNameHeader', t.itemName);
    setText('qtyHeader', t.qty);
    setText('priceHeader', t.price);
    setText('totalHeader', t.total);
    
    // Summary
    setText('subtotalLabel', t.subtotal);
    setText('gstLabel', t.gst);
    setText('totalLabel', t.grandTotal);
    
    // Notes
    setText('notesLabel', t.notes);
    
    // History
    setText('historyTitle', t.historyTitle);
    setText('noInvoicesText', t.noInvoices);
    
    // Action buttons on invoices
    document.querySelectorAll('.view-btn-text').forEach(el => el.textContent = t.view);
    document.querySelectorAll('.edit-btn-text').forEach(el => el.textContent = t.edit);
    document.querySelectorAll('.delete-btn-text').forEach(el => el.textContent = t.delete);
    
    // Settings Panel
    setText('settingsTitle', t.settingsTitle);
    setText('qrUploadTitle', t.paymentQRTitle);
    setText('qrUploadDesc', t.paymentQRDesc);
    setText('themeTitle', t.themeTitle);
    setText('dataTitle', t.dataTitle);
    setText('aboutTitle', t.aboutTitle);
    setText('aboutText', t.aboutText);
    
    // QR Modal
    setText('paymentQRTitle', t.scanToPay);
    setText('paymentQRInstruction', t.scanInstruction);
    setText('qrCloseBtn', t.close);
    setText('noQRText', t.noQR);
    
    // Tips
    setText('tipText', t.tipText);
    
    // Placeholders
    const businessNameInput = document.getElementById('businessName');
    const businessContactInput = document.getElementById('businessContact');
    const customerNameInput = document.getElementById('customerName');
    const customerMobileInput = document.getElementById('customerMobile');
    const tamilNotesInput = document.getElementById('tamilNotes');
    
    if (businessNameInput) businessNameInput.placeholder = t.businessNamePlaceholder;
    if (businessContactInput) businessContactInput.placeholder = t.businessContactPlaceholder;
    if (customerNameInput) customerNameInput.placeholder = t.customerNamePlaceholder;
    if (customerMobileInput) customerMobileInput.placeholder = t.customerMobilePlaceholder;
    if (tamilNotesInput) tamilNotesInput.placeholder = t.notesPlaceholder;
    
    // Update language button text
    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.innerHTML = `<i class="fas fa-language"></i> ${currentLanguage === 'tamil' ? 'English' : 'தமிழ்'}`;
    
    // Update item name placeholders
    document.querySelectorAll('.item-name').forEach(input => {
        input.placeholder = t.itemNamePlaceholder;
    });
}

function setText(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = text;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'tamil' ? 'english' : 'tamil';
    applyTranslations();
    showToast(currentLanguage === 'tamil' ? '✅ தமிழுக்கு மாற்றப்பட்டது' : '✅ Switched to English');
}

// Settings Panel
function openSettings() {
    document.getElementById('settingsPanel').classList.add('open');
    document.getElementById('settingsOverlay').classList.add('active');
}

function closeSettings() {
    document.getElementById('settingsPanel').classList.remove('open');
    document.getElementById('settingsOverlay').classList.remove('active');
}

// Theme
function changeTheme(theme) {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('app_theme', theme);
    showToast(translations[currentLanguage].themeChanged);
    closeSettings();
}

// QR Code Functions
function showPaymentQR() {
    const savedQR = localStorage.getItem('payment_qr');
    const modal = document.getElementById('paymentQRModal');
    const qrImage = document.getElementById('paymentQRImage');
    const noQRMessage = document.getElementById('noQRMessage');
    
    if (savedQR) {
        qrImage.src = savedQR;
        qrImage.style.display = 'block';
        noQRMessage.style.display = 'none';
    } else {
        qrImage.style.display = 'none';
        noQRMessage.style.display = 'block';
    }
    modal.classList.add('active');
}

function closePaymentQRModal() {
    document.getElementById('paymentQRModal').classList.remove('active');
}

function handleQRUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const qrData = e.target.result;
            localStorage.setItem('payment_qr', qrData);
            document.getElementById('qrPreview').src = qrData;
            document.getElementById('qrPreview').style.display = 'block';
            document.getElementById('qrPlaceholder').style.display = 'none';
            showToast(translations[currentLanguage].qrUploadSuccess);
        };
        reader.readAsDataURL(file);
    }
}

function removeQRCode() {
    localStorage.removeItem('payment_qr');
    document.getElementById('qrPreview').style.display = 'none';
    document.getElementById('qrPlaceholder').style.display = 'flex';
    showToast(translations[currentLanguage].qrRemoved);
}

// New Bill - Clear form for next customer
function resetForNewBill() {
    const t = translations[currentLanguage];
    document.getElementById('customerName').value = '';
    document.getElementById('customerMobile').value = '';
    document.getElementById('tamilNotes').value = t.notesPlaceholder;
    
    const tbody = document.getElementById('itemsTable');
    if (tbody) {
        tbody.innerHTML = '';
        itemCounter = 0;
        addItemRow();
    }
    calculateAllTotals();
    
    if (editingInvoiceId) {
        editingInvoiceId = null;
        const saveBtn = document.getElementById('saveInvoiceBtn');
        if (saveBtn) saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t.saveInvoice}`;
        document.getElementById('createInvoiceTitle').innerHTML = t.createInvoice;
    }
    
    showToast(t.newBillReady);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============ Database Functions ============

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('HosurInvoiceDB', 3);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('invoices')) {
                db.createObjectStore('invoices', { keyPath: 'id' });
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

function getAllFromStore(storeName) {
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

function saveToAutoComplete(storeName, name) {
    if (!name || name.trim() === '') return Promise.resolve();
    const cleanName = name.trim();
    return new Promise((resolve, reject) => {
        const tx = db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        const getRequest = store.get(cleanName);
        getRequest.onsuccess = () => {
            const existing = getRequest.result;
            if (existing) {
                existing.count = (existing.count || 0) + 1;
                store.put(existing);
            } else {
                store.put({ name: cleanName, count: 1, lastUsed: Date.now() });
            }
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        };
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
    const existing = document.getElementById(`dropdown_${inputElement.id}`);
    if (existing) existing.remove();
    if (!suggestions.length) return;
    
    const dropdown = document.createElement('div');
    dropdown.id = `dropdown_${inputElement.id}`;
    dropdown.className = 'fixed z-50 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto';
    const rect = inputElement.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.left = `${rect.left + window.scrollX}px`;
    dropdown.style.minWidth = `${rect.width}px`;
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm';
        item.textContent = suggestion;
        item.onclick = () => {
            inputElement.value = suggestion;
            onSelect(suggestion);
            dropdown.remove();
        };
        dropdown.appendChild(item);
    });
    document.body.appendChild(dropdown);
    
    const close = (e) => {
        if (!dropdown.contains(e.target) && e.target !== inputElement) {
            dropdown.remove();
            document.removeEventListener('click', close);
        }
    };
    setTimeout(() => document.addEventListener('click', close), 100);
}

function getDigitalFootprint() {
    let footprint = localStorage.getItem('hosur_bill_footprint');
    if (!footprint) {
        footprint = 'user_' + crypto.randomUUID() + '_' + Date.now();
        localStorage.setItem('hosur_bill_footprint', footprint);
    }
    return footprint;
}

function saveInvoiceToDB(invoice) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['invoices'], 'readwrite');
        const store = tx.objectStore('invoices');
        const request = store.put(invoice);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function deleteInvoiceFromDB(invoiceId) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['invoices'], 'readwrite');
        const store = tx.objectStore('invoices');
        const request = store.delete(invoiceId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function getInvoiceById(invoiceId) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['invoices'], 'readonly');
        const store = tx.objectStore('invoices');
        const request = store.get(invoiceId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function getAllInvoices() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['invoices'], 'readonly');
        const store = tx.objectStore('invoices');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

function saveBusinessInfo(info) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['business'], 'readwrite');
        const store = tx.objectStore('business');
        const request = store.put({ id: 'businessInfo', ...info });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function loadBusinessInfo() {
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
    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.item-qty')?.value) || 0;
        const price = parseFloat(row.querySelector('.item-price')?.value) || 0;
        const total = qty * price;
        const totalSpan = row.querySelector('.item-total');
        if (totalSpan) totalSpan.textContent = total.toFixed(2);
        subtotal += total;
    });
    const gst = subtotal * 0.05;
    const total = subtotal + gst;
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('gstAmount').textContent = gst.toFixed(2);
    document.getElementById('grandTotal').textContent = total.toFixed(2);
    return { subtotal, gst, total };
}

function addRowEventListeners(row) {
    const qtyInput = row.querySelector('.item-qty');
    const priceInput = row.querySelector('.item-price');
    const nameInput = row.querySelector('.item-name');
    
    const update = () => calculateAllTotals();
    if (qtyInput) qtyInput.addEventListener('input', update);
    if (priceInput) priceInput.addEventListener('input', update);
    
    if (nameInput) {
        nameInput.placeholder = translations[currentLanguage].itemNamePlaceholder;
        nameInput.addEventListener('input', async (e) => {
            update();
            const query = e.target.value;
            if (query.length >= 1) {
                const suggestions = await getSuggestions('itemNames', query, 5);
                createAutoComplete(nameInput, suggestions, async (selected) => {
                    await saveToAutoComplete('itemNames', selected);
                });
            }
        });
        nameInput.addEventListener('blur', async () => {
            if (nameInput.value.trim()) await saveToAutoComplete('itemNames', nameInput.value.trim());
        });
    }
    update();
}

function addItemRow() {
    const tbody = document.getElementById('itemsTable');
    if (!tbody) return;
    const rowId = itemCounter++;
    const t = translations[currentLanguage];
    const newRow = document.createElement('tr');
    newRow.id = `itemRow_${rowId}`;
    newRow.innerHTML = `
        <td class="border p-1"><input type="text" class="item-name w-full p-2 border rounded-lg" placeholder="${t.itemNamePlaceholder}" style="font-size:16px"></td>
        <td class="border p-1"><input type="number" class="item-qty w-full p-2 border rounded-lg" value="1" step="0.5" min="0" style="font-size:16px;text-align:center"></td>
        <td class="border p-1"><input type="number" class="item-price w-full p-2 border rounded-lg" value="0" step="1" min="0" style="font-size:16px;text-align:center"></td>
        <td class="border p-1 text-center"><span class="item-total font-bold">0</span></td>
        <td class="border p-1 text-center"><button onclick="removeItemRow(${rowId})" class="text-red-600 text-xl">&times;</button></td>
    `;
    tbody.appendChild(newRow);
    addRowEventListeners(newRow);
}

function removeItemRow(rowId) {
    const row = document.getElementById(`itemRow_${rowId}`);
    if (row) {
        row.remove();
        calculateAllTotals();
        if (document.querySelectorAll('#itemsTable tr').length === 0) addItemRow();
    }
}

function initializeFirstRow() {
    const tbody = document.getElementById('itemsTable');
    if (tbody) {
        tbody.innerHTML = '';
        itemCounter = 0;
        addItemRow();
    }
}

// ============ CRUD Operations ============

async function editInvoice(invoiceId) {
    const t = translations[currentLanguage];
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
    
    invoice.items.forEach(item => {
        const rowId = itemCounter++;
        const newRow = document.createElement('tr');
        newRow.id = `itemRow_${rowId}`;
        newRow.innerHTML = `
            <td class="border p-1"><input type="text" class="item-name w-full p-2 border rounded-lg" value="${escapeHtml(item.name)}" style="font-size:16px"></td>
            <td class="border p-1"><input type="number" class="item-qty w-full p-2 border rounded-lg" value="${item.qty}" step="0.5" min="0" style="font-size:16px;text-align:center"></td>
            <td class="border p-1"><input type="number" class="item-price w-full p-2 border rounded-lg" value="${item.price}" step="1" min="0" style="font-size:16px;text-align:center"></td>
            <td class="border p-1 text-center"><span class="item-total font-bold">${(item.qty * item.price).toFixed(2)}</span></td>
            <td class="border p-1 text-center"><button onclick="removeItemRow(${rowId})" class="text-red-600 text-xl">&times;</button></td>
        `;
        tbody.appendChild(newRow);
        addRowEventListeners(newRow);
    });
    
    calculateAllTotals();
    document.getElementById('createInvoiceTitle').innerHTML = t.editInvoiceTitle;
    const saveBtn = document.getElementById('saveInvoiceBtn');
    if (saveBtn) saveBtn.innerHTML = `<i class="fas fa-edit"></i> ${t.updateInvoice}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Editing invoice ${invoice.invoiceNo}`);
}

async function deleteInvoice(invoiceId) {
    const t = translations[currentLanguage];
    if (confirm(t.confirmDelete)) {
        await deleteInvoiceFromDB(invoiceId);
        await loadInvoices();
        showToast(t.deleteSuccess);
        if (editingInvoiceId === invoiceId) {
            editingInvoiceId = null;
            document.getElementById('createInvoiceTitle').innerHTML = t.createInvoice;
            const saveBtn = document.getElementById('saveInvoiceBtn');
            if (saveBtn) saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t.saveInvoice}`;
        }
    }
}

async function saveInvoice() {
    const t = translations[currentLanguage];
    const businessName = document.getElementById('businessName').value || 'My Business';
    const businessContact = document.getElementById('businessContact').value || 'Contact Info';
    const customerName = document.getElementById('customerName').value || 'Guest';
    const customerMobile = document.getElementById('customerMobile').value || '';
    const tamilNotes = document.getElementById('tamilNotes').value;
    
    await saveToAutoComplete('businessNames', businessName);
    await saveToAutoComplete('customerNames', customerName);
    
    const items = [];
    const rows = document.querySelectorAll('#itemsTable tr');
    for (const row of rows) {
        const name = row.querySelector('.item-name')?.value.trim();
        const qty = parseFloat(row.querySelector('.item-qty')?.value) || 0;
        const price = parseFloat(row.querySelector('.item-price')?.value) || 0;
        if (name && (qty > 0 || price > 0)) {
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
    
    if (editingInvoiceId) {
        const existing = await getInvoiceById(editingInvoiceId);
        const invoice = { ...existing, businessName, businessContact, customerName, customerMobile, items, subtotal: subtotal.toFixed(2), gst: gst.toFixed(2), total: total.toFixed(2), tamilNotes, updatedAt: new Date().toISOString() };
        await saveInvoiceToDB(invoice);
        showToast(t.updateSuccess);
        editingInvoiceId = null;
        document.getElementById('createInvoiceTitle').innerHTML = t.createInvoice;
        const saveBtn = document.getElementById('saveInvoiceBtn');
        if (saveBtn) saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t.saveInvoice}`;
    } else {
        const invoiceNo = await getNextInvoiceNumber();
        const invoice = { id: Date.now(), invoiceNo, date, businessName, businessContact, customerName, customerMobile, items, subtotal: subtotal.toFixed(2), gst: gst.toFixed(2), total: total.toFixed(2), tamilNotes, footprint: getDigitalFootprint(), timestamp: new Date().toISOString() };
        await saveInvoiceToDB(invoice);
        document.getElementById('customerName').value = '';
        document.getElementById('customerMobile').value = '';
        showToast(t.saveSuccess);
    }
    
    await saveBusinessInfo({ businessName, businessContact });
    await loadInvoices();
    const nextNum = await getNextInvoiceNumber();
    document.getElementById('nextInvoiceNumber').textContent = nextNum;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generatePrintPDF(invoice) {
    const win = window.open('', '_blank');
    const itemsHtml = invoice.items.map(item => `
        <tr><td style="border:1px solid #000;padding:8px;">${escapeHtml(item.name)}</td>
        <td style="border:1px solid #000;padding:8px;text-align:center;">${item.qty}</td>
        <td style="border:1px solid #000;padding:8px;text-align:right;">₹${item.price.toFixed(2)}</td>
        <td style="border:1px solid #000;padding:8px;text-align:right;">₹${item.total.toFixed(2)}</td>
        </tr>
    `).join('');
    
    win.document.write(`
        <!DOCTYPE html>
        <html><head><title>Invoice ${invoice.invoiceNo}</title>
        <style>
            body{font-family:Arial;padding:20px;}
            .invoice-box{max-width:800px;margin:auto;border:2px solid #000;padding:20px;}
            .header{text-align:center;border-bottom:2px solid #000;margin-bottom:20px;}
            .customer-details{margin-bottom:20px;background:#f5f5f5;padding:10px;}
            table{width:100%;border-collapse:collapse;margin:20px 0;}
            th,td{border:1px solid #000;padding:8px;}
            th{background:#f0f0f0;}
            .footer{margin-top:20px;text-align:center;}
        </style>
        </head><body>
        <div class="invoice-box">
            <div class="header"><h2>${escapeHtml(invoice.businessName)}</h2><p>${escapeHtml(invoice.businessContact)}</p><h3>TAX INVOICE</h3></div>
            <div><strong>Invoice No:</strong> ${invoice.invoiceNo}<br><strong>Date:</strong> ${invoice.date}</div>
            <div class="customer-details"><strong>Customer:</strong> ${escapeHtml(invoice.customerName)}<br>${invoice.customerMobile ? `<strong>Mobile:</strong> ${invoice.customerMobile}` : ''}</div>
            <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>${itemsHtml}</tbody></table>
            <div style="text-align:right;"><p>Subtotal: ₹${invoice.subtotal}</p><p>GST (5%): ₹${invoice.gst}</p><h3>Total: ₹${invoice.total}</h3></div>
            <div class="footer"><p>${escapeHtml(invoice.tamilNotes)}</p><p>Powered by Hosur Invoice Bill</p></div>
        </div>
        <script>window.print();setTimeout(()=>window.close(),1000);<\/script>
        </body></html>
    `);
}

async function loadInvoices() {
    const invoices = await getAllInvoices();
    const container = document.getElementById('invoicesList');
    const countSpan = document.getElementById('invoiceCount');
    const t = translations[currentLanguage];
    
    countSpan.textContent = `(${invoices.length})`;
    
    if (invoices.length === 0) {
        container.innerHTML = `<div class="text-center text-gray-500 py-8"><i class="fas fa-file-invoice text-4xl mb-2 opacity-50"></i><p>${t.noInvoices}</p></div>`;
        return;
    }
    
    const sorted = invoices.sort((a, b) => b.id - a.id);
    container.innerHTML = sorted.map(inv => `
        <div class="invoice-item border rounded-xl p-3 hover:shadow-md">
            <div class="flex flex-wrap justify-between items-center gap-2">
                <div><span class="font-bold text-blue-700">${inv.invoiceNo}</span> <span class="text-gray-600">${escapeHtml(inv.customerName)}</span></div>
                <div><span class="font-bold text-green-700">₹${inv.total}</span> <span class="text-xs text-gray-500">${inv.date}</span></div>
            </div>
            <div class="text-xs text-gray-400 mt-1">${inv.items.length} item(s) | ${escapeHtml(inv.items[0]?.name || '')}</div>
            <div class="flex gap-2 mt-2 pt-2 border-t">
                <button onclick="viewInvoiceDetails(${inv.id})" class="flex-1 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs"><i class="fas fa-eye"></i> <span class="view-btn-text">${t.view}</span></button>
                <button onclick="editInvoice(${inv.id})" class="flex-1 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs"><i class="fas fa-edit"></i> <span class="edit-btn-text">${t.edit}</span></button>
                <button onclick="deleteInvoice(${inv.id})" class="flex-1 bg-red-500 text-white px-2 py-1 rounded-lg text-xs"><i class="fas fa-trash"></i> <span class="delete-btn-text">${t.delete}</span></button>
            </div>
        </div>
    `).join('');
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
        resetForNewBill();
        document.getElementById('businessName').value = '';
        document.getElementById('businessContact').value = '';
        await loadInvoices();
        calculateAllTotals();
        showToast('✅ All data cleared!');
        closeSettings();
    }
}

// ============ Auto-complete Setup ============

async function setupBusinessAutoComplete() {
    const input = document.getElementById('businessName');
    input.addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length >= 1) {
            const suggestions = await getSuggestions('businessNames', query, 5);
            createAutoComplete(input, suggestions, async (selected) => {
                await saveToAutoComplete('businessNames', selected);
            });
        }
    });
    input.addEventListener('blur', async () => {
        if (input.value.trim()) await saveToAutoComplete('businessNames', input.value.trim());
    });
}

async function setupCustomerAutoComplete() {
    const input = document.getElementById('customerName');
    input.addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length >= 1) {
            const suggestions = await getSuggestions('customerNames', query, 5);
            createAutoComplete(input, suggestions, async (selected) => {
                await saveToAutoComplete('customerNames', selected);
            });
        }
    });
    input.addEventListener('blur', async () => {
        if (input.value.trim()) await saveToAutoComplete('customerNames', input.value.trim());
    });
}

// ============ Event Listeners ============

document.getElementById('qrUpload').addEventListener('change', handleQRUpload);
document.getElementById('businessName').addEventListener('input', async (e) => {
    const info = await loadBusinessInfo();
    info.businessName = e.target.value;
    await saveBusinessInfo(info);
});
document.getElementById('businessContact').addEventListener('input', async (e) => {
    const info = await loadBusinessInfo();
    info.businessContact = e.target.value;
    await saveBusinessInfo(info);
});
document.getElementById('invoicePrefix').addEventListener('change', async () => {
    await loadInvoices();
    const nextNum = await getNextInvoiceNumber();
    document.getElementById('nextInvoiceNumber').textContent = nextNum;
});

// ============ Initialize ============

async function init() {
    try {
        const savedTheme = localStorage.getItem('app_theme');
        if (savedTheme) document.body.classList.add(`theme-${savedTheme}`);
        
        const savedQR = localStorage.getItem('payment_qr');
        if (savedQR) {
            document.getElementById('qrPreview').src = savedQR;
            document.getElementById('qrPreview').style.display = 'block';
            document.getElementById('qrPlaceholder').style.display = 'none';
        }
        
        await initDB();
        const business = await loadBusinessInfo();
        if (business.businessName) document.getElementById('businessName').value = business.businessName;
        if (business.businessContact) document.getElementById('businessContact').value = business.businessContact;
        
        initializeFirstRow();
        await loadInvoices();
        calculateAllTotals();
        await setupBusinessAutoComplete();
        await setupCustomerAutoComplete();
        
        const nextNum = await getNextInvoiceNumber();
        document.getElementById('nextInvoiceNumber').textContent = nextNum;
        
        // Apply translations after everything is loaded
        applyTranslations();
        
        console.log('✅ Hosur Invoice Bill Ready!');
    } catch (error) {
        console.error('Init error:', error);
    }
}

// Make functions global
window.toggleLanguage = toggleLanguage;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.changeTheme = changeTheme;
window.showPaymentQR = showPaymentQR;
window.closePaymentQRModal = closePaymentQRModal;
window.removeQRCode = removeQRCode;
window.resetForNewBill = resetForNewBill;
window.addItemRow = addItemRow;
window.removeItemRow = removeItemRow;
window.saveInvoice = saveInvoice;
window.editInvoice = editInvoice;
window.deleteInvoice = deleteInvoice;
window.viewInvoiceDetails = viewInvoiceDetails;
window.clearAllData = clearAllData;

// Start the app
init();
