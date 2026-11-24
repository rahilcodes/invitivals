/* RSVPSection — three things only (client, 2026-11-24): the guest's name, the answer (two choices) and the number of
   guests attending (asked only after "Yes"). The reply is stored on our server by rsvp.php next to this page
   (cfg.rsvp.endpoint); the family reads the replies at /admin/sai-sushmitha-sai-santosh-rsvp/ and downloads them as a
   CSV from /admin/sai-sushmitha-sai-santosh-rsvp/export/. A "No" is kept as a reply with 0 guests attending.
   The thank-you appears only once the server has confirmed the reply is stored. */
import { Heading, Button, FloralVine } from '../decor.js';
import { $ } from '../util.js';

export const RSVPSection = (cfg) => `
<section class="sec rsvp" id="rsvp" aria-labelledby="rsvp-h">
  ${FloralVine({ side: 'l', top: '-60px', height: '620px', crop: 15, depth: 0.05 })}
  ${FloralVine({ side: 'r', top: '-60px', height: '620px', crop: 15, depth: 0.05 })}
  <div class="sec-inner">
    ${Heading('Kindly RSVP', 'We would love to know if you can join us', { id: 'rsvp-h' })}
    <form class="rsvp-form" id="rsvp-form" data-reveal novalidate>
      <label class="field"><span>Guest name</span><input name="name" autocomplete="name" maxlength="80" placeholder="Full name" required></label>
      <fieldset class="field rsvp-choices">
        <legend><span>Attendance</span></legend>
        ${cfg.rsvp.choices.map((label, i) => `<label class="rsvp-choice"><input type="radio" name="attending" value="${i ? 'no' : 'yes'}"><i aria-hidden="true"></i><span>${label}</span></label>`).join('')}
      </fieldset>
      <div class="field rsvp-guests" hidden>
        <span id="guests-l">Number of guests attending</span>
        <div class="stepper" role="group" aria-labelledby="guests-l">
          <button type="button" data-step="-1" aria-label="Fewer guests">−</button>
          <output name="guests" aria-live="polite">1</output>
          <button type="button" data-step="1" aria-label="More guests">+</button>
        </div>
      </div>
      <input name="website" class="rsvp-trap" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="rsvp-actions">
        ${Button({ label: 'Send Response', icon: 'send', id: 'rsvp-send', attrs: 'type="submit"' }).replace('type="button" ', '')}
      </div>
      <p class="rsvp-status" id="rsvp-status" role="status" aria-live="polite"></p>
      ${cfg.rsvp.deadline ? `<p class="rsvp-note">${cfg.rsvp.deadline}</p>` : ''}
    </form>
    <p class="rsvp-thanks prose" id="rsvp-thanks" hidden></p>
  </div>
</section>`;

export function initRSVP(cfg, guest) {
  const form = $('#rsvp-form');
  const out = form.querySelector('output');
  const name = form.elements.name;
  const guests = form.querySelector('.rsvp-guests');
  const status = $('#rsvp-status');
  const send = $('#rsvp-send');
  if (guest) name.value = guest;
  form.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => {
    out.value = Math.min(cfg.rsvp.maxGuests, Math.max(1, +out.value + +b.dataset.step));
  }));
  /* the number of guests is asked only of a guest who is coming */
  form.addEventListener('change', () => { guests.hidden = form.elements.attending.value !== 'yes'; });
  const bad = (msg, el) => { status.className = 'rsvp-status is-bad'; status.textContent = msg; if (el) el.focus(); };
  let sending = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;                                   // one send at a time: no double replies from a double tap
    const who = name.value.trim(), attending = form.elements.attending.value;
    name.closest('.field').classList.toggle('is-invalid', who.length < 2);
    if (who.length < 2) return bad('Please enter your name.', name);
    if (!attending) return bad(`Please choose “${cfg.rsvp.choices[0]}” or “${cfg.rsvp.choices[1]}”.`);
    const count = attending === 'yes' ? +out.value : 0;
    sending = true; send.disabled = true; status.className = 'rsvp-status'; status.textContent = 'Sending…';
    try {
      const r = await fetch(cfg.rsvp.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: who, attending, guests: count, website: form.elements.website.value }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || 'Your reply could not be sent. Please try again.');
      const thanks = $('#rsvp-thanks');
      const safe = who.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
      thanks.innerHTML = attending === 'yes'
        ? `Thank you, ${safe}. Your reply has been received.<br>We can’t wait to see you there.`
        : `Thank you, ${safe}, for letting us know.<br>You will be in our hearts on the day.`;
      form.hidden = true; thanks.hidden = false;
    } catch (err) {
      sending = false; send.disabled = false;
      bad(/fetch|network/i.test(err.message) ? 'Your reply could not be sent. Please check your connection and try again.' : err.message);
    }
  });
}
