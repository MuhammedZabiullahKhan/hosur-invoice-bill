// Hosur Invoice Bill - Main Application
// Created by Shri Muhammed Zabiullah Khan
// Full Tamil & English Support

let db;
let currentLanguage = 'tamil'; // 'tamil' or 'english'
let itemCounter = 0;

// Tamil & English Translations
const translations = {
    tamil: {
        // Business section
        businessTitle: "🏪 என் கடை விவரங்கள்",
        businessNameLabel: "கடை பெயர்",
        businessContactLabel: "தொடர்பு & முகவரி",
        invoicePrefixLabel: "இன்வாய்ஸ் எண் முறை",
        nextInvoiceLabel: "அடுத்த இன்வாய்ஸ் எண்",
        
        // Create invoice
        createInvoiceTitle: "➕ புதிய இன்வாய்ஸ்",
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
        saveBtnText: "💾 இன்வாய்ஸ் சேமி & அச்சிடு",
        
        // History
        historyTitle: "📄 என் இன்வாய்ஸ்கள்",
        noInvoicesText: "இன்னும் இன்வாய்ஸ் இல்லை. மேலே உங்கள் முதல் இன்வாய்ஸ் உருவாக்கவும்!",
        
        // Buttons
        clearBtnText: "அழிக்க",
        refreshBtnText: "புதுப்பி",
        
        // Placeholders
        businessNamePlaceholder: "உதா: ஷ்ரீ முஹம்மது சன்ஸ்",
        businessContactPlaceholder: "தொலை: 9876543210, ஹொசூர் மெயின் ரோடு",
        customerNamePlaceholder: "உதா: ராஜேஷ் டெக்ஸ்டைல்ஸ்",
        customerMobilePlaceholder: "உதா: 9876543210",
        itemNamePlaceholder: "பொருள் பெயர்",
        notesPlaceholder: "நன்றி! மீண்டும் வருக",
        
        // Messages
        tipText: "💡 குறிப்பு: தட்டச்சு செய்ய ஆரம்பித்தால் பரிந்துரைகள் வரும்!",
        syncText: "சின்க் செய்கிறது...",
        syncSuccess: "✅ இன்வாய்ஸ் வெற்றிகரமாக சேமிக்கப்பட்டது!",
        noItemAlert: "⚠️ தயவுசெய்து குறைந்தது ஒரு பொருளையாவது சேர்க்கவும்!",
        clearConfirm: "⚠️ எச்சரிக்கை: இது உங்கள் உலாவியில் உள்ள அனைத்து இன்வாய்ஸ்களையும் நீக்கும்!\n\nசேவையக காப்பு இருக்கும்.\n\nதொடரவா?"
    },
    english: {
        businessTitle: "🏪 My Business Details",
        businessNameLabel: "Business Name",
        businessContactLabel: "Contact & Address",
        invoicePrefixLabel: "Invoice Number Pattern",
        nextInvoiceLabel: "Next Invoice Number",
        
        createInvoiceTitle: "➕ Create New Invoice",
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
        saveBtnText: "💾 Save Invoice & Print",
        
        historyTitle: "📄 My Invoices",
        noInvoicesText: "No invoices yet. Create your first invoice above!",
        
        clearBtnText: "Clear",
        refreshBtnText: "Refresh",
        
        businessNamePlaceholder: "Ex: Shri Muhammed Sons",
        businessContactPlaceholder: "Phone: 9876543210, Hosur Main Road",
        customerNamePlaceholder: "Ex: Rajesh Textiles",
        customerMobilePlaceholder: "Ex: 9876543210",
        itemNamePlaceholder: "Item name",
        notesPlaceholder: "Thank you! Visit again",
        
        tipText: "💡 Tip: Start typing - auto suggestions appear!",
        syncText: "Syncing...",
        syncSuccess: "✅ Invoice saved successfully!",
        noItemAlert: "⚠️ Please add at least one item!",
        clearConfirm: "⚠️ WARNING: This will delete ALL your invoices from this browser!\n\nServer backup will remain.\n\nContinue?"
    }
};

// Apply Tamil/English translations
function applyTranslations() {
    const t = translations[currentLanguage];
    
    // Business section
    setText('businessTitle', t.businessTitle);
    setText('businessNameLabel', t.businessNameLabel);
    setText('businessContactLabel', t.businessContactLabel);
    setText('invoicePrefixLabel', t.invoicePrefixLabel);
    setText('nextInvoiceLabel', t.nextInvoiceLabel);
    
    // Create invoice
    setText('createInvoiceTitle', t.createInvoiceTitle);
    setText('customerNameLabel', t.customerNameLabel);
    setText('customerMobileLabel', t.customerMobileLabel);
    setText('itemsLabel', t.itemsLabel);
    setText('itemNameHeader', t.itemNameHeader);
    setText('qtyHeader', t.qtyHeader);
    setText('priceHeader', t.priceHeader);
    setText('totalHeader', t.totalHeader);
    setText('addItemBtnText', t.addItemBtnText);
    setText('subtotalLabel', t.subtotalLabel);
    setText('gstLabel', t.gstLabel);
    setText('totalLabel', t.totalLabel);
    setText('notesLabel', t.notesLabel);
    setText('saveBtnText', t.saveBtnText);
    
    // History
    setText('historyTitle', t.historyTitle);
    setText('noInvoicesText', t.noInvoicesText);
    
    // Buttons
    setText('clearBtnText', t.clearBtnText);
    setText('refreshBtnText', t.refreshBtnText);
    setText('langBtnText', currentLanguage === 'tamil' ? 'English' : 'தமிழ்');
    
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
    
    // Tips
    setText('tipText', t.tipText);
    
    // Update all item row placeholders
    document.querySelectorAll('.item-name').forEach(input => {
        input.placeholder = t.itemNamePlaceholder;
    });
}

