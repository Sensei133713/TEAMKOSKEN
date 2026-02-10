document.addEventListener("DOMContentLoaded", function () {
  // Mobiilinavigaation toggle
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  var primaryMenu = document.getElementById("primary-menu");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    if (primaryMenu) {
      primaryMenu.addEventListener("click", function (e) {
        if (
          e.target.tagName.toLowerCase() === "a" &&
          mainNav.classList.contains("open")
        ) {
          mainNav.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  // Smooth scrolling
  var links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // Lomakkeen kevyt validointi
  var form = document.getElementById("contact-form");
  var messageEl = document.getElementById("form-message");

  function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  if (form && messageEl) {
    form.addEventListener("submit", function (e) {
      var name = form.elements["name"].value.trim();
      var email = form.elements["email"].value.trim();
      var msg = form.elements["message"].value.trim();

      if (!name || !email || !msg) {
        e.preventDefault();
        messageEl.textContent =
          "Täytä vähintään nimi, sähköposti ja viesti.";
        messageEl.classList.remove("success");
        messageEl.classList.add("error");
        return;
      }
      if (name.length < 2) {
        e.preventDefault();
        messageEl.textContent = "Kirjoita nimi kokonaisuudessaan.";
        messageEl.classList.remove("success");
        messageEl.classList.add("error");
        return;
      }
      if (!validateEmail(email)) {
        e.preventDefault();
        messageEl.textContent = "Tarkista sähköpostiosoitteen muoto.";
        messageEl.classList.remove("success");
        messageEl.classList.add("error");
        return;
      }

      messageEl.textContent =
        "Kiitos viestistä! Yritämme vastata mahdollisimman pian.";
      messageEl.classList.remove("error");
      messageEl.classList.add("success");
    });
  }

  // Vuoden automaattinen päivitys footerissa
  var yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Shrink vain nav-containeriin (sticky header) → ei heron nykimistä
  var navContainer = document.querySelector(".nav-container");

  function handleScroll() {
    if (!navContainer) return;
    var scrolled = window.scrollY > 80;
    navContainer.classList.toggle("shrink", scrolled);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});



// Johto-modal
var openLeadership = document.getElementById("open-leadership");
var leadershipModal = document.getElementById("leadership-modal");

function openModal() {
  if (!leadershipModal) return;
  leadershipModal.classList.add("is-open");
  leadershipModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!leadershipModal) return;
  leadershipModal.classList.remove("is-open");
  leadershipModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (openLeadership && leadershipModal) {
  openLeadership.addEventListener("click", openModal);

  leadershipModal.addEventListener("click", function (e) {
    if (e.target && e.target.hasAttribute("data-close-modal")) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && leadershipModal.classList.contains("is-open")) closeModal();
  });
}
