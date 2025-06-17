// comentários por Leandro
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/lesson/5/questions") // pega perguntas da api
    .then((res) => res.json()) // converte para json
    .then((data) => {
      questions = data.questions;
      // variáveis globais
      let currentQuestionIndex = 0;
      let score = 0;
      let selectedOption = null;
      // elementos DOM
      const questionText = document.getElementById("question-text");
      const optionsContainer = document.getElementById("options-container");
      const submitAnswerBtn = document.getElementById("submit-answer-btn");
      const feedbackContainer = document.getElementById("feedback-container");
      const feedbackText = document.getElementById("feedback-text");
      const nextQuestionBtn = document.getElementById("next-question-btn");
      const quizResults = document.getElementById("quiz-results");
      const scoreSpan = document.getElementById("score");
      const totalQuestionsSpan = document.getElementById("total-questions");
      const restartQuizBtn = document.getElementById("restart-quiz-btn");

      function loadQuestion() {
        // carrega a pergunta atual
        selectedOption = null;
        feedbackContainer.classList.add("hidden");
        submitAnswerBtn.classList.remove("hidden");
        nextQuestionBtn.classList.add("hidden");

        const currentQuestion = questions[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;
        optionsContainer.innerHTML = "";

        currentQuestion.options.forEach((option) => {
          // cria opções
          const optionDiv = document.createElement("div");
          optionDiv.classList.add("option-item");
          optionDiv.textContent = option;
          optionDiv.addEventListener("click", () => selectOption(optionDiv));
          optionsContainer.appendChild(optionDiv);
        });
      }

      function selectOption(optionDiv) {
        // estilização pergunta clicada
        const currentSelected = document.querySelector(".option-item.selected");
        if (currentSelected) {
          currentSelected.classList.remove("selected");
        }
        optionDiv.classList.add("selected");
        selectedOption = optionDiv.textContent;
      }

      function submitAnswer() {
        // enviar resposta
        if (selectedOption === null) {
          alert("Por favor, selecione uma resposta!");
          return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        submitAnswerBtn.classList.add("hidden");

        Array.from(optionsContainer.children).forEach((optionDiv) => {
          // estiliza opções
          optionDiv.style.pointerEvents = "none"; // desabilita clique
          if (optionDiv.textContent === currentQuestion.correctAnswer) {
            // resposta correta
            optionDiv.classList.add("correct");
          }
          if (
            // resposta incorreta
            optionDiv.textContent === selectedOption &&
            selectedOption !== currentQuestion.correctAnswer
          ) {
            optionDiv.classList.add("incorrect");
          }
        });

        feedbackContainer.classList.remove("hidden"); // animação feedback
        if (selectedOption === currentQuestion.correctAnswer) {
          // resposta correta
          score++;
          feedbackText.textContent = "Correto!";
          feedbackText.classList.remove("feedback-incorrect");
          feedbackText.classList.add("feedback-correct");
        } else {
          // resposta incorreta
          feedbackText.textContent = `Incorreto. A resposta correta é: ${currentQuestion.correctAnswer}`;
          feedbackText.classList.remove("feedback-correct");
          feedbackText.classList.add("feedback-incorrect");
        }

        nextQuestionBtn.classList.remove("hidden");
      }

      function nextQuestion() {
        // próxima pergunta
        currentQuestionIndex++;
         if (currentQuestionIndex < questions.length) {// se houver mais peprguntas
        } else { // se não houver mais perguntas
          showResults(); // mostra resultados
        }
      }

      function showResults() {
        // mostra resultados
        document.getElementById("quiz-content").classList.add("hidden");
        quizResults.classList.remove("hidden");
        scoreSpan.textContent = score; // exibe pontuação
        totalQuestionsSpan.textContent = questions.length; // exibe total de perguntas

        fetch("/api/user/lessons_completed") // atualiza lições concluídas
          .then((res) => res.json()) // converte para json
          .then((data) => { 
            let completed = Array.isArray(data.lessons_completed) // verifica se é um array, caso contrário, cria array vazio
              ? data.lessons_completed
              : [];
            if (!completed.includes(5)) completed.push(5);
            return fetch("/api/user/lessons_completed", {
              // atualiza lições
              method: "POST",
              headers: { "Content-Type": "application/json" }, // define cabeçalho para api endpoint
              credentials: "include", // inclui cookies para autenticação
              body: JSON.stringify({ lessons_completed: completed }) // converte para json,
            });
          });
      }

      function restartQuiz() {
        // reinicia o quiz
        currentQuestionIndex = 0;
        score = 0;
        quizResults.classList.add("hidden");
        document.getElementById("quiz-content").classList.remove("hidden");
        loadQuestion();
      }
      // adiciona eventos
      submitAnswerBtn.addEventListener("click", submitAnswer);
      nextQuestionBtn.addEventListener("click", nextQuestion);
      restartQuizBtn.addEventListener("click", restartQuiz);
      // carrega a primeira pergunta
      loadQuestion();
    });
});
