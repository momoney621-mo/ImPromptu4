// Homepage interactions are intentionally light; the visual is CSS animated.
document.querySelectorAll('a[href="practice.html"]').forEach((link) => {
    link.addEventListener('click', () => {
        document.body.classList.add('is-leaving');
    });
});

const navigation = document.querySelector('.topbar');
if (navigation) {
    const updateNavigation = () => navigation.classList.toggle('is-scrolled', window.scrollY > 18);
    window.addEventListener('scroll', updateNavigation, { passive: true });
    updateNavigation();
}
