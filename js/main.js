/* =====================================================================
   DELUXE HOTEL · SCRIPTS
   Navigation, booking calculator, contact form, gallery lightbox,
   blog filters and scroll animations. No libraries needed.
   ===================================================================== */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Navigation ---------- */
  var nav = $('#nav');
  var toggle = $('#nav-toggle');
  var solidAlways = document.body.classList.contains('solid-nav');

  function onScroll() {
    nav.classList.toggle('scrolled', solidAlways || window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }
  toggle.addEventListener('click', function () {
    var open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('#nav-menu a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // Highlight the menu link of the section on screen
  var links = $$('#nav-menu a[href^="#"]:not(.btn)');
  if ('IntersectionObserver' in window && links.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var t = $(l.getAttribute('href')); if (t) spy.observe(t); });
  }

  /* ---------- Footer year ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Booking calculator ---------- */
  var booking = $('#booking');
  if (booking) {
    var ROOMS = {
      deluxe: { name: 'Deluxe Room', price: 180, max: 2 },
      superior: { name: 'Superior Room', price: 140, max: 4 },
      standard: { name: 'Standard Room', price: 95, max: 2 }
    };
    var inEl = $('#checkin'), outEl = $('#checkout'), guestsEl = $('#guests'), roomEl = $('#room'), msg = $('#booking-msg');

    function iso(d) { return d.toISOString().slice(0, 10); }
    var today = new Date(); today.setHours(12, 0, 0, 0);
    var tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    inEl.min = iso(today); outEl.min = iso(tomorrow);

    inEl.addEventListener('change', function () {
      if (!inEl.value) return;
      var next = new Date(inEl.value + 'T12:00:00'); next.setDate(next.getDate() + 1);
      outEl.min = iso(next);
      if (!outEl.value || outEl.value <= inEl.value) outEl.value = iso(next);
    });

    // "Book" buttons on room cards pick the room and jump to the form
    $$('[data-room]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        roomEl.value = btn.getAttribute('data-room');
        booking.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function () { inEl.focus({ preventScroll: true }); }, 500);
      });
    });

    function show(text, ok) { msg.textContent = text; msg.className = 'form-msg ' + (ok ? 'ok' : 'err'); }

    booking.addEventListener('submit', function (e) {
      e.preventDefault();
      [inEl, outEl].forEach(function (f) { f.classList.toggle('invalid', !f.value); });
      if (!inEl.value || !outEl.value) return show('Please choose your check-in and check-out dates.', false);
      var a = new Date(inEl.value + 'T12:00:00'), b = new Date(outEl.value + 'T12:00:00');
      var nights = Math.round((b - a) / 86400000);
      if (a < today) return show('Check-in cannot be in the past.', false);
      if (nights < 1) return show('Check-out must be at least one night after check-in.', false);
      var room = ROOMS[roomEl.value];
      var guests = Number(guestsEl.value);
      if (guests > room.max) return show('The ' + room.name + ' fits up to ' + room.max + ' guests. Try the Superior Room for families.', false);
      var total = nights * room.price;
      show('Good news: the ' + room.name + ' is available. ' + nights + (nights === 1 ? ' night' : ' nights') +
        ' × €' + room.price + ' = €' + total.toLocaleString('en-US') + ', breakfast included. (Demo site: no booking is made.)', true);
    });
  }

  /* ---------- Contact form ---------- */
  var form = $('#contact-form');
  if (form) {
    var cmsg = $('#contact-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#name'), email = $('#email'), message = $('#message');
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      name.classList.toggle('invalid', !name.value.trim());
      email.classList.toggle('invalid', !emailOk);
      message.classList.toggle('invalid', !message.value.trim());
      if (!name.value.trim() || !emailOk || !message.value.trim()) {
        cmsg.textContent = 'Please fill in your name, a valid email address and a message.';
        cmsg.className = 'form-msg err';
        return;
      }
      cmsg.textContent = 'Thank you, ' + name.value.trim().split(' ')[0] + '. Your message is ready. (Demo site: nothing is actually sent.)';
      cmsg.className = 'form-msg ok';
      form.reset();
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var items = $$('.g-item');
  var lb = $('#lightbox');
  if (items.length && lb) {
    var lbImg = $('#lb-img'), current = 0, lastFocus = null;
    function openAt(i) {
      current = (i + items.length) % items.length;
      var it = items[current];
      lbImg.src = it.getAttribute('data-full');
      lbImg.alt = $('img', it).alt;
      if (lb.hidden) { lastFocus = document.activeElement; lb.hidden = false; document.body.style.overflow = 'hidden'; $('#lb-close').focus(); }
    }
    function close() { lb.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
    items.forEach(function (it, i) { it.addEventListener('click', function () { openAt(i); }); });
    $('#lb-close').addEventListener('click', close);
    $('#lb-prev').addEventListener('click', function () { openAt(current - 1); });
    $('#lb-next').addEventListener('click', function () { openAt(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') openAt(current - 1);
      if (e.key === 'ArrowRight') openAt(current + 1);
    });
  }

  /* ---------- Blog: read more + category filters ---------- */
  $$('.read-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var post = btn.closest('.post');
      var open = post.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      $('span', btn).textContent = open ? 'Show less' : 'Read more';
    });
  });
  var chips = $$('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var cat = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      $$('.post').forEach(function (p) { p.hidden = cat !== 'all' && p.getAttribute('data-cat') !== cat; });
    });
  });

  /* ---------- Scroll reveal ---------- */
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('seen');
        io.unobserve(el);
        // Hand hover effects back to their own, faster transitions
        setTimeout(function () { el.classList.remove('reveal'); el.style.transitionDelay = ''; }, 1400);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    $$('.reveal').forEach(function (el) {
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = Math.min(idx, 5) * 90 + 'ms';
      io.observe(el);
    });
  }
})();
