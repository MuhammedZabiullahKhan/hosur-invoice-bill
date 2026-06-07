// Hosur Invoice Bill - Complete Application with Frontend File Management
// Created by Shri Muhammed Zabiullah Khan

let db;
let currentLanguage = 'tamil';
let itemCounter = 0;
let editingInvoiceId = null;
let rootDirectoryHandle = null; // For File System Access API

// GST Settings
let gstEnabled = false;
let gstPercentage = 0;

// Load GST settings from localStorage
function loadGSTSettings() {
    const savedGSTEnabled = localStorage.getItem('gstEnabled');
    const savedGSTPercentage = localStorage.getItem('gstPercentage');
    
    gstEnabled = savedGSTEnabled === 'true';
    gstPercentage = savedGSTPercentage ? parseFloat(savedGSTPercentage) : 0;
    
    const gstToggle = document.getElementById('gstToggle');
    const gstPercentageDiv = document.getElementById('gstPercentageDiv');
    const gstPercentageInput = document.getElementById('gstPercentage');
    const gstInfoText = document.getElementById('gstInfoText');
    const gstLabel = document.getElementById('gstLabel');
    
    if (gstToggle) gstToggle.checked = gstEnabled;
    if (gstPercentageDiv) gstPercentageDiv.style.display = gstEnabled ? 'block' : 'none';
    if (gstPercentageInput) gstPercentageInput.value = gstPercentage;
    if (gstInfoText) {
        gstInfoText.textContent = gstEnabled ? `Current GST: ${gstPercentage}% (Enabled)` : `Current GST: Disabled (0%)`;
    }
    if (gstLabel) {
        gstLabel.textContent = gstEnabled ? `GST (${gstPercentage}%)` : `GST`;
    }
}

function toggleGST() {
    const gstToggle = document.getElementById('gstToggle');
    const gstPercentageDiv = document.getElementById('gstPercentageDiv');
    gstEnabled = gstToggle.checked;
    gstPercentageDiv.style.display = gstEnabled ? 'block' : 'none';
    saveGSTSettings();
}

function saveGSTSettings() {
    const gstPercentageInput = document.getElementById('gstPercentage');
    gstPercentage = parseFloat(gstPercentageInput.value) || 0;
    
    localStorage.setItem('gstEnabled', gstEnabled);
    localStorage.setItem('gstPercentage', gstPercentage);
    
    const gstInfoText = document.getElementById('gstInfoText');
    const gstLabel = document.getElementById('gstLabel');
    
    if (gstEnabled) {
        gstInfoText.textContent = `Current GST: ${gstPercentage}% (Enabled)`;
        gstLabel.textContent = `GST (${gstPercentage}%)`;
    } else {
        gstInfoText.textContent = `Current GST: Disabled (0%)`;
        gstLabel.textContent = `GST`;
    }
    
    calculateAllTotals();
    showToast(`GST settings saved: ${gstEnabled ? gstPercentage + '%' : 'Disabled'}`);
}

