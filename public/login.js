const form = document.querySelector(".form");
const error = document.querySelector(".error");
const success = document.querySelector(".success");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = document.querySelector("input[name=password]").value;
  const email = document.querySelector("input[name=email]").value;
  const response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();
  if (data.status == "error") {
    error.textContent = data.message;
    setTimeout(() => (error.textContent = ""), 2000);
  } else {
    success.textContent = data.message;
    setTimeout(() => {
      success.textContent = "";
      window.location.href = data.redirect;
    }, 1000);

    form.reset();
  }
});
