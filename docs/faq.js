// FAQ Knowledge Base for Customer Support Chatbot
const FAQ_KNOWLEDGE_BASE = [
    {
        id: 1,
        category: "Orders",
        questions: ["How do I track my order?", "Where is my package?", "Order tracking", "Track shipment"],
        answer: "You can track your order by logging into your account and visiting the 'My Orders' section. Enter your order number or use the tracking link sent to your email. Tracking updates usually appear within 24 hours of shipment.",
        intent: "track_order",
        keywords: ["track", "order", "shipment", "package", "where", "status"]
    },
    {
        id: 2,
        category: "Returns",
        questions: ["What is your return policy?", "How do I return an item?", "Can I return a product?", "Return process"],
        answer: "We offer a 30-day return policy for most items. Items must be unused and in original packaging. To initiate a return, go to 'My Orders', select the item, and click 'Return'. You'll receive a prepaid shipping label. Refunds are processed within 5-7 business days after we receive the item.",
        intent: "return_policy",
        keywords: ["return", "refund", "exchange", "policy", "send back"]
    },
    {
        id: 3,
        category: "Payments",
        questions: ["What payment methods do you accept?", "Can I pay with credit card?", "Do you accept PayPal?", "Payment options"],
        answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and shop gift cards. All payments are processed securely through encrypted gateways.",
        intent: "payment_methods",
        keywords: ["payment", "pay", "credit", "card", "paypal", "method", "visa"]
    },
    {
        id: 4,
        category: "Shipping",
        questions: ["How long does shipping take?", "What are the shipping costs?", "Do you offer free shipping?", "Shipping options"],
        answer: "Standard shipping takes 5-7 business days and is free for orders over $50. Express shipping (2-3 days) costs $9.99. Overnight shipping is available for $19.99. International shipping times and rates vary by destination.",
        intent: "shipping_info",
        keywords: ["shipping", "delivery", "free", "cost", "how long", "express"]
    },
    {
        id: 5,
        category: "Account",
        questions: ["How do I reset my password?", "I forgot my password", "Change account password", "Login issues"],
        answer: "To reset your password, click 'Forgot Password' on the login page. Enter your registered email address and we'll send a reset link. The link is valid for 24 hours. If you don't receive the email, check your spam folder or contact support.",
        intent: "password_reset",
        keywords: ["password", "reset", "forgot", "login", "account", "sign in"]
    },
    {
        id: 6,
        category: "Support",
        questions: ["How can I contact support?", "Customer service number", "Talk to a human", "Support hours"],
        answer: "You can reach our support team via live chat (available 24/7), email at support@example.com, or phone at 1-800-SUPPORT (Mon-Fri 9AM-6PM EST). For urgent issues, ask me to escalate to a human agent.",
        intent: "contact_support",
        keywords: ["contact", "support", "help", "human", "agent", "phone", "email"]
    },
    {
        id: 7,
        category: "Products",
        questions: ["Do you have a product warranty?", "What is the warranty period?", "Warranty claim", "Product guarantee"],
        answer: "Most products come with a 1-year manufacturer warranty covering defects in materials and workmanship. Extended warranties are available at checkout. To file a warranty claim, provide your order number and a description of the issue.",
        intent: "warranty",
        keywords: ["warranty", "guarantee", "defect", "broken", "claim"]
    },
    {
        id: 8,
        category: "Orders",
        questions: ["Can I cancel my order?", "How to cancel an order", "Order cancellation"],
        answer: "You can cancel an order within 1 hour of placing it if it hasn't been processed for shipping. Go to 'My Orders', select the order, and click 'Cancel'. If the order has already shipped, you'll need to initiate a return once you receive it.",
        intent: "cancel_order",
        keywords: ["cancel", "order", "stop", "undo"]
    },
    {
        id: 9,
        category: "Account",
        questions: ["How do I update my shipping address?", "Change delivery address", "Update address"],
        answer: "You can update your default shipping address in Account Settings > Addresses. For a specific order that hasn't shipped yet, go to My Orders and select 'Edit Address'. Once an order has shipped, the address cannot be changed.",
        intent: "update_address",
        keywords: ["address", "shipping", "update", "change", "delivery"]
    },
    {
        id: 10,
        category: "Promotions",
        questions: ["Do you have any discount codes?", "Promo codes", "Current sales", "Coupons"],
        answer: "Check our homepage banner and the 'Deals' section for current promotions. Sign up for our newsletter to receive exclusive discount codes. First-time customers get 10% off with code WELCOME10.",
        intent: "discounts",
        keywords: ["discount", "promo", "code", "coupon", "sale", "offer"]
    },
    {
        id: 11,
        category: "Damaged",
        questions: [
            "I received a damaged parcel",
            "My package arrived damaged",
            "Damaged item",
            "Broken product in delivery",
            "Parcel was damaged"
        ],
        answer: "We're sorry your parcel arrived damaged. Please follow these steps:\n1. Take clear photos of the damaged packaging and the item.\n2. Go to My Orders → select the order → Report Issue → Damaged Item.\n3. Upload the photos and describe the damage.\n4. We will arrange a free replacement or full refund within 24–48 hours.\nYou can also start the process right here — just share your order number and a short description of the damage.",
        intent: "damaged_parcel",
        keywords: ["damaged", "damage", "broken", "crushed", "torn", "parcel damaged", "package damaged"]
    },
    {
        id: 12,
        category: "Wrong Item",
        questions: [
            "I received the wrong parcel",
            "Wrong item delivered",
            "Incorrect product",
            "Got someone else's order",
            "Wrong package"
        ],
        answer: "We're sorry you received the wrong parcel. Here's how we fix it quickly:\n1. Go to My Orders → select the order → Report Issue → Wrong Item.\n2. Tell us what you ordered vs. what you received.\n3. Keep the incorrect item — we will arrange a free return label and send the correct product at no extra cost.\n4. Once we receive the wrong item (or in many cases even before), we ship the correct one.\nShare your order number and what you received so I can start the replacement process for you.",
        intent: "wrong_parcel",
        keywords: ["wrong", "incorrect", "different", "someone else", "mismatch", "wrong parcel", "wrong item"]
    }
];

function retrieveRelevantFAQs(query, topK = 3) {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\\s+/).filter(w => w.length > 2);
    
    const scored = FAQ_KNOWLEDGE_BASE.map(faq => {
        let score = 0;
        faq.keywords.forEach(kw => {
            if (queryLower.includes(kw)) score += 2;
        });
        faq.questions.forEach(q => {
            const qWords = q.toLowerCase().split(/\\s+/);
            const overlap = queryWords.filter(w => qWords.includes(w)).length;
            score += overlap * 1.5;
        });
        if (queryLower.includes(faq.category.toLowerCase())) score += 1;
        return { faq, score };
    });
    
    return scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(s => s.faq);
}

function calculateConfidence(retrievalScore, hasStrongMatch) {
    if (hasStrongMatch || retrievalScore >= 4) return { level: "high", score: 0.9 + Math.random() * 0.08 };
    if (retrievalScore >= 2) return { level: "medium", score: 0.65 + Math.random() * 0.15 };
    return { level: "low", score: 0.35 + Math.random() * 0.2 };
}