// Complete Translations
const translations = {
    tamil: {
        appTitle: "🏪 ஹொசூர் இன்வாய்ஸ் பில்",
        subtitle: "Hosur Invoice Bill",
        createdBy: "by Shri Muhammed Zabiullah Khan",
        showQR: "QR காட்டு",
        settings: "அமைப்புகள்",
        newBill: "புதிய பில்",
        addItem: "பொருள் சேர்",
        saveInvoice: "💾 இன்வாய்ஸ் சேமி & அச்சிடு",
        updateInvoice: "🔄 இன்வாய்ஸ் புதுப்பி & அச்சிடு",
        uploadQR: "QR பதிவேற்று",
        removeQR: "QR நீக்கு",
        clearAllData: "எல்லா தரவையும் அழிக்க",
        businessTitle: "🏪 என் கடை விவரங்கள்",
        businessName: "கடை பெயர்",
        businessContact: "தொடர்பு & முகவரி",
        invoicePrefix: "இன்வாய்ஸ் எண் முறை",
        nextInvoice: "அடுத்த இன்வாய்ஸ் எண்",
        createInvoice: "➕ புதிய இன்வாய்ஸ்",
        editInvoiceTitle: "✏️ இன்வாய்ஸ் திருத்து",
        customerName: "வாடிக்கையாளர் பெயர்",
        customerMobile: "மொபைல் எண்",
        itemsLabel: "📦 பொருட்கள்",
        itemName: "பொருள் பெயர்",
        qty: "அளவு",
        price: "விலை (₹)",
        total: "மொத்தம் (₹)",
        subtotal: "துணை மொத்தம்",
        gst: "ஜிஎஸ்டி",
        grandTotal: "மொத்தம்",
        notes: "குறிப்புகள்",
        historyTitle: "📄 என் இன்வாய்ஸ்கள்",
        noInvoices: "இன்னும் இன்வாய்ஸ் இல்லை",
        view: "பார்",
        edit: "திருத்து",
        delete: "நீக்கு",
        settingsTitle: "அமைப்புகள்",
        paymentQRTitle: "உங்கள் கட்டண QR",
        paymentQRDesc: "GPay/PhonePe/Paytm QR பதிவேற்றுக",
        themeTitle: "🎨 வண்ண தீம்",
        gstTitle: "ஜிஎஸ்டி அமைப்புகள்",
        gstToggleLabel: "ஜிஎஸ்டி செயல்படுத்துக",
        gstPercentLabel: "ஜிஎஸ்டி சதவீதம் (%)",
        dataTitle: "🗑️ தரவு மேலாண்மை",
        aboutTitle: "ℹ️ பற்றி",
        aboutText: "ஹொசூர் இன்வாய்ஸ் பில் - இலவச இன்வாய்ஸ் ஜெனரேட்டர்",
        scanToPay: "ஸ்கேன் செய்து பணம் செலுத்துங்கள்",
        scanInstruction: "GPay, PhonePe, Paytm மூலம் ஸ்கேன் செய்யவும்",
        close: "மூடு",
        noQR: "கட்டண QR இல்லை",
        businessNamePlaceholder: "உதா: ஷ்ரீ முஹம்மது சன்ஸ்",
        businessContactPlaceholder: "தொலை: 9876543210, ஹொசூர் மெயின் ரோடு",
        customerNamePlaceholder: "உதா: ராஜேஷ் டெக்ஸ்டைல்ஸ்",
        customerMobilePlaceholder: "உதா: 9876543210",
        itemNamePlaceholder: "பொருள் பெயர் (உதா: அரிசி 5கிலோ)",
        notesPlaceholder: "நன்றி! மீண்டும் வருக",
        tipText: "💡 குறிப்பு: தட்டச்சு செய்ய ஆரம்பித்தால் பரிந்துரைகள் வரும்! ஜிஎஸ்டியை அமைப்புகளில் மாற்றலாம்",
        confirmDelete: "இந்த இன்வாய்ஸை நீக்க வேண்டுமா?",
        deleteSuccess: "✅ இன்வாய்ஸ் நீக்கப்பட்டது!",
        updateSuccess: "✅ இன்வாய்ஸ் புதுப்பிக்கப்பட்டது!",
        saveSuccess: "✅ இன்வாய்ஸ் சேமிக்கப்பட்டது!",
        noItemAlert: "⚠️ குறைந்தது ஒரு பொருளையாவது சேர்க்கவும்!",
        clearConfirm: "⚠️ எல்லா இன்வாய்ஸ்களையும் நீக்க வேண்டுமா?",
        themeChanged: "வண்ண தீம் மாற்றப்பட்டது",
        qrUploadSuccess: "QR பதிவேற்றப்பட்டது!",
        qrRemoved: "QR நீக்கப்பட்டது",
        newBillReady: "✅ புதிய பில்லுக்கு தயார்!",
        selectFolder: "சேமிப்பு கோப்புறையை தேர்ந்தெடுக்கவும்",
        folderSelected: "✅ கோப்புறை தேர்ந்தெடுக்கப்பட்டது",
        pdfSaved: "✅ PDF சேமிக்கப்பட்டது"
    },
    english: {
        appTitle: "🏪 Hosur Invoice Bill",
        subtitle: "Hosur Invoice Bill",
        createdBy: "by Shri Muhammed Zabiullah Khan",
        showQR: "Show QR",
        settings: "Settings",
        newBill: "New Bill",
        addItem: "Add Item",
        saveInvoice: "💾 Save Invoice & Print",
        updateInvoice: "🔄 Update Invoice & Print",
        uploadQR: "Upload QR",
        removeQR: "Remove QR",
        clearAllData: "Clear All My Data",
        businessTitle: "🏪 My Business Details",
        businessName: "Business Name",
        businessContact: "Contact & Address",
        invoicePrefix: "Invoice Number Pattern",
        nextInvoice: "Next Invoice Number",
        createInvoice: "➕ Create New Invoice",
        editInvoiceTitle: "✏️ Edit Invoice",
        customerName: "Customer Name",
        customerMobile: "Mobile Number",
        itemsLabel: "📦 Items",
        itemName: "Item Name",
        qty: "Qty",
        price: "Price (₹)",
        total: "Total (₹)",
        subtotal: "Subtotal",
        gst: "GST",
        grandTotal: "Total",
        notes: "Notes",
        historyTitle: "📄 My Invoices",
        noInvoices: "No invoices yet",
        view: "View",
        edit: "Edit",
        delete: "Delete",
        settingsTitle: "Settings",
        paymentQRTitle: "Your Payment QR",
        paymentQRDesc: "Upload GPay/PhonePe/Paytm QR",
        themeTitle: "🎨 Theme Color",
        gstTitle: "GST Settings",
        gstToggleLabel: "Enable GST",
        gstPercentLabel: "GST Percentage (%)",
        dataTitle: "🗑️ Data Management",
        aboutTitle: "ℹ️ About",
        aboutText: "Hosur Invoice Bill - Free invoice generator",
        scanToPay: "Scan to Pay",
        scanInstruction: "Scan with GPay, PhonePe, or Paytm",
        close: "Close",
        noQR: "No payment QR uploaded",
        businessNamePlaceholder: "Ex: Shri Muhammed Sons",
        businessContactPlaceholder: "Phone: 9876543210, Hosur Main Road",
        customerNamePlaceholder: "Ex: Rajesh Textiles",
        customerMobilePlaceholder: "Ex: 9876543210",
        itemNamePlaceholder: "Item name (Ex: Rice 5kg)",
        notesPlaceholder: "Thank you! Visit again",
        tipText: "💡 Tip: Start typing - auto suggestions appear! Configure GST in Settings",
        confirmDelete: "Are you sure you want to delete this invoice?",
        deleteSuccess: "✅ Invoice deleted!",
        updateSuccess: "✅ Invoice updated!",
        saveSuccess: "✅ Invoice saved!",
        noItemAlert: "⚠️ Please add at least one item!",
        clearConfirm: "⚠️ Delete all invoices?",
        themeChanged: "Theme changed",
        qrUploadSuccess: "QR uploaded!",
        qrRemoved: "QR removed",
        newBillReady: "✅ Ready for new bill!",
        selectFolder: "Select Save Folder",
        folderSelected: "✅ Folder selected",
        pdfSaved: "✅ PDF saved"
    }
};

