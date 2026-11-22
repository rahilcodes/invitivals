/* RSVPSection — name, contact number, number of guests, and two answers (the Nandana Vanam system).
   The reply is POSTed to rsvp.php, which stores it on the server for the hosts' private list; the thank-you is
   shown only after the server confirms it is stored. Nothing is kept in the browser. */
import { Heading, Button, FloralVine } from '../decor.js';
import { $ } from '../util.js';

export const RSVPSection = () => `
<section class="sec rsvp" id="rsvp" aria-labelledby="rsvp-h">
  ${FloralVine({ side: 'l', top: '-60px', height: '620px', crop: 15, depth: 0.05 })}
  ${FloralVine({ side: 'r', top: '-60px', height: '620px', crop: 15, depth: 0.05 })}
  <div class="sec-inner">
    ${Heading('Kindly RSVP', 'We would love to know if you can join us', { id: 'rsvp-h' })}
    <form class="rsvp-form" id="rsvp-form" data-reveal novalidate>
      <label class="field" data-f="name"><span>Your name</span><input name="name" autocomplete="name" placeholder="Full name" maxlength="80" required><em class="field-err" hidden>Please enter your full name.</em></label>
      <label class="field" data-f="phone"><span>Contact number</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="e.g. 98765 43210" maxlength="24" required><em class="field-err" hidden>Please enter a valid contact number.</em></label>
      <input class="rsvp-trap" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="field">
        <span id="guests-l">Number of guests</span>
        <div class="stepper" role="group" aria-labelledby="guests-l">
          <button type="button" data-step="-1" aria-label="Fewer guests">−</button>
          <output name="guests" aria-live="polite">2</output>
          <button type="button" data-step="1" aria-label="More guests">+</button>
        </div>
      </div>
      <div class="rsvp-actions">
        ${Button({ label: 'I’ll Be There', id: 'rsvp-yes', attrs: 'data-answer="yes"' })}
        ${Button({ label: 'Unable to Attend', id: 'rsvp-no', cls: 'btn-ghost', attrs: 'data-answer="no"' })}
      </div>
      <p class="rsvp-status" id="rsvp-status" role="status" aria-live="polite"></p>
    </form>
    <div class="rsvp-done" id="rsvp-done" hidden>
      <p class="rsvp-thanks prose" id="rsvp-thanks" tabindex="-1"></p>
      <button type="button" class="rsvp-again" id="rsvp-again">Change my reply</button>
    </div>
  </div>
</section>`;

export function initRSVP(cfg, guest) {
  const form = $('#rsvp-form'), out = form.querySelector('output'), status = $('#rsvp-status');
  const name = form.elements.name, phone = form.elements.phone, done = $('#rsvp-done'), thanks = $('#rsvp-thanks');
  const MAX = cfg.rsvp.maxGuests || 20;
  let busy = false;
  form.reset();
  if (guest && !/&| and |family/i.test(guest)) name.value = guest;
  form.addEventListener('submit', (e) => e.preventDefault());
  form.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => {
    out.value = Math.min(MAX, Math.max(1, +out.value + +b.dataset.step));
  }));
  const flag = (key, bad) => {
    const f = form.querySelector(`[data-f="${key}"]`);
    f.classList.toggle('is-invalid', bad); f.querySelector('.field-err').hidden = !bad;
    return bad;
  };
  name.addEventListener('input', () => flag('name', false));
  phone.addEventListener('input', () => flag('phone', false));
  const say = (cls, text) => { status.className = 'rsvp-status ' + cls; status.textContent = text; };

  form.querySelectorAll('[data-answer]').forEach((b) => b.addEventListener('click', async () => {
    if (busy) return;
    const who = name.value.trim().replace(/\s+/g, ' '), tel = phone.value.trim(), digits = tel.replace(/\D/g, '');
    const bad = [flag('name', who.length < 2), flag('phone', !/^\+?[0-9\s().-]+$/.test(tel) || digits.length < 7 || digits.length > 15)];
    if (bad.some(Boolean)) { say('is-error', ''); form.querySelector('.is-invalid input')?.focus(); return; }
    const yes = b.dataset.answer === 'yes';
    busy = true; form.classList.add('is-busy'); say('', 'Sending your reply…');
    try {
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 15000);
      const res = await fetch(cfg.rsvp.endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal,
        body: JSON.stringify({ name: who, phone: tel, attending: yes ? 'yes' : 'no', guests: yes ? +out.value : 0, website: form.elements.website.value }),
      });
      clearTimeout(timer);
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) { say('is-error', data?.error || 'Your reply could not be saved. Please try again.'); return; }
      thanks.textContent = yes
        ? `Thank you, ${who}. We look forward to welcoming ${+out.value === 1 ? 'you' : `you and your guests (${out.value} in all)`}.`
        : `Thank you, ${who}. We will miss you, and are grateful for your blessings.`;
      form.hidden = true; done.hidden = false; say('', '');
      thanks.focus({ preventScroll: true });
    } catch {
      say('is-error', 'No connection. Your reply was not sent; please try again.');
    } finally {
      busy = false; form.classList.remove('is-busy');
    }
  }));
  $('#rsvp-again').addEventListener('click', () => { done.hidden = true; form.hidden = false; });
}
