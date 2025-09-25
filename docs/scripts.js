// Lazy Loading with Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
    
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
                element.src = src;
                element.classList.add('loaded');
                // Optional: remove the data-src after loading
                delete element.dataset.src;
            }
        } else if (element.tagName === 'VIDEO') {
            // Handle videos
            const sources = element.querySelectorAll('source');
            sources.forEach(source => {
                const src = source.dataset.src;
                if (src) {
                    source.src = src;
                    // Remove data-src after setting
                    delete source.dataset.src;
                }
            });
            // Load the video after sources are set
            element.load();
            element.classList.add('loaded');
        }
    }
    
    // Start observing all lazy images
    const lazyImages = document.querySelectorAll('.lazy-image');
    lazyImages.forEach(img => observer.observe(img));
    
    // Start observing all lazy videos
    const lazyVideos = document.querySelectorAll('.lazy-video');
    lazyVideos.forEach(video => observer.observe(video));
    
    // Alternative: Observe entire sections or rows if you prefer
    // const imageSections = document.querySelectorAll('.page-section');
    // imageSections.forEach(section => observer.observe(section));
});