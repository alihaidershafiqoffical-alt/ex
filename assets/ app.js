/* =====================================================================
   IVD — shared behavior for every page.
   Split into small, independent pieces — each guards for the elements it
   needs, so this one file works unchanged whether a page has a carousel,
   an FAQ, a contact form, all three, or none of them.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ---- 1. Mobile nav toggle ------------------------------------------
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
    // Close the mobile menu once a link is tapped.
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { navLinks.classList.remove('is-open'); });
    });
  }

  // ---- 2. Active nav-link highlighting --------------------------------
  // Each page sets data-page="home" / "pricing-page" / etc. on <body>.
  // Nav links carry a matching data-page attribute. This just compares
  // the two and applies the "is-active" class (styled in primary blue).
  var currentPage = document.body.getAttribute('data-page');
  if (currentPage) {
    document.querySelectorAll('.nav-link[data-page]').forEach(function (link) {
      if (link.getAttribute('data-page') === currentPage) {
        link.classList.add('is-active');
      }
    });
  }

  // ---- 3. Software preview carousel ------------------------------------
  var track = document.querySelector('.carousel-track');
  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = document.querySelector('.carousel-dots');
    var prevBtn = document.querySelector('.carousel-btn.prev');
    var nextBtn = document.querySelector('.carousel-btn.next');
    var index = 0;
    var autoplayTimer;

    // Build one dot per slide.
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () { goTo(i); resetAutoplay(); });
      dotsWrap.appendChild(dot);
    });

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dotsWrap.querySelectorAll('button').forEach(function (dot, di) {
        dot.classList.toggle('is-active', di === index);
      });
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(function () { goTo(index + 1); }, 5000);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); resetAutoplay(); });

    goTo(0);
    resetAutoplay();
  }

  // ---- 4. FAQ accordion --------------------------------------------------
  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      var item = question.closest('.faq-item');
      var wasOpen = item.classList.contains('is-open');
      // Close every other item so only one answer is open at a time.
      item.parentElement.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('is-open');
      });
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  // ---- 5. Support topic cards (contact.html) ------------------------------
  // Clicking a topic card scrolls to the form and pre-selects the matching
  // option in the "Topic" dropdown, so the user doesn't retype their issue.
  document.querySelectorAll('.support-card[data-topic]').forEach(function (card) {
    card.addEventListener('click', function () {
      var topicSelect = document.getElementById('contact-topic');
      var form = document.querySelector('.form-card');
      if (topicSelect) topicSelect.value = card.getAttribute('data-topic');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // ---- 6. Contact form submission ----------------------------------------
  // Static page, no backend — this just confirms receipt and resets the
  // form. Swap the alert() for a real fetch() call to your API later.
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var name = document.getElementById('contact-name').value;
      alert('Thanks, ' + name + '! Your message has been received \u2014 we\'ll get back to you within a day.');
      contactForm.reset();
    });
  }
});
