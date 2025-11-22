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

            // Fallback response
            addBotMessage("Üzgünüm, bir sorun oluştu. Lütfen tekrar dene veya direkt Selahattin'e ulaşabilirsin: selahattincincin@gmail.com");
        }

        // Re-enable input
        chatInput.disabled = false;
        sendMessage.disabled = false;
        chatInput.focus();
    }

    // Call Claude API via Netlify function
    async function callClaudeAPI(messages, isFirst = false) {
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
            const error = await response.json();
            throw new Error(error.error || 'API request failed');
        }

        const data = await response.json();
        return data.message;
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
