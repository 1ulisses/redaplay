// Comentário por Matheus e Leandro
document.addEventListener('DOMContentLoaded', () => {
    const lessonItems = document.querySelectorAll('.lesson-item');
    let completedLessons = [];

    // pega questões completas
    function fetchCompletedLessons() {
        return fetch('/api/user/lessons_completed') // pega lições completadas da api endpoint
            .then(res => res.json()) // converte para json
            .then(data => {
                if (Array.isArray(data.lessons_completed)) { // checa se é um array
                    completedLessons = data.lessons_completed; // atribui lições completadas
                } else { // se não for um array, inicializa como vazio
                    completedLessons = [];
                }
            });
    }

    // atualiza lições completadas
    function saveCompletedLessons() {
        fetch('/api/user/lessons_completed', { // envia lições completadas para a api endpoint
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, // cabeçalho da api endpoint
            body: JSON.stringify({lessons_completed: completedLessons}) // lições completadas para json
        });
    }

    // Função para atualizar o status visual da lição
    const updateLessonStatus = (lessonId, isCompleted, isDisabled, isLocked) => { // Atualiza o status visual da lição 
        const lessonItem = document.querySelector(`.lesson-item[data-id-lesson="${lessonId}"]`); // Seleciona o item da lição
        if (!lessonItem) return; // Se o item não existir, sai da função

        if (isCompleted) { // para lição concluída
            lessonItem.classList.add('completed');
            lessonItem.classList.remove('disabled', 'locked');
            lessonItem.style.pointerEvents = 'auto';
            if (lessonId > 1) {
                lessonItem.href = `lesson${lessonId}`;
            }
        } else if (isDisabled && isLocked) { // para lição desabilitada e bloqueada
            lessonItem.classList.remove('completed');
            lessonItem.classList.add('disabled', 'locked');
            lessonItem.style.pointerEvents = 'none';
            if (lessonId > 1) {
                lessonItem.href = '#';
            }
        } else { // para lição ativa/próxima
            lessonItem.classList.remove('completed', 'disabled', 'locked');
            lessonItem.style.pointerEvents = 'auto';
            if (lessonId > 1) {
                lessonItem.href = `lesson${lessonId}`;
            }
        }
    };

    
    const loadLessonStatuses = () => {
        // Desabilita todas as lições exceto a primeira
        lessonItems.forEach(item => {
            const lessonId = parseInt(item.dataset.idLesson);
            if (lessonId > 1) { 
                updateLessonStatus(lessonId, false, true, true);
            }
        });

        // Atualiza o status de cada lição com base nas lições concluídas
        for (let i = 1; i <= lessonItems.length; i++) {
            const isCompleted = completedLessons.includes(i);
            if (isCompleted) {
                updateLessonStatus(i, true, false, false); 
            } else {
                // Se a lição não estiver concluída, verifica se é a primeira lição ou se a lição anterior foi concluída
                if (i === 1 || completedLessons.includes(i - 1)) {
                    updateLessonStatus(i, false, false, false); 
                }
            }
        }
    };
    // Carrega as lições concluídas e atualiza o status visual
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