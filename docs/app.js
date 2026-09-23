// AI Customer Support Chatbot - Full App with Login, Home, Chat, History

const state = {
    user: null,           // { name, email, order }
    history: [],          // current session messages
    allSessions: [],      // saved conversation sessions
    language: 'en',
    voiceMode: false,
    isListening: false,
    isProcessing: false,
    recognition: null,
    theme: 'dark',
    currentTopic: null
};

const LANG_NAMES = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German',
    ur: 'Urdu', hi: 'Hindi', zh: 'Chinese', ar: 'Arabic'
};

const TOPIC_QUERIES = {
    track: "How do I track my order?",
    return: "What is your return policy?",
    damage: "I received a damaged parcel",
    wrong: "I received the wrong parcel",
    payment: "What payment methods do you accept?",
    account: "How do I reset my password?",
    shipping: "How long does shipping take?",
    contact: "How can I contact support?"
};

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    setupEventListeners();
    initSpeechRecognition();
    applyTheme();

    if (state.user) {
        showScreen('homeScreen');
        updateUserUI();
    } else {
        showScreen('loginScreen');
    }
});

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function updateUserUI() {
    if (!state.user) return;
    const name = state.user.name.split(' ')[0];
    document.getElementById('homeUserName').textContent = `Hi, ${name}`;
    document.getElementById('welcomeName').textContent = name;
    document.getElementById('chatUserLabel').textContent = state.user.email;
}

// ---------- EVENT LISTENERS ----------
function setupEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const order = document.getElementById('userOrder').value.trim();
        if (!name || !email) return;

        state.user = { name, email, order: order || null };
        saveState();
        updateUserUI();
        showScreen('homeScreen');
    });

    // Home topics
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', () => {
            const topic = card.dataset.topic;
            state.currentTopic = topic;
            openChat(TOPIC_QUERIES[topic] || null);
        });
    });

    document.getElementById('startChatBtn').addEventListener('click', () => openChat(null));

    // Back to home
    document.getElementById('backBtn').addEventListener('click', () => {
        stopSpeaking(); // stop any ongoing TTS when going back
        saveCurrentSession();
        showScreen('homeScreen');
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Logout and clear current session?')) {
            stopSpeaking();
            saveCurrentSession();
            state.user = null;
            state.history = [];
            document.getElementById('messages').innerHTML = '';
            document.getElementById('welcomeMessage').style.display = 'block';
            saveState();
            showScreen('loginScreen');
        }
    });

    // History panel
    document.getElementById('historyBtn').addEventListener('click', openHistoryPanel);
    document.getElementById('closeHistory').addEventListener('click', closeHistoryPanel);
    document.getElementById('historyOverlay').addEventListener('click', closeHistoryPanel);
    document.getElementById('clearAllHistory').addEventListener('click', () => {
        if (confirm('Clear ALL conversation history?')) {
            state.allSessions = [];
            state.history = [];
            document.getElementById('messages').innerHTML = '';
            document.getElementById('welcomeMessage').style.display = 'block';
            saveState();
            renderHistoryList();
            closeHistoryPanel();
        }
    });

    // Chat controls
    document.getElementById('sendBtn').addEventListener('click', handleSend);
    document.getElementById('userInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
    document.getElementById('userInput').addEventListener('input', autoResize);
    document.getElementById('micBtn').addEventListener('click', toggleVoiceInput);

    document.getElementById('voiceToggle').addEventListener('click', () => {
        state.voiceMode = !state.voiceMode;
        document.getElementById('voiceToggle').classList.toggle('active', state.voiceMode);
        if (!state.voiceMode) {
            stopSpeaking(); // stop immediately when turning OFF
            updateStatus('Voice mode OFF — speech stopped');
        } else {
            updateStatus('Voice mode ON — responses will be spoken');
        }
    });

    document.getElementById('languageSelect').addEventListener('change', (e) => {
        state.language = e.target.value;
        updateStatus(`Language: ${LANG_NAMES[state.language]}`);
    });

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Quick action buttons (delegated because they are recreated)
    document.getElementById('quickActions').addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-btn');
        if (btn) {
            document.getElementById('userInput').value = btn.dataset.query;
            handleSend();
        }
    });
}

function openChat(prefillQuery) {
    showScreen('chatScreen');
    updateUserUI();
    // If starting fresh for a topic, clear current messages view but keep session history separate
    if (prefillQuery) {
        document.getElementById('welcomeMessage').style.display = 'none';
        // small delay so screen is visible
        setTimeout(() => {
            document.getElementById('userInput').value = prefillQuery;
            handleSend();
        }, 300);
    }
}

