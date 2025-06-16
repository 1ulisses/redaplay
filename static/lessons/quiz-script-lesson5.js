document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/lesson/5/questions')
        .then(res => res.json())
        .then(data => {
            questions = data.questions;

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

                fetch('/api/user/lessons_completed')
                    .then(res => res.json())
                    .then(data => {
                        let completed = Array.isArray(data.lessons_completed) ? data.lessons_completed : [];
                        if (!completed.includes(5)) completed.push(5); // <-- should be 5, not 2
                        return fetch('/api/user/lessons_completed', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({lessons_completed: completed})
                        });
                    });
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
});