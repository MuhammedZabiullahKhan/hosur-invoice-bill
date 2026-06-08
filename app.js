// ============================================ //
// HOSUR INVOICE BILL - COMPLETE APPLICATION    //
// Created by: Shri Muhammed Zabiullah Khan    //
// PrimeSys Solutions | Hosur, Tamil Nadu      //
// ============================================ //

// ============================================ //
// GLOBAL VARIABLES                             //
// ============================================ //
let db = null;
let currentLanguage = 'tamil';
let itemCounter = 0;
let editingInvoiceId = null;
let previewWindow = null;
let currentFilterDate = null;

// GST Settings
let gstEnabled = false;
let gstPercentage = 0;

// Sound settings
let soundEnabled = true;

// ============================================ //
// SOUND FUNCTIONS                              //
// ============================================ //
function playSound(type) {
    if (!soundEnabled) return;
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'save') {
            oscillator.frequency.value = 523.25;
            gainNode.gain.value = 0.3;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
            oscillator.stop(audioContext.currentTime + 0.5);
        } else if (type === 'new') {
            oscillator.frequency.value = 440;
            gainNode.gain.value = 0.3;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
            oscillator.stop(audioContext.currentTime + 0.3);
        } else if (type === 'delete') {
            oscillator.frequency.value = 330;
            gainNode.gain.value = 0.3;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.4);
            oscillator.stop(audioContext.currentTime + 0.4);
        } else if (type === 'error') {
            oscillator.frequency.value = 220;
            gainNode.gain.value = 0.3;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
        setTimeout(() => audioContext.close(), 600);
    } catch(e) { console.log('Audio not supported'); }
}

// ============================================ //
// DATE FORMAT CONVERSION FUNCTIONS             //
// ============================================ //

// Convert any date format to standard DD/MM/YYYY with leading zeros
function normalizeDate(dateStr) {
    if (!dateStr) return '';
    
    // If already in DD/MM/YYYY format
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const day = parts[0].toString().padStart(2, '0');
            const month = parts[1].toString().padStart(2, '0');
            const year = parts[2];
            return `${day}/${month}/${year}`;
        }
    }
    
    // If in YYYY-MM-DD format
    if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const day = parts[2].toString().padStart(2, '0');
            const month = parts[1].toString().padStart(2, '0');
            const year = parts[0];
            return `${day}/${month}/${year}`;
        }
    }
    
    return dateStr;
}

// Convert YYYY-MM-DD to DD/MM/YYYY for filter
function convertFilterDateToDMY(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        const day = parseInt(parts[2]).toString();
        const month = parseInt(parts[1]).toString();
        const year = parts[0];
        // Return both normalized and raw formats for comparison
        return {
            normalized: `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`,
            raw: `${day}/${month}/${year}`
        };
    }
    return { normalized: dateStr, raw: dateStr };
}

// Check if two dates match (handles single/double digit differences)
function datesMatch(invoiceDate, filterDate) {
    if (!invoiceDate || !filterDate) return false;
    
    // Normalize both dates
    const normalizedInvoice = normalizeDate(invoiceDate);
    const normalizedFilter = normalizeDate(filterDate);
    
    // Also try raw comparison without leading zeros
    const invoiceRaw = invoiceDate.replace(/\b0/g, ''); // Remove leading zeros
    const filterRaw = filterDate.replace(/\b0/g, '');
    
    return normalizedInvoice === normalizedFilter || invoiceRaw === filterRaw;
}

// ============================================ //
// GST SETTINGS FUNCTIONS                       //
// ============================================ //
function loadGSTSettings() {
    const savedGSTEnabled = localStorage.getItem('gstEnabled');
    const savedGSTPercentage = localStorage.getItem('gstPercentage');
    gstEnabled = savedGSTEnabled === 'true';
    gstPercentage = savedGSTPercentage ? parseFloat(savedGSTPercentage) : 0;
    
    const gstToggle = document.getElementById('gstToggle');
    const gstPercentageDiv = document.getElementById('gstPercentageDiv');
    const gstPercentageInput = document.getElementById('gstPercentage');
    const gstInfoText = document.getElementById('gstInfoText');
    
    if (gstToggle) gstToggle.checked = gstEnabled;
    if (gstPercentageDiv) gstPercentageDiv.style.display = gstEnabled ? 'block' : 'none';
    if (gstPercentageInput) gstPercentageInput.value = gstPercentage;
    if (gstInfoText) {
        gstInfoText.textContent = currentLanguage === 'tamil' 
            ? `தற்போதைய ஜிஎஸ்டி: ${gstPercentage}% (${gstEnabled ? 'இயக்கத்தில்' : 'முடக்கப்பட்டது'})`
            : `Current GST: ${gstPercentage}% (${gstEnabled ? 'Enabled' : 'Disabled'})`;
    }
    updateGSTLabel();
}

function updateGSTLabel() {
    const gstLabel = document.getElementById('gstLabel');
    if (gstLabel) {
        if (gstEnabled && gstPercentage > 0) {
            gstLabel.textContent = currentLanguage === 'tamil' ? `ஜிஎஸ்டி (${gstPercentage}%)` : `GST (${gstPercentage}%)`;
        } else {
            gstLabel.textContent = currentLanguage === 'tamil' ? `ஜிஎஸ்டி` : `GST`;
        }
    }
}

function toggleGST() {
    const gstToggle = document.getElementById('gstToggle');
    const gstPercentageDiv = document.getElementById('gstPercentageDiv');
    gstEnabled = gstToggle.checked;
    if (gstPercentageDiv) gstPercentageDiv.style.display = gstEnabled ? 'block' : 'none';
    saveGSTSettings();
}

