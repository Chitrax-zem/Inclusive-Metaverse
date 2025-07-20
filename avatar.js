// Avatar.js - Avatar Creation and Management System

// Global Avatar State
let currentAvatar = {
    bodyType: 'body-1',
    height: 50,
    build: 50,
    skinTone: '#e0c8b0',
    facialFeatures: 'face-1',
    hairstyle: 'hair-1',
    hairColor: '#4a3000',
    clothing: 'clothing-1',
    clothingPrimaryColor: '#3a81e6',
    clothingSecondaryColor: '#ffffff',
    mobilityAid: 'mobility-none',
    culturalElements: 'cultural-none',
    accessories: 'acc-none',
    pronouns: ''
};

// Three.js Avatar Components
let avatarScene, avatarCamera, avatarRenderer, avatarModel;
let avatarRotation = 0;

// Initialize Avatar Creator
function initAvatarCreator() {
    const container = document.getElementById('avatar-model-container');
    
    // Set up Three.js scene
    avatarScene = new THREE.Scene();
    avatarCamera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    avatarRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    avatarRenderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(avatarRenderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    avatarScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1.5);
    avatarScene.add(directionalLight);
    
    // Set camera position
    avatarCamera.position.z = 5;
    
    // Load default avatar
    loadAvatarModel();
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (avatarModel) {
            avatarModel.rotation.y = avatarRotation;
        }
        
        avatarRenderer.render(avatarScene, avatarCamera);
    }
    animate();
    
    // Set up event listeners for avatar controls
    document.getElementById('rotate-left').addEventListener('click', () => avatarRotation += 0.1);
    document.getElementById('rotate-right').addEventListener('click', () => avatarRotation -= 0.1);
    document.getElementById('zoom-in').addEventListener('click', () => avatarCamera.position.z -= 0.5);
    document.getElementById('zoom-out').addEventListener('click', () => avatarCamera.position.z += 0.5);
    
    // Set up event listeners for avatar options
    setupAvatarOptions();
}

// Load or create the basic avatar model
function loadAvatarModel() {
    // Clear previous model if exists
    if (avatarModel) {
        avatarScene.remove(avatarModel);
    }
    
    // Create a simple avatar model (in a real implementation, this would use more complex 3D models)
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.5);
    const limbGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 16);
    const handGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    
    // Position body parts
    const head = new THREE.Mesh(headGeometry, new THREE.MeshPhongMaterial({ color: currentAvatar.skinTone }));
    head.position.y = 1.8;
    
    const body = new THREE.Mesh(bodyGeometry, new THREE.MeshPhongMaterial({ 
        color: currentAvatar.clothingPrimaryColor 
    }));
    body.position.y = 0.75;
    
    const leftArm = new THREE.Mesh(limbGeometry, new THREE.MeshPhongMaterial({ color: currentAvatar.skinTone }));
    leftArm.position.set(-0.8, 0.75, 0);
    leftArm.rotation.z = Math.PI / 2;
    
    const rightArm = new THREE.Mesh(limbGeometry, new THREE.MeshPhongMaterial({ color: currentAvatar.skinTone }));
    rightArm.position.set(0.8, 0.75, 0);
    rightArm.rotation.z = Math.PI / 2;
    
    const leftLeg = new THREE.Mesh(limbGeometry, new THREE.MeshPhongMaterial({ color: '#4a3000' }));
    leftLeg.position.set(-0.3, -1, 0);
    
    const rightLeg = new THREE.Mesh(limbGeometry, new THREE.MeshPhongMaterial({ color: '#4a3000' }));
    rightLeg.position.set(0.3, -1, 0);
    
    const leftHand = new THREE.Mesh(handGeometry, new THREE.MeshPhongMaterial({ color: currentAvatar.skinTone }));
    leftHand.position.set(-1.5, 0.75, 0);
    
    const rightHand = new THREE.Mesh(handGeometry, new THREE.MeshPhongMaterial({ color: currentAvatar.skinTone }));
    rightHand.position.set(1.5, 0.75, 0);
    
    // Group all parts together
    avatarModel = new THREE.Group();
    avatarModel.add(head);
    avatarModel.add(body);
    avatarModel.add(leftArm);
    avatarModel.add(rightArm);
    avatarModel.add(leftLeg);
    avatarModel.add(rightLeg);
    avatarModel.add(leftHand);
    avatarModel.add(rightHand);
    
    // Add to scene
    avatarScene.add(avatarModel);
}

