// Initialize Lucide icons
lucide.createIcons();

// Define button and audio elements
const declineBtn = document.getElementById('declineBtn');
const acceptBtn = document.getElementById('acceptBtn');
const leftArrows = document.querySelector('.left-arrows');
const rightArrows = document.querySelector('.right-arrows');
const ringtone = document.getElementById('ringtone');

// Track active button
let activeButton = null;
let callAnswered = false;
let callDeclined = false;

// Common variables for drag functionality
let isDraggingDecline = false;
let isDraggingAccept = false;
let startXDecline = 0;
let startXAccept = 0;
let initialLeftDecline = 0;
let initialRightAccept = 0;
const maxDragDecline = 100;
const maxDragAccept = 100;

// Function to start ringtone
function startRingtone() {
  ringtone.play().catch(error => {
    console.log('Autoplay prevented. User interaction required to start ringtone.');
    // Add user interaction event to start ringtone
    document.addEventListener('click', startRingtone);
    document.addEventListener('touchstart', startRingtone);
  });
}

// Start ringtone and pulsating animation on page load
window.addEventListener('load', () => {
  // Start pulsating animation on both buttons
  declineBtn.classList.add('pulsating');
  acceptBtn.classList.add('pulsating');

  // Show arrow animations
  leftArrows.style.display = 'block';
  rightArrows.style.display = 'block';

  // Attempt to start ringtone
  startRingtone();
});

// Function to stop ringtone
function stopRingtone() {
  ringtone.pause();
  ringtone.currentTime = 0;
}

// Decline Button Touch/Mouse Start Handler
function handleTouchStartDecline(e) {
  isDraggingDecline = true;
  startXDecline = e.clientX;
  initialLeftDecline = parseInt(window.getComputedStyle(declineBtn).left);
  declineBtn.style.transition = 'none';
  
  // Stop pulsating animation for decline button
  declineBtn.classList.remove('pulsating');
}

// Decline Button Touch/Mouse Move Handler
function handleTouchMoveDecline(e) {
  if (!isDraggingDecline) return;
  
  const deltaX = e.clientX - startXDecline;
  let newLeft = initialLeftDecline + deltaX;
  
  // Limit drag to right direction only and max distance
  if (newLeft < 0) newLeft = 0;
  if (newLeft > maxDragDecline) newLeft = maxDragDecline;
  
  declineBtn.style.left = `${newLeft}px`;
  
  // If dragged more than threshold, trigger decline
  if (newLeft >= maxDragDecline) {
    performDecline();
  }
}

// Decline Button Touch/Mouse End Handler
function handleTouchEndDecline() {
  isDraggingDecline = false;
  declineBtn.style.transition = 'transform 0.3s ease, left 0.3s ease';
  declineBtn.style.left = '0px';
  
  // Reset active button if call wasn't declined
  if (!callDeclined) {
    activeButton = null;
    acceptBtn.classList.remove('disabled');
    
    // Resume pulsating
    setTimeout(() => {
      if (!callAnswered && !callDeclined) {
        declineBtn.classList.add('pulsating');
      }
    }, 300);
  }
}

// Accept Button Touch/Mouse Start Handler
function handleTouchStartAccept(e) {
  isDraggingAccept = true;
  startXAccept = e.clientX;
  initialRightAccept = parseInt(window.getComputedStyle(acceptBtn).right);
  acceptBtn.style.transition = 'none';
  
  // Stop pulsating animation for accept button
  acceptBtn.classList.remove('pulsating');
}

// Accept Button Touch/Mouse Move Handler
function handleTouchMoveAccept(e) {
  if (!isDraggingAccept) return;
  
  const deltaX = startXAccept - e.clientX;
  let newRight = initialRightAccept + deltaX;
  
  // Limit drag to left direction only and max distance
  if (newRight < 0) newRight = 0;
  if (newRight > maxDragAccept) newRight = maxDragAccept;
  
  acceptBtn.style.right = `${newRight}px`;
  
  // If dragged more than threshold, trigger accept
  if (newRight >= maxDragAccept) {
    performAccept();
  }
}

