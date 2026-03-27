// Chapa ክፍያ ለመፈጸም የሚያስፈልጉ መረጃዎች (Configuration)
export const chapaConfig = {
    // ማሳሰቢያ፡ ይህ Public Key በ Chapa Dashboard ላይ ያለህ መሆኑን አረጋግጥ
    public_key: 'CHAPUBK_TEST-rnl2jvRBPJvcH3mSmANq7x9b5aWSFM2o', 
    
    amount: '500', // የልብሱ ዋጋ (ለምሳሌ 500 ብር)
    currency: 'ETB',
    
    // እነዚህን መረጃዎች ከ Form (ከደንበኛው) መቀበል ትችላለህ
    email: 'customer@email.com',
    first_name: 'Abebe',
    last_name: 'Bikila',
    
    // ለእያንዳንዱ ክፍያ የተለየ መለያ ቁጥር (Unique Reference)
    tx_ref: `lilmoo-${Date.now()}`, 

    // ክፍያው ሲያልቅ Chapa መረጃ የሚልክበት የ Backend ሊንክህ
    callback_url: 'https://aviation-backend-g75i.onrender.com/api/verify-payment', 

    // ደንበኛው ከከፈለ በኋላ ተመልሶ የሚመጣበት የድረ-ገጽህ ሊንክ
    return_url: 'https://aviation-gallery.vercel.app/' 
};

/**
 * ክፍያውን ለመጀመር ወደ Backend (Node.js) ጥሪ የሚያደርግ ፋንክሽን
 * @param {Object} axios - Axios instance
 * @param {String} backendUrl - የሰርቨርህ አድራሻ
 */
export async function startPayment(axios, backendUrl) {
    console.log("ክፍያ እየተጀመረ ነው...");
    
    try {
        const response = await axios.post(`${backendUrl}/api/pay`, {
            amount: chapaConfig.amount,
            email: chapaConfig.email,
            first_name: chapaConfig.first_name,
            last_name: chapaConfig.last_name,
            tx_ref: chapaConfig.tx_ref,
            callback_url: chapaConfig.callback_url,
            return_url: chapaConfig.return_url
        });

        // Backend ክፍያውን ካዘጋጀ (Initialize ካደረገ) ወደ Chapa ገጽ ይወስደዋል
        if (response.data && response.data.status === 'success') {
            window.location.href = response.data.data.checkout_url;
        } else {
            throw new Error("ክፍያውን ማዘጋጀት አልተቻለም");
        }
    } catch (error) {
        console.error("የክፍያ ስህተት:", error.response ? error.response.data : error.message);
        throw error;
    }
}