// ---------- HISTORY PANEL ----------
function openHistoryPanel() {
    renderHistoryList();
    document.getElementById('historyPanel').classList.add('open');
    document.getElementById('historyOverlay').classList.add('show');
}

function closeHistoryPanel() {
    document.getElementById('historyPanel').classList.remove('open');
    document.getElementById('historyOverlay').classList.remove('show');
}

function renderHistoryList() {
    const list = document.getElementById('historyList');
    if (!state.allSessions.length) {
        list.innerHTML = '<p class="empty-history">No previous conversations yet.</p>';
        return;
    }
    list.innerHTML = state.allSessions.map((s, i) => {
        const preview = s.messages.find(m => m.role === 'user')?.content || 'Chat session';
        const date = new Date(s.timestamp).toLocaleString();
        return `
            <div class="history-item" data-index="${i}">
                <div class="hist-preview">${escapeHtml(preview.substring(0, 60))}${preview.length > 60 ? '…' : ''}</div>
                <div class="hist-meta">${date} • ${s.messages.length} messages</div>
            </div>
        `;
    }).join('');

    list.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index);
            loadSession(idx);
            closeHistoryPanel();
            showScreen('chatScreen');
        });
    });
}

function loadSession(index) {
    const session = state.allSessions[index];
    if (!session) return;
    state.history = [...session.messages];
    const container = document.getElementById('messages');
    container.innerHTML = '';
    document.getElementById('welcomeMessage').style.display = 'none';
    session.messages.forEach(msg => {
        if (msg.role === 'user') addMessage('user', msg.content);
        else addMessage('bot', msg.content, { intent: msg.intent, confidence: msg.confidence });
    });
}

function saveCurrentSession() {
    if (state.history.length < 2) return; // at least one exchange
    state.allSessions.unshift({
        timestamp: Date.now(),
        messages: [...state.history],
        user: state.user?.name || 'Guest'
    });
    // keep max 20 sessions
    if (state.allSessions.length > 20) state.allSessions = state.allSessions.slice(0, 20);
    state.history = [];
    document.getElementById('messages').innerHTML = '';
    document.getElementById('welcomeMessage').style.display = 'block';
    saveState();
}

// ---------- THEME ----------
function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    document.getElementById('themeToggle').innerHTML =
        state.theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    saveState();
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme === 'light' ? 'light' : '');
}

function autoResize() {
    const el = document.getElementById('userInput');
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 110) + 'px';
}

// ---------- SPEECH ----------
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        document.getElementById('micBtn').style.display = 'none';
        return;
    }
    state.recognition = new SpeechRecognition();
    state.recognition.continuous = false;
    state.recognition.interimResults = true;

    state.recognition.onstart = () => {
        state.isListening = true;
        document.getElementById('micBtn').classList.add('listening');
        updateStatus('Listening...');
    };
    state.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        document.getElementById('userInput').value = transcript;
        autoResize();
    };
    state.recognition.onend = () => {
        state.isListening = false;
        document.getElementById('micBtn').classList.remove('listening');
        if (document.getElementById('userInput').value.trim()) handleSend();
        else updateStatus('Ready');
    };
    state.recognition.onerror = () => {
        state.isListening = false;
        document.getElementById('micBtn').classList.remove('listening');
        updateStatus('Voice error');
    };
}

function getSpeechLangCode(lang) {
    const map = { en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', ur: 'ur-PK', hi: 'hi-IN', zh: 'zh-CN', ar: 'ar-SA' };
    return map[lang] || 'en-US';
}

function toggleVoiceInput() {
    if (!state.recognition) {
        updateStatus('Speech recognition not supported');
        return;
    }
    if (state.isListening) state.recognition.stop();
    else {
        state.recognition.lang = getSpeechLangCode(state.language);
        state.recognition.start();
    }
}

// Keep reference to current audio so we can stop it
let currentAudio = null;

function stopSpeaking() {
    // Stop Web Speech API
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
    // Stop Puter / HTMLAudioElement if playing
    if (currentAudio) {
        try {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        } catch (e) {}
        currentAudio = null;
    }
}

async function speakText(text) {
    if (!state.voiceMode) return;

    // Always stop previous speech before starting a new one
    stopSpeaking();

    try {
        if (window.puter?.ai?.txt2speech) {
            const audio = await puter.ai.txt2speech(text);
            currentAudio = audio;
            audio.onended = () => { currentAudio = null; };
            audio.play();
            return;
        }
    } catch (e) {
        console.log('Puter TTS failed, falling back to Web Speech');
    }

    if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = getSpeechLangCode(state.language);
        u.onend = () => { currentAudio = null; };
        speechSynthesis.speak(u);
    }
}

// ---------- CHAT CORE ----------
async function handleSend() {
    const query = document.getElementById('userInput').value.trim();
    if (!query || state.isProcessing) return;

    state.isProcessing = true;
    document.getElementById('sendBtn').disabled = true;
    document.getElementById('welcomeMessage').style.display = 'none';

    addMessage('user', query);
    document.getElementById('userInput').value = '';
    autoResize();

    const typingId = showTyping();
    updateStatus('Thinking...');

    try {
        const relevantFAQs = retrieveRelevantFAQs(query);
        const hasStrongMatch = relevantFAQs.length > 0 &&
            relevantFAQs[0].keywords.some(k => query.toLowerCase().includes(k));

        const systemPrompt = buildSystemPrompt(relevantFAQs);
        const messages = buildMessages(systemPrompt, query);

        let responseText = '';
        let intent = 'general_inquiry';
        let confidence = { level: 'medium', score: 0.7 };

        try {
            const response = await puter.ai.chat(messages, {
                model: 'gpt-5.4-nano',
                stream: false
            });

            if (typeof response === 'string') responseText = response;
            else if (response.message) responseText = response.message.content || response.message.toString();
            else if (response.text) responseText = response.text;
            else responseText = JSON.stringify(response);

            const parsed = parseStructuredResponse(responseText);
            responseText = parsed.answer || responseText;
            intent = parsed.intent || detectIntent(query, relevantFAQs);
            confidence = parsed.confidence || calculateConfidence(relevantFAQs.length > 0 ? 3 : 0, hasStrongMatch);
        } catch (llmError) {
            console.error('LLM Error:', llmError);
            if (relevantFAQs.length > 0) {
                responseText = relevantFAQs[0].answer;
                intent = relevantFAQs[0].intent;
                confidence = { level: 'high', score: 0.85 };
            } else {
                responseText = getFallbackResponse();
                confidence = { level: 'low', score: 0.4 };
            }
        }

        removeTyping(typingId);
        addMessage('bot', responseText, { intent, confidence });

        state.history.push({ role: 'user', content: query });
        state.history.push({ role: 'assistant', content: responseText, intent, confidence });
        if (state.history.length > 30) state.history = state.history.slice(-30);
        saveState();

        await speakText(responseText);
        updateStatus('Ready');
        document.getElementById('confidenceDisplay').textContent =
            `Confidence: ${(confidence.score * 100).toFixed(0)}%`;
    } catch (error) {
        console.error(error);
        removeTyping(typingId);
        addMessage('bot', 'Sorry, something went wrong. Please try again.', {
            intent: 'error', confidence: { level: 'low', score: 0.1 }
        });
        updateStatus('Error');
    } finally {
        state.isProcessing = false;
        document.getElementById('sendBtn').disabled = false;
        document.getElementById('userInput').focus();
    }
}

function buildSystemPrompt(relevantFAQs) {
    const userInfo = state.user
        ? `Customer name: ${state.user.name}. Email: ${state.user.email}.${state.user.order ? ` Order number on file: ${state.user.order}.` : ''}`
        : 'Guest user.';

    const faqContext = relevantFAQs.length > 0
        ? relevantFAQs.map((f, i) =>
            `[FAQ ${i + 1}] Category: ${f.category} | Intent: ${f.intent}\nQ: ${f.questions[0]}\nA: ${f.answer}`
          ).join('\n\n')
        : 'No highly relevant FAQ found. Answer helpfully.';

    return `You are a professional, friendly AI Customer Support Agent.

CUSTOMER INFO:
${userInfo}

INSTRUCTIONS:
- Be clear, empathetic and helpful.
- Prefer FAQ answers when they match the question.
- For damaged or wrong parcels, guide the customer step-by-step and ask for order number + photos if needed.
- Respond in ${LANG_NAMES[state.language]}.
- Keep answers concise but complete.

FAQ KNOWLEDGE BASE:
${faqContext}

RESPONSE FORMAT (always use this):
INTENT: <intent_name>
CONFIDENCE: <high|medium|low>
ANSWER: <your response>`;
}

function buildMessages(systemPrompt, userQuery) {
    const messages = [{ role: 'system', content: systemPrompt }];
    const recent = state.history.slice(-6);
    recent.forEach(msg => {
        messages.push({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
        });
    });
    messages.push({ role: 'user', content: userQuery });
    return messages;
}

function parseStructuredResponse(text) {
    const result = { answer: text, intent: null, confidence: null };
    const intentMatch = text.match(/INTENT:\s*(\w+)/i);
    if (intentMatch) result.intent = intentMatch[1].toLowerCase();
    const confMatch = text.match(/CONFIDENCE:\s*(high|medium|low)/i);
    if (confMatch) {
        const level = confMatch[1].toLowerCase();
        result.confidence = {
            level,
            score: level === 'high' ? 0.9 : level === 'medium' ? 0.7 : 0.4
        };
    }
    const answerMatch = text.match(/ANSWER:\s*([\s\S]*)/i);
    if (answerMatch) result.answer = answerMatch[1].trim();
    else {
        result.answer = text
            .replace(/INTENT:\s*\w+/i, '')
            .replace(/CONFIDENCE:\s*\w+/i, '')
            .trim();
    }
    return result;
}

