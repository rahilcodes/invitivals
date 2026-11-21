/* RSVPSection — one button, "Confirm your attendance", opens a short form: name, contact number, number of
   guests, accepting or declining. On submit the details are checked and WhatsApp opens to the family's number
   with the reply written out; the guest sends it there. Nothing is claimed as received: the page only says
   WhatsApp has been opened, and offers WhatsApp Web and a copy of the message as fall-backs. */
import { Heading, Button, FloralVine, Icon } from '../decor.js';
import { $ } from '../util.js';

export const RSVPSection = (cfg) => `
<section class="sec rsvp" id="rsvp" aria-labelledby="rsvp-h">
  ${FloralVine({ side: 'l', top: '-60px', height: '620px', crop: 15, depth: 0.05 })}
  ${FloralVine({ side: 'r', top: '-60px', height: '620px', crop: 15, depth: 0.05 })}
  <div class="sec-inner">
    ${Heading('Kindly RSVP', 'We would love to know if you can join us', { id: 'rsvp-h' })}
    <div class="rsvp-open" id="rsvp-open" data-reveal>
      ${Button({ label: 'Confirm Your Attendance', icon: 'whatsapp', id: 'rsvp-show', attrs: 'aria-controls="rsvp-form" aria-expanded="false"' })}
      <p class="rsvp-note">Your reply goes to the family on WhatsApp · ${cfg.rsvp.display}</p>
    </div>
    <form class="rsvp-form" id="rsvp-form" novalidate hidden>
      <label class="field" data-f="name"><span>Guest name</span><input name="name" autocomplete="name" placeholder="Full name" maxlength="60" required><em class="field-err" hidden>Please enter your name.</em></label>
      <label class="field" data-f="phone"><span>Contact number</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="e.g. 98765 43210" maxlength="20" required><em class="field-err" hidden>Please enter a valid contact number.</em></label>
      <div class="field" data-f="guests">
        <span id="guests-l">Number of guests attending</span>
        <div class="stepper" role="group" aria-labelledby="guests-l">
          <button type="button" data-step="-1" aria-label="Fewer guests">−</button>
          <output name="guests" aria-live="polite">1</output>
          <button type="button" data-step="1" aria-label="More guests">+</button>
        </div>
      </div>
      <fieldset class="field rsvp-choice" data-f="answer">
        <legend><span>Attendance</span></legend>
        <label><input type="radio" name="answer" value="Accepting"><span>Accepting</span></label>
        <label><input type="radio" name="answer" value="Declining"><span>Declining</span></label>
        <em class="field-err" hidden>Please choose Accepting or Declining.</em>
      </fieldset>
      <div class="rsvp-actions"><button class="btn" type="submit" id="rsvp-send">${Icon('whatsapp', 'ico ico-btn')}<span>Send on WhatsApp</span></button></div>
    </form>
    <div class="rsvp-after" id="rsvp-after" hidden aria-live="polite">
      <p class="prose small">WhatsApp should now be open with your reply written out. <b>Please tap Send there</b> so the family receives it.</p>
      <pre class="rsvp-msg" id="rsvp-msg"></pre>
      <div class="rsvp-fallback">
        <a class="btn btn-ghost" id="rsvp-web" target="_blank" rel="noopener">Open in WhatsApp Web</a>
        <button type="button" class="btn btn-ghost" id="rsvp-copy">Copy the message</button>
        <button type="button" class="rsvp-edit" id="rsvp-edit">Change my reply</button>
      </div>
    </div>
  </div>
</section>`;

export function initRSVP(cfg, guest) {
  const form = $('#rsvp-form'), out = form.querySelector('output');
  const show = $('#rsvp-show'), after = $('#rsvp-after');
  if (guest) form.elements.name.value = guest;
  show.addEventListener('click', () => {
    $('#rsvp-open').hidden = true; form.hidden = false; show.setAttribute('aria-expanded', 'true');
    form.elements.name.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  form.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => {
    out.value = Math.min(20, Math.max(0, +out.value + +b.dataset.step));
  }));
  const flag = (key, bad) => {
    const f = form.querySelector(`[data-f="${key}"]`);
    f.classList.toggle('is-invalid', bad); f.querySelector('.field-err').hidden = !bad;
    return bad;
  };
  form.addEventListener('change', (e) => { if (e.target.name === 'answer') { flag('answer', false); out.value = e.target.value === 'Declining' ? 0 : Math.max(1, +out.value); } });
  let msg = '';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim().replace(/\s+/g, ' ');
    const phone = form.elements.phone.value.trim();
    const digits = phone.replace(/\D/g, '');
    const answer = form.elements.answer.value;
    const bad = [flag('name', name.length < 2), flag('phone', digits.length < 10 || digits.length > 13 || /[^\d\s+()-]/.test(phone)), flag('answer', !answer)];
    if (bad.some(Boolean)) { form.querySelector('.is-invalid input')?.focus(); return; }
    const guests = answer === 'Declining' ? 0 : out.value;
    msg = [
      `Hello, I would like to confirm my attendance for the wedding of ${cfg.fullPair}.`, '',
      `Name: ${name}`, `Contact Number: ${phone}`, `Number of Guests: ${guests}`, `Attendance: ${answer}`, '', 'Thank you.',
    ].join('\n');
    const text = encodeURIComponent(msg);
    $('#rsvp-msg').textContent = msg;
    $('#rsvp-web').href = `https://web.whatsapp.com/send?phone=${cfg.rsvp.whatsapp}&text=${text}`;
    window.open(`https://wa.me/${cfg.rsvp.whatsapp}?text=${text}`, '_blank', 'noopener');
    form.hidden = true; after.hidden = false;
  });
  $('#rsvp-copy').addEventListener('click', async (e) => {
    const b = e.currentTarget;
    try { await navigator.clipboard.writeText(msg); b.textContent = 'Copied'; }
    catch { const r = document.createRange(); r.selectNodeContents($('#rsvp-msg')); getSelection().removeAllRanges(); getSelection().addRange(r); b.textContent = 'Selected: copy it'; }
    setTimeout(() => { b.textContent = 'Copy the message'; }, 2500);
  });
  $('#rsvp-edit').addEventListener('click', () => { after.hidden = true; form.hidden = false; });
}

