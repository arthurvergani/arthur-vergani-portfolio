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