// Set up event listeners for all avatar customization options
function setupAvatarOptions() {
    // Body type selection
    document.querySelectorAll('[data-option^="body-"]').forEach(option => {
        option.addEventListener('click', function() {
            const bodyType = this.getAttribute('data-option');
            currentAvatar.bodyType = bodyType;
            
            if (bodyType === 'body-custom') {
                document.getElementById('body-custom-controls').classList.remove('hidden');
                // Apply custom values
                currentAvatar.height = document.getElementById('height-slider').value;
                currentAvatar.build = document.getElementById('build-slider').value;
            } else {
                document.getElementById('body-custom-controls').classList.add('hidden');
            }
            
            updateAvatarModel();
        });
    });
    
    // Height and build sliders
    document.getElementById('height-slider').addEventListener('input', function() {
        currentAvatar.height = this.value;
        updateAvatarModel();
    });
    
    document.getElementById('build-slider').addEventListener('input', function() {
        currentAvatar.build = this.value;
        updateAvatarModel();
    });
    
    // Skin tone picker
    document.getElementById('skin-tone-picker').addEventListener('input', function() {
        currentAvatar.skinTone = this.value;
        updateAvatarModel();
    });
    
    // Preset skin tone buttons
    document.querySelectorAll('.color-preset').forEach(preset => {
        preset.addEventListener('click', function() {
            const color = this.style.backgroundColor;
            currentAvatar.skinTone = color;
            document.getElementById('skin-tone-picker').value = rgbToHex(color);
            updateAvatarModel();
        });
    });
    
    // Facial features
    document.querySelectorAll('[data-option^="face-"]').forEach(option => {
        option.addEventListener('click', function() {
            currentAvatar.facialFeatures = this.getAttribute('data-option');
            updateAvatarModel();
        });
    });
    
    // Hairstyle
    document.querySelectorAll('[data-option^="hair-"]').forEach(option => {
        option.addEventListener('click', function() {
            currentAvatar.hairstyle = this.getAttribute('data-option');
            updateAvatarModel();
        });
    });
    
    // Hair color
    document.getElementById('hair-color-picker').addEventListener('input', function() {
        currentAvatar.hairColor = this.value;
        updateAvatarModel();
    });
    
    // Clothing
    document.querySelectorAll('[data-option^="clothing-"]').forEach(option => {
        option.addEventListener('click', function() {
            currentAvatar.clothing = this.getAttribute('data-option');
            updateAvatarModel();
        });
    });
    
    // Clothing colors
    document.getElementById('clothing-primary-color').addEventListener('input', function() {
        currentAvatar.clothingPrimaryColor = this.value;
        updateAvatarModel();
    });
    
    document.getElementById('clothing-secondary-color').addEventListener('input', function() {
        currentAvatar.clothingSecondaryColor = this.value;
        updateAvatarModel();
    });
    
    // Mobility aids
    document.querySelectorAll('[data-option^="mobility-"]').forEach(option => {
        option.addEventListener('click', function() {
            currentAvatar.mobilityAid = this.getAttribute('data-option');
            updateAvatarModel();
        });
    });
    
    // Cultural elements
    document.querySelectorAll('[data-option^="cultural-"]').forEach(option => {
        option.addEventListener('click', function() {
            currentAvatar.culturalElements = this.getAttribute('data-option');
            updateAvatarModel();
        });
    });
    
    // Accessories
    document.querySelectorAll('[data-option^="acc-"]').forEach(option => {
        option.addEventListener('click', function() {
            currentAvatar.accessories = this.getAttribute('data-option');
            updateAvatarModel();
        });
    });
    
    // Pronouns
    const pronounSelect = document.getElementById('pronouns');
    const customPronounInput = document.getElementById('custom-pronouns');
    
    pronounSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customPronounInput.classList.remove('hidden');
            currentAvatar.pronouns = customPronounInput.value;
        } else {
            customPronounInput.classList.add('hidden');
            currentAvatar.pronouns = this.value;
        }
    });
    
    customPronounInput.addEventListener('input', function() {
        currentAvatar.pronouns = this.value;
    });
}

// Update the avatar model based on current settings
function updateAvatarModel() {
    // In a full implementation, this would update the 3D model with all current settings
    // For this example, we'll just reload the basic model with updated colors
    
    loadAvatarModel();
}

