// Metaverse Core Functionality
class MetaverseEngine {
  constructor() {
    this.scene = new THREE.Scene();
    this.users = new Map();
    this.currentUser = null;
    this.activeSpace = 'general';
    this.spaces = {
      'general': { name: 'General Hub', objects: [], users: [] },
      'lgbtq': { name: 'LGBTQ+ Space', objects: [], users: [] },
      'disability': { name: 'Accessibility Community', objects: [], users: [] },
      'cultural': { name: 'Cultural Exchange', objects: [], users: [] },
      'workshop': { name: 'Diversity Workshops', objects: [], users: [] },
      'meditation': { name: 'Meditation Garden', objects: [], users: [] },
      'gaming': { name: 'Inclusive Gaming', objects: [], users: [] },
      'art': { name: 'Creative Arts Studio', objects: [], users: [] }
    };
    this.initRenderer();
    this.initCamera();
    this.initControls();
    this.initWorld();
    this.initNetwork();
    this.setupEventListeners();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('metaverse-canvas'),
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.6, 5);
    this.scene.add(this.camera);
  }

  initControls() {
    // For movement controls
    this.moveState = {
      up: false,
      down: false,
      left: false,
      right: false,
      jump: false
    };

    // Keyboard controls
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // Touch controls for mobile
    this.initTouchControls();
  }

  initTouchControls() {
    const controls = [
      { id: 'move-forward', key: 'up' },
      { id: 'move-left', key: 'left' },
      { id: 'move-right', key: 'right' },
      { id: 'move-backward', key: 'down' },
      { id: 'jump', key: 'jump' }
    ];

    controls.forEach(control => {
      const element = document.getElementById(control.id);
      element.addEventListener('touchstart', () => this.moveState[control.key] = true);
      element.addEventListener('touchend', () => this.moveState[control.key] = false);
      element.addEventListener('mousedown', () => this.moveState[control.key] = true);
      element.addEventListener('mouseup', () => this.moveState[control.key] = false);
    });
  }

  handleKeyDown(e) {
    switch(e.key) {
      case 'w':
      case 'ArrowUp':
        this.moveState.up = true;
        break;
      case 's':
      case 'ArrowDown':
        this.moveState.down = true;
        break;
      case 'a':
      case 'ArrowLeft':
        this.moveState.left = true;
        break;
      case 'd':
      case 'ArrowRight':
        this.moveState.right = true;
        break;
      case ' ':
        this.moveState.jump = true;
        break;
    }
  }

  handleKeyUp(e) {
    switch(e.key) {
      case 'w':
      case 'ArrowUp':
        this.moveState.up = false;
        break;
      case 's':
      case 'ArrowDown':
        this.moveState.down = false;
        break;
      case 'a':
      case 'ArrowLeft':
        this.moveState.left = false;
        break;
      case 'd':
      case 'ArrowRight':
        this.moveState.right = false;
        break;
      case ' ':
        this.moveState.jump = false;
        break;
    }
  }

  initWorld() {
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xdddddd,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Skybox
    const skyboxGeometry = new THREE.SphereGeometry(500, 60, 40);
    const skyboxMaterial = new THREE.MeshBasicMaterial({
      color: 0x87CEEB,
      side: THREE.BackSide
    });
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    this.scene.add(skybox);

    // Initialize space-specific objects
    this.initSpaces();
  }

  initSpaces() {
    // Each space can have its own unique environment
    this.spaces['general'].objects = this.createHubEnvironment();
    this.spaces['lgbtq'].objects = this.createLGBTQEnvironment();
    this.spaces['disability'].objects = this.createAccessibilityEnvironment();
    this.spaces['cultural'].objects = this.createCulturalEnvironment();
    this.spaces['workshop'].objects = this.createWorkshopEnvironment();
    this.spaces['meditation'].objects = this.createMeditationEnvironment();
    this.spaces['gaming'].objects = this.createGamingEnvironment();
    this.spaces['art'].objects = this.createArtEnvironment();

    // Add all objects of the current space to the scene
    this.updateSceneForCurrentSpace();
  }

  createHubEnvironment() {
    const objects = [];
    // Create central meeting area
    const centralArea = new THREE.Group();
    
    // Circular seating
    const geometry = new THREE.TorusGeometry(5, 0.5, 16, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0x4a86e8 });
    const torus = new THREE.Mesh(geometry, material);
    torus.rotation.x = Math.PI / 2;
    torus.position.y = 0.5;
    centralArea.add(torus);
    
    objects.push(centralArea);
    return objects;
  }

  createLGBTQEnvironment() {
    const objects = [];
    // Rainbow-themed elements
    const rainbow = new THREE.Group();
    
    // Rainbow arc
    const colors = [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x9400d3];
    colors.forEach((color, i) => {
      const arcGeometry = new THREE.TorusGeometry(10 - i, 0.3, 16, 100, Math.PI);
      const arcMaterial = new THREE.MeshStandardMaterial({ color });
      const arc = new THREE.Mesh(arcGeometry, arcMaterial);
      arc.rotation.x = Math.PI / 2;
      arc.rotation.z = Math.PI;
      arc.position.y = 0.5;
      rainbow.add(arc);
    });
    
    objects.push(rainbow);
    return objects;
  }

  // Other space creation methods would follow similar patterns

  updateSceneForCurrentSpace() {
    // Clear previous space objects
    this.spaces[this.prevSpace]?.objects.forEach(obj => {
      this.scene.remove(obj);
    });

    // Add new space objects
    this.spaces[this.activeSpace].objects.forEach(obj => {
      this.scene.add(obj);
    });

    this.prevSpace = this.activeSpace;
  }

  initNetwork() {
    // Simulate network connection to other users
    this.socket = io.connect('https://metaverse-server.inclusive');

    this.socket.on('connect', () => {
      console.log('Connected to metaverse server');
      this.initializeCurrentUser();
    });

    this.socket.on('userJoined', (user) => {
      this.addUser(user);
    });

    this.socket.on('userLeft', (userId) => {
      this.removeUser(userId);
    });

    this.socket.on('userMoved', (userData) => {
      this.updateUserPosition(userData);
    });
  }

  initializeCurrentUser() {
    // Get user data from local storage or create new
    const userData = this.getUserData() || this.createNewUser();
    this.currentUser = userData;
    
    // Emit to server that we've joined
    this.socket.emit('join', {
      userId: userData.userId,
      username: userData.username,
      avatar: userData.avatar,
      space: this.activeSpace
    });
  }

  getUserData() {
    // Get from localStorage
    const storedUser = localStorage.getItem('metaverseUser');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  }

  createNewUser() {
    const newUser = {
      userId: this.generateUserId(),
      username: 'Guest_' + Math.floor(Math.random() * 10000),
      avatar: this.createDefaultAvatar(),
      position: { x: 0, y: 0, z: 0 },
      rotation: 0,
      space: 'general'
    };
    localStorage.setItem('metaverseUser', JSON.stringify(newUser));
    return newUser;
  }

  generateUserId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  createDefaultAvatar() {
    // Simple avatar representation
    return {
      bodyType: 'default',
      skinTone: '#e0c8b0',
      hairStyle: 'short',
      hairColor: '#4a3000',
      clothing: 'casual',
      accessories: []
    };
  }

  addUser(userData) {
    if (this.users.has(userData.userId) || userData.userId === this.currentUser.userId) return;

    // Create a 3D representation of the user
    const userAvatar = this.createAvatarMesh(userData.avatar);
    userAvatar.position.set(userData.position.x, userData.position.y, userData.position.z);
    userAvatar.rotation.y = userData.rotation;
    
    // Store reference
    this.users.set(userData.userId, {
      data: userData,
      mesh: userAvatar
    });
    
    // Add to scene
    this.scene.add(userAvatar);
  }

  removeUser(userId) {
    if (!this.users.has(userId)) return;
    
    const user = this.users.get(userId);
    this.scene.remove(user.mesh);
    this.users.delete(userId);
  }

  updateUserPosition(userData) {
    if (!this.users.has(userData.userId)) return;
    
    const user = this.users.get(userData.userId);
    user.mesh.position.set(userData.position.x, userData.position.y, userData.position.z);
    user.mesh.rotation.y = userData.rotation;
  }

  createAvatarMesh(avatarData) {
    // Create a more sophisticated avatar based on the avatar data
    const group = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.5, 1, 0.3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(avatarData.skinTone),
      roughness: 0.7,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    group.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(avatarData.skinTone),
      roughness: 0.5
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.7;
    group.add(head);
    
    return group;
  }

  setupEventListeners() {
    // Space switching
    document.querySelectorAll('#spaces-panel li').forEach(item => {
      item.addEventListener('click', () => {
        const space = item.getAttribute('data-space');
        this.switchSpace(space);
      });
    });

    // Join Community button
    document.getElementById('join-now-btn').addEventListener('click', () => {
      this.showAuthModal();
    });

    // Window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  switchSpace(spaceId) {
    if (this.activeSpace === spaceId || !this.spaces[spaceId]) return;
    
    this.activeSpace = spaceId;
    this.updateSceneForCurrentSpace();
    
    // Notify server of space change
    this.socket.emit('switchSpace', {
      userId: this.currentUser.userId,
      space: spaceId
    });
    
    // Update UI
    document.querySelectorAll('#spaces-panel li').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-space') === spaceId);
    });
  }

  showAuthModal() {
    document.getElementById('auth-container').style.display = 'block';
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Main animation loop
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Update user movement
    this.updateUserMovement();
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  updateUserMovement() {
    if (!this.currentUser) return;
    
    const moveSpeed = 0.1;
    const rotSpeed = 0.05;
    const positionUpdate = {
      x: this.currentUser.position.x,
      y: this.currentUser.position.y,
      z: this.currentUser.position.z,
      rot: this.currentUser.rotation
    };
    
    if (this.moveState.up) {
      positionUpdate.z -= moveSpeed * Math.cos(this.currentUser.rotation);
      positionUpdate.x -= moveSpeed * Math.sin(this.currentUser.rotation);
    }
    if (this.moveState.down) {
      positionUpdate.z += moveSpeed * Math.cos(this.currentUser.rotation);
      positionUpdate.x += moveSpeed * Math.sin(this.currentUser.rotation);
    }
    if (this.moveState.left) {
      positionUpdate.rotation += rotSpeed;
    }
    if (this.moveState.right) {
      positionUpdate.rotation -= rotSpeed;
    }
    if (this.moveState.jump && Math.abs(positionUpdate.y) < 0.1) {
      positionUpdate.y = 0.5; // Simple jump
    } else {
      // Gravity
      positionUpdate.y = Math.max(0, positionUpdate.y - 0.05);
    }
    
    // Update position
    this.currentUser.position = {
      x: positionUpdate.x,
      y: positionUpdate.y,
      z: positionUpdate.z
    };
    this.currentUser.rotation = positionUpdate.rot;
    
    // Update camera to follow user
    this.camera.position.set(
      this.currentUser.position.x,
      this.currentUser.position.y + 1.6,
      this.currentUser.position.z + 5
    );
    this.camera.lookAt(
      this.currentUser.position.x,
      this.currentUser.position.y + 1.6,
      this.currentUser.position.z
    );
    
    // Notify server of movement
    this.socket.emit('move', {
      userId: this.currentUser.userId,
      position: this.currentUser.position,
      rotation: this.currentUser.rotation,
      space: this.activeSpace
    });
  }
}

// Initialize the metaverse when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const metaverse = new MetaverseEngine();
  metaverse.animate();
  
  // Make metaverse instance globally available for other scripts
  window.metaverse = metaverse;
});

// Helper functions for metaverse interactions
function handleChatMessage(message) {
  // Process chat message through toxicity filter
  checkMessageToxicity(message).then(isToxic => {
    if (!isToxic) {
      // Display message in chat UI if not toxic
      displayChatMessage(message);
    } else {
      // Notify user about moderation
      displaySystemMessage('Your message was flagged as potentially harmful and was not sent.');
    }
  });
}

function displayChatMessage(message) {
  const chatContainer = document.getElementById('chat-messages');
  const messageElement = document.createElement('div');
  messageElement.className = 'chat-message';
  messageElement.innerHTML = `
    <span class="message-sender">${message.sender}:</span>
    <span class="message-content">${message.content}</span>
  `;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function displaySystemMessage(content) {
  const chatContainer = document.getElementById('chat-messages');
  const messageElement = document.createElement('div');
  messageElement.className = 'system-message';
  messageElement.textContent = content;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Accessibility features
function setupAccessibilityControls() {
  // Text size adjustment
  document.getElementById('text-size-increase').addEventListener('click', () => {
    document.body.style.fontSize = `${Math.min(24, parseInt(getComputedStyle(document.body).fontSize) + 2)}px`;
  });
  
  document.getElementById('text-size-decrease').addEventListener('click', () => {
    document.body.style.fontSize = `${Math.max(12, parseInt(getComputedStyle(document.body).fontSize) - 2)}px`;
  });
  
  // High contrast mode
  document.getElementById('high-contrast').addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
    localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
  });
  
  // Colorblind mode
  document.getElementById('colorblind-mode').addEventListener('click', () => {
    document.body.classList.toggle('colorblind');
    localStorage.setItem('colorblindMode', document.body.classList.contains('colorblind'));
  });
  
  // Reduce motion
  document.getElementById('reduce-motion').addEventListener('click', () => {
    document.body.classList.toggle('reduce-motion');
    localStorage.setItem('reduceMotion', document.body.classList.contains('reduce-motion'));
  });
  
  // Load saved settings
  if (localStorage.getItem('highContrast') === 'true') {
    document.body.classList.add('high-contrast');
  }
  if (localStorage.getItem('colorblindMode') === 'true') {
    document.body.classList.add('colorblind');
  }
  if (localStorage.getItem('reduceMotion') === 'true') {
    document.body.classList.add('reduce-motion');
  }
}

// Initialize when ready
if (document.readyState === 'complete') {
  setupAccessibilityControls();
} else {
  document.addEventListener('DOMContentLoaded', setupAccessibilityControls);
}