function setText(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = text;
}

function applyTranslations() {
    const t = translations[currentLanguage];
    const elements = ['appTitle', 'subtitleText', 'createdByText', 'showQRBtn', 'settingsBtn', 'newBillBtn', 
        'addItemBtn', 'businessTitle', 'businessNameLabel', 'businessContactLabel', 'invoicePrefixLabel', 
        'nextInvoiceLabel', 'createInvoiceTitle', 'customerNameLabel', 'customerMobileLabel', 'itemsLabel',
        'itemNameHeader', 'qtyHeader', 'priceHeader', 'totalHeader', 'subtotalLabel', 'totalLabel', 
        'notesLabel', 'historyTitle', 'noInvoicesText', 'settingsTitle', 'qrUploadTitle', 'qrUploadDesc',
        'themeTitle', 'gstTitle', 'gstToggleLabel', 'gstPercentLabel', 'dataTitle', 'aboutTitle', 'aboutText',
        'paymentQRTitle', 'paymentQRInstruction', 'qrCloseBtn', 'noQRText', 'tipText', 'uploadQRBtn', 'removeQRBtn', 'clearDataBtn'];
    
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el && t[id]) el.textContent = t[id];
    });
    
    setText('saveBtnText', editingInvoiceId ? t.updateInvoice : t.saveInvoice);
    setText('gstLabel', gstEnabled ? `${t.gst} (${gstPercentage}%)` : t.gst);
    
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
    
    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.innerHTML = `<i class="fas fa-language"></i> ${currentLanguage === 'tamil' ? 'English' : 'தமிழ்'}`;
    
    document.querySelectorAll('.item-name').forEach(input => {
        input.placeholder = t.itemNamePlaceholder;
    });
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

