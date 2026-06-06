// Hosur Invoice Bill - Complete Application
// Created by Shri Muhammed Zabiullah Khan

let db;
let currentLanguage = 'tamil';
let itemCounter = 0;
let editingInvoiceId = null;

// ============ UI Functions ============

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'tamil' ? 'english' : 'tamil';
    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.textContent = currentLanguage === 'tamil' ? 'English' : 'தமிழ்';
    
    // Update placeholders
    const placeholders = {
        businessName: currentLanguage === 'tamil' ? 'உதா: ஷ்ரீ முஹம்மது சன்ஸ்' : 'Ex: Shri Muhammed Sons',
        businessContact: currentLanguage === 'tamil' ? 'தொலை: 9876543210, ஹொசூர் மெயின் ரோடு' : 'Phone: 9876543210, Hosur Main Road',
        customerName: currentLanguage === 'tamil' ? 'உதா: ராஜேஷ் டெக்ஸ்டைல்ஸ்' : 'Ex: Rajesh Textiles',
        customerMobile: currentLanguage === 'tamil' ? 'உதா: 9876543210' : 'Ex: 9876543210',
        tamilNotes: currentLanguage === 'tamil' ? 'நன்றி! மீண்டும் வருக' : 'Thank you! Visit again'
    };
    
    document.getElementById('businessName').placeholder = placeholders.businessName;
    document.getElementById('businessContact').placeholder = placeholders.businessContact;
    document.getElementById('customerName').placeholder = placeholders.customerName;
    document.getElementById('customerMobile').placeholder = placeholders.customerMobile;
    document.getElementById('tamilNotes').value = placeholders.tamilNotes;
    
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
    showToast(`Theme changed to ${theme}`);
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
            showToast('QR code uploaded successfully!');
        };
        reader.readAsDataURL(file);
    }
}

function removeQRCode() {
    localStorage.removeItem('payment_qr');
    document.getElementById('qrPreview').style.display = 'none';
    document.getElementById('qrPlaceholder').style.display = 'flex';
    showToast('QR code removed');
}

// New Bill - Clear form for next customer
function resetForNewBill() {
    document.getElementById('customerName').value = '';
    document.getElementById('customerMobile').value = '';
    document.getElementById('tamilNotes').value = currentLanguage === 'tamil' ? 'நன்றி! மீண்டும் வருக' : 'Thank you! Visit again';
    
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
        if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Invoice & Print';
        document.getElementById('createInvoiceTitle').innerHTML = '➕ Create New Invoice';
    }
    
    showToast('Ready for new bill! Enter customer details.');
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
        nameInput.placeholder = currentLanguage === 'tamil' ? 'பொருள் பெயர்' : 'Item name';
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
    const newRow = document.createElement('tr');
    newRow.id = `itemRow_${rowId}`;
    newRow.innerHTML = `
        <td class="border p-1"><input type="text" class="item-name w-full p-2 border rounded-lg" style="font-size:16px"></td>
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
    document.getElementById('createInvoiceTitle').innerHTML = '✏️ Edit Invoice';
    const saveBtn = document.getElementById('saveInvoiceBtn');
    if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-edit"></i> Update Invoice';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Editing invoice ${invoice.invoiceNo}`);
}

async function deleteInvoice(invoiceId) {
    if (confirm('Are you sure you want to delete this invoice?')) {
        await deleteInvoiceFromDB(invoiceId);
        await loadInvoices();
        showToast('✅ Invoice deleted!');
        if (editingInvoiceId === invoiceId) {
            editingInvoiceId = null;
            document.getElementById('createInvoiceTitle').innerHTML = '➕ Create New Invoice';
            const saveBtn = document.getElementById('saveInvoiceBtn');
            if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Invoice & Print';
        }
    }
}

async function saveInvoice() {
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
        alert('Please add at least one item!');
        return;
    }
    
    const { subtotal, gst, total } = calculateAllTotals();
    const date = new Date().toLocaleDateString('en-IN');
    
    if (editingInvoiceId) {
        const existing = await getInvoiceById(editingInvoiceId);
        const invoice = { ...existing, businessName, businessContact, customerName, customerMobile, items, subtotal: subtotal.toFixed(2), gst: gst.toFixed(2), total: total.toFixed(2), tamilNotes, updatedAt: new Date().toISOString() };
        await saveInvoiceToDB(invoice);
        showToast('✅ Invoice updated!');
        editingInvoiceId = null;
        document.getElementById('createInvoiceTitle').innerHTML = '➕ Create New Invoice';
        const saveBtn = document.getElementById('saveInvoiceBtn');
        if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Invoice & Print';
    } else {
        const invoiceNo = await getNextInvoiceNumber();
        const invoice = { id: Date.now(), invoiceNo, date, businessName, businessContact, customerName, customerMobile, items, subtotal: subtotal.toFixed(2), gst: gst.toFixed(2), total: total.toFixed(2), tamilNotes, footprint: getDigitalFootprint(), timestamp: new Date().toISOString() };
        await saveInvoiceToDB(invoice);
        document.getElementById('customerName').value = '';
        document.getElementById('customerMobile').value = '';
        showToast('✅ Invoice saved!');
    }
    
    await saveBusinessInfo({ businessName, businessContact });
    await loadInvoices();
    const nextNum = await getNextInvoiceNumber();
    document.getElementById('nextInvoiceNumber').textContent = nextNum;
}

function generatePrintPDF(invoice) {
    const win = window.open('', '_blank');
    const itemsHtml = invoice.items.map(item => `
        <tr><td style="border:1px solid #000;padding:8px;">${escapeHtml(item.name)}</td>
        <td style="border:1px solid #000;padding:8px;text-align:center;">${item.qty}</td>
        <td style="border:1px solid #000;padding:8px;text-align:right;">₹${item.price.toFixed(2)}</td>
        <td style="border:1px solid #000;padding:8px;text-align:right;">₹${item.total.toFixed(2)}</td></tr>
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

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function loadInvoices() {
    const invoices = await getAllInvoices();
    const container = document.getElementById('invoicesList');
    const countSpan = document.getElementById('invoiceCount');
    
    countSpan.textContent = `(${invoices.length})`;
    
    if (invoices.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-500 py-8"><i class="fas fa-file-invoice text-4xl mb-2 opacity-50"></i><p>No invoices yet. Create your first invoice above!</p></div>';
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
                <button onclick="viewInvoiceDetails(${inv.id})" class="flex-1 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs"><i class="fas fa-eye"></i> View</button>
                <button onclick="editInvoice(${inv.id})" class="flex-1 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteInvoice(${inv.id})" class="flex-1 bg-red-500 text-white px-2 py-1 rounded-lg text-xs"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join('');
}

async function viewInvoiceDetails(invoiceId) {
    const invoice = await getInvoiceById(invoiceId);
    if (invoice) generatePrintPDF(invoice);
}

async function clearAllData() {
    if (confirm('⚠️ WARNING: This will delete ALL your invoices from this browser! Continue?')) {
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
        
        console.log('✅ App Ready!');
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

init();
