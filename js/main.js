document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in-section');

    if (!fadeElements.length) {
        return;
    }

    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    };

    const intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);

    fadeElements.forEach(el => {
        intersectionObserver.observe(el);
    });
});