function setText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = text;
}

// Toggle language
function toggleLanguage() {
    currentLanguage = currentLanguage === 'tamil' ? 'english' : 'tamil';
    applyTranslations();
    
    // Show feedback
    const msg = currentLanguage === 'tamil' ? '✅ தமிழுக்கு மாற்றப்பட்டது' : '✅ Switched to English';
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Initialize IndexedDB
async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('HosurInvoiceDB', 2);
        
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
                const businessStore = db.createObjectStore('businessNames', { keyPath: 'name' });
                businessStore.createIndex('count', 'count', { unique: false });
                businessStore.createIndex('lastUsed', 'lastUsed', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('itemNames')) {
                const itemStore = db.createObjectStore('itemNames', { keyPath: 'name' });
                itemStore.createIndex('count', 'count', { unique: false });
                itemStore.createIndex('lastUsed', 'lastUsed', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('customerNames')) {
                const customerStore = db.createObjectStore('customerNames', { keyPath: 'name' });
                customerStore.createIndex('count', 'count', { unique: false });
                customerStore.createIndex('lastUsed', 'lastUsed', { unique: false });
            }
        };
    });
}

// Load auto-complete data
async function loadAutoCompleteData() {
    try {
        const businessNames = await getAllFromStore('businessNames');
        const itemNames = await getAllFromStore('itemNames');
        console.log(`📝 Loaded ${businessNames.length} business names, ${itemNames.length} item names`);
    } catch (error) {
        console.error('Error loading auto-complete data:', error);
    }
}

// Get all records from a store
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

// Save to auto-complete
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
                store.put({
                    name: cleanName,
                    count: 1,
                    firstUsed: Date.now(),
                    lastUsed: Date.now()
                });
            }
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        };
        getRequest.onerror = () => reject(getRequest.error);
    });
}

// Get suggestions
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

// Create auto-complete dropdown
function createAutoComplete(inputElement, suggestions, onSelect) {
    const existingDropdown = document.getElementById(`dropdown_${inputElement.id}`);
    if (existingDropdown) existingDropdown.remove();
    
    if (!suggestions || suggestions.length === 0) return;
    
    const dropdown = document.createElement('div');
    dropdown.id = `dropdown_${inputElement.id}`;
    dropdown.className = 'absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto';
    
    const rect = inputElement.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.left = `${rect.left + window.scrollX}px`;
    dropdown.style.minWidth = `${rect.width}px`;
    
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

async function saveInvoiceToDB(invoice) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['invoices'], 'readwrite');
        const store = tx.objectStore('invoices');
        const request = store.add(invoice);
        request.onsuccess = () => resolve();
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
    const nextNum = maxNum + 1;
    return prefix + String(nextNum).padStart(3, '0');
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
            
            if (totalSpan) {
                totalSpan.innerText = total.toFixed(2);
            }
            subtotal += total;
        }
    });
    
    const gst = subtotal * 0.05;
    const total = subtotal + gst;
    
    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('gstAmount').innerText = gst.toFixed(2);
    document.getElementById('grandTotal').innerText = total.toFixed(2);
    
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
            if (nameInput.value.trim()) {
                await saveToAutoComplete('itemNames', nameInput.value.trim());
            }
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
            <input type="text" class="item-name w-full p-2 border rounded-lg text-base" placeholder="${t.itemNamePlaceholder}" autocomplete="off">
        </td>
        <td class="border p-1 md:p-2">
            <input type="number" class="item-qty w-full p-2 border rounded-lg text-base" value="1" step="0.5" min="0">
        </td>
        <td class="border p-1 md:p-2">
            <input type="number" class="item-price w-full p-2 border rounded-lg text-base" value="0" step="1" min="0">
        </td>
        <td class="border p-1 md:p-2 text-center">
            <span class="item-total font-mono font-bold">0</span>
        </td>
        <td class="border p-1 md:p-2 text-center">
            <button type="button" onclick="removeItemRow(${rowId})" class="text-red-600 hover:text-red-800 text-2xl font-bold">&times;</button>
        </td>
    `;
    
    tbody.appendChild(newRow);
    addRowEventListeners(newRow, rowId);
}

function removeItemRow(rowId) {
    const row = document.getElementById(`itemRow_${rowId}`);
    if (row) {
        row.remove();
        calculateAllTotals();
        
        const remainingRows = document.querySelectorAll('#itemsTable tr').length;
        if (remainingRows === 0) {
            addItemRow();
        }
    }
}

function initializeFirstRow() {
    const tbody = document.getElementById('itemsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    itemCounter = 0;
    addItemRow();
}

async function saveInvoice() {
    const businessName = document.getElementById('businessName').value || 'My Business';
    const businessContact = document.getElementById('businessContact').value || 'Contact Info';
    const customerName = document.getElementById('customerName').value || 'Guest';
    const customerMobile = document.getElementById('customerMobile').value || '';
    const tamilNotes = document.getElementById('tamilNotes').value;
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
    const invoiceNo = await getNextInvoiceNumber();
    const date = new Date().toLocaleDateString('en-IN');
    
    const invoice = {
        id: Date.now(),
        invoiceNo, date, businessName, businessContact,
        customerName, customerMobile, items,
        subtotal: subtotal.toFixed(2), gst: gst.toFixed(2), total: total.toFixed(2),
        tamilNotes, footprint: getDigitalFootprint(),
        timestamp: new Date().toISOString()
    };
    
    await saveInvoiceToDB(invoice);
    await saveBusinessInfo({ businessName, businessContact });
    await loadInvoices();
    generatePrintPDF(invoice);
    
    document.getElementById('customerName').value = '';
    document.getElementById('customerMobile').value = '';
    
    const nextNum = await getNextInvoiceNumber();
    document.getElementById('nextInvoiceNumber').innerText = nextNum;
    
    if (typeof syncToServer === 'function') syncToServer();
    
    const statusDiv = document.getElementById('syncStatus');
    if (statusDiv) {
        statusDiv.innerHTML = `<i class="fas fa-check-circle text-green-600"></i> <span>${t.syncSuccess}</span>`;
        setTimeout(() => {
            statusDiv.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> <span>${t.syncText}</span>`;
        }, 3000);
    }
}

