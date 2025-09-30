// Lazy Loading with Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Lazy loading script starting...');
    
    // Configuration
    const config = {
        rootMargin: '200px 0px', // Start loading 200px before element is visible
        threshold: 0.01 // Trigger when 1% of element is visible
    };
    
    // Create the observer
    const observer = new IntersectionObserver(onIntersection, config);
    
    // Handle intersection
    function onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load the asset
                loadAsset(entry.target);
                // Stop observing this element
                observer.unobserve(entry.target);
            }
        });
    }
    
    // Load the actual asset
    function loadAsset(element) {
        if (element.tagName === 'IMG') {
            // Handle images
            const src = element.dataset.src;
            if (src) {
                console.log('Loading image:', src.split('/').pop());
                element.src = src;
                element.classList.add('loaded');
                delete element.dataset.src;
            }
        } else if (element.tagName === 'VIDEO') {
            // Handle videos
            const sources = element.querySelectorAll('source[data-src]');
            if (sources.length > 0) {
                console.log('Loading video with', sources.length, 'source(s)');
                sources.forEach(source => {
                    const src = source.dataset.src;
                    if (src) {
                        source.src = src;
                        delete source.dataset.src;
                    }
                });
                // Load the video after sources are set
                element.load();
                element.classList.add('loaded');
            }
        }
    }
    
    // Find ALL images with data-src attribute (no class needed)
    const lazyImages = document.querySelectorAll('img[data-src]');
    console.log('Found', lazyImages.length, 'images to lazy load');
    lazyImages.forEach(img => observer.observe(img));
    
    // Find ALL videos that have source elements with data-src
    const lazyVideos = document.querySelectorAll('video:has(source[data-src])');
    console.log('Found', lazyVideos.length, 'videos to lazy load');
    lazyVideos.forEach(video => observer.observe(video));
    
    // Fallback for browsers that don't support :has() selector
    if (lazyVideos.length === 0) {
        const allVideos = document.querySelectorAll('video');
        const videosWithDataSrc = Array.from(allVideos).filter(video => 
            video.querySelector('source[data-src]')
        );
        console.log('Found', videosWithDataSrc.length, 'videos to lazy load (fallback)');
        videosWithDataSrc.forEach(video => observer.observe(video));
    }
});