function saveGSTSettings() {
    const gstPercentageInput = document.getElementById('gstPercentage');
    gstPercentage = parseFloat(gstPercentageInput.value) || 0;
    
    localStorage.setItem('gstEnabled', gstEnabled);
    localStorage.setItem('gstPercentage', gstPercentage);
    
    const gstInfoText = document.getElementById('gstInfoText');
    if (gstInfoText) {
        gstInfoText.textContent = currentLanguage === 'tamil'
            ? `தற்போதைய ஜிஎஸ்டி: ${gstPercentage}% (${gstEnabled ? 'இயக்கத்தில்' : 'முடக்கப்பட்டது'})`
            : `Current GST: ${gstPercentage}% (${gstEnabled ? 'Enabled' : 'Disabled'})`;
    }
    updateGSTLabel();
    calculateAllTotals();
    showToast(currentLanguage === 'tamil'
        ? `ஜிஎஸ்டி அமைப்புகள் சேமிக்கப்பட்டன: ${gstEnabled ? gstPercentage + '%' : 'முடக்கப்பட்டது'}`
        : `GST settings saved: ${gstEnabled ? gstPercentage + '%' : 'Disabled'}`);
    playSound('save');
}

// ============================================ //
// COMPLETE TRANSLATIONS (100% Tamil & English) //
// ============================================ //
const translations = {
    tamil: {
        appTitle: "🏪 ஹொசூர் இன்வாய்ஸ் பில்",
        subtitleText: "ஹொசூர் இன்வாய்ஸ் பில்",
        createdByText: "ஷ்ரீ முஹம்மது ஜபியுல்லா கான் | பிரைம் சிஸ் சொல்யூஷன்ஸ்",
        showQRBtnText: "QR காட்டு",
        settingsBtnText: "அமைப்புகள்",
        installBtnText: "ஆப் நிறுவுக",
        tipText: "💡 குறிப்பு: தட்டச்சு செய்ய ஆரம்பித்தால் பரிந்துரைகள் வரும்! PDF-ஐ உங்கள் சாதனத்தில் சேமிக்கவும். தேதி வாரியாக வடிகட்டி பயன்படுத்தவும்!",
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
        gstLabel: "ஜிஎஸ்டி",
        totalLabel: "மொத்தம்",
        notesLabel: "குறிப்புகள்",
        saveBtnText: "💾 இன்வாய்ஸ் சேமி & முன்னோட்டம்",
        updateBtnText: "🔄 இன்வாய்ஸ் புதுப்பி & முன்னோட்டம்",
        cancelEditText: "ரத்து செய்",
        newBillBtnText: "புதிய பில்",
        historyTitle: "📄 என் இன்வாய்ஸ்கள்",
        noInvoicesText: "இன்னும் இன்வாய்ஸ் இல்லை. மேலே உங்கள் முதல் இன்வாய்ஸ் உருவாக்கவும்!",
        viewText: "PDF முன்னோட்டம்",
        editText: "திருத்து",
        deleteText: "நீக்கு",
        filterBtnText: "வடிகட்டு",
        clearFilterBtnText: "அழி",
        settingsTitle: "அமைப்புகள்",
        qrUploadTitle: "உங்கள் கட்டண QR குறியீடு",
        qrUploadDesc: "உங்கள் ஜிபே/போன்பே/பேட்டிஎம் QR குறியீட்டை பதிவேற்றவும்",
        uploadQRBtn: "QR பதிவேற்று",
        removeQRBtn: "QR நீக்கு",
        gstTitle: "ஜிஎஸ்டி அமைப்புகள்",
        gstToggleLabel: "ஜிஎஸ்டி செயல்படுத்துக",
        gstPercentLabel: "ஜிஎஸ்டி சதவீதம் (%)",
        saveGSTBtn: "ஜிஎஸ்டி சேமி",
        themeTitle: "🎨 வண்ண தீம்",
        dataTitle: "🗑️ தரவு மேலாண்மை",
        clearDataBtn: "எல்லா தரவையும் அழிக்க",
        clearWarning: "எச்சரிக்கை: இது உங்கள் எல்லா இன்வாய்ஸ்களையும் நிரந்தரமாக நீக்கும்",
        aboutTitle: "ℹ️ பற்றி & வழிமுறைகள்",
        aboutText: "ஹொசூர் இன்வாய்ஸ் பில் - இலவச இன்வாய்ஸ் ஜெனரேட்டர்",
        paymentQRTitle: "ஸ்கேன் செய்து பணம் செலுத்துங்கள்",
        paymentQRInstruction: "ஜிபே, போன்பே, அல்லது பேட்டிஎம் மூலம் ஸ்கேன் செய்யவும்",
        qrCloseBtn: "மூடு",
        noQRText: "கட்டண QR இல்லை. அமைப்புகளில் சேர்க்கவும்.",
        warningTitle: "⚠️ முக்கிய எச்சரிக்கை:",
        warningList: "• உலாவி தற்காலிக சேமிப்பை அழித்தால் அனைத்து இன்வாய்ஸ்களும் நீங்கும்\n• PDF-ஐ உங்கள் சாதனத்தில் கண்டிப்பாக சேமிக்கவும்\n• நாங்கள் எந்த சேவரிலும் உங்கள் தரவை சேமிக்க மாட்டோம்\n• உங்கள் இன்வாய்ஸ்களை காப்புப் பிரதி எடுப்பது உங்கள் பொறுப்பு\n• PDF கோப்புகளே உங்கள் நிரந்தர சட்டப்பூர்வ ஆவணங்கள்",
        howToTitle: "📖 எவ்வாறு பயன்படுத்துவது:",
        howToList: "1. உங்கள் கடை பெயர் மற்றும் தொடர்பு விவரங்களை உள்ளிடவும்\n2. வாடிக்கையாளர் பெயர் மற்றும் மொபைல் எண்ணை உள்ளிடவும்\n3. பொருள் பெயரை தட்டச்சு செய்யவும் (பழைய பெயர்கள் தானாக வரும்)\n4. அளவு மற்றும் விலையை உள்ளிடவும் (மொத்தம் தானாக கணக்கிடப்படும்)\n5. 'இன்வாய்ஸ் சேமி & முன்னோட்டம்' பொத்தானை அழுத்தவும்\n6. இன்வாய்ஸை மதிப்பாய்வு செய்து, 'PDF ஆக அச்சிடுக' அழுத்தவும்\n7. PDF-ஐ உங்கள் சாதனத்தில் சேமிக்கவும் - இதுவே உங்கள் நிரந்தர நகல்!\n8. அடுத்த வாடிக்கையாளருக்கு 'புதிய பில்' பொத்தானை பயன்படுத்தவும்\n9. தேதி வடிகட்டியை பயன்படுத்தி பழைய இன்வாய்ஸ்களை கண்டறியவும்",
        techTitle: "🛠️ தொழில்நுட்ப விவரங்கள்:",
        techText: "உங்கள் இன்வாய்ஸ்கள் உங்கள் உலாவியின் IndexedDB தரவுத்தளத்தில் சேமிக்கப்படும். PDF கோப்புகளை நீங்களே சேமிக்க வேண்டும். இது 100% ஆஃப்லைன்-ஃபர்ஸ்ட் PWA ஆகும்.",
        businessNamePlaceholder: "உதாரணம்: ஷ்ரீ முஹம்மது சன்ஸ்",
        businessContactPlaceholder: "தொலைபேசி: 9876543210, ஹொசூர் மெயின் ரோடு",
        customerNamePlaceholder: "உதாரணம்: ராஜேஷ் டெக்ஸ்டைல்ஸ்",
        customerMobilePlaceholder: "உதாரணம்: 9876543210",
        itemNamePlaceholder: "பொருள் பெயர் (உதாரணம்: அரிசி 5கிலோ)",
        notesPlaceholder: "நன்றி! மீண்டும் வருக",
        printPDF: "🖨️ PDF ஆக அச்சிடுக",
        closePreview: "❌ மூடு",
        confirmDelete: "இந்த இன்வாய்ஸை நிரந்தரமாக நீக்க வேண்டுமா?",
        deleteSuccess: "✅ இன்வாய்ஸ் நீக்கப்பட்டது!",
        updateSuccess: "✅ இன்வாய்ஸ் புதுப்பிக்கப்பட்டது!",
        saveSuccess: "✅ இன்வாய்ஸ் சேமிக்கப்பட்டது!",
        noItemAlert: "⚠️ தயவுசெய்து குறைந்தது ஒரு பொருளையாவது சேர்க்கவும்!",
        clearConfirm: "⚠️ எச்சரிக்கை: இது உங்கள் உலாவியில் உள்ள அனைத்து இன்வாய்ஸ்களையும் நிரந்தரமாக நீக்கும்!\n\nதொடரவா?",
        themeChanged: "வண்ண தீம் மாற்றப்பட்டது",
        qrUploadSuccess: "QR குறியீடு வெற்றிகரமாக பதிவேற்றப்பட்டது!",
        qrRemoved: "QR குறியீடு நீக்கப்பட்டது",
        newBillReady: "✅ புதிய பில்லுக்கு தயார்! வாடிக்கையாளர் விவரங்களை உள்ளிடவும்.",
        filterApplied: (date) => `📅 ${date} தேதியில் உள்ள இன்வாய்ஸ்களை காட்டுகிறது`,
        filterCleared: "📅 அனைத்து இன்வாய்ஸ்களையும் காட்டுகிறது",
        noInvoicesForDate: (date) => `📅 ${date} தேதியில் இன்வாய்ஸ் இல்லை`
    },
    english: {
        appTitle: "🏪 Hosur Invoice Bill",
        subtitleText: "Hosur Invoice Bill",
        createdByText: "Shri Muhammed Zabiullah Khan | PrimeSys Solutions",
        showQRBtnText: "Show QR",
        settingsBtnText: "Settings",
        installBtnText: "Install App",
        tipText: "💡 Tip: Start typing - auto suggestions appear! Save PDFs to your device. Use date filter to find past invoices!",
        businessTitle: "🏪 My Business Details",
        businessNameLabel: "Business Name",
        businessContactLabel: "Contact & Address",
        invoicePrefixLabel: "Invoice Prefix",
        nextInvoiceLabel: "Next Invoice #",
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
        gstLabel: "GST",
        totalLabel: "Total",
        notesLabel: "Notes",
        saveBtnText: "💾 Save Invoice & Preview",
        updateBtnText: "🔄 Update Invoice & Preview",
        cancelEditText: "Cancel",
        newBillBtnText: "New Bill",
        historyTitle: "📄 My Invoices",
        noInvoicesText: "No invoices yet. Create your first invoice above!",
        viewText: "PDF Preview",
        editText: "Edit",
        deleteText: "Delete",
        filterBtnText: "Filter",
        clearFilterBtnText: "Clear",
        settingsTitle: "Settings",
        qrUploadTitle: "Your Payment QR Code",
        qrUploadDesc: "Upload your GPay/PhonePe/Paytm QR code",
        uploadQRBtn: "Upload QR",
        removeQRBtn: "Remove QR",
        gstTitle: "GST Settings",
        gstToggleLabel: "Enable GST",
        gstPercentLabel: "GST Percentage (%)",
        saveGSTBtn: "Save GST",
        themeTitle: "🎨 Theme Color",
        dataTitle: "🗑️ Data Management",
        clearDataBtn: "Clear All My Data",
        clearWarning: "Warning: This will permanently delete all your invoices",
        aboutTitle: "ℹ️ About & Instructions",
        aboutText: "Hosur Invoice Bill - Free invoice generator",
        paymentQRTitle: "Scan to Pay",
        paymentQRInstruction: "Scan with GPay, PhonePe, or Paytm to pay",
        qrCloseBtn: "Close",
        noQRText: "No payment QR uploaded. Please add in settings.",
        warningTitle: "⚠️ Important Warning:",
        warningList: "• Clearing browser cache will DELETE all unsaved invoices\n• Always save PDFs to your device\n• We do NOT store your data on any server\n• You are responsible for backing up your invoices\n• PDF files are your permanent legal records",
        howToTitle: "📖 How to Use:",
        howToList: "1. Enter your Business Name and Contact details\n2. Add Customer Name and Mobile Number\n3. Type Item Name (auto-suggestions appear from history)\n4. Enter Quantity and Price (total auto-calculates instantly)\n5. Click 'Save Invoice & Preview' button\n6. Review the invoice, then click 'Print as PDF'\n7. Save the PDF to your device - this is your permanent copy!\n8. Use 'New Bill' button for next customer\n9. Use date filter to find past invoices",
        techTitle: "🛠️ Technical Details:",
        techText: "Your invoices are stored in your browser's IndexedDB database. PDF files must be saved manually. This is a 100% offline-first PWA.",
        businessNamePlaceholder: "Ex: Shri Muhammed Sons",
        businessContactPlaceholder: "Phone: 9876543210, Hosur Main Road",
        customerNamePlaceholder: "Ex: Rajesh Textiles",
        customerMobilePlaceholder: "Ex: 9876543210",
        itemNamePlaceholder: "Item name (Ex: Rice 5kg)",
        notesPlaceholder: "Thank you! Visit again",
        printPDF: "🖨️ Print as PDF",
        closePreview: "❌ Close",
        confirmDelete: "Permanently delete this invoice?",
        deleteSuccess: "✅ Invoice deleted!",
        updateSuccess: "✅ Invoice updated!",
        saveSuccess: "✅ Invoice saved!",
        noItemAlert: "⚠️ Please add at least one item!",
        clearConfirm: "⚠️ WARNING: This will permanently delete ALL your invoices from this browser!\n\nContinue?",
        themeChanged: "Theme changed",
        qrUploadSuccess: "QR code uploaded successfully!",
        qrRemoved: "QR code removed",
        newBillReady: "✅ Ready for new bill! Enter customer details.",
        filterApplied: (date) => `📅 Showing invoices for ${date}`,
        filterCleared: "📅 Showing all invoices",
        noInvoicesForDate: (date) => `📅 No invoices found for ${date}`
    }
};

