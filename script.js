/**
 * Team Kosken - Main JavaScript
 * Modaalit: Ota yhteyttä (4 henkilöä) ja Tarjouspyynnöt (Tuomas)
 */

document.addEventListener("DOMContentLoaded", function () {
  
  // =========================
  // 1) SCROLL REVEAL - Elementit aukeaa skrollatessa
  // =========================
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    scrollRevealElements.forEach(el => revealObserver.observe(el));
  } else {
    scrollRevealElements.forEach(el => el.classList.add('is-visible'));
  }

  // =========================
  // 2) Mobiilinavigaatio
  // =========================
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  var primaryMenu = document.getElementById("primary-menu");
  var navOverlay = document.querySelector("[data-nav-overlay]");

  function openNav() {
    if (!mainNav || !navToggle) return;
    mainNav.classList.add("open");
    if (navOverlay) navOverlay.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    if (!mainNav || !navToggle) return;
    mainNav.classList.remove("open");
    if (navOverlay) navOverlay.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function() {
      mainNav.classList.contains("open") ? closeNav() : openNav();
    });

    if (primaryMenu) {
      primaryMenu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", closeNav);
      });
    }

    if (navOverlay) navOverlay.addEventListener("click", closeNav);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mainNav.classList.contains("open")) closeNav();
    });
  }

  // =========================
  // 3) Smooth scrolling
  // =========================
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (!targetId || targetId.length <= 1) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Header shrink skrollatessa
  var navContainer = document.querySelector(".nav-container");
  function handleScroll() {
    if (!navContainer) return;
    navContainer.classList.toggle("shrink", window.scrollY > 80);
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // =========================
  // 4) MODAALIT - Ota yhteyttä + Tarjouspyynnöt
  // =========================
  function initModal(openButtons, modalId, closeAttr) {
    var modal = document.getElementById(modalId);
    if (!modal) return;
    
    var backdrop = modal.querySelector('.modal-backdrop');
    var closeBtn = modal.querySelector('.modal-close');
    var lastFocusedElement = null;

    function open(e) {
      if (e) e.preventDefault();
      lastFocusedElement = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
      trapFocus(modal);
    }

    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocusedElement) lastFocusedElement.focus();
    }
    
    function trapFocus(modalEl) {
      var focusableElements = modalEl.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;
      var firstFocusable = focusableElements[0];
      var lastFocusable = focusableElements[focusableElements.length - 1];

      modalEl.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      });
    }

    // Avaa-napit (voi olla useita)
    openButtons.forEach(function(btn) {
      if (btn) btn.addEventListener("click", open);
    });

    // Sulje-napit
    modal.querySelectorAll("[" + closeAttr + "]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    
    if (backdrop) backdrop.addEventListener('click', close);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  // Ota yhteyttä -modaali (4 henkilöä)
  var leadershipButtons = [
    document.getElementById("open-leadership"),
    document.getElementById("open-leadership-bottom")
  ].filter(Boolean);
  initModal(leadershipButtons, "leadership-modal", "data-close-modal");

  // Tarjouspyynnöt -modaali (vain Tuomas)
  var tarjousButtons = [
    document.getElementById("open-tarjous"),
    document.getElementById("open-tarjous-bottom")
  ].filter(Boolean);
  initModal(tarjousButtons, "tarjous-modal", "data-close-tarjous");

  // =========================
  // 5) Lomakkeen validointi
  // =========================
  var form = document.getElementById("contact-form");
  var messageEl = document.getElementById("form-message");

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (form && messageEl) {
    form.addEventListener("submit", function (e) {
      var name = (form.elements["name"]?.value || "").trim();
      var email = (form.elements["email"]?.value || "").trim();
      var msg = (form.elements["message"]?.value || "").trim();

      function setMsg(text, type) {
        messageEl.textContent = text;
        messageEl.classList.remove("error", "success");
        messageEl.classList.add(type);
      }

      if (!name || !email || !msg) {
        e.preventDefault();
        setMsg("Täytä vähintään nimi, sähköposti ja viesti.", "error");
        return;
      }
      if (name.length < 2) {
        e.preventDefault();
        setMsg("Kirjoita nimi kokonaisuudessaan.", "error");
        return;
      }
      if (!validateEmail(email)) {
        e.preventDefault();
        setMsg("Tarkista sähköpostiosoitteen muoto.", "error");
        return;
      }
      setMsg("Kiitos viestistä! Yritämme vastata mahdollisimman pian.", "success");
    });
  }

  // =========================
  // 6) Footer year
  // =========================
  var yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // =========================
  // 7) Accordion (mobiili)
  // =========================
  document.querySelectorAll('[data-accordion="single"]').forEach(function (list) {
    list.addEventListener("toggle", function (e) {
      if (!(e.target instanceof HTMLDetailsElement)) return;
      if (!e.target.open) return;
      list.querySelectorAll("details").forEach(function (d) {
        if (d !== e.target) d.open = false;
      });
    }, true);
  });
  
  // =========================
  // 8) Lazy loading fallback
  // =========================
  if (!('loading' in HTMLImageElement.prototype)) {
    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      var imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src || img.src;
            img.removeAttribute('loading');
            imageObserver.unobserve(img);
          }
        });
      });
      lazyImages.forEach(function(img) { imageObserver.observe(img); });
    }
  }
});
// ============================================
// KORJAUS: Yläpalkin "Ota yhteyttä" avaa modaalin
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Etsi yläpalkin "Ota yhteyttä" linkki
  const navContactLink = document.querySelector('.nav-menu a[href="#yhteys"]');
  
  if (navContactLink) {
    // Poista oletusankkuri-toiminto
    navContactLink.removeAttribute('href');
    navContactLink.style.cursor = 'pointer';
    
    // Lisää click-kuuntelija modaalin avaamiseksi
    navContactLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Avaa leadership-modal (Yhteyshenkilöt)
      const modal = document.getElementById('leadership-modal');
      if (modal) {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Estä vieritys
      }
    });
  }
  
});