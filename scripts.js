

/* Main application */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js for 3D metaverse environment
    initMetaverse();
    
    // Set up accessibility features
    initAccessibility();
    
    // Initialize moderation system
    initModeration();
    
    // Set up avatar creation system
    initAvatarSystem();
    
    // Initialize community spaces
    initCommunitySpaces();
    
    // Set up multilingual support
    initLanguageSupport();
});

// Initialize 3D metaverse environment with Three.js
function initMetaverse() {
    const canvas = document.getElementById('metaverse-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB); // Sky blue background
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);
    
    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x7CFC00,
        roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    scene.add(ground);
    
    // Position camera
    camera.position.set(0, 1.6, 5); // Average human height
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize accessibility features
function initAccessibility() {
    // Text size controls
    document.getElementById('text-size-increase').addEventListener('click', () => {
        const currentSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--font-size'));
        document.documentElement.style.setProperty('--font-size', (currentSize + 2) + 'px');
    });
    
    document.getElementById('text-size-decrease').addEventListener('click', () => {
        const currentSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--font-size'));
        document.documentElement.style.setProperty('--font-size', (currentSize - 2) + 'px');
    });
    
    // High contrast mode
    document.getElementById('high-contrast').addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });
    
    // Colorblind mode
    document.getElementById('colorblind-mode').addEventListener('click', () => {
        document.body.classList.toggle('colorblind');
    });
    
    // Text to speech
    document.getElementById('text-to-speech').addEventListener('click', () => {
        const messages = document.getElementById('chat-messages').textContent;
        const speech = new SpeechSynthesisUtterance(messages);
        window.speechSynthesis.speak(speech);
    });
    
    // Voice input for chat
    document.getElementById('voice-input').addEventListener('click', () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.lang = document.getElementById('language-selector').value;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chat-input').value = transcript;
            };

            recognition.start();
        } else {
            alert('Speech recognition is not supported in your browser.');
        }
    });
}

// Initialize moderation system
function initModeration() {
    // AI-powered content moderation (simulated)
    function moderateContent(content) {
        const problematicTerms = [
            'slur', 'hate', 'racist', 'sexist', 'homophobic', 'transphobic', 'ableist'
        ];
        
        let isFlagged = false;
        problematicTerms.forEach(term => {
            if (content.toLowerCase().includes(term)) {
                isFlagged = true;
            }
        });
        
        return {
            isFlagged,
            moderatedContent: isFlagged ? '[This message has been flagged for review]' : content
        };
    }
    
    document.getElementById('send-btn').addEventListener('click', () => {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (message) {
            const moderation = moderateContent(message);
            const messageElement = document.createElement('div');
            messageElement.className = 'chat-message';
            
            if (moderation.isFlagged) {
                messageElement.classList.add('flagged');
            }
            
            messageElement.textContent = `You: ${moderation.moderatedContent}`;
            document.getElementById('chat-messages').appendChild(messageElement);
            chatInput.value = '';
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });
    
    document.getElementById('report-btn').addEventListener('click', () => {
        const reportDialog = document.createElement('div');
        reportDialog.className = 'modal';
        reportDialog.style.display = 'flex';
        
        reportDialog.innerHTML = `
            <div class="modal-content">
                <h3>Report a Concern</h3>
                <select id="report-type">
                    <option value="harassment">Harassment</option>
                    <option value="hate-speech">Hate Speech</option>
                    <option value="inappropriate">Inappropriate Content</option>
                    <option value="other">Other</option>
                </select>
                <textarea id="report-details" placeholder="Please provide details..."></textarea>
                <div class="button-group">
                    <button id="submit-report">Submit</button>
                    <button id="cancel-report">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(reportDialog);
        
        document.getElementById('cancel-report').addEventListener('click', () => {
            document.body.removeChild(reportDialog);
        });
        
        document.getElementById('submit-report').addEventListener('click', () => {
            alert('Thank you for your report. Our moderation team will review it promptly.');
            document.body.removeChild(reportDialog);
        });
    });
}

// Initialize avatar creation system
function initAvatarSystem() {
    function openAvatarCreator() {
        const avatarCreator = document.createElement('div');
        avatarCreator.className = 'modal';
        avatarCreator.style.display = 'flex';
        
        avatarCreator.innerHTML = `
            <div class="modal-content avatar-creator">
                <h3>Create Your Inclusive Avatar</h3>
                <div class="avatar-section">
                    <h4>Body Type</h4>
                    <div class="option-group">
                        <button class="avatar-option">Type 1</button>
                        <button class="avatar-option">Type 2</button>
                        <button class="avatar-option">Type 3</button>
                        <button class="avatar-option">Type 4</button>
                        <button class="avatar-option">Custom</button>
                    </div>
                </div>
                <div class="avatar-section">
                    <h4>Mobility Aids (Optional)</h4>
                    <div class="option-group">
                        <button class="avatar-option">None</button>
                        <button class="avatar-option">Wheelchair</button>
                        <button class="avatar-option">Cane</button>
                        <button class="avatar-option">Prosthetic</button>
                    </div>
                </div>
                <div class="avatar-section">
                    <h4>Cultural Elements</h4>
                    <div class="option-group">
                        <button class="avatar-option">Traditional Clothing</button>
                        <button class="avatar-option">Religious Symbols</button>
                        <button class="avatar-option">Cultural Hairstyles</button>
                    </div>
                </div>
                <div class="avatar-section">
                    <h4>Gender Expression</h4>
                    <div class="option-group">
                        <input type="range" min="0" max="100" value="50" id="gender-slider">
                        <label for="gender-slider">Fluid Expression</label>
                    </div>
                </div>
                <div class="button-group">
                    <button id="save-avatar">Save Avatar</button>
                    <button id="cancel-avatar">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(avatarCreator);
        
        document.getElementById('cancel-avatar').addEventListener('click', () => {
            document.body.removeChild(avatarCreator);
        });
        
        document.getElementById('save-avatar').addEventListener('click', () => {
            alert('Avatar saved! You can now represent yourself authentically in our metaverse.');
            document.body.removeChild(avatarCreator);
        });
    }
    
    const avatarButton = document.createElement('button');
    avatarButton.textContent = 'Create Avatar';
    avatarButton.style.position = 'fixed';
    avatarButton.style.top = '70px';
    avatarButton.style.right = '10px';
    avatarButton.style.zIndex = '100';
    avatarButton.style.padding = '8px 15px';
    avatarButton.style.background = '#4a90e2';
    avatarButton.style.color = 'white';
    avatarButton.style.border = 'none';
    avatarButton.style.borderRadius = '4px';
    avatarButton.style.cursor = 'pointer';
    
    avatarButton.addEventListener('click', openAvatarCreator);
    document.body.appendChild(avatarButton);
}

// Initialize community spaces
function initCommunitySpaces() {
    const spaces = document.querySelectorAll('#spaces-panel li');
    
    spaces.forEach(space => {
        space.addEventListener('click', () => {
            const spaceType = space.getAttribute('data-space');
            alert(`Entering ${space.textContent} space. In a full implementation, this would load a new environment designed specifically for this community.`);
            spaces.forEach(s => s.style.fontWeight = 'normal');
            space.style.fontWeight = 'bold';
        });
    });
}

// Initialize language support
function initLanguageSupport() {
    const languageSelector = document.getElementById('language-selector');
    
    languageSelector.addEventListener('change', () => {
        const selectedLanguage = languageSelector.value;
        alert(`Language changed to ${languageSelector.options[languageSelector.selectedIndex].text}. In a full implementation, all UI text would update.`);
    });
}
