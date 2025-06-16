// Comentário por Matheus e Leandro
document.addEventListener('DOMContentLoaded', () => {
    const lessonItems = document.querySelectorAll('.lesson-item');
    let completedLessons = [];

    // pega questões completas
    function fetchCompletedLessons() {
        return fetch('/api/user/lessons_completed')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.lessons_completed)) {
                    completedLessons = data.lessons_completed;
                } else {
                    completedLessons = [];
                }
            });
    }

    // atualiza lições completadas
    function saveCompletedLessons() {
        fetch('/api/user/lessons_completed', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({lessons_completed: completedLessons})
        });
    }

    // Função para atualizar o status visual da lição
    const updateLessonStatus = (lessonId, isCompleted, isDisabled, isLocked) => {
        const lessonItem = document.querySelector(`.lesson-item[data-id-lesson="${lessonId}"]`);
        if (!lessonItem) return;

        if (isCompleted) {
            lessonItem.classList.add('completed');
            lessonItem.classList.remove('disabled', 'locked');
            lessonItem.style.pointerEvents = 'auto';
            if (lessonId > 1) {
                lessonItem.href = `lesson${lessonId}`;
            }
        } else if (isDisabled && isLocked) {
            lessonItem.classList.remove('completed');
            lessonItem.classList.add('disabled', 'locked');
            lessonItem.style.pointerEvents = 'none';
            if (lessonId > 1) {
                lessonItem.href = '#';
            }
        } else {
            lessonItem.classList.remove('completed', 'disabled', 'locked');
            lessonItem.style.pointerEvents = 'auto';
            if (lessonId > 1) {
                lessonItem.href = `lesson${lessonId}`;
            }
        }
    };

    // Carrega os status iniciais das lições do localStorage e aplica as classes corretas
    const loadLessonStatuses = () => {
        // Primeiro, marca todas as lições como desabilitadas/bloqueadas por padrão, exceto a primeira
        lessonItems.forEach(item => {
            const lessonId = parseInt(item.dataset.idLesson);
            if (lessonId > 1) { // Todas as lições após a primeira são inicialmente bloqueadas
                updateLessonStatus(lessonId, false, true, true);
            }
        });

        // Em seguida, verifica e habilita as lições com base no localStorage
        for (let i = 1; i <= lessonItems.length; i++) {
            const isCompleted = completedLessons.includes(i);
            if (isCompleted) {
                updateLessonStatus(i, true, false, false); // Marca como concluída
            } else {
                // Se a lição atual NÃO está concluída, verifica se a anterior ESTÁ concluída
                // Isso significa que a lição atual deve ser ativa (não bloqueada)
                if (i === 1 || completedLessons.includes(i - 1)) {
                    updateLessonStatus(i, false, false, false); // Marca como ativa/próxima
                }
            }
        }
    };

    fetchCompletedLessons().then(() => {
        loadLessonStatuses(); // Chama ao carregar a página

        // Adiciona o evento de clique a cada item de lição
        lessonItems.forEach(item => {
            item.addEventListener('click', (event) => {
                const lessonId = parseInt(item.dataset.idLesson);

                // Somente prossegue se a lição NÃO estiver desabilitada/bloqueada
                if (!item.classList.contains('disabled') && !item.classList.contains('locked')) {
                    if (!completedLessons.includes(lessonId)) {
                        completedLessons.push(lessonId);
                        saveCompletedLessons();
                    }
                    updateLessonStatus(lessonId, true, false, false); // Atualiza visualmente a lição atual

                    // Habilita a próxima lição
                    const nextLessonId = lessonId + 1;
                    if (nextLessonId <= lessonItems.length) {
                        // Marca a próxima lição como ativa/próxima (não concluída, não desabilitada, não bloqueada)
                        updateLessonStatus(nextLessonId, false, false, false);
                    }
                } else {
                    // Previne a navegação se desabilitado
                    event.preventDefault();
                }
            });
        });
    });
});