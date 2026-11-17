(function () {
    function loadFooter() {
        const placeholder = document.getElementById('site-footer') || document.querySelector('[data-component="footer"]');
        if (!placeholder) return;

        fetch('/footer.html')
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Failed to load footer component: ' + response.status);
                }
                return response.text();
            })
            .then(function (html) {
                placeholder.outerHTML = html;
            })
            .catch(function (error) {
                console.error('Error loading footer:', error);
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }
})();

