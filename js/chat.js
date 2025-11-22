(function() {
    'use strict';

    const chatButton = document.getElementById('chatButton');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');

    // Conversation history for Claude API
    let conversationHistory = [];
    let githubProjects = null;
    let isFirstMessage = true;

    // API endpoint (will be Netlify function)
    const API_ENDPOINT = '/.netlify/functions/chat';

    // Fallback responses for local development
    const localResponses = {
        greeting: [
            "Merhaba! Selahattin hakkında ne bilmek istersin? 😊",
            "Selam! Ben Selahattin'in AI asistanıyım. Sana nasıl yardımcı olabilirim?"
        ],
        skills: [
            "Selahattin iOS Developer olarak Swift, SwiftUI ve UIKit konularında uzman! Mobil uygulama geliştirmede deneyimli, clean code yazan ve sürekli kendini geliştiren bir developer. Full-stack development yapabilir, yeni teknolojileri hızla öğrenir. 🚀",
            "Selahattin'in teknik yetenekleri gerçekten etkileyici! Swift ve iOS development'ta uzman. Self-taught olması, öğrenmeye ne kadar tutkulu olduğunu gösteriyor. Backend, frontend, mobile - hepsinde başarılı! 💪"
        ],
        projects: "Selahattin'in GitHub'da harika projeleri var! <a href='https://github.com/selahattincincin' target='_blank' style='color: #667eea;'>GitHub profiline buradan</a> göz atabilirsin. Her projede problem çözme yeteneği ve kod kalitesi göze çarpıyor! 🎯",
        experience: [
            "Selahattin deneyimli bir iOS Developer! Self-taught olması sürekli öğrenmeye açık olduğunu gösteriyor. Takım çalışmasına yatkın, agile metodolojilere hakim ve clean code yazıyor. ✨",
            "iOS development konusunda yılların deneyimi var! Mobile app development'ta uzman, UI/UX'te bilgili. Hem solo hem takım çalışmasında mükemmel performans gösteriyor! 🏆"
        ],
        contact: "Selahattin'le iletişime geçmek için:<br><br>📧 Email: <a href='mailto:selahattincincin@gmail.com?subject=Proje Görüşmesi' style='color: #667eea;'>selahattincincin@gmail.com</a><br>💼 LinkedIn: <a href='https://www.linkedin.com/in/cincinselahattin' target='_blank' style='color: #667eea;'>LinkedIn Profili</a><br>🐙 GitHub: <a href='https://github.com/selahattincincin' target='_blank' style='color: #667eea;'>GitHub</a><br><br>Projen için mükemmel bir seçim olacak! 💼",
        default: [
            "Selahattin iOS Developer olarak Swift, SwiftUI konularında uzman. Projelerini, yeteneklerini veya iletişim bilgilerini öğrenmek ister misin? 🤓",
            "Selahattin hakkında sana yardımcı olabilirim! Yazılım yetenekleri, projeleri veya deneyimi hakkında ne öğrenmek istersin? 💡"
        ]
    };

    // Initialize chat
    function initChat() {
        chatButton.addEventListener('click', toggleChat);
        closeChat.addEventListener('click', toggleChat);
        sendMessage.addEventListener('click', handleSendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        // Preload GitHub projects
        fetchGithubProjects();
    }

    // Fetch GitHub projects
    async function fetchGithubProjects() {
        try {
            const response = await fetch('https://api.github.com/users/selahattincincin/repos?sort=updated&per_page=10');
            if (response.ok) {
                githubProjects = await response.json();
                githubProjects = githubProjects.filter(repo => !repo.fork);
            }
        } catch (error) {
            console.error('GitHub API error:', error);
        }
    }

    // Toggle chat window
    async function toggleChat() {
        const isActive = chatWindow.classList.toggle('active');
        if (isActive && isFirstMessage) {
            // Get initial greeting from AI
            showTypingIndicator();
            try {
                const greeting = await callClaudeAPI([], true);
                removeTypingIndicator();
                addBotMessage(greeting);
                isFirstMessage = false;
            } catch (error) {
                removeTypingIndicator();
                addBotMessage("Selahattin hakkında ne bilmek istersin? 😊");
                isFirstMessage = false;
            }
        }
    }

    // Handle send message
    async function handleSendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Disable input while processing
        chatInput.disabled = true;
        sendMessage.disabled = true;

        // Add user message to chat
        addUserMessage(message);
        chatInput.value = '';

        // Add to conversation history
        conversationHistory.push({
            role: 'user',
            content: message
        });

        // Show typing indicator
        showTypingIndicator();

        try {
            // Check if user is asking about projects
            const lowerMessage = message.toLowerCase();
            const isProjectQuery = lowerMessage.includes('proje') ||
                                  lowerMessage.includes('github') ||
                                  lowerMessage.includes('kod') ||
                                  lowerMessage.includes('repo') ||
                                  lowerMessage.includes('portfolio') ||
                                  lowerMessage.includes('çalışma');

            // Get AI response
            const response = await callClaudeAPI(conversationHistory, false);

            // Add assistant response to history
            conversationHistory.push({
                role: 'assistant',
                content: response
            });

            // Remove typing indicator
            removeTypingIndicator();

            // Display response
            addBotMessage(response);

            // If asking about projects, show GitHub projects
            if (isProjectQuery && githubProjects && githubProjects.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                showTypingIndicator();
                await new Promise(resolve => setTimeout(resolve, 1500));
                removeTypingIndicator();

                const projectsHTML = formatGithubProjects();
                addBotMessage(projectsHTML);
            }

        } catch (error) {
            removeTypingIndicator();
            console.error('Chat error:', error);

            // This should rarely happen as callClaudeAPI has fallback
            addBotMessage("Üzgünüm, beklenmedik bir hata oluştu. Lütfen sayfayı yenile.");
        }

        // Re-enable input
        chatInput.disabled = false;
        sendMessage.disabled = false;
        chatInput.focus();
    }

    // Call Claude API via Netlify function
    async function callClaudeAPI(messages, isFirst = false) {
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: messages,
                    isFirstMessage: isFirst
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return data.message;
        } catch (error) {
            // Fallback to local responses
            console.log('Using local fallback responses');

            if (isFirst) {
                return getRandomResponse(localResponses.greeting);
            }

            const lastMessage = messages[messages.length - 1]?.content || '';
            return generateLocalResponse(lastMessage);
        }
    }

    // Generate local response based on keywords
    function generateLocalResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Contact/iletişim
        if (lowerMessage.includes('iletişim') || lowerMessage.includes('ulaş') ||
            lowerMessage.includes('mail') || lowerMessage.includes('contact') ||
            lowerMessage.includes('bağla') || lowerMessage.includes('email')) {
            return localResponses.contact;
        }

        // Projects
        if (lowerMessage.includes('proje') || lowerMessage.includes('github') ||
            lowerMessage.includes('kod') || lowerMessage.includes('repo') ||
            lowerMessage.includes('portfolio') || lowerMessage.includes('çalışma')) {
            return localResponses.projects;
        }

        // Skills/yetenekler
        if (lowerMessage.includes('yetenek') || lowerMessage.includes('beceri') ||
            lowerMessage.includes('skill') || lowerMessage.includes('yazılım') ||
            lowerMessage.includes('teknoloji') || lowerMessage.includes('swift') ||
            lowerMessage.includes('ios') || lowerMessage.includes('ne yapabilir') ||
            lowerMessage.includes('programla')) {
            return getRandomResponse(localResponses.skills);
        }

        // Experience
        if (lowerMessage.includes('deneyim') || lowerMessage.includes('tecrübe') ||
            lowerMessage.includes('experience') || lowerMessage.includes('kariyer') ||
            lowerMessage.includes('iş')) {
            return getRandomResponse(localResponses.experience);
        }

        // Default response
        return getRandomResponse(localResponses.default);
    }

    // Get random response from array
    function getRandomResponse(responses) {
        if (Array.isArray(responses)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
        return responses;
    }

    // Format GitHub projects as HTML
    function formatGithubProjects() {
        let html = '<div style="margin-top: 10px;">📚 <strong>GitHub Projeleri:</strong><br><br>';

        const topProjects = githubProjects.slice(0, 5);
        topProjects.forEach(project => {
            html += `<div class="project-card">
                <h5>⭐ ${project.name}</h5>
                <p>${project.description || 'Harika bir proje!'}</p>
                <a href="${project.html_url}" target="_blank">Projeyi İncele →</a>
            </div>`;
        });

        html += '</div>';
        return html;
    }

    // Add user message to chat
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Add bot message to chat
    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot';
        messageDiv.innerHTML = message;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChat);
    } else {
        initChat();
    }
})();
