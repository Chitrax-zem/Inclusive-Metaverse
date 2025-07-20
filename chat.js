// chat.js - Metaverse Chat System with Toxicity Moderation

class ChatSystem {
    constructor() {
        this.currentTab = 'global';
        this.isMinimized = false;
        this.isExpanded = false;
        this.toxicityModel = null;
        this.initialize();
    }

    async initialize() {
        // DOM elements
        this.chatContainer = document.getElementById('chat-container');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-btn');
        this.emojiBtn = document.getElementById('emoji-btn');
        this.voiceInputBtn = document.getElementById('voice-input');
        this.tabs = document.querySelectorAll('.chat-tab');
        this.emojiPicker = document.getElementById('emoji-picker');
        this.emojiCategories = document.querySelectorAll('.emoji-categories button');
        this.emojiList = document.querySelector('.emoji-list');
        this.chatMinimizeBtn = document.getElementById('chat-minimize');
        this.chatExpandBtn = document.getElementById('chat-expand');

        // Events
        this.setupEventListeners();
        
        // Load toxicity model
        await this.loadToxicityModel();
        
        // Load emoji data
        this.loadEmojis();
    }

    async loadToxicityModel() {
        try {
            // Threshold for toxicity detection (0.9 = 90% confident)
            const threshold = 0.9;
            this.toxicityModel = await toxicity.load(threshold);
            console.log("Toxicity model loaded successfully");
        } catch (error) {
            console.error("Error loading toxicity model:", error);
        }
    }

    setupEventListeners() {
        // Tab switching
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e));
        });

        // Send message on button click or Enter key
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Emoji picker
        this.emojiBtn.addEventListener('click', () => this.toggleEmojiPicker());
        document.addEventListener('click', (e) => {
            if (!this.emojiPicker.contains(e.target) && e.target !== this.emojiBtn) {
                this.emojiPicker.classList.add('hidden');
            }
        });

        // Voice input (placeholder for now)
        this.voiceInputBtn.addEventListener('click', () => {
            this.showSystemMessage("Voice input is not yet implemented");
        });

        // Chat minimize/expand
        this.chatMinimizeBtn.addEventListener('click', () => this.toggleMinimize());
        this.chatExpandBtn.addEventListener('click', () => this.toggleExpand());
    }

    switchTab(e) {
        const tab = e.currentTarget;
        const tabId = tab.getAttribute('data-tab');
        
        // Update active tab styling
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        this.currentTab = tabId;
        // In a real implementation, you would fetch messages for this tab
        this.showSystemMessage(`Switched to ${tabId} chat`);
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Check for toxicity
        const isToxic = await this.checkMessageToxicity(message);
        
        if (isToxic) {
            this.showSystemMessage("Your message was flagged as potentially harmful and wasn't sent. Please review our community guidelines.");
            // Optional: report to moderation
            this.reportToModeration(message);
        } else {
            // Add message to chat
            this.addMessage('current-user', message);
            
            // Clear input
            this.chatInput.value = '';
            
            // In a real app, you would send to server here
        }
    }

    async checkMessageToxicity(message) {
        if (!this.toxicityModel) return false;

        try {
            const predictions = await this.toxicityModel.classify([message]);
            
            // Check if any toxicity category was matched
            return predictions.some(prediction => prediction.results[0].match);
        } catch (error) {
            console.error("Error checking message toxicity:", error);
            return false;
        }
    }

    reportToModeration(message) {
        // In a real implementation, this would send to your moderation system
        console.log("Reported message to moderation:", message);
    }

    addMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        
        const senderSpan = document.createElement('span');
        senderSpan.className = 'message-sender';
        senderSpan.textContent = sender === 'current-user' ? 'You:' : `${sender}:`;
        
        const contentSpan = document.createElement('span');
        contentSpan.className = 'message-content';
        contentSpan.textContent = message;
        
        messageDiv.appendChild(senderSpan);
        messageDiv.appendChild(contentSpan);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showSystemMessage(message) {
        const systemMsg = document.createElement('div');
        systemMsg.className = 'system-message';
        systemMsg.textContent = message;
        
        this.chatMessages.appendChild(systemMsg);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    toggleEmojiPicker() {
        this.emojiPicker.classList.toggle('hidden');
    }

    loadEmojis() {
        // This would be replaced with actual emoji data in a real implementation
        const emojiCategories = {
            smileys: ['😀', '😂', '😊', '😍', '🤔', '😴', '🥳'],
            people: ['👋', '👍', '👎', '✋', '🤝', '🙏', '💪'],
            animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻'],
            food: ['🍎', '🍕', '🍔', '🥗', '🍰', '🍫', '🍵'],
            activities: ['⚽', '🏀', '🎮', '🎲', '🎯', '🎸', '🎨'],
            travel: ['🚗', '✈️', '🚀', '⛵', '🚲', '🚂', '🏍️'],
            objects: ['💡', '⌚', '📱', '💻', '📷', '🔑', '🎁'],
            symbols: ['❤️', '✨', '🌟', '💯', '❓', '❗', '✅'],
            flags: ['🏳️‍🌈', '🇮🇳', '🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇯🇵']
        };

        // Populate emoji list based on first category
        this.populateEmojiList('smileys');
        
        // Add category switchers
        this.emojiCategories.forEach(categoryBtn => {
            categoryBtn.addEventListener('click', () => {
                const category = categoryBtn.getAttribute('data-category');
                this.emojiCategories.forEach(btn => btn.classList.remove('active'));
                categoryBtn.classList.add('active');
                this.populateEmojiList(category);
            });
        });
    }

    populateEmojiList(category) {
        // Simplified for example - in reality you'd use real emoji data
        this.emojiList.innerHTML = '';
        
        // Sample emojis for the selected category
        const sampleEmojis = {
            smileys: ['😀', '😂', '😊', '😍', '🤔', '😴', '🥳'],
            people: ['👋', '👍', '👎', '✋', '🤝', '🙏', '💪']
        }[category] || ['⭐', '⭐', '⭐', '⭐', '⭐', '⭐', '⭐'];
        
        sampleEmojis.forEach(emoji => {
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'emoji-option';
            emojiSpan.textContent = emoji;
            emojiSpan.addEventListener('click', () => {
                this.chatInput.value += emoji;
                this.chatInput.focus();
            });
            this.emojiList.appendChild(emojiSpan);
        });
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        if (this.isMinimized) {
            this.chatContainer.classList.add('minimized');
            this.chatMinimizeBtn.innerHTML = '<i class="fas fa-plus"></i>';
        } else {
            this.chatContainer.classList.remove('minimized');
            this.chatMinimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
        }
    }

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
            this.chatContainer.classList.add('expanded');
            this.chatExpandBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            this.chatContainer.classList.remove('expanded');
            this.chatExpandBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }
}

// Initialize the chat system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatSystem = new ChatSystem();
    
    // For demonstration - simulate incoming messages
    setInterval(() => {
        const users = ['Moderator', 'HappyUser', 'NewComer', 'TechFan', 'ArtLover'];
        const messages = [
            "Welcome to our inclusive community!",
            "Anyone joining the workshop later?",
            "How do I customize my avatar?",
            "The new accessibility features are amazing!",
            "Let's meet in the meditation space"
        ];
        if (Math.random() > 0.7) {
            const user = users[Math.floor(Math.random() * users.length)];
            const message = messages[Math.floor(Math.random() * messages.length)];
            chatSystem.addMessage(user, message);
        }
    }, 8000);
});

// Accessibility features for chat
function setupAccessibilityChat() {
    // Make chat messages readable by screen readers
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.setAttribute('aria-live', 'polite');
    chatMessages.setAttribute('role', 'log');
    
    // Keyboard navigation for emoji picker
    const emojiOptions = document.querySelectorAll('.emoji-option');
    emojiOptions.forEach(option => {
        option.setAttribute('tabindex', '0');
        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.target.click();
                e.preventDefault();
            }
        });
    });
    
    // High contrast mode for chat
    document.getElementById('high-contrast').addEventListener('click', () => {
        document.getElementById('chat-container').classList.toggle('high-contrast');
    });
}

document.addEventListener('DOMContentLoaded', setupAccessibilityChat);
