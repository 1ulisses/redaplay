// comentários por Leandro
document.addEventListener("DOMContentLoaded", () => {
  // elementos DOM
  const introductionTextarea = document.getElementById("introduction-text");
  const charCountSpan = document.getElementById("char-count");
  const submitButton = document.getElementById("submit-introduction-btn");
  const maxLength = parseInt(introductionTextarea.getAttribute("maxlength"));

  introductionTextarea.addEventListener("input", () => {
    // contagem de char
    const currentLength = introductionTextarea.value.length;
    charCountSpan.textContent = `${currentLength}/${maxLength} caracteres`;

    if (currentLength >= maxLength * 0.9) {
      // 90% do limite
      charCountSpan.style.color = "#d32f2f";
    } else {
      // menos de 90%
      charCountSpan.style.color = "#666";
    }
  });

  submitButton.addEventListener("click", () => {
    // enviar introdução
    const textContent = introductionTextarea.value.trim();

    if (textContent.length < 50) {
      // introdução mínima
      alert(
        "Por favor, escreva uma introdução mais completa (mínimo 50 caracteres)."
      );
      return;
    }

    fetch("/api/user/lessons_completed") // pega lições completadas
      .then((res) => res.json()) // converte para json
      .then((data) => {
        let completed = Array.isArray(data.lessons_completed) // verifica se array
          ? data.lessons_completed
          : [];
        if (!completed.includes(3)) completed.push(3);
        return fetch("/api/user/lessons_completed", {
          // atualiza lições
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessons_completed: completed }),
        });
      })
      .then(() => {
        window.location.href = "/inicio"; // redireciona para início
      });
  });

  introductionTextarea.dispatchEvent(new Event("input")); // evento para checar char
});
