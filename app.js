document.addEventListener("DOMContentLoaded", () => {
  const loginModalEl = document.getElementById("loginModal");
  const verificationModalEl = document.getElementById("verificationModal");

  const loginModal = bootstrap.Modal.getOrCreateInstance(loginModalEl);
  const verificationModal = bootstrap.Modal.getOrCreateInstance(verificationModalEl);

  const emailLoginForm = document.getElementById("emailLoginForm");
  const verificationForm = document.getElementById("verificationForm");
  const emailInput = document.getElementById("emailInput");
  const verificationCode = document.getElementById("verificationCode");
  const verificationEmail = document.getElementById("verificationEmail");
  const differentEmailBtn = document.getElementById("differentEmailBtn");
  const resendBtn = document.getElementById("resendBtn");
  const verificationStatus = document.getElementById("verificationStatus");
  const googleBtn = document.getElementById("googleBtn");
  const accountLabel = document.getElementById("accountLabel");
  const loginMenuItem = document.getElementById("loginMenuItem");
  const logoutMenuItem = document.getElementById("logoutMenuItem");
  const logoutBtn = document.getElementById("logoutBtn");
  const projectSearchForm = document.getElementById("projectSearchForm");
  const projectSearch = document.getElementById("projectSearch");
  const searchHint = document.getElementById("searchHint");
  const successToast = bootstrap.Toast.getOrCreateInstance(document.getElementById("successToast"), {
    delay: 3500
  });

  let pendingEmail = "";

  function setSignedIn(label = "Signed in") {
    accountLabel.textContent = label;
    loginMenuItem.classList.add("d-none");
    logoutMenuItem.classList.remove("d-none");
    successToast.show();
  }

  emailLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!emailLoginForm.checkValidity()) {
      event.stopPropagation();
      emailLoginForm.classList.add("was-validated");
      return;
    }

    pendingEmail = emailInput.value.trim();
    verificationEmail.textContent = pendingEmail;

    loginModal.hide();

    loginModalEl.addEventListener("hidden.bs.modal", () => {
      verificationModal.show();
      setTimeout(() => verificationCode.focus(), 250);
    }, { once: true });
  });

  verificationCode.addEventListener("input", () => {
    verificationCode.value = verificationCode.value.replace(/\D/g, "").slice(0, 6);
  });

  verificationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!verificationForm.checkValidity()) {
      event.stopPropagation();
      verificationForm.classList.add("was-validated");
      return;
    }

    verificationModal.hide();

    const readableName = pendingEmail
      ? pendingEmail.split("@")[0].replace(/[._-]+/g, " ")
      : "Signed User";

    const label = readableName
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    setSignedIn(label || "Signed User");
    verificationForm.reset();
    verificationForm.classList.remove("was-validated");
  });

  differentEmailBtn.addEventListener("click", () => {
    verificationModal.hide();

    verificationModalEl.addEventListener("hidden.bs.modal", () => {
      loginModal.show();
      setTimeout(() => emailInput.focus(), 250);
    }, { once: true });
  });

  resendBtn.addEventListener("click", () => {
    verificationStatus.classList.remove("d-none");

    window.setTimeout(() => {
      verificationStatus.classList.add("d-none");
    }, 2500);
  });

  googleBtn.addEventListener("click", () => {
    loginModal.hide();
    setSignedIn("Google User");
  });

  logoutBtn.addEventListener("click", () => {
    accountLabel.textContent = "Guest User";
    logoutMenuItem.classList.add("d-none");
    loginMenuItem.classList.remove("d-none");
  });

  projectSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = projectSearch.value.trim();

    if (!value) {
      searchHint.textContent = "Enter a homeowner, address, project name, or reference number.";
      projectSearch.focus();
      return;
    }

    searchHint.textContent = `Searching for “${value}”…`;
  });
});