// =====================================
// Menu controls and navigation
// =====================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Get references to all the elements we need
    const menuButton = document.querySelector('.menu-button');
    const menuContainer = document.querySelector('.website-menu-container');
    const scrim = document.querySelector('.scrim');
    const menuButtonSvg = menuButton.querySelector('svg');
    const menuImageContainer = document.querySelector('.website-menu .media-container.aspect-16x9');
    const menuItems = document.querySelectorAll('.menu-project-list-item');
    
    // Variable to track if menu is open or closed - SHARED STATE
    let isMenuOpen = false;
    
    // Define images for each menu item
    const menuImages = {
        0: 'https://firebasestorage.googleapis.com/v0/b/portfolio-video-assets.firebasestorage.app/o/global-assets%2F01-Thumbnail--Ctrl-alt.webp?alt=media&token=618d0cff-68a5-4252-9f8d-d9b9a7a5efa9', // Meister
        1: 'https://firebasestorage.googleapis.com/v0/b/portfolio-video-assets.firebasestorage.app/o/global-assets%2F02-Thumbnail--Google-Design.webp?alt=media&token=4cbe4a5b-537e-4d63-add3-6d0ec7e43689', // Google editorial
        2: 'https://firebasestorage.googleapis.com/v0/b/portfolio-video-assets.firebasestorage.app/o/global-assets%2F03-Thumbnail--Acorde.webp?alt=media&token=e8652b8b-e566-4cd5-8d10-3b1e5568e28c', // Music tool
        3: 'https://firebasestorage.googleapis.com/v0/b/portfolio-video-assets.firebasestorage.app/o/global-assets%2F04-Thumbnail--Building-a-bridge.webp?alt=media&token=63c157d3-926a-40cd-b397-6565765bcfe7', // Design Kit
        4: 'https://firebasestorage.googleapis.com/v0/b/portfolio-video-assets.firebasestorage.app/o/global-assets%2F05-Thumbnail--Telegraph.webp?alt=media&token=0c843936-f8a8-4514-bcc2-85c40cd790f6', // Telegraph
        5: 'https://firebasestorage.googleapis.com/v0/b/portfolio-video-assets.firebasestorage.app/o/global-assets%2F06-Thumbnail--Gif-workshop.webp?alt=media&token=f31b0ac1-7338-4d4d-a4db-4c9460478e17' // Teaching
    };
    
    // Define section IDs for each menu item
    const sectionIds = {
        0: 'when-90s-aesthetics-meets-mayhem',           // Meister
        1: 'joinging-the-design-conversation',           // Google editorial
        2: 'the-music-learning-tool-i-couldnt-find-copy', // Music tool
        3: 'building-a-bridge-with-design-kit',          // Design Kit
        4: 'the-illustration-system-nobody-asked-for-copy', // Telegraph
        5: 'from-analogue-to-motion'                     // Teaching
    };
    
    // Variable to store the timeout for image hover
    let fadeOutTimeout = null;
    
    // Set initial state (menu closed)
    function initializeMenu() {
        menuContainer.style.display = 'none';
        scrim.style.display = 'none';
        menuButtonSvg.style.display = 'none';
        // Make sure the "Menu" text is visible
        menuButton.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Menu') {
                node.style.display = 'inline';
            }
        });
        
        isMenuOpen = false;
    }
    
    // Function to open the menu
    function openMenu() {
        menuContainer.style.display = 'flex';
        scrim.style.display = 'block';
        menuButtonSvg.style.display = 'inline';
        
        // Hide the "Menu" text and make button square
        const textNode = Array.from(menuButton.childNodes).find(node => 
            node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Menu'
        );
        if (textNode) {
            textNode.textContent = '';
        }
        
        // Make button square for close state and remove padding
        menuButton.style.width = 'var(--space-8)';
        menuButton.style.padding = '0';
        
        isMenuOpen = true;
    }
    
    // Function to close the menu - SINGLE SOURCE OF TRUTH
    function closeMenu() {
        menuContainer.style.display = 'none';
        scrim.style.display = 'none';
        menuButtonSvg.style.display = 'none';
        
        // Show the "Menu" text and restore original styling
        const textNode = Array.from(menuButton.childNodes).find(node => 
            node.nodeType === Node.TEXT_NODE
        );
        if (textNode) {
            textNode.textContent = 'Menu';
        }
        
        // Restore original button styling
        menuButton.style.width = 'fit-content';
        menuButton.style.padding = 'var(--button-padding)';
        
        // IMPORTANT: Update the state
        isMenuOpen = false;
    }
    
    // Add click event listener to the menu button
    menuButton.addEventListener('click', function() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close menu when clicking on the scrim
    scrim.addEventListener('click', function() {
        if (isMenuOpen) {
            closeMenu();
        }
    });
    
    // =====================================
    // Menu hover and navigation functionality
    // =====================================
    
    if (menuImageContainer && menuItems.length > 0) {
        
        // Add hover and click listeners to each menu item
        menuItems.forEach((item, index) => {
            
            // On mouse enter - show the image
            item.addEventListener('mouseenter', function() {
                // Clear any pending fade out
                if (fadeOutTimeout) {
                    clearTimeout(fadeOutTimeout);
                    fadeOutTimeout = null;
                }
                
                // Set the new image
                if (menuImages[index]) {
                    menuImageContainer.style.backgroundImage = `url('${menuImages[index]}')`;
                    menuImageContainer.style.backgroundSize = 'cover';
                    menuImageContainer.style.backgroundPosition = 'center';
                    menuImageContainer.style.opacity = '1';
                }
            });
            
            // On mouse leave - start fade out
            item.addEventListener('mouseleave', function() {
                // Clear any existing timeout
                if (fadeOutTimeout) {
                    clearTimeout(fadeOutTimeout);
                }
                
                // Set new timeout for fade out
                fadeOutTimeout = setTimeout(() => {
                    menuImageContainer.style.opacity = '0';
                    // Clear image after fade completes
                    setTimeout(() => {
                        // Only clear if still faded out (not hovering another item)
                        if (menuImageContainer.style.opacity === '0') {
                            menuImageContainer.style.backgroundImage = '';
                        }
                    }, 200);
                }, 100); // Small delay before starting fade
            });
            
            // On click - navigate to section
            item.addEventListener('click', function() {
                const targetSectionId = sectionIds[index];
                const targetSection = document.getElementById(targetSectionId);
                
                if (targetSection) {
                    // Close the menu using the shared function
                    closeMenu();
                    
                    // Scroll to the section with the top of the section at the top of viewport
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Set initial state for menu images
        menuImageContainer.style.opacity = '0';
        menuImageContainer.style.transition = 'opacity 200ms ease';
    }
    
    // Initialize the menu to closed state when page loads
    initializeMenu();
});

// =====================================
// Rive Animation - Happy Fella
// =====================================

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('rive-canvas');
    
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    // Check if Rive library loaded
    if (typeof rive === 'undefined') {
        console.error('Rive library not loaded');
        return;
    }
    
    console.log('Initializing Rive animation...');
    
    try {
        const riveInstance = new rive.Rive({
            src: 'happy_fella.riv',
            canvas: canvas,
            autoplay: true,
            stateMachines: 'State Machine 1',
            fit: rive.Fit.Contain,
            alignment: rive.Alignment.Center,
            onLoad: () => {
                console.log('Rive animation loaded successfully!');
                // Don't call resizeDrawingSurfaceToCanvas - use fixed canvas dimensions
            },
            onLoadError: (error) => {
                console.error('Failed to load Rive animation:', error);
            }
        });
        
        // Window resize listener removed - keeping canvas at fixed size
        
    } catch (error) {
        console.error('Error creating Rive instance:', error);
    }
});

// =====================================
// Rive Animation - Hero Illustration
// =====================================

document.addEventListener('DOMContentLoaded', function() {
    const heroCanvas = document.getElementById('hero-rive-canvas');
    
    if (!heroCanvas) {
        console.error('Hero canvas element not found');
        return;
    }
    
    // Check if Rive library loaded
    if (typeof rive === 'undefined') {
        console.error('Rive library not loaded');
        return;
    }
    
    console.log('Initializing Hero Rive animation...');
    
    try {
        const heroRiveInstance = new rive.Rive({
            src: 'hero-illustration.riv',
            canvas: heroCanvas,
            autoplay: true,
            stateMachines: 'State Machine 2',
            fit: rive.Fit.Cover, // Use Cover to fill the container
            alignment: rive.Alignment.Center,
            onLoad: () => {
                console.log('Hero Rive animation loaded successfully!');
                riveInstance.resizeDrawingSurfaceToCanvas();
            },
            onLoadError: (error) => {
                console.error('Failed to load Hero Rive animation:', error);
            }
        });
        
        // Resize on window resize
        window.addEventListener('resize', () => {
            heroRiveInstance.resizeDrawingSurfaceToCanvas();
        });
        
    } catch (error) {
        console.error('Error creating Hero Rive instance:', error);
    }
});