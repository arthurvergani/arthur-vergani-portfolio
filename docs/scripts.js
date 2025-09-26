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
        0: 'https://firebasestorage.googleapis.com/v0/b/portfolio-video-assets.firebasestorage.app/o/ctrl-alt-destroy%2F02-A-Ctrl-Alt-Destroy--4x5.webp?alt=media&token=808c09d3-6080-4686-a6d5-a2d2639dc133', // Meister
        1: 'https://firebasestorage.googleapis.com/v0/b/portfolio-video-assets.firebasestorage.app/o/google-design-editorial%2F01-B-UX-dance-reference-desktop--1x1.webp?alt=media&token=824e6629-1e82-47c6-95b1-22533481fb5a', // Google editorial
        2: 'https://firebasestorage.googleapis.com/v0/b/portfolio-video-assets.firebasestorage.app/o/The%C2%A0music%20learning%20tool%20I%C2%A0couldn-t%20find%2F02-B-Acorde--4x3.webp?alt=media&token=5a9f7684-debc-436e-9ad0-9091e89a6d76', // Music tool
        3: 'https://firebasestorage.googleapis.com/v0/b/portfolio-video-assets.firebasestorage.app/o/building-a-bridge-with-design-kit%2F02-B-Building-a-Bridge-Components--4x3.webp?alt=media&token=2c6cefeb-e3be-4340-930a-f5f8d678e577', // Design Kit
        4: 'https://firebasestorage.googleapis.com/v0/b/portfolio-video-assets.firebasestorage.app/o/Telegraph-illustration-system%2F04-B-Telegraph--16x9.webp?alt=media&token=ebead134-0606-47b4-a14f-382c8b945d0a', // Telegraph
        5: 'https://firebasestorage.googleapis.com/v0/b/portfolio-video-assets.firebasestorage.app/o/Telegraph-illustration-system%2F03-Telegraph--2x1.webp?alt=media&token=7a71b6c0-9e7c-463f-a4ee-6b75ce692482' // Teaching
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