function openSettings() {
    document.getElementById('settingsPanel').classList.add('open');
    document.getElementById('settingsOverlay').classList.add('active');
}

function closeSettings() {
    document.getElementById('settingsPanel').classList.remove('open');
    document.getElementById('settingsOverlay').classList.remove('active');
}

function changeTheme(theme) {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('app_theme', theme);
    showToast(translations[currentLanguage].themeChanged);
    closeSettings();
}

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

// ============ File System Access API Functions ============

// Request permission to save files
async function requestSaveDirectory() {
    try {
        // Check if File System Access API is supported
        if ('showDirectoryPicker' in window) {
            rootDirectoryHandle = await window.showDirectoryPicker();
            localStorage.setItem('saveDirectoryPermission', 'granted');
            showToast(translations[currentLanguage].folderSelected);
            return true;
        } else {
            // Fallback for browsers that don't support the API
            showToast('Your browser doesn\'t support file saving. Use Save as PDF from print dialog.');
            return false;
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error selecting directory:', error);
            showToast('Could not select directory. Using print fallback.');
        }
        return false;
    }
}

// Get today's folder (create if not exists)
async function getTodaysFolder() {
    if (!rootDirectoryHandle) return null;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const folderName = `${year}-${month}-${day}`;
    
    try {
        // Try to get existing folder
        let folderHandle = await rootDirectoryHandle.getDirectoryHandle(folderName, { create: false });
        return folderHandle;
    } catch (e) {
        // Folder doesn't exist, create it
        try {
            let folderHandle = await rootDirectoryHandle.getDirectoryHandle(folderName, { create: true });
            return folderHandle;
        } catch (err) {
            console.error('Error creating folder:', err);
            return null;
        }
    }
}

// Save PDF file to the selected directory
async function savePDFToDevice(pdfBlob, fileName) {
    if (!rootDirectoryHandle) {
        // Ask user to select folder first
        const t = translations[currentLanguage];
        const confirmed = confirm(`${t.selectFolder}?`);
        if (confirmed) {
            const success = await requestSaveDirectory();
            if (!success) return false;
        } else {
            return false;
        }
    }
    
    try {
        const todayFolder = await getTodaysFolder();
        if (!todayFolder) return false;
        
        // Create the file
        const fileHandle = await todayFolder.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(pdfBlob);
        await writable.close();
        
        showToast(`${translations[currentLanguage].pdfSaved}: ${fileName}`);
        return true;
    } catch (error) {
        console.error('Error saving PDF:', error);
        showToast('Could not save PDF. Using print fallback.');
        return false;
    }
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
    
    let gst = 0;
    let total = subtotal;
    
    if (gstEnabled && gstPercentage > 0) {
        gst = subtotal * (gstPercentage / 100);
        total = subtotal + gst;
    }
    
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('gstAmount').textContent = gst.toFixed(2);
    document.getElementById('grandTotal').textContent = total.toFixed(2);
    
    return { subtotal, gst, total };
}

