(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('primary-nav');
  var dropdownWraps = Array.prototype.slice.call(document.querySelectorAll('.nav-dropdown-wrap'));
  var dropdownButtons = Array.prototype.slice.call(document.querySelectorAll('.nav-toggle'));
  var desktopQuery = window.matchMedia('(min-width: 981px)');
  var hoverTimer = null;

  function panelFor(button) {
    return document.getElementById(button.getAttribute('aria-controls'));
  }

  function setDropdown(button, open) {
    var panel = panelFor(button);
    if (!panel) return;
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.classList.toggle('is-open', open);
  }

  function closeDropdowns(except) {
    dropdownButtons.forEach(function (button) {
      if (button !== except) setDropdown(button, false);
    });
  }

  function closeMenu(returnFocus) {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    closeDropdowns();
    if (returnFocus) toggle.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var opening = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', opening ? 'true' : 'false');
      nav.classList.toggle('is-open', opening);
      document.body.classList.toggle('nav-open', opening);
      if (opening) {
        var firstLink = nav.querySelector('a, button');
        if (firstLink) firstLink.focus();
      }
    });
  }

  dropdownButtons.forEach(function (button) {
    button.setAttribute('aria-haspopup', 'true');
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      var opening = button.getAttribute('aria-expanded') !== 'true';
      closeDropdowns(button);
      setDropdown(button, opening);
    });
  });

  dropdownWraps.forEach(function (wrap) {
    var button = wrap.querySelector('.nav-toggle');
    if (!button) return;

    wrap.addEventListener('mouseenter', function () {
      if (!desktopQuery.matches) return;
      window.clearTimeout(hoverTimer);
      closeDropdowns(button);
      setDropdown(button, true);
    });

    wrap.addEventListener('mouseleave', function () {
      if (!desktopQuery.matches) return;
      hoverTimer = window.setTimeout(function () {
        if (!wrap.contains(document.activeElement)) setDropdown(button, false);
      }, 140);
    });

    wrap.addEventListener('focusin', function () {
      if (!desktopQuery.matches) return;
      closeDropdowns(button);
      setDropdown(button, true);
    });

    wrap.addEventListener('focusout', function (event) {
      if (!desktopQuery.matches) return;
      if (!wrap.contains(event.relatedTarget)) setDropdown(button, false);
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav-dropdown-wrap')) closeDropdowns();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var openButton = dropdownButtons.filter(function (button) {
      return button.getAttribute('aria-expanded') === 'true';
    })[0];
    if (openButton) {
      setDropdown(openButton, false);
      openButton.focus();
      return;
    }
    if (nav && nav.classList.contains('is-open')) closeMenu(true);
  });

  if (nav) {
    nav.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (link && !desktopQuery.matches) closeMenu(false);
    });
  }

  var onQueryChange = function (event) {
    if (!event.matches) closeMenu(false);
  };

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', onQueryChange);
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(onQueryChange);
  }

  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll('form.quote-form'));
  forms.forEach(function (form) {
    form.addEventListener('submit', function () {
      var button = form.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.textContent = 'Sending request…';
      }
    });
  });
})();
