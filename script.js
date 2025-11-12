const chatBtn = document.getElementById('chatBtn');
const chatWidget = document.getElementById('chatWidget');
const closeChat = document.getElementById('closeChat');
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatMessages = document.getElementById('chatMessages');
const themeToggle = document.getElementById('themeToggle');

// ==================== CHATBOT ====================
const endpoint = "https://innovventas.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=InnovVentas-FAQ&api-version=2021-10-01&deploymentName=production";
const apiKey = "694Z9xV8GiuTlka7iuBDAquT00m93r7AyrbsbzAwfZuD9i0mchxiJQQJ99BKACHYHv6XJ3w3AAAaACOGoFV0";

chatBtn.addEventListener('click', () => chatWidget.classList.toggle('open'));
closeChat.addEventListener('click', () => chatWidget.classList.remove('open'));
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  appendMessage(text, 'user');
  userInput.value = '';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ top: 1, question: text })
    });

    const data = await response.json();
    const answer = data.answers?.[0]?.answer || "Lo siento, no tengo una respuesta para eso.";
    appendMessage(answer, 'ai');
  } catch (error) {
    appendMessage("⚠️ Error al conectar con el servicio de Azure.", 'ai');
  }
}

function appendMessage(message, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('msg', sender);
  msgDiv.innerHTML = `<div class="bubble">${message}</div>`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ==================== MODO DÍA/NOCHE ====================
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Cargar tema guardado
window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  }
});

themeToggle.addEventListener('click', toggleTheme);