function generatePrintPDF(invoice) {
    const printWindow = window.open('', '_blank');
    
    const itemsHtml = invoice.items.map(item => `
        <tr>
            <td style="border:1px solid #000;padding:8px;">${escapeHtml(item.name)}</td>
            <td style="border:1px solid #000;padding:8px;text-align:center;">${item.qty}</td>
            <td style="border:1px solid #000;padding:8px;text-align:right;">₹${item.price.toFixed(2)}</td>
            <td style="border:1px solid #000;padding:8px;text-align:right;">₹${item.total.toFixed(2)}</td>
        </tr>
    `).join('');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head><title>Invoice ${invoice.invoiceNo}</title>
        <meta charset="UTF-8">
        <style>
            * { font-family: 'Noto Sans Tamil', Arial, sans-serif; }
            body { padding: 20px; margin: 0; }
            .invoice-box { max-width: 800px; margin: auto; border: 2px solid #000; padding: 20px; background: white; }
            .header { text-align: center; border-bottom: 2px solid #000; margin-bottom: 20px; }
            .customer-details { margin-bottom: 20px; background: #f5f5f5; padding: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #000; padding: 8px; }
            th { background: #f0f0f0; }
            .footer { margin-top: 20px; text-align: center; font-style: italic; }
            @media print { body { padding: 0; } }
        </style>
        </head>
        <body>
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
            <p>Powered by Hosur Invoice Bill | shri-muhammed-zabiullah-khan</p></div>
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
        <div class="border rounded-xl p-3 hover:shadow-md transition cursor-pointer bg-white" onclick="viewInvoiceDetails(${inv.id})">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="font-bold text-blue-700">${inv.invoiceNo}</span>
                    <span class="text-gray-600">${escapeHtml(inv.customerName)}</span>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                    <span class="font-bold text-green-700">₹${inv.total}</span>
                    <span class="text-xs text-gray-500">${inv.date}</span>
                </div>
            </div>
            <div class="text-xs text-gray-400 mt-1">${inv.items.length} item(s) | ${escapeHtml(inv.items[0]?.name || '')}${inv.items.length > 1 ? ` +${inv.items.length - 1} more` : ''}</div>
        </div>
    `).join('');
    
    const nextNum = await getNextInvoiceNumber();
    const nextNumSpan = document.getElementById('nextInvoiceNumber');
    if (nextNumSpan) nextNumSpan.innerText = nextNum;
}

async function viewInvoiceDetails(invoiceId) {
    const invoices = await getAllInvoices();
    const invoice = invoices.find(inv => inv.id === invoiceId);
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
        
        document.getElementById('customerName').value = '';
        document.getElementById('customerMobile').value = '';
        document.getElementById('businessName').value = '';
        document.getElementById('businessContact').value = '';
        
        initializeFirstRow();
        await loadInvoices();
        calculateAllTotals();
        await loadAutoCompleteData();
        alert('✅ All data cleared!');
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

// Auto-save business info
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

// Initialize
(async function init() {
    try {
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
        
        console.log('✅ Hosur Invoice Bill Ready | Language:', currentLanguage);
    } catch (error) {
        console.error('Init error:', error);
        alert('Error loading app. Please refresh.');
    }
})();