function addRowEventListeners(row) {
    const qtyInput = row.querySelector('.item-qty');
    const priceInput = row.querySelector('.item-price');
    const nameInput = row.querySelector('.item-name');
    const t = translations[currentLanguage];
    
    const update = () => calculateAllTotals();
    if (qtyInput) qtyInput.addEventListener('input', update);
    if (priceInput) priceInput.addEventListener('input', update);
    
    if (nameInput) {
        nameInput.placeholder = t.itemNamePlaceholder;
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

// Generate HTML content for PDF
function generatePDFHtml(invoice) {
    const itemsHtml = invoice.items.map((item, index) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 8px; text-align: center; border: 1px solid #ddd;">${index + 1}</td>
            <td style="padding: 12px 8px; text-align: left; border: 1px solid #ddd;">${escapeHtml(item.name)}</td>
            <td style="padding: 12px 8px; text-align: center; border: 1px solid #ddd;">${item.qty}</td>
            <td style="padding: 12px 8px; text-align: right; border: 1px solid #ddd;">₹ ${item.price.toFixed(2)}</td>
            <td style="padding: 12px 8px; text-align: right; border: 1px solid #ddd;">₹ ${item.total.toFixed(2)}</td>
        </tr>
    `).join('');
    
    const gstText = gstEnabled ? `GST (${gstPercentage}%)` : 'GST';
    const gstAmount = gstEnabled ? parseFloat(invoice.gst).toFixed(2) : '0.00';
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Invoice ${invoice.invoiceNo}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Inter', 'Noto Sans Tamil', Arial, sans-serif;
                    background: #f0f2f5;
                    padding: 40px 20px;
                    display: flex;
                    justify-content: center;
                }
                .invoice-container {
                    max-width: 900px;
                    width: 100%;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 20px 35px -10px rgba(0,0,0,0.15);
                    overflow: hidden;
                }
                .invoice-header {
                    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                    color: white;
                    padding: 30px 35px;
                    text-align: center;
                }
                .invoice-header h1 { font-size: 28px; margin-bottom: 5px; }
                .invoice-header p { font-size: 14px; opacity: 0.9; }
                .invoice-title {
                    background: #f8fafc;
                    padding: 15px 35px;
                    border-bottom: 2px solid #e2e8f0;
                }
                .invoice-title h2 { color: #1e3a8a; font-size: 20px; }
                .customer-info {
                    padding: 20px 35px;
                    background: #f8fafc;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 20px;
                    border-bottom: 1px solid #e2e8f0;
                }
                .customer-info div { flex: 1; }
                .customer-info strong { color: #1f2937; font-size: 14px; display: block; margin-bottom: 5px; }
                .customer-info p { color: #4b5563; font-size: 14px; }
                .items-table { padding: 20px 35px; }
                .items-table table { width: 100%; border-collapse: collapse; }
                .items-table th {
                    background: #f1f5f9;
                    padding: 12px 8px;
                    text-align: left;
                    font-size: 13px;
                    font-weight: 600;
                    color: #1e293b;
                    border: 1px solid #cbd5e1;
                }
                .items-table td { font-size: 13px; color: #334155; }
                .items-table th:first-child, .items-table td:first-child { text-align: center; width: 50px; }
                .items-table th:nth-child(3), .items-table td:nth-child(3) { text-align: center; width: 80px; }
                .items-table th:nth-child(4), .items-table td:nth-child(4) { text-align: right; width: 100px; }
                .items-table th:nth-child(5), .items-table td:nth-child(5) { text-align: right; width: 100px; }
                .totals {
                    padding: 20px 35px;
                    background: #f8fafc;
                    text-align: right;
                    border-top: 2px solid #e2e8f0;
                }
                .totals table { width: 300px; margin-left: auto; border-collapse: collapse; }
                .totals td { padding: 8px 12px; font-size: 14px; }
                .totals td:first-child { text-align: left; font-weight: 500; }
                .totals td:last-child { text-align: right; font-weight: 600; }
                .totals .grand-total td { font-size: 18px; font-weight: 800; color: #1e3a8a; border-top: 2px solid #cbd5e1; }
                .notes { padding: 20px 35px; background: white; border-top: 1px solid #e2e8f0; font-style: italic; color: #6b7280; font-size: 13px; }
                .footer { padding: 20px 35px; background: #f1f5f9; text-align: center; font-size: 11px; color: #64748b; }
                @media print {
                    body { background: white; padding: 0; margin: 0; }
                    .invoice-container { box-shadow: none; border-radius: 0; }
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="invoice-header">
                    <h1>${escapeHtml(invoice.businessName)}</h1>
                    <p>${escapeHtml(invoice.businessContact)}</p>
                </div>
                <div class="invoice-title"><h2>TAX INVOICE</h2></div>
                <div class="customer-info">
                    <div><strong>BILL TO:</strong><p>${escapeHtml(invoice.customerName)}</p>${invoice.customerMobile ? `<p>Mobile: ${escapeHtml(invoice.customerMobile)}</p>` : ''}</div>
                    <div><strong>INVOICE DETAILS:</strong><p>Invoice No: ${invoice.invoiceNo}</p><p>Date: ${invoice.date}</p></div>
                </div>
                <div class="items-table">
                    <table>
                        <thead><tr><th>#</th><th>ITEM DESCRIPTION</th><th>QTY</th><th>PRICE</th><th>TOTAL</th></tr></thead>
                        <tbody>${itemsHtml}</tbody>
                    </table>
                </div>
                <div class="totals">
                    <table>
                        <tr><td>Subtotal</td><td>₹ ${invoice.subtotal}</td></tr>
                        <tr><td>${gstText}</td><td>₹ ${gstAmount}</td></tr>
                        <tr class="grand-total"><td>TOTAL</td><td>₹ ${invoice.total}</td></tr>
                    </table>
                </div>
                <div class="notes"><p>📝 ${escapeHtml(invoice.tamilNotes)}</p></div>
                <div class="footer"><p>Thank you for your business! | Powered by Hosur Invoice Bill</p></div>
            </div>
            <script>window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 1000); };<\/script>
        </body>
        </html>
    `;
}

// Professional Print Function with File Saving
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
    const timestamp = new Date().toISOString();
    
    let invoice;
    
    if (editingInvoiceId) {
        const existing = await getInvoiceById(editingInvoiceId);
        invoice = { ...existing, businessName, businessContact, customerName, customerMobile, items, 
            subtotal: subtotal.toFixed(2), gst: gst.toFixed(2), total: total.toFixed(2), tamilNotes, updatedAt: timestamp };
        await saveInvoiceToDB(invoice);
        showToast(t.updateSuccess);
        editingInvoiceId = null;
        document.getElementById('createInvoiceTitle').innerHTML = t.createInvoice;
        const saveBtn = document.getElementById('saveInvoiceBtn');
        if (saveBtn) saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t.saveInvoice}`;
    } else {
        const invoiceNo = await getNextInvoiceNumber();
        invoice = { id: Date.now(), invoiceNo, date, businessName, businessContact, customerName, customerMobile, 
            items, subtotal: subtotal.toFixed(2), gst: gst.toFixed(2), total: total.toFixed(2), tamilNotes, 
            footprint: getDigitalFootprint(), timestamp };
        await saveInvoiceToDB(invoice);
        document.getElementById('customerName').value = '';
        document.getElementById('customerMobile').value = '';
        showToast(t.saveSuccess);
    }
    
    await saveBusinessInfo({ businessName, businessContact });
    await loadInvoices();
    const nextNum = await getNextInvoiceNumber();
    document.getElementById('nextInvoiceNumber').textContent = nextNum;
    
    // Generate and save/print the invoice
    await generateAndSaveInvoice(invoice);
}

async function generateAndSaveInvoice(invoice) {
    const htmlContent = generatePDFHtml(invoice);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create a safe filename
    const customerName = invoice.customerName.replace(/[^a-zA-Z0-9]/g, '_');
    const mobile = invoice.customerMobile || 'no_mobile';
    const fileName = `${customerName}_${mobile}.html`;
    
    // Try to save to device using File System Access API
    const saved = await savePDFToDevice(blob, fileName);
    
    if (!saved) {
        // Fallback: Open print dialog (user can Save as PDF)
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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
            <div class="text-xs text-gray-400 mt-1">${inv.items.length} item(s)</div>
            <div class="flex gap-2 mt-2 pt-2 border-t">
                <button onclick="viewAndPrintInvoice(${inv.id})" class="flex-1 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs"><i class="fas fa-print"></i> ${t.view}</button>
                <button onclick="editInvoice(${inv.id})" class="flex-1 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs"><i class="fas fa-edit"></i> ${t.edit}</button>
                <button onclick="deleteInvoice(${inv.id})" class="flex-1 bg-red-500 text-white px-2 py-1 rounded-lg text-xs"><i class="fas fa-trash"></i> ${t.delete}</button>
            </div>
        </div>
    `).join('');
}

async function viewAndPrintInvoice(invoiceId) {
    const invoice = await getInvoiceById(invoiceId);
    if (invoice) {
        const htmlContent = generatePDFHtml(invoice);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    }
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

// Event Listeners
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

// Add Select Folder button to settings
function addFolderSelectorToSettings() {
    const settingsPanel = document.getElementById('settingsPanel');
    const themeDiv = document.getElementById('themeTitle')?.parentElement;
    if (themeDiv && !document.getElementById('folderSelectorBtn')) {
        const folderDiv = document.createElement('div');
        folderDiv.className = 'mb-6 border-b pb-4';
        folderDiv.innerHTML = `
            <h3 class="font-semibold mb-2"><i class="fas fa-folder text-yellow-600"></i> <span id="folderTitle">Save Location</span></h3>
            <button id="folderSelectorBtn" onclick="requestSaveDirectory()" class="w-full bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-600 transition">
                <i class="fas fa-folder-open"></i> <span id="selectFolderBtnText">Select Save Folder</span>
            </button>
            <p class="text-xs text-gray-500 mt-1" id="folderInfo">Choose where to save invoice files</p>
        `;
        themeDiv.parentElement.insertBefore(folderDiv, themeDiv);
        
        // Update translations for folder selector
        const t = translations[currentLanguage];
        document.getElementById('folderTitle').textContent = t.selectFolder || 'Save Location';
        const selectBtn = document.getElementById('selectFolderBtnText');
        if (selectBtn) selectBtn.textContent = t.selectFolder || 'Select Save Folder';
    }
}

// Initialize
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
        
        loadGSTSettings();
        applyTranslations();
        addFolderSelectorToSettings();
        
        console.log('✅ Hosur Invoice Bill Ready! Frontend File Management Active');
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
window.viewAndPrintInvoice = viewAndPrintInvoice;
window.clearAllData = clearAllData;
window.toggleGST = toggleGST;
window.saveGSTSettings = saveGSTSettings;
window.requestSaveDirectory = requestSaveDirectory;

init();
