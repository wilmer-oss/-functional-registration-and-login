const logout = document.querySelector(".logout");

logout.addEventListener("click", async () => {
  const data = await fetch("http://localhost:3000/logout", {
    method: "POST",
  });

  const response = await data.json();
  if (response.status == "success") {
    window.location.href = response.redirect;
  } else {
    window.location.href = response.redirect;
  }
});
