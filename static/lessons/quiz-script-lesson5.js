document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            question: "1. Qual das opções abaixo NÃO é uma boa estratégia de argumentação em uma redação?",
            options: [
                "A) Utilizar dados estatísticos confiáveis",
                "B) Usar exemplos históricos e sociais",
                "C) Apelar exclusivamente para a emoção do leitor",
                "D) Relacionar o tema com a Constituição ou leis brasileiras"
            ],
            correctAnswer: "C) Apelar exclusivamente para a emoção do leitor"
        },
        {
            question: "2. O que caracteriza a linguagem da norma-padrão usada em redações?",
            options: [
                "A) Uso de gírias e regionalismos",
                "B) Clareza, formalidade e correção gramatical",
                "C) Frases curtas e emotivas",
                "D) Repetição de palavras para reforçar o argumento"
            ],
            correctAnswer: "B) Clareza, formalidade e correção gramatical"
        },
        {
            question: "3. Em uma proposta de intervenção no ENEM, é necessário apresentar:",
            options: [
                "A) Somente o agente responsável pela solução",
                "B) Uma solução vaga e genérica",
                "C) A ação, o agente, o modo, o efeito e o detalhamento",
                "D) Apenas uma opinião sobre o problema"
            ],
            correctAnswer: "C) A ação, o agente, o modo, o efeito e o detalhamento"
        },
        {
            question: "4. Qual das frases abaixo está escrita de forma correta segundo a norma culta?",
            options: [
                "A) “Os problema do país é muito complicado.”",
                "B) “A gente vamos resolver isso amanhã.”",
                "C) “As medidas foram tomadas com responsabilidade.”",
                "D) “Eles vai apresentar o projeto.”"
            ],
            correctAnswer: "C) “As medidas foram tomadas com responsabilidade.”"
        },
        {
            question: "5. Qual é o tipo de discurso mais comum em uma redação dissertativa-argumentativa?",
            options: [
                "A) Discurso direto",
                "B) Discurso indireto",
                "C) Discurso poético",
                "D) Discurso informal"
            ],
            correctAnswer: "B) Discurso indireto"
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

        // **CRITICAL LINE:** Marks Lesson 5 as completed in localStorage
        localStorage.setItem('lesson-5-completed', 'true');
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