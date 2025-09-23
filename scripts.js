// Askterisk container position
document.addEventListener('DOMContentLoaded', function() {
  const updatePosition = () => {
    const asterisk = document.getElementById('asterisk');
    const wrapper = document.querySelector('.hero-wrapper');
    const container = document.querySelector('.asterisk-container');
    
    if (asterisk && wrapper && container) {
      // Get position relative to wrapper
      const asteriskRect = asterisk.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      const containerWidth = container.offsetWidth;
      const viewportWidth = document.documentElement.clientWidth;
      const leftPos = asteriskRect.left - wrapperRect.left;
      
      // Check if container would overflow
      if (asteriskRect.left + containerWidth > viewportWidth) {
        // Align container's right edge with asterisk's right edge
        const rightAlignedPos = leftPos - containerWidth + asterisk.offsetWidth;
        wrapper.style.setProperty('--asterisk-left', `${rightAlignedPos}px`);
      } else {
        // Standard alignment
        wrapper.style.setProperty('--asterisk-left', `${leftPos}px`);
      }
    }
  };
  
  // Run on load and resize
  updatePosition();
  window.addEventListener('resize', updatePosition);
});

// Nav-position Y
document.addEventListener('DOMContentLoaded', function() {
  const updateGap = () => {
    const welcomeText = document.querySelector('.welcome-text');
    const navContainer = document.querySelector('.nav-container');
    const heroWrapper = document.querySelector('.hero-wrapper');
    
    if (welcomeText && navContainer && heroWrapper) {
      // Calculate gap: nav height minus welcome text height
      const navHeight = navContainer.offsetHeight;
      const welcomeHeight = welcomeText.offsetHeight;
      const gap = Math.max(0, navHeight - welcomeHeight);
      
      // Apply gap between welcome-text and hero-wrapper
      welcomeText.style.marginBottom = `${gap}px`;
    }
  };
  
  // Keep your original asterisk code here
  
  // Run with delays for accurate measurements
  setTimeout(updateGap, 100);
  setTimeout(updateGap, 300);
  
  // Update on window resize
  window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(updateGap, 100);
  });
});