// Accept Button Touch/Mouse End Handler
function handleTouchEndAccept() {
  isDraggingAccept = false;
  acceptBtn.style.transition = 'transform 0.3s ease, right 0.3s ease';
  acceptBtn.style.right = '0px';
  
  // Reset active button if call wasn't accepted
  if (!callAnswered) {
    activeButton = null;
    declineBtn.classList.remove('disabled');
    
    // Resume pulsating
    setTimeout(() => {
      if (!callAnswered && !callDeclined) {
        acceptBtn.classList.add('pulsating');
      }
    }, 300);
  }
}

// Perform Accept Call Action
function performAccept() {
  stopRingtone(); // Stop ringtone when call is accepted
  
  callAnswered = true;
  
  // Stop all animations and interactions
  declineBtn.classList.remove('pulsating');
  acceptBtn.classList.remove('pulsating');
  isDraggingAccept = false;
  isDraggingDecline = false;
  
  // Visual feedback
  acceptBtn.style.transform = 'scale(1.2)';
  document.querySelector('.call-info h1').textContent = 'Order Accepted';
  document.querySelector('.call-info p').textContent = 'Generating route...';
  
  // Hide decline button
  declineBtn.style.opacity = '0.5';
  
  // Vibration feedback
  if (window.navigator.vibrate) {
    window.navigator.vibrate([100, 50, 100]);
  }
}

// Perform Decline Call Action
function performDecline() {
  stopRingtone(); // Stop ringtone when call is declined
  
  callDeclined = true;
  
  // Stop all animations and interactions
  declineBtn.classList.remove('pulsating');
  acceptBtn.classList.remove('pulsating');
  isDraggingAccept = false;
  isDraggingDecline = false;
  
  // Visual feedback
  declineBtn.style.transform = 'scale(1.2)';
  document.querySelector('.call-info h1').textContent = 'Order Declined';
  document.querySelector('.call-info p').textContent = '';
  
  // Hide accept button
  acceptBtn.style.opacity = '0.5';
  
  // Vibration feedback
  if (window.navigator.vibrate) {
    window.navigator.vibrate([100, 50, 100]);
  }
}

// Decline Button Event Listeners
declineBtn.addEventListener('touchstart', (e) => {
  if (activeButton === null) {
    activeButton = 'decline';
    acceptBtn.classList.add('disabled');
    handleTouchStartDecline(e.touches[0]);
    if (window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  }
});

declineBtn.addEventListener('mousedown', (e) => {
  if (activeButton === null) {
    activeButton = 'decline';
    acceptBtn.classList.add('disabled');
    handleTouchStartDecline(e);
  }
});

// Accept Button Event Listeners
acceptBtn.addEventListener('touchstart', (e) => {
  if (activeButton === null) {
    activeButton = 'accept';
    declineBtn.classList.add('disabled');
    handleTouchStartAccept(e.touches[0]);
    if (window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  }
});

acceptBtn.addEventListener('mousedown', (e) => {
  if (activeButton === null) {
    activeButton = 'accept';
    declineBtn.classList.add('disabled');
    handleTouchStartAccept(e);
  }
});

// Global Move Event Listeners
document.addEventListener('touchmove', (e) => {
  if (isDraggingDecline) {
    handleTouchMoveDecline(e.touches[0]);
  }
  if (isDraggingAccept) {
    handleTouchMoveAccept(e.touches[0]);
  }
});

document.addEventListener('mousemove', (e) => {
  if (isDraggingDecline) {
    handleTouchMoveDecline(e);
  }
  if (isDraggingAccept) {
    handleTouchMoveAccept(e);
  }
});

// Global Touch/Mouse End Event Listeners
document.addEventListener('touchend', () => {
  if (isDraggingDecline) {
    handleTouchEndDecline();
  }
  if (isDraggingAccept) {
    handleTouchEndAccept();
  }
});

document.addEventListener('mouseup', () => {
  if (isDraggingDecline) {
    handleTouchEndDecline();
  }
  if (isDraggingAccept) {
    handleTouchEndAccept();
  }
});