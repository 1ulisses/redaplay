document.addEventListener('DOMContentLoaded', () => {
    const introductionTextarea = document.getElementById('introduction-text');
    const charCountSpan = document.getElementById('char-count');
    const submitButton = document.getElementById('submit-introduction-btn');
    const maxLength = parseInt(introductionTextarea.getAttribute('maxlength'));

    introductionTextarea.addEventListener('input', () => {
        const currentLength = introductionTextarea.value.length;
        charCountSpan.textContent = `${currentLength}/${maxLength} caracteres`;

        if (currentLength >= maxLength * 0.9) {
            charCountSpan.style.color = '#d32f2f';
        } else {
            charCountSpan.style.color = '#666';
        }
    });

    submitButton.addEventListener('click', () => {
        const textContent = introductionTextarea.value.trim();

        if (textContent.length < 50) {
            alert('Por favor, escreva uma introdução mais completa (mínimo 50 caracteres).');
            return;
        }
        
        fetch('/api/user/lessons_completed')
            .then(res => res.json())
            .then(data => {
                let completed = Array.isArray(data.lessons_completed) ? data.lessons_completed : [];
                if (!completed.includes(3)) completed.push(3);
                return fetch('/api/user/lessons_completed', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({lessons_completed: completed})
                });
            })
            .then(() => {
                alert('Sua introdução foi \"concluída\"! A Lição 3 foi marcada como completa.');
                window.location.href = '/inicio';
            });
    });

    introductionTextarea.dispatchEvent(new Event('input'));
});