// ============================================ //
// UI TRANSLATION FUNCTIONS                     //
// ============================================ //
function setText(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = text;
}

function applyTranslations() {
    const t = translations[currentLanguage];
    
    const elements = ['appTitle', 'subtitleText', 'createdByText', 'showQRBtnText', 'settingsBtnText', 
        'installBtnText', 'tipText', 'businessTitle', 'businessNameLabel', 'businessContactLabel', 
        'invoicePrefixLabel', 'nextInvoiceLabel', 'createInvoiceTitle', 'customerNameLabel', 
        'customerMobileLabel', 'itemsLabel', 'itemNameHeader', 'qtyHeader', 'priceHeader', 'totalHeader', 
        'subtotalLabel', 'totalLabel', 'notesLabel', 'historyTitle', 'noInvoicesText', 'filterBtn', 
        'clearFilterBtn', 'settingsTitle', 'qrUploadTitle', 'qrUploadDesc', 'uploadQRBtn', 'removeQRBtn', 
        'gstTitle', 'gstToggleLabel', 'gstPercentLabel', 'saveGSTBtn', 'themeTitle', 'dataTitle', 
        'clearDataBtn', 'clearWarning', 'aboutTitle', 'aboutText', 'paymentQRTitle', 'paymentQRInstruction', 
        'qrCloseBtn', 'noQRText', 'warningTitle', 'howToTitle', 'techTitle', 'techText', 'addItemBtnText', 
        'newBillBtnText'];
    
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el && t[id]) el.textContent = t[id];
    });
    
    setText('saveBtnText', editingInvoiceId ? t.updateBtnText : t.saveBtnText);
    setText('createInvoiceTitle', editingInvoiceId ? t.editInvoiceTitle : t.createInvoice);
    
    const warningList = document.getElementById('warningList');
    if (warningList && t.warningList) {
        warningList.innerHTML = t.warningList.split('\n').map(item => `<li>${item}</li>`).join('');
    }
    const howToList = document.getElementById('howToList');
    if (howToList && t.howToList) {
        howToList.innerHTML = t.howToList.split('\n').map(item => `<li>${item}</li>`).join('');
    }
    
    updateGSTLabel();
    
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
    if (langBtn) {
        langBtn.innerHTML = `<i class="fas fa-language"></i> ${currentLanguage === 'tamil' ? 'English' : 'தமிழ்'}`;
    }
    
    document.querySelectorAll('.item-name').forEach(input => {
        input.placeholder = t.itemNamePlaceholder;
    });
    
    const gstInfoText = document.getElementById('gstInfoText');
    if (gstInfoText) {
        gstInfoText.textContent = currentLanguage === 'tamil'
            ? `தற்போதைய ஜிஎஸ்டி: ${gstPercentage}% (${gstEnabled ? 'இயக்கத்தில்' : 'முடக்கப்பட்டது'})`
            : `Current GST: ${gstPercentage}% (${gstEnabled ? 'Enabled' : 'Disabled'})`;
    }
    
    loadInvoices();
}

