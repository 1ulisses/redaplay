document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            question: "1. Qual é a estrutura clássica de uma redação dissertativa-argumentativa?",
            options: [
                "A) Introdução, desenvolvimento e conclusão",
                "B) Tema, título e parágrafo",
                "C) Argumento, exemplo e opinião",
                "D) Título, resumo e bibliografia"
            ],
            correctAnswer: "A) Introdução, desenvolvimento e conclusão"
        },
        {
            question: "2. O que é coesão textual?",
            options: [
                "A) A repetição do mesmo termo em toda a redação",
                "B) A forma como as ideias estão logicamente conectadas",
                "C) O uso de palavras estrangeiras",
                "D) A pontuação usada no texto"
            ],
            correctAnswer: "B) A forma como as ideias estão logicamente conectadas"
        },
        {
            question: "3. Qual dos elementos abaixo é essencial para a conclusão de uma redação do ENEM?",
            options: [
                "A) Um resumo do texto",
                "B) Uma pergunta retórica",
                "C) Uma proposta de intervenção",
                "D) Uma citação de impacto"
            ],
            correctAnswer: "C) Uma proposta de intervenção"
        },
        {
            question: "4. Qual das alternativas abaixo apresenta um exemplo de linguagem formal, adequada a uma redação?",
            options: [
                "A) “A galera tá de olho nessa parada.”",
                "B) “Tipo assim, isso daí foi meio errado.”",
                "C) “Observa-se que o problema persiste na sociedade atual.”",
                "D) “Tava tudo certo até que deu ruim.”"
            ],
            correctAnswer: "C) “Observa-se que o problema persiste na sociedade atual.”"
        },
        {
            question: "5. O que prejudica a coerência de um texto?",
            options: [
                "A) Usar conectivos como \"portanto\" e \"além disso\"",
                "B) Apresentar ideias contraditórias ou sem sentido",
                "C) Fazer uma proposta de intervenção ao final",
                "D) Dividir o texto em parágrafos"
            ],
            correctAnswer: "B) Apresentar ideias contraditórias ou sem sentido"
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null;

    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const submitAnswerBtn = document.getElementById('submit-answer-btn');
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackText = document.getElementById('feedback-text');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const quizResults = document.getElementById('quiz-results');
    const scoreSpan = document.getElementById('score');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');

    function loadQuestion() {
        selectedOption = null;
        feedbackContainer.classList.add('hidden');
        submitAnswerBtn.classList.remove('hidden');
        nextQuestionBtn.classList.add('hidden');

        const currentQuestion = questions[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;
        optionsContainer.innerHTML = '';

        currentQuestion.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('option-item');
            optionDiv.textContent = option;
            optionDiv.addEventListener('click', () => selectOption(optionDiv));
            optionsContainer.appendChild(optionDiv);
        });
    }

    function selectOption(optionDiv) {
        const currentSelected = document.querySelector('.option-item.selected');
        if (currentSelected) {
            currentSelected.classList.remove('selected');
        }
        optionDiv.classList.add('selected');
        selectedOption = optionDiv.textContent;
    }

    function submitAnswer() {
        if (selectedOption === null) {
            alert('Por favor, selecione uma resposta!');
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        submitAnswerBtn.classList.add('hidden');

        Array.from(optionsContainer.children).forEach(optionDiv => {
            optionDiv.style.pointerEvents = 'none';
            if (optionDiv.textContent === currentQuestion.correctAnswer) {
                optionDiv.classList.add('correct');
            }
            if (optionDiv.textContent === selectedOption && selectedOption !== currentQuestion.correctAnswer) {
                optionDiv.classList.add('incorrect');
            }
        });

        feedbackContainer.classList.remove('hidden');
        if (selectedOption === currentQuestion.correctAnswer) {
            score++;
            feedbackText.textContent = 'Correto!';
            feedbackText.classList.remove('feedback-incorrect');
            feedbackText.classList.add('feedback-correct');
        } else {
            feedbackText.textContent = `Incorreto. A resposta correta é: ${currentQuestion.correctAnswer}`;
            feedbackText.classList.remove('feedback-correct');
            feedbackText.classList.add('feedback-incorrect');
        }

        nextQuestionBtn.classList.remove('hidden');
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        document.getElementById('quiz-content').classList.add('hidden');
        quizResults.classList.remove('hidden');
        scoreSpan.textContent = score;
        totalQuestionsSpan.textContent = questions.length;

        // **CRITICAL LINE:** Marks Lesson 2 as completed in localStorage
        localStorage.setItem('lesson-2-completed', 'true');
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        quizResults.classList.add('hidden');
        document.getElementById('quiz-content').classList.remove('hidden');
        loadQuestion();
    }

    submitAnswerBtn.addEventListener('click', submitAnswer);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    restartQuizBtn.addEventListener('click', restartQuiz);

    loadQuestion();
});