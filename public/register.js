const form = document.querySelector(".form");
const error = document.querySelector(".error");
const success = document.querySelector(".success");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.querySelector("input[name=username]").value;
  const password = document.querySelector("input[name=password]").value;
  const email = document.querySelector("input[name=email]").value;
  const response = await fetch("http://localhost:3000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      email,
    }),
  });

  const data = await response.json();
  if (data.error) {
    error.textContent = data.error;
    setTimeout(() => (error.textContent = ""), 2000);
  } else {
    document.querySelector(".button1").disabled = true;
    success.textContent = data.message;
    setTimeout(() => {
      success.textContent = "";
      window.location.href = data.redirect;
    }, 2000);

    form.reset();
  }
});