function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    if (isError) {
        toast.style.background = '#dc2626';
        playSound('error');
    }
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'tamil' ? 'english' : 'tamil';
    applyTranslations();
    showToast(currentLanguage === 'tamil' ? '✅ தமிழுக்கு மாற்றப்பட்டது' : '✅ Switched to English');
}

// ============================================ //
// SETTINGS & THEME FUNCTIONS                   //
// ============================================ //
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

function changeTheme(theme) {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('app_theme', theme);
    
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.getAttribute('data-theme') === theme) {
            opt.classList.add('active');
        }
    });
    
    showToast(translations[currentLanguage].themeChanged);
    closeSettings();
    playSound('new');
}

// ============================================ //
// QR CODE FUNCTIONS                            //
// ============================================ //
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
            showToast(translations[currentLanguage].qrUploadSuccess);
            playSound('save');
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
    showToast(translations[currentLanguage].qrRemoved);
    playSound('delete');
}

// ============================================ //
// NEW BILL & CANCEL EDIT FUNCTIONS             //
// ============================================ //
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
        if (saveBtn) {
            saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t.saveBtnText}`;
            saveBtn.classList.remove('bg-orange-500', 'hover:bg-orange-600');
            saveBtn.classList.add('btn-primary');
        }
        document.getElementById('createInvoiceTitle').innerHTML = t.createInvoiceTitle;
        const cancelBtn = document.getElementById('cancelEditBtn');
        if (cancelBtn) cancelBtn.style.display = 'none';
    }
    
    showToast(t.newBillReady);
    playSound('new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    const t = translations[currentLanguage];
    
    editingInvoiceId = null;
    
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
    
    const saveBtn = document.getElementById('saveInvoiceBtn');
    if (saveBtn) {
        saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t.saveBtnText}`;
        saveBtn.classList.remove('bg-orange-500', 'hover:bg-orange-600');
        saveBtn.classList.add('btn-primary');
    }
    
    document.getElementById('createInvoiceTitle').innerHTML = t.createInvoiceTitle;
    
    const cancelBtn = document.getElementById('cancelEditBtn');
    if (cancelBtn) cancelBtn.style.display = 'none';
    
    showToast('Edit cancelled');
}

