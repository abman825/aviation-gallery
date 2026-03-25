// Chapa ለመጠቀም የሚያስፈልግህ መረጃ
const chapaConfig = {
    public_key: 'CHAPUBK_TEST-rnl2jvRBPJvcH3mSmANq7x9b5aWSFM2o', // በፎቶው ላይ ያለው ያንተ Public Key
    amount: '500', // ለምሳሌ የልብሱ ዋጋ 500 ብር ቢሆን
    currency: 'ETB',
    email: 'customer@email.com',
    first_name: 'Abebe',
    last_name: 'Bikila',
    tx_ref: 'lilmoo-' + Date.now(), // ለየብቻ የሆነ መለያ ቁጥር
    callback_url: 'https://yourwebsite.com/api/verify-payment', // ክፍያው ሲያልቅ መረጃ የሚላክበት
    return_url: 'https://yourwebsite.com/success', // ክፍያው ሲያልቅ ደንበኛው የሚመለስበት
};

// ክፍያውን የሚጀምር ፈንክሽን
async function startPayment() {
    console.log("ክፍያ እየተጀመረ ነው...");
    // እዚህ ጋር ክፍያውን ወደ Chapa API የምትልክበት ኮድ ይገባል
}