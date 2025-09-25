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