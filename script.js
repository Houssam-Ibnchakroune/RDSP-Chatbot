// Configuration
const API_URL = "https://premonarchial-chignoned-hae.ngrok-free.dev/api/chat";  // Remplacez par votre URL ngrok
			
let currentLang = 'fr';

// Éléments DOM
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const toggleBtn = document.getElementById('toggleLang');
const sendButton = document.getElementById('sendButton');
const suggestionText = document.getElementById('suggestionText');

// Messages d'accueil
const welcomeMessages = {
    fr: "Bonjour ! Je suis un assistant expert sur le Régime enregistré d'épargne-invalidité (RDSP) canadien. Posez-moi vos questions !",
    en: "Hello! I'm an expert assistant on the Canadian Registered Disability Savings Plan (RDSP). Ask me your questions!"
};

// Suggestions par langue
const suggestions = {
    fr: ["Qu'est-ce que le RDSP ?", "Qui est éligible ?", "Quels sont les avantages fiscaux ?"],
    en: ["What is RDSP?", "Who is eligible?", "What are the tax benefits?"]
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    addMessage(welcomeMessages[currentLang], false);
    updateSuggestions();
});

// Fonctions principales
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;
    
    addMessage(question, true);
    userInput.value = '';
    sendButton.disabled = true;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: question,
                lang: currentLang
            })
        });
        
        const data = await response.json();
        addMessage(data.response, false);
    } catch (error) {
        const errorMsg = currentLang === 'fr' 
            ? "Désolé, une erreur s'est produite. Essayez à nouveau." 
            : "Sorry, an error occurred. Please try again.";
        addMessage(errorMsg, false);
        console.error('API Error:', error);
    } finally {
        sendButton.disabled = false;
        userInput.focus();
    }
}

// Fonctions utilitaires
function toggleLanguage() {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    userInput.placeholder = currentLang === 'fr' 
        ? "Posez votre question sur le RDSP..." 
        : "Ask your RDSP question...";
    suggestionText.textContent = currentLang === 'fr' 
        ? "Essayez ces questions :" 
        : "Try these questions:";
    updateSuggestions();
}

function updateSuggestions() {
    const buttonsContainer = document.querySelector('.suggestion-buttons');
    buttonsContainer.innerHTML = '';
    
    suggestions[currentLang].forEach(question => {
        const button = document.createElement('button');
        button.textContent = question;
        button.onclick = () => insertQuestion(question);
        buttonsContainer.appendChild(button);
    });
}

function insertQuestion(question) {
    userInput.value = question;
    userInput.focus();
}

// Événements
toggleBtn.addEventListener('click', toggleLanguage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
sendButton.addEventListener('click', sendMessage);