// Randomize all avatar options
function randomizeAvatar() {
    // Body type
    const bodyTypes = ['body-1', 'body-2', 'body-3', 'body-4'];
    currentAvatar.bodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
    
    // Height and build
    currentAvatar.height = Math.floor(Math.random() * 101);
    currentAvatar.build = Math.floor(Math.random() * 101);
    
    // Skin tone - generate random hex color
    currentAvatar.skinTone = '#' + Math.floor(Math.random()*16777215).toString(16);
    
    // Facial features
    const faceTypes = ['face-1', 'face-2', 'face-3', 'face-4', 'face-5'];
    currentAvatar.facialFeatures = faceTypes[Math.floor(Math.random() * faceTypes.length)];
    
    // Hairstyle and color
    const hairStyles = ['hair-1', 'hair-2', 'hair-3', 'hair-4', 'hair-5', 'hair-6', 'hair-7', 'hair-8'];
    currentAvatar.hairstyle = hairStyles[Math.floor(Math.random() * hairStyles.length)];
    currentAvatar.hairColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    
    // Clothing and colors
    const clothingStyles = ['clothing-1', 'clothing-2', 'clothing-3', 'clothing-4', 'clothing-5'];
    currentAvatar.clothing = clothingStyles[Math.floor(Math.random() * clothingStyles.length)];
    currentAvatar.clothingPrimaryColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    currentAvatar.clothingSecondaryColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    
    // Mobility aids
    const mobilityOptions = ['mobility-none', 'mobility-wheelchair', 'mobility-cane', 'mobility-crutches', 'mobility-prosthetic-arm', 'mobility-prosthetic-leg'];
    currentAvatar.mobilityAid = mobilityOptions[Math.floor(Math.random() * mobilityOptions.length)];
    
    // Cultural elements
    const culturalOptions = [
        'cultural-none', 'cultural-bindi', 'cultural-turban', 
        'cultural-hijab', 'cultural-kippah', 'cultural-saree', 
        'cultural-dhoti'
    ];
    currentAvatar.culturalElements = culturalOptions[Math.floor(Math.random() * culturalOptions.length)];
    
    // Accessories
    const accessoryOptions = ['acc-none', 'acc-glasses', 'acc-sunglasses', 'acc-hearing-aid', 'acc-jewelry', 'acc-hat'];
    currentAvatar.accessories = accessoryOptions[Math.floor(Math.random() * accessoryOptions.length)];
    
    // Pronouns
    const pronounOptions = ['', 'he/him', 'she/her', 'they/them'];
    currentAvatar.pronouns = pronounOptions[Math.floor(Math.random() * pronounOptions.length)];
    
    // Update UI to match randomized selections
    updateUIFromCurrentAvatar();
    updateAvatarModel();
}

// Update UI controls to match current avatar settings
function updateUIFromCurrentAvatar() {
    // Body type
    document.querySelector(`[data-option="${currentAvatar.bodyType}"]`).click();
    
    // Height and build sliders
    document.getElementById('height-slider').value = currentAvatar.height;
    document.getElementById('build-slider').value = currentAvatar.build;
    
    // Skin tone
    document.getElementById('skin-tone-picker').value = currentAvatar.skinTone;
    
    // Facial features
    document.querySelector(`[data-option="${currentAvatar.facialFeatures}"]`).click();
    
    // Hairstyle and color
    document.querySelector(`[data-option="${currentAvatar.hairstyle}"]`).click();
    document.getElementById('hair-color-picker').value = currentAvatar.hairColor;
    
    // Clothing and colors
    document.querySelector(`[data-option="${currentAvatar.clothing}"]`).click();
    document.getElementById('clothing-primary-color').value = currentAvatar.clothingPrimaryColor;
    document.getElementById('clothing-secondary-color').value = currentAvatar.clothingSecondaryColor;
    
    // Mobility aids
    document.querySelector(`[data-option="${currentAvatar.mobilityAid}"]`).click();
    
    // Cultural elements
    document.querySelector(`[data-option="${currentAvatar.culturalElements}"]`).click();
    
    // Accessories
    document.querySelector(`[data-option="${currentAvatar.accessories}"]`).click();
    
    // Pronouns
    if (['he/him', 'she/her', 'they/them'].includes(currentAvatar.pronouns)) {
        document.getElementById('pronouns').value = currentAvatar.pronouns;
        document.getElementById('custom-pronouns').classList.add('hidden');
    } else if (currentAvatar.pronouns) {
        document.getElementById('pronouns').value = 'custom';
        document.getElementById('custom-pronouns').value = currentAvatar.pronouns;
        document.getElementById('custom-pronouns').classList.remove('hidden');
    } else {
        document.getElementById('pronouns').value = '';
        document.getElementById('custom-pronouns').classList.add('hidden');
    }
}

// Save the current avatar configuration
function saveAvatar() {
    // In a real implementation, this would save to a database
    console.log('Saving avatar:', currentAvatar);
    
    // Display avatar in the HUD
    const userAvatar = document.getElementById('user-avatar');
    userAvatar.innerHTML = `<div class="avatar-preview" style="background-color: ${currentAvatar.skinTone}"></div>`;
    
    // Close the avatar creator
    document.getElementById('avatar-creator').style.display = 'none';
}

// Helper function to convert RGB to HEX
function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g);
    if (rgbValues && rgbValues.length >= 3) {
        const r = parseInt(rgbValues[0]);
        const g = parseInt(rgbValues[1]);
        const b = parseInt(rgbValues[2]);
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return '#000000';
}

// Initialize avatar creator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAvatarCreator();
    
    // Open avatar creator when avatar in HUD is clicked
    document.getElementById('user-avatar').addEventListener('click', function() {
        document.getElementById('avatar-creator').style.display = 'block';
    });
    
    // Save avatar button
    document.getElementById('save-avatar').addEventListener('click', saveAvatar);
    
    // Randomize avatar button
    document.getElementById('randomize-avatar').addEventListener('click', randomizeAvatar);
    
    // Cancel avatar button
    document.getElementById('cancel-avatar').addEventListener('click', function() {
        document.getElementById('avatar-creator').style.display = 'none';
    });
});

// Export current avatar data if needed
function getCurrentAvatar() {
    return currentAvatar;
}