function detectIntent(query, faqs) {
    if (faqs.length > 0) return faqs[0].intent;
    const q = query.toLowerCase();
    if (q.includes('damage') || q.includes('broken') || q.includes('crushed')) return 'damaged_parcel';
    if (q.includes('wrong') || q.includes('incorrect')) return 'wrong_parcel';
    if (q.includes('track') || q.includes('where is')) return 'track_order';
    if (q.includes('return') || q.includes('refund')) return 'return_policy';
    if (q.includes('pay') || q.includes('card')) return 'payment_methods';
    if (q.includes('ship') || q.includes('deliver')) return 'shipping_info';
    if (q.includes('password') || q.includes('login')) return 'password_reset';
    if (q.includes('contact') || q.includes('human')) return 'contact_support';
    return 'general_inquiry';
}

function getFallbackResponse() {
    const fallbacks = {
        en: "I'm not entirely sure about that. Could you give more details or share your order number? I can also connect you with a human agent.",
        es: "No estoy completamente seguro. ¿Puedes dar más detalles o tu número de pedido?",
        fr: "Je ne suis pas entièrement sûr. Pouvez-vous donner plus de détails ?",
        de: "Ich bin mir nicht ganz sicher. Könnten Sie mehr Details angeben?",
        ur: "مجھے پوری طرح یقین نہیں۔ کیا آپ مزید تفصیلات یا آرڈر نمبر دے سکتے ہیں؟",
        hi: "मुझे पूरा यकीन नहीं है। क्या आप और विवरण या ऑर्डर नंबर दे सकते हैं?",
        zh: "我不太确定。您能提供更多细节或订单号吗？",
        ar: "لست متأكدًا تمامًا. هل يمكنك تقديم المزيد من التفاصيل؟"
    };
    return fallbacks[state.language] || fallbacks.en;
}

// ---------- UI HELPERS ----------
function addMessage(role, content, meta = {}) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = role === 'bot' ? '<i class="fas fa-headset"></i>' : '<i class="fas fa-user"></i>';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    let html = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    contentDiv.innerHTML = html;

    if (role === 'bot' && meta.intent) {
        const metaDiv = document.createElement('div');
        metaDiv.className = 'message-meta';
        const intentSpan = document.createElement('span');
        intentSpan.className = 'intent-tag';
        intentSpan.textContent = `Intent: ${meta.intent.replace(/_/g, ' ')}`;
        metaDiv.appendChild(intentSpan);
        if (meta.confidence) {
            const confSpan = document.createElement('span');
            confSpan.className = `confidence-badge confidence-${meta.confidence.level}`;
            confSpan.innerHTML = `<i class="fas fa-chart-line"></i> ${(meta.confidence.score * 100).toFixed(0)}%`;
            metaDiv.appendChild(confSpan);
        }
        contentDiv.appendChild(metaDiv);
    }

    div.appendChild(avatar);
    div.appendChild(contentDiv);
    document.getElementById('messages').appendChild(div);
    scrollToBottom();
}

function showTyping() {
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.className = 'message bot';
    div.id = id;
    div.innerHTML = `
        <div class="message-avatar"><i class="fas fa-headset"></i></div>
        <div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>
    `;
    document.getElementById('messages').appendChild(div);
    scrollToBottom();
    return id;
}

function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollToBottom() {
    const c = document.getElementById('chatContainer');
    c.scrollTop = c.scrollHeight;
}

function updateStatus(text) {
    document.getElementById('statusText').textContent = text;
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------- PERSISTENCE ----------
function saveState() {
    try {
        localStorage.setItem('cs_user', JSON.stringify(state.user));
        localStorage.setItem('cs_history', JSON.stringify(state.history));
        localStorage.setItem('cs_sessions', JSON.stringify(state.allSessions));
        localStorage.setItem('cs_theme', state.theme);
    } catch (e) {}
}

function loadState() {
    try {
        const u = localStorage.getItem('cs_user');
        if (u) state.user = JSON.parse(u);
        const h = localStorage.getItem('cs_history');
        if (h) state.history = JSON.parse(h);
        const s = localStorage.getItem('cs_sessions');
        if (s) state.allSessions = JSON.parse(s);
        const t = localStorage.getItem('cs_theme');
        if (t) state.theme = t;
    } catch (e) {}
}