// ============================================ //
// INDEXEDDB DATABASE FUNCTIONS                 //
// ============================================ //
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('HosurInvoiceDB', 4);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
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
    if (!name || !name.trim()) return Promise.resolve();
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

async function getSuggestions(storeName, query, limit = 6) {
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
    if (!suggestions.length || !inputElement.value.trim()) return;
    
    const dropdown = document.createElement('div');
    dropdown.id = `dropdown_${inputElement.id}`;
    dropdown.className = 'auto-suggest';
    const rect = inputElement.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + window.scrollY + 5}px`;
    dropdown.style.left = `${rect.left + window.scrollX}px`;
    dropdown.style.minWidth = `${Math.max(rect.width, 200)}px`;
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'auto-suggest-item';
        item.textContent = suggestion;
        item.onclick = () => {
            inputElement.value = suggestion;
            if (onSelect) onSelect(suggestion);
            dropdown.remove();
            calculateAllTotals();
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
    setTimeout(() => document.addEventListener('click', closeDropdown), 150);
}

function getDigitalFootprint() {
    let footprint = localStorage.getItem('hosur_bill_footprint');
    if (!footprint) {
        footprint = 'user_' + crypto.randomUUID() + '_' + Date.now();
        localStorage.setItem('hosur_bill_footprint', footprint);
    }
    return footprint;
}

// ============================================ //
// CRUD OPERATIONS                              //
// ============================================ //
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
    const nextNum = maxNum + 1;
    return prefix + String(nextNum).padStart(3, '0');
}

// ============================================ //
// CALCULATIONS & ITEMS TABLE                   //
// ============================================ //
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
    
    const subtotalEl = document.getElementById('subtotal');
    const gstEl = document.getElementById('gstAmount');
    const grandTotalEl = document.getElementById('grandTotal');
    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (gstEl) gstEl.textContent = gst.toFixed(2);
    if (grandTotalEl) grandTotalEl.textContent = total.toFixed(2);
    
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
            const existing = document.getElementById(`dropdown_${nameInput.id}`);
            if (existing) existing.remove();
            if (query && query.length >= 1) {
                const suggestions = await getSuggestions('itemNames', query, 6);
                if (suggestions.length > 0 && nameInput.value.trim()) {
                    createAutoComplete(nameInput, suggestions, async (selected) => {
                        await saveToAutoComplete('itemNames', selected);
                    });
                }
            }
        });
        nameInput.addEventListener('blur', async () => {
            if (nameInput.value.trim()) {
                await saveToAutoComplete('itemNames', nameInput.value.trim());
            }
            setTimeout(() => {
                const dropdown = document.getElementById(`dropdown_${nameInput.id}`);
                if (dropdown) dropdown.remove();
            }, 200);
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
        <td class="border p-1">
            <input type="text" class="item-name w-full p-2 border rounded-lg" placeholder="${t.itemNamePlaceholder}" style="font-size:16px" autocomplete="off">
         </td>
        <td class="border p-1">
            <input type="number" class="item-qty w-full p-2 border rounded-lg" value="1" step="0.5" min="0" style="font-size:16px;text-align:center">
         </td>
        <td class="border p-1">
            <input type="number" class="item-price w-full p-2 border rounded-lg" value="0" step="1" min="0" style="font-size:16px;text-align:center">
         </td>
        <td class="border p-1 text-center">
            <span class="item-total font-mono font-bold">0.00</span>
         </td>
        <td class="border p-1 text-center">
            <button type="button" onclick="removeItemRow(${rowId})" class="text-red-600 hover:text-red-800 text-2xl font-bold px-2">&times;</button>
         </td>
    `;
    tbody.appendChild(newRow);
    addRowEventListeners(newRow);
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
    if (tbody) {
        tbody.innerHTML = '';
        itemCounter = 0;
        addItemRow();
    }
}

// ============================================ //
// PDF GENERATION FUNCTIONS                     //
// ============================================ //
function generateFileName(customerName, date) {
    let cleanName = customerName.replace(/[^a-zA-Z0-9\u0B80-\u0BFF]/g, '_').replace(/_+/g, '_').substring(0, 50);
    let formattedDate = date;
    if (date && date.includes('/')) {
        const parts = date.split('/');
        formattedDate = `${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[2]}`;
    } else {
        const today = new Date();
        formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    }
    return `${cleanName}_${formattedDate}.pdf`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generatePreviewHTML(invoice) {
    const t = translations[currentLanguage];
    const fileName = generateFileName(invoice.customerName, invoice.date);
    
    const itemsHtml = invoice.items.map((item, index) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 8px; text-align: center; border: 1px solid #ddd;">${index + 1}</td>
            <td style="padding: 10px 8px; text-align: left; border: 1px solid #ddd;">${escapeHtml(item.name)}</td>
            <td style="padding: 10px 8px; text-align: center; border: 1px solid #ddd;">${item.qty}</td>
            <td style="padding: 10px 8px; text-align: right; border: 1px solid #ddd;">₹ ${parseFloat(item.price).toFixed(2)}</td>
            <td style="padding: 10px 8px; text-align: right; border: 1px solid #ddd;">₹ ${parseFloat(item.total).toFixed(2)}</td>
         </tr>
    `).join('');
    
    const gstText = (gstEnabled && gstPercentage > 0) 
        ? (currentLanguage === 'tamil' ? `ஜிஎஸ்டி (${gstPercentage}%)` : `GST (${gstPercentage}%)`)
        : (currentLanguage === 'tamil' ? 'ஜிஎஸ்டி' : 'GST');
    const gstAmount = (gstEnabled && gstPercentage > 0) ? parseFloat(invoice.gst).toFixed(2) : '0.00';
    const thankyouText = currentLanguage === 'tamil' ? 'நன்றி! மீண்டும் வருக' : 'Thank you! Visit again';
    const poweredText = currentLanguage === 'tamil' ? 'ஹொசூர் இன்வாய்ஸ் பில் மூலம் இயக்கப்படுகிறது' : 'Powered by Hosur Invoice Bill';
    
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Invoice ${invoice.invoiceNo}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', 'Noto Sans Tamil', Arial, sans-serif; background: #f0f2f5; padding: 40px 20px; display: flex; justify-content: center; }
            .invoice-container { max-width: 900px; width: 100%; background: white; border-radius: 16px; box-shadow: 0 20px 35px -10px rgba(0,0,0,0.15); overflow: hidden; }
            .invoice-header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px 35px; text-align: center; }
            .invoice-header h1 { font-size: 24px; margin-bottom: 5px; }
            .invoice-header p { font-size: 13px; opacity: 0.9; }
            .invoice-title { background: #f8fafc; padding: 15px 35px; border-bottom: 2px solid #e2e8f0; }
            .invoice-title h2 { color: #1e3a8a; font-size: 18px; }
            .customer-info { padding: 20px 35px; background: #f8fafc; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px; border-bottom: 1px solid #e2e8f0; }
            .customer-info div { flex: 1; }
            .customer-info strong { color: #1f2937; font-size: 13px; display: block; margin-bottom: 5px; }
            .customer-info p { color: #4b5563; font-size: 13px; }
            .filename-info { background: #e8f0fe; padding: 10px 35px; font-size: 11px; color: #1e3a8a; border-bottom: 1px solid #e2e8f0; text-align: center; }
            .items-table { padding: 20px 35px; }
            .items-table table { width: 100%; border-collapse: collapse; }
            .items-table th { background: #f1f5f9; padding: 12px 8px; text-align: left; font-size: 13px; font-weight: 600; color: #1e293b; border: 1px solid #cbd5e1; }
            .items-table td { padding: 10px 8px; font-size: 13px; color: #334155; border: 1px solid #cbd5e1; }
            .items-table th:first-child, .items-table td:first-child { text-align: center; width: 50px; }
            .items-table th:nth-child(3), .items-table td:nth-child(3) { text-align: center; width: 80px; }
            .items-table th:nth-child(4), .items-table td:nth-child(4) { text-align: right; width: 100px; }
            .items-table th:nth-child(5), .items-table td:nth-child(5) { text-align: right; width: 100px; }
            .totals { padding: 20px 35px; background: #f8fafc; text-align: right; border-top: 2px solid #e2e8f0; }
            .totals table { width: 280px; margin-left: auto; border-collapse: collapse; }
            .totals td { padding: 8px 12px; font-size: 14px; }
            .totals td:first-child { text-align: left; font-weight: 500; }
            .totals td:last-child { text-align: right; font-weight: 600; }
            .totals .grand-total td { font-size: 18px; font-weight: 800; color: #1e3a8a; border-top: 2px solid #cbd5e1; }
            .notes { padding: 20px 35px; background: white; border-top: 1px solid #e2e8f0; font-style: italic; color: #6b7280; font-size: 13px; }
            .footer { padding: 15px 35px; background: #f1f5f9; text-align: center; font-size: 11px; color: #64748b; }
            .button-container { padding: 20px 35px; background: white; text-align: center; border-top: 1px solid #e2e8f0; }
            .print-btn { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 28px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-right: 12px; }
            .print-btn:hover { transform: scale(1.02); }
            .close-btn { background: #6b7280; color: white; padding: 12px 28px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; }
            @media print { .button-container, .print-btn, .close-btn, .filename-info { display: none !important; } body { background: white; padding: 0; } .invoice-container { box-shadow: none; border-radius: 0; } }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="invoice-header"><h1>${escapeHtml(invoice.businessName)}</h1><p>${escapeHtml(invoice.businessContact)}</p></div>
            <div class="invoice-title"><h2>TAX INVOICE</h2></div>
            <div class="filename-info">📄 ${currentLanguage === 'tamil' ? 'PDF கோப்பு பெயர்:' : 'PDF File Name:'} <strong>${fileName}</strong></div>
            <div class="customer-info"><div><strong>BILL TO:</strong><p>${escapeHtml(invoice.customerName)}</p>${invoice.customerMobile ? `<p>📞 ${escapeHtml(invoice.customerMobile)}</p>` : ''}</div>
            <div><strong>INVOICE DETAILS:</strong><p>Invoice No: ${invoice.invoiceNo}</p><p>Date: ${invoice.date}</p></div></div>
            <div class="items-table"><table><thead><tr><th>#</th><th>ITEM DESCRIPTION</th><th>QTY</th><th>PRICE</th><th>TOTAL</th></tr></thead><tbody>${itemsHtml}</tbody></table></div>
            <div class="totals"><tr><td>Subtotal</td>lakang₹ ${invoice.subtotal}</td></tr>
            <tr><td>${gstText}</td>lakang₹ ${gstAmount}</td></tr>
            <tr class="grand-total"><td>TOTAL</td>lakang₹ ${invoice.total}Neu</tr>
            </table>
            </div>
            <div class="notes"><p>📝 ${escapeHtml(invoice.tamilNotes || thankyouText)}</p></div>
            <div class="footer"><p>${thankyouText} | ${poweredText}</p></div>
            <div class="button-container"><button class="print-btn" onclick="window.print()">🖨️ ${t.printPDF}</button><button class="close-btn" onclick="window.close()">❌ ${t.closePreview}</button></div>
        </div>
        <script>document.title = "${fileName.replace('.pdf', '')}";<\/script>
    </body>
    </html>`;
}

function showPreview(invoice) {
    const htmlContent = generatePreviewHTML(invoice);
    if (previewWindow && !previewWindow.closed) previewWindow.close();
    previewWindow = window.open('', '_blank', 'width=950,height=850,scrollbars=yes,resizable=yes');
    previewWindow.document.write(htmlContent);
    previewWindow.document.close();
    previewWindow.focus();
}

// ============================================ //
// SAVE INVOICE - MAIN FUNCTION                 //
// ============================================ //
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
        showToast(t.noItemAlert, true);
        playSound('error');
        return;
    }
    
    const { subtotal, gst, total } = calculateAllTotals();
    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const timestamp = new Date().toISOString();
    
    let invoice;
    
    if (editingInvoiceId) {
        const existing = await getInvoiceById(editingInvoiceId);
        invoice = { 
            ...existing, 
            businessName, businessContact, customerName, customerMobile, 
            items, 
            subtotal: subtotal.toFixed(2), 
            gst: gst.toFixed(2), 
            total: total.toFixed(2), 
            tamilNotes, 
            updatedAt: timestamp 
        };
        await saveInvoiceToDB(invoice);
        showToast(t.updateSuccess);
        playSound('save');
        editingInvoiceId = null;
        document.getElementById('createInvoiceTitle').innerHTML = t.createInvoiceTitle;
        const saveBtn = document.getElementById('saveInvoiceBtn');
        if (saveBtn) {
            saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t.saveBtnText}`;
            saveBtn.classList.remove('bg-orange-500', 'hover:bg-orange-600');
            saveBtn.classList.add('btn-primary');
        }
        const cancelBtn = document.getElementById('cancelEditBtn');
        if (cancelBtn) cancelBtn.style.display = 'none';
    } else {
        const invoiceNo = await getNextInvoiceNumber();
        invoice = { 
            id: Date.now(), 
            invoiceNo, 
            date, 
            businessName, 
            businessContact, 
            customerName, 
            customerMobile, 
            items, 
            subtotal: subtotal.toFixed(2), 
            gst: gst.toFixed(2), 
            total: total.toFixed(2), 
            tamilNotes, 
            footprint: getDigitalFootprint(), 
            timestamp 
        };
        await saveInvoiceToDB(invoice);
        document.getElementById('customerName').value = '';
        document.getElementById('customerMobile').value = '';
        showToast(t.saveSuccess);
        playSound('save');
    }
    
    await saveBusinessInfo({ businessName, businessContact });
    await loadInvoices();
    const nextNum = await getNextInvoiceNumber();
    document.getElementById('nextInvoiceNumber').textContent = nextNum;
    
    showPreview(invoice);
}

// ============================================ //
// EDIT, DELETE, VIEW FUNCTIONS                 //
// ============================================ //
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
            <td class="border p-1"><input type="text" class="item-name w-full p-2 border rounded-lg" value="${escapeHtml(item.name)}" style="font-size:16px" autocomplete="off"></td>
            <td class="border p-1"><input type="number" class="item-qty w-full p-2 border rounded-lg" value="${item.qty}" step="0.5" min="0" style="font-size:16px;text-align:center"></td>
            <td class="border p-1"><input type="number" class="item-price w-full p-2 border rounded-lg" value="${item.price}" step="1" min="0" style="font-size:16px;text-align:center"></td>
            <td class="border p-1 text-center"><span class="item-total font-mono font-bold">${(item.qty * item.price).toFixed(2)}</span></td>
            <td class="border p-1 text-center"><button onclick="removeItemRow(${rowId})" class="text-red-600 text-xl">&times;</button></td>
        `;
        tbody.appendChild(newRow);
        addRowEventListeners(newRow);
    });
    
    if (invoice.items.length === 0) addItemRow();
    calculateAllTotals();
    
    document.getElementById('createInvoiceTitle').innerHTML = t.editInvoiceTitle;
    const saveBtn = document.getElementById('saveInvoiceBtn');
    if (saveBtn) {
        saveBtn.innerHTML = `<i class="fas fa-edit"></i> ${t.updateBtnText}`;
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
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Editing invoice ${invoice.invoiceNo}`);
}

async function deleteInvoice(invoiceId) {
    const t = translations[currentLanguage];
    if (confirm(t.confirmDelete)) {
        await deleteInvoiceFromDB(invoiceId);
        await loadInvoices();
        showToast(t.deleteSuccess);
        playSound('delete');
        if (editingInvoiceId === invoiceId) {
            editingInvoiceId = null;
            document.getElementById('createInvoiceTitle').innerHTML = t.createInvoiceTitle;
            const saveBtn = document.getElementById('saveInvoiceBtn');
            if (saveBtn) {
                saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t.saveBtnText}`;
                saveBtn.classList.remove('bg-orange-500', 'hover:bg-orange-600');
                saveBtn.classList.add('btn-primary');
            }
            const cancelBtn = document.getElementById('cancelEditBtn');
            if (cancelBtn) cancelBtn.style.display = 'none';
        }
    }
}

async function viewInvoicePreview(invoiceId) {
    const invoice = await getInvoiceById(invoiceId);
    if (invoice) showPreview(invoice);
}

// ============================================ //
// DATE FILTER FUNCTIONS - FINAL FIX!           //
// ============================================ //
async function applyDateFilter() {
    const dateInput = document.getElementById('filterDate');
    const selectedDate = dateInput.value;
    
    if (!selectedDate) {
        showToast(currentLanguage === 'tamil' ? 'தயவுசெய்து ஒரு தேதியை தேர்ந்தெடுக்கவும்' : 'Please select a date', true);
        return;
    }
    
    // Convert the filter date to match invoice date format
    const parts = selectedDate.split('-');
    const year = parts[0];
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    
    // Create both formats for comparison (with and without leading zeros)
    const filterDates = [
        `${day}/${month}/${year}`,           // 9/6/2026
        `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`  // 09/06/2026
    ];
    
    currentFilterDate = filterDates;
    await loadInvoices();
    
    const displayDate = `${day}/${month}/${year}`;
    const t = translations[currentLanguage];
    showToast(`📅 ${typeof t.filterApplied === 'function' ? t.filterApplied(displayDate) : `Showing invoices for ${displayDate}`}`);
}

async function clearDateFilter() {
    const dateInput = document.getElementById('filterDate');
    dateInput.value = '';
    currentFilterDate = null;
    await loadInvoices();
    
    const t = translations[currentLanguage];
    showToast(typeof t.filterCleared === 'string' ? t.filterCleared : '📅 Showing all invoices');
}

async function loadInvoices() {
    try {
        const invoices = await getAllInvoices();
        const container = document.getElementById('invoicesList');
        const countSpan = document.getElementById('invoiceCount');
        const t = translations[currentLanguage];
        
        // Apply date filter
        let filteredInvoices = [...invoices];
        if (currentFilterDate) {
            // currentFilterDate is now an array of possible date formats
            const filterDateArray = Array.isArray(currentFilterDate) ? currentFilterDate : [currentFilterDate];
            
            filteredInvoices = filteredInvoices.filter(inv => {
                const invoiceDate = inv.date;
                return filterDateArray.some(filterDate => {
                    // Direct comparison
                    if (invoiceDate === filterDate) return true;
                    // Also try normalizing both
                    const normalizedInvoice = normalizeDate(invoiceDate);
                    const normalizedFilter = normalizeDate(filterDate);
                    return normalizedInvoice === normalizedFilter;
                });
            });
        }
        
        // Sort by ID descending
        filteredInvoices.sort((a, b) => b.id - a.id);
        
        if (countSpan) countSpan.textContent = `(${filteredInvoices.length})`;
        
        if (filteredInvoices.length === 0) {
            if (currentFilterDate) {
                let displayDate = Array.isArray(currentFilterDate) ? currentFilterDate[0] : currentFilterDate;
                displayDate = normalizeDate(displayDate);
                container.innerHTML = `<div class="text-center text-gray-500 py-8">
                    <i class="fas fa-calendar-times text-4xl mb-2 opacity-50"></i>
                    <p class="text-sm">${currentLanguage === 'tamil' ? `📅 ${displayDate} தேதியில் இன்வாய்ஸ் இல்லை` : `📅 No invoices found for ${displayDate}`}</p>
                    <p class="text-xs text-gray-400 mt-2">${currentLanguage === 'tamil' ? 'வேறு தேதியை முயற்சிக்கவும் அல்லது வடிகட்டியை அழிக்கவும்' : 'Try another date or clear filter'}</p>
                </div>`;
            } else {
                container.innerHTML = `<div class="text-center text-gray-500 py-8">
                    <i class="fas fa-file-invoice text-4xl mb-2 opacity-50"></i>
                    <p class="text-sm">${t.noInvoicesText}</p>
                </div>`;
            }
            return;
        }
        
        container.innerHTML = filteredInvoices.map(inv => `
            <div class="invoice-item border rounded-xl p-3 hover:shadow-md transition bg-white">
                <div class="flex flex-wrap justify-between items-center gap-2">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="font-bold text-blue-700">${inv.invoiceNo}</span>
                        <span class="text-gray-600">${escapeHtml(inv.customerName)}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="font-bold text-green-700">₹${inv.total}</span>
                        <span class="text-xs text-gray-500">${inv.date}</span>
                    </div>
                </div>
                <div class="text-xs text-gray-400 mt-1">${inv.items.length} item(s) | ${escapeHtml(inv.items[0]?.name || '')}${inv.items.length > 1 ? ` +${inv.items.length - 1} more` : ''}</div>
                <div class="flex gap-2 mt-3 pt-2 border-t">
                    <button onclick="viewInvoicePreview(${inv.id})" class="flex-1 bg-blue-500 text-white px-2 py-1.5 rounded-lg text-xs hover:bg-blue-600 transition">
                        <i class="fas fa-eye mr-1"></i> ${t.viewText}
                    </button>
                    <button onclick="editInvoice(${inv.id})" class="flex-1 bg-yellow-500 text-white px-2 py-1.5 rounded-lg text-xs hover:bg-yellow-600 transition">
                        <i class="fas fa-edit mr-1"></i> ${t.editText}
                    </button>
                    <button onclick="deleteInvoice(${inv.id})" class="flex-1 bg-red-500 text-white px-2 py-1.5 rounded-lg text-xs hover:bg-red-600 transition">
                        <i class="fas fa-trash mr-1"></i> ${t.deleteText}
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading invoices:', error);
        showToast('Error loading invoices', true);
    }
}

// ============================================ //
// CLEAR ALL DATA                               //
// ============================================ //
async function clearAllData() {
    const t = translations[currentLanguage];
    if (confirm(t.clearConfirm)) {
        try {
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
            showToast('✅ All data cleared successfully!');
            playSound('delete');
            closeSettings();
        } catch (error) {
            console.error('Error clearing data:', error);
            showToast('Error clearing data', true);
        }
    }
}

// ============================================ //
// AUTO-COMPLETE SETUP                          //
// ============================================ //
async function setupBusinessAutoComplete() {
    const input = document.getElementById('businessName');
    if (!input) return;
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
    if (!input) return;
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

// ============================================ //
// EVENT LISTENERS & INITIALIZATION             //
// ============================================ //
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

async function init() {
    try {
        const savedTheme = localStorage.getItem('app_theme');
        if (savedTheme) document.body.classList.add(`theme-${savedTheme}`);
        
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
        const nextInvoiceSpan = document.getElementById('nextInvoiceNumber');
        if (nextInvoiceSpan) nextInvoiceSpan.textContent = nextNum;
        
        loadGSTSettings();
        applyTranslations();
        
        // Set default filter date to null (show all)
        currentFilterDate = null;
        
        console.log('✅ Hosur Invoice Bill v3.0 - Fully Loaded!');
        console.log('Date filter ready - select a date to filter invoices');
    } catch (error) {
        console.error('Init error:', error);
    }
}

// ============================================ //
// EXPOSE FUNCTIONS TO GLOBAL SCOPE             //
// ============================================ //
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
window.viewInvoicePreview = viewInvoicePreview;
window.clearAllData = clearAllData;
window.toggleGST = toggleGST;
window.saveGSTSettings = saveGSTSettings;
window.applyDateFilter = applyDateFilter;
window.clearDateFilter = clearDateFilter;
window.cancelEdit = cancelEdit;

// Start the application
init();
