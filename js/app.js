const token = localStorage.token;
if (!token) location.href = '/login.html';
const me = JSON.parse(localStorage.user || '{}');
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => '$' + (+n || 0).toFixed(2).replace(/\.00$/, '');
const day = d => d ? String(d).slice(0, 10) : '';
$('#uname').textContent = me.name || ''; $('#av').textContent = (me.name || '?')[0];
$('#out').onclick = e => { e.preventDefault(); localStorage.clear(); location.href = '/login.html'; };

async function api(path, opt = {}) {
  const r = await fetch(API_BASE + path, { method: opt.method || 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: opt.body ? JSON.stringify(opt.body) : undefined });
  if (r.status === 401) { localStorage.clear(); location.href = '/login.html'; }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Request failed');
  return d;
}
function toast(msg, err) {
  const t = document.createElement('div'); t.className = 'toast' + (err ? ' err' : ''); t.textContent = msg; t.setAttribute('role', 'status');
  document.body.append(t); setTimeout(() => t.remove(), 3200);
}
const tryDo = fn => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message, true); } };
const logo = `<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M5 62C30 40 45 40 60 40s30 0 55 22C85 52 75 50 60 50S35 52 5 62Z" fill="#4aa3d4"/><path d="M60 5l4 18M60 5l-4 18M44 12l8 16M76 12l-8 16M32 24l12 12M88 24l-12 12" stroke="#4aa3d4" stroke-width="5" stroke-linecap="round"/><path d="M42 30c6-6 12-4 18-2 6-2 12-4 18 2 4 12-2 22-6 40-2 8-6 8-8-2-1-8-2-12-4-12s-3 4-4 12c-2 10-6 10-8 2-4-18-10-28-6-40Z" fill="#fff" stroke="#2d6a82" stroke-width="4"/></svg>`;
const head = (sub = '') => `<div class="brand">${sub ? '' : logo}<h1>52-Dental Clinic</h1><hr></div>`;

const routes = {
  async main() {
    const d = await api('/dashboard');
    const rows = [['Payments today', money(d.payments_today), '$'], ['box (today)', money(d.box), '▣'], ['The patients', d.patients, '👥'],
      ['Appointments today', d.appointments, '🔗'], ['Users', d.users, '▤'], ["Today's reviews", d.reviews, '🔒']];
    const tiles = [['#/appointments', '📅', 'Appointments'], ['#/patients', '📁', 'files'], ['#/new-patient', '🦷', 'new patient'],
      ['#/appointments', '📋', "Today's reviews"], ['#/reports', '📊', 'Reports'], ['#/payments', '💵', 'Payments'],
      ['#/box', '🧰', 'box'], ['#/patients', '🔄', 'Pictures'], ['#/users', '🧑‍⚕️', 'Users']];
    return head() + `<div class="dash"><div class="stats">${rows.map(r => `<div><span>${r[2]}</span><span>${r[0]}</span><span class="badge">${r[1]}</span></div>`).join('')}</div>
      <div class="tiles">${tiles.map(t => `<a class="tile" href="${t[0]}"><span class="ico">${t[1]}</span>${t[2]}</a>`).join('')}</div></div>`;
  },

  'new-patient'() {
    setTimeout(() => $('#pf').onsubmit = tryDo(async e => {
      e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
      const p = await api('/patients', { method: 'POST', body: f }); toast('Patient file created'); location.hash = '#/patient/' + p.id;
    }));
    return head(1) + `<form class="panel" id="pf"><h2 class="title">new patient | <b>New file</b></h2>
      <div class="grid2"><input class="field" name="phone" placeholder="Telephone number" required aria-label="Telephone number"><input class="field" name="name" placeholder="Patient name" required aria-label="Patient name"></div>
      <select class="field" name="gender" style="margin-bottom:16px" aria-label="Gender"><option value="">===Choose a gender==</option><option>Male</option><option>Female</option></select>
      <textarea class="field" name="note" placeholder="note" aria-label="Note"></textarea>
      <p style="text-align:center"><button class="btn">Save file</button></p></form>`;
  },

  async patients() {
    const render = tryDo(async () => {
      const list = await api(`/patients?name=${encodeURIComponent($('#sn').value)}&from=${$('#sd').value}`);
      $('#pt').innerHTML = list.length ? list.map((p, i) => `<tr class="${i === 0 ? 'alt' : ''}"><td><div class="row-actions">
        <a class="btn sm" href="#/patient/${p.id}">View file</a><a class="btn sm dark" href="#/patient/${p.id}/edit">Edit file</a>
        <button class="btn sm red" data-del="${p.id}">delete file</button></div></td><td>${esc(day(p.created_at))}</td><td>${esc(p.phone)}</td><td>${esc(p.name)}</td><td>${p.id}</td></tr>`).join('')
        : `<tr><td colspan="5" class="empty">No patient files match. Try a different name or clear the date.</td></tr>`;
      document.querySelectorAll('[data-del]').forEach(b => b.onclick = tryDo(async () => {
        if (!confirm('Delete this patient file and all its sessions and payments?')) return;
        await api('/patients/' + b.dataset.del, { method: 'DELETE' }); toast('File deleted'); render();
      }));
    });
    setTimeout(() => { $('#go').onclick = render; $('#sn').oninput = render; render(); });
    return head(1) + `<h2 class="title"><b>Patient files |</b> 📋</h2><div class="crumb">The patients / Patient records</div>
      <div class="panel"><div class="filters"><button class="btn" id="go">research 🔍</button><input class="field" id="sd" type="date" aria-label="File date from"><input class="field" id="sn" placeholder="Patient name" aria-label="Patient name"></div></div>
      <div class="panel"><table><thead><tr><th>Action</th><th>File History</th><th>File No</th><th>Patient name</th><th>patient number</th></tr></thead><tbody id="pt"></tbody></table></div>`;
  },

  async patient(id, sub) {
    const p = await api('/patients/' + id);
    const edit = sub === 'edit';
    setTimeout(() => {
      if (edit) $('#ef').onsubmit = tryDo(async e => { e.preventDefault(); await api('/patients/' + id, { method: 'PUT', body: Object.fromEntries(new FormData(e.target)) }); toast('File saved'); location.hash = '#/patient/' + id; });
      $('#as') && ($('#as').onclick = tryDo(async () => { const s = await api(`/patients/${id}/sessions`, { method: 'POST', body: {} }); location.hash = '#/session/' + s.id; }));
      $('#df') && ($('#df').onclick = tryDo(async () => { if (confirm('Delete this patient file?')) { await api('/patients/' + id, { method: 'DELETE' }); location.hash = '#/patients'; } }));
      document.querySelectorAll('[data-ds]').forEach(b => b.onclick = tryDo(async () => { if (confirm('Delete this session?')) { await api('/sessions/' + b.dataset.ds, { method: 'DELETE' }); routeNow(); } }));
    });
    const ro = edit ? '' : 'readonly';
    return `<div class="panel"><div style="text-align:center"><div class="av" style="width:150px;height:150px;border-radius:50%;background:#53b6e3;color:#fff;margin:0 auto;display:grid;place-items:center;font-size:4rem">${esc(p.name[0])}</div>
      <h2 class="title" style="margin-top:14px">${edit ? 'edit file' : 'patient file'} | <b>${esc(p.name)}</b></h2></div>
      <form id="ef"><div class="grid2"><div><label>patient number</label><input class="field" value="${p.id}" readonly></div><div><label>Patient name</label><input class="field" name="name" value="${esc(p.name)}" ${ro}></div></div>
      <div class="grid2"><div><label>Telephone number</label><input class="field" name="phone" value="${esc(p.phone)}" ${ro}></div><div><label>entry date</label><input class="field" value="${esc(String(p.created_at).replace('T', ' ').slice(0, 19))}" readonly></div></div>
      <label>patient's gender</label>${edit ? `<select class="field" name="gender"><option ${p.gender === 'Male' ? 'selected' : ''}>Male</option><option ${p.gender === 'Female' ? 'selected' : ''}>Female</option></select>` : `<input class="field" value="${esc(p.gender || '')}" readonly>`}
      <label style="margin-top:16px">Doctor's notes</label><textarea class="field" name="note" ${ro}>${esc(p.note || '')}</textarea>
      ${edit ? '<p style="text-align:center"><button class="btn">Save changes</button></p>' : ''}</form></div>
      <div class="grid2" style="max-width:1100px;margin:0 auto"><div class="panel"><h3 style="text-align:center;font-weight:500">sessions</h3>
      <table><thead><tr><th>the details</th><th>session date</th><th>cost</th></tr></thead><tbody>${p.sessions.map(s => `<tr><td><div class="row-actions"><button class="btn sm red" data-ds="${s.id}">delete session</button><a class="btn sm" href="#/session/${s.id}">View details</a></div></td><td>${esc(day(s.session_date))}</td><td>${money(s.cost)}</td></tr>`).join('') || '<tr><td colspan="3" class="empty" style="color:#777">No sessions yet. Add the first one.</td></tr>'}</tbody></table></div>
      <div class="panel"><h3 style="text-align:center;font-weight:500">the procedures</h3><table>
      <tr><td><a href="#/patient/${id}/edit" style="color:inherit;text-decoration:none">Edit file</a></td></tr>
      <tr><td><a href="#" id="df" style="color:var(--red);text-decoration:none">delete file</a></td></tr>
      <tr><td><a href="#" id="as" style="color:inherit;text-decoration:none">add session</a></td></tr>
      <tr><td><a href="#/statement/${id}" style="color:var(--green);text-decoration:none">Account statement</a></td></tr></table></div></div>`;
  },

  async statement(id) {
    const s = await api(`/patients/${id}/statement`);
    setTimeout(() => {
      $('#pdf').onclick = () => print();
      $('#mail').onclick = () => location.href = `mailto:?subject=${encodeURIComponent('Account statement – ' + s.patient.name)}&body=${encodeURIComponent(`Sessions: ${s.sessions}\nCharged: ${money(s.charged)}\nPaid: ${money(s.paid)}\nBalance due: ${money(s.debt)}`)}`;
      $('#pay').onsubmit = tryDo(async e => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)); await api('/payments', { method: 'POST', body: { ...f, patient_id: id } }); toast('Payment saved'); routeNow(); });
    });
    return head() + `<div class="panel"><h2 class="title">${esc(s.patient.name)} |<b>Account statement</b> |</h2>
      <div class="cards3"><div class="stat r"><h4>Debt amount</h4><p>${money(s.debt)}</p></div><div class="stat b"><h4>number of sessions</h4><p>${s.sessions}</p></div><div class="stat g"><h4>total payment</h4><p>${money(s.paid)}</p></div></div>
      ${s.payments.length ? `<table><thead><tr><th>Date</th><th>Type</th><th>Batch</th><th>Amount</th></tr></thead><tbody>${s.payments.map(p => `<tr><td>${day(p.paid_at)}</td><td>${esc(p.type)}</td><td>${esc(p.batch_number || '')}</td><td>${money(p.amount)}</td></tr>`).join('')}</tbody></table>` : '<p class="empty">There are no payments</p>'}
      <form id="pay" class="noprint grid2" style="margin-top:20px;grid-template-columns:2fr 1fr 1fr auto"><input class="field" name="amount" type="number" step="0.01" min="0.01" placeholder="Payment amount" required aria-label="Payment amount"><select class="field" name="type" aria-label="Type"><option>Cash</option><option>Card</option><option>Transfer</option></select><input class="field" name="batch_number" placeholder="batch number" aria-label="Batch number"><button class="btn green">Record payment</button></form>
      <div class="actions3 noprint"><button class="btn red" id="pdf">PDF Download</button><button class="btn" id="mail">Send to an email</button><button class="btn green" onclick="print()">Detection printing</button></div></div>`;
  },

  async session(id) {
    const s = await api('/sessions/' + id);
    const state = {}; s.teeth.forEach(t => state[t.tooth] = t);
    let cur = null;
    const upper = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28], lower = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
    const tp = n => `<button class="tooth" data-t="${n}" aria-label="Tooth ${n}"><svg viewBox="0 0 40 56"><path d="M8 8c6-6 18-6 24 0 4 10-2 18-4 30-1 8-5 14-8 6-1-4-2-7-4-7s-3 3-4 7c-3 8-7 2-8-6C10 26 4 18 8 8Z" fill="#f3f3f3" stroke="#666" stroke-width="2"/></svg><small>${n}</small></button>`;
    const D = ['Cares','Coron','Implant','RR','mobility','X-RAY','Impacted','XOP','RCT','C&C'], C = ['Normal','Bad','Extracted','Traded'];
    function paint() {
      document.querySelectorAll('.tooth').forEach(b => { const t = state[b.dataset.t]; b.dataset.c = t?.condition || ''; b.classList.toggle('has', !!t && (t.details.length || t.surfaces.length || t.note)); b.classList.toggle('sel', +b.dataset.t === cur); });
    }
    function pick(n) {
      cur = n; const t = state[n] ||= { tooth: n, condition: 'Normal', details: [], surfaces: [], note: '' };
      $('#cur').textContent = 'Tooth ' + n; $('#note').value = t.note || '';
      document.querySelectorAll('[name=cond]').forEach(r => r.checked = r.value === t.condition);
      document.querySelectorAll('[name=det]').forEach(c => c.checked = t.details.includes(c.value));
      document.querySelectorAll('.surf [data-s]').forEach(e => e.classList.toggle('on', t.surfaces.includes(e.dataset.s))); paint();
    }
    setTimeout(() => {
      document.querySelectorAll('.tooth').forEach(b => b.onclick = () => pick(+b.dataset.t));
      $('#chart').addEventListener('change', () => { if (!cur) return; const t = state[cur]; t.condition = document.querySelector('[name=cond]:checked')?.value || 'Normal'; t.details = [...document.querySelectorAll('[name=det]:checked')].map(x => x.value); paint(); });
      $('#note').oninput = () => { if (cur) { state[cur].note = $('#note').value; paint(); } };
      document.querySelectorAll('.surf [data-s]').forEach(e => e.onclick = () => { if (!cur) return toast('Select a tooth first', true); const t = state[cur], k = e.dataset.s; t.surfaces = t.surfaces.includes(k) ? t.surfaces.filter(x => x !== k) : [...t.surfaces, k]; e.classList.toggle('on'); paint(); });
      $('#save').onclick = tryDo(async () => {
        const teeth = Object.values(state).filter(t => t.condition !== 'Normal' || t.details.length || t.surfaces.length || t.note);
        await api('/sessions/' + id, { method: 'PUT', body: { session_date: $('#sdate').value, cost: $('#cost').value || 0, notes: $('#snotes').value, teeth } });
        toast('Session saved');
      });
      paint();
    });
    return `<div class="noprint"><div class="brand"><h1>52-Dental Clinic</h1><hr></div></div>
      <div class="panel"><h2 class="title">${esc(s.patient_name)} | <b>Session</b></h2>
      <div class="arch">${upper.map(tp).join('')}</div>
      <div class="chart-box" id="chart"><div><h3>Note</h3><textarea class="field" id="note" placeholder="Note for the selected tooth" style="text-align:left;min-height:240px"></textarea></div>
        <div><h3 id="cur">Select a tooth</h3><h3>Condition tooth</h3>${C.map(c => `<label class="opt" style="justify-content:flex-start"><input type="radio" name="cond" value="${c}"> ${c}</label>`).join('')}
        <h3 style="margin-top:20px">Details</h3><div class="opts2">${D.map(d => `<label class="opt" style="justify-content:flex-start"><input type="checkbox" name="det" value="${d}"> ${d}</label>`).join('')}</div></div>
        <svg class="surf" viewBox="0 0 200 200" role="group" aria-label="Tooth surfaces"><path data-s="top" d="M100 100 L24 24 A108 108 0 0 1 176 24Z"/><path data-s="right" d="M100 100 L176 24 A108 108 0 0 1 176 176Z"/><path data-s="bottom" d="M100 100 L176 176 A108 108 0 0 1 24 176Z"/><path data-s="left" d="M100 100 L24 176 A108 108 0 0 1 24 24Z"/><circle data-s="center" cx="100" cy="100" r="36"/></svg></div>
      <div class="arch" style="margin-top:24px">${lower.map(tp).join('')}</div>
      <div class="grid2"><div><label>Session date</label><input class="field" id="sdate" type="date" value="${day(s.session_date)}"></div><div><label>Cost</label><input class="field" id="cost" type="number" step="0.01" min="0" value="${s.cost}"></div></div>
      <label>Session notes</label><textarea class="field" id="snotes">${esc(s.notes || '')}</textarea>
      <p style="text-align:center"><button class="btn" id="save">Save session</button> <a class="btn dark" href="#/patient/${s.patient_id}">Back to file</a></p></div>`;
  },

  payments() {
    const render = tryDo(async () => {
      const qs = new URLSearchParams({ date: $('#fd').value, name: $('#fn').value, amount: $('#fa').value, batch: $('#fb').value });
      const l = await api('/payments?' + qs);
      $('#tb').innerHTML = l.length ? l.map(p => `<tr><td><button class="btn sm red" data-d="${p.id}">Delete</button></td><td>${money(p.amount)}</td><td>${esc(p.type)}</td><td>${esc(p.batch_number || '')}</td><td>${day(p.paid_at)}</td><td>${esc(p.patient_name)}</td></tr>`).join('') : '<tr><td colspan="6" class="empty">No payments found.</td></tr>';
      document.querySelectorAll('[data-d]').forEach(b => b.onclick = tryDo(async () => { if (confirm('Delete this payment?')) { await api('/payments/' + b.dataset.d, { method: 'DELETE' }); render(); } }));
    });
    setTimeout(() => { $('#go').onclick = render; render(); });
    return head() + `<div class="panel"><div class="grid2"><input class="field" id="fd" type="date" aria-label="Payment date"><input class="field" id="fn" placeholder="Patient name"></div>
      <div class="filters"><button class="btn" id="go">research 🔍</button><input class="field" id="fa" type="number" placeholder="Payment amount"><input class="field" id="fb" placeholder="batch number"></div></div>
      <div class="panel"><table><thead><tr><th>Action</th><th>Payment amount</th><th>Type</th><th>Payment value</th><th>Payment date</th><th>the customer</th></tr></thead><tbody id="tb"></tbody></table></div>`;
  },

  expenses() {
    const render = tryDo(async () => {
      const l = await api('/expenses');
      $('#tb').innerHTML = l.length ? l.map(x => `<tr><td>${day(x.spent_at)}</td><td>${esc(x.title)}</td><td>${money(x.amount)}</td><td>${esc(x.note || '')}</td><td><button class="btn sm red" data-d="${x.id}">Delete</button></td></tr>`).join('') : '<tr><td colspan="5" class="empty">No expenses yet. Add the first one above.</td></tr>';
      document.querySelectorAll('[data-d]').forEach(b => b.onclick = tryDo(async () => { if (confirm('Delete this expense?')) { await api('/expenses/' + b.dataset.d, { method: 'DELETE' }); render(); } }));
    });
    setTimeout(() => { render(); $('#ef').onsubmit = tryDo(async e => { e.preventDefault(); await api('/expenses', { method: 'POST', body: Object.fromEntries(new FormData(e.target)) }); e.target.reset(); toast('Expense saved'); render(); }); });
    return head() + `<form class="panel" id="ef"><h2 class="title"><b>Expenses</b></h2><div class="filters"><input class="field" name="title" placeholder="Title" required><input class="field" name="amount" type="number" step="0.01" min="0.01" placeholder="Amount" required><input class="field" name="spent_at" type="date"></div>
      <input class="field" name="note" placeholder="note" style="margin-top:16px"><p style="text-align:center"><button class="btn">Add expense</button></p></form>
      <div class="panel"><table><thead><tr><th>Date</th><th>Title</th><th>Amount</th><th>Note</th><th>Action</th></tr></thead><tbody id="tb"></tbody></table></div>`;
  },

  appointments() {
    const render = tryDo(async () => {
      const l = await api('/appointments?day=' + $('#ad').value);
      $('#tb').innerHTML = l.length ? l.map(a => `<tr><td>${esc(String(a.appt_at).replace('T', ' ').slice(0, 16))}</td><td><a href="#/patient/${a.patient_id}">${esc(a.patient_name)}</a></td><td>${esc(a.phone)}</td><td>${esc(a.reason || '')}</td><td>${a.status}</td><td><div class="row-actions"><button class="btn sm green" data-s="${a.id}:done">Done</button><button class="btn sm red" data-s="${a.id}:cancelled">Cancel</button></div></td></tr>`).join('') : '<tr><td colspan="6" class="empty">No appointments for this day.</td></tr>';
      document.querySelectorAll('[data-s]').forEach(b => b.onclick = tryDo(async () => { const [i, st] = b.dataset.s.split(':'); await api('/appointments/' + i, { method: 'PATCH', body: { status: st } }); render(); }));
    });
    setTimeout(async () => {
      $('#ad').value = new Date().toISOString().slice(0, 10); $('#ad').onchange = render; render();
      const pts = await api('/patients'); $('#ap').innerHTML = pts.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('');
      $('#af').onsubmit = tryDo(async e => { e.preventDefault(); await api('/appointments', { method: 'POST', body: Object.fromEntries(new FormData(e.target)) }); toast('Appointment booked'); render(); });
    });
    return head() + `<form class="panel" id="af"><h2 class="title"><b>Appointments</b></h2><div class="filters"><select class="field" name="patient_id" id="ap" aria-label="Patient"></select><input class="field" name="appt_at" type="datetime-local" required><input class="field" name="reason" placeholder="Reason"></div><p style="text-align:center"><button class="btn">Book appointment</button></p></form>
      <div class="panel"><input class="field" id="ad" type="date" style="max-width:260px;margin-bottom:16px" aria-label="Day"><table><thead><tr><th>Time</th><th>Patient</th><th>Phone</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead><tbody id="tb"></tbody></table></div>`;
  },

  async box() {
    const d = await api('/dashboard');
    return head() + `<div class="panel"><h2 class="title"><b>box</b> | today</h2><div class="cards3"><div class="stat g"><h4>Payments today</h4><p>${money(d.payments_today)}</p></div><div class="stat b"><h4>Cash in box</h4><p>${money(d.box)}</p></div><div class="stat r"><h4>Sessions today</h4><p>${d.reviews}</p></div></div></div>`;
  },

  async reports() {
    const [pay, exp] = await Promise.all([api('/payments'), api('/expenses')]);
    const by = {}; pay.forEach(p => (by[day(p.paid_at).slice(0, 7)] ||= { i: 0, o: 0 }).i += +p.amount); exp.forEach(x => (by[day(x.spent_at).slice(0, 7)] ||= { i: 0, o: 0 }).o += +x.amount);
    const rows = Object.entries(by).sort().reverse();
    return head() + `<div class="panel"><h2 class="title"><b>Reports</b></h2><table><thead><tr><th>Month</th><th>Income</th><th>Expenses</th><th>Net</th></tr></thead><tbody>${rows.map(([m, v]) => `<tr><td>${m}</td><td>${money(v.i)}</td><td>${money(v.o)}</td><td style="color:${v.i - v.o < 0 ? 'var(--red)' : 'var(--green)'}">${money(v.i - v.o)}</td></tr>`).join('') || '<tr><td colspan="4" class="empty">No payments or expenses recorded yet.</td></tr>'}</tbody></table></div>`;
  },

  async users() {
    if (me.role !== 'admin') return head() + '<div class="panel"><p class="empty">Only admins can manage users.</p></div>';
    const l = await api('/users');
    setTimeout(() => {
      $('#uf').onsubmit = tryDo(async e => { e.preventDefault(); await api('/users', { method: 'POST', body: Object.fromEntries(new FormData(e.target)) }); toast('User added'); routeNow(); });
      document.querySelectorAll('[data-a]').forEach(b => b.onclick = tryDo(async () => { const [i, v] = b.dataset.a.split(':'); await api('/users/' + i, { method: 'PATCH', body: { active: v === '1' } }); routeNow(); }));
    });
    return head() + `<form class="panel" id="uf"><h2 class="title"><b>Users</b></h2><div class="filters"><input class="field" name="name" placeholder="Name" required><input class="field" name="email" type="email" placeholder="E-mail" required><input class="field" name="password" type="password" minlength="8" placeholder="Password (8+ characters)" required></div>
      <div class="grid2" style="margin-top:16px"><input class="field" name="phone" placeholder="Phone"><select class="field" name="role"><option>doctor</option><option>assistant</option><option>admin</option></select></div><p style="text-align:center"><button class="btn">Add user</button></p></form>
      <div class="panel"><table><thead><tr><th>Name</th><th>E-mail</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>${l.map(u => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${u.role}</td><td>${u.active ? 'Active' : 'Disabled'}</td><td>${u.id === me.id ? '' : `<button class="btn sm ${u.active ? 'red' : 'green'}" data-a="${u.id}:${u.active ? 0 : 1}">${u.active ? 'Disable' : 'Enable'}</button>`}</td></tr>`).join('')}</tbody></table></div>`;
  },

  settings() {
    setTimeout(() => $('#sf').onsubmit = tryDo(async e => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)); await api('/me/password', { method: 'POST', body: f }); e.target.reset(); toast('Password changed'); }));
    return head() + `<form class="panel" id="sf" style="max-width:600px"><h2 class="title"><b>Settings</b></h2><label>Current password</label><input class="field" type="password" name="current" required autocomplete="current-password"><label style="margin-top:16px">New password (8+ characters)</label><input class="field" type="password" name="next" minlength="8" required autocomplete="new-password"><p style="text-align:center"><button class="btn">Change password</button></p></form>`;
  },
};

async function routeNow() {
  const [, name = 'main', a, b] = location.hash.split('/');
  document.querySelectorAll('#nav a').forEach(x => x.classList.toggle('on', x.getAttribute('href') === '#/' + name));
  const fn = routes[name] || routes.main;
  try { $('#app').innerHTML = await fn(a, b); scrollTo(0, 0); }
  catch (e) { $('#app').innerHTML = `<div class="panel"><p class="empty">${esc(e.message)}</p></div>`; }
}
addEventListener('hashchange', routeNow);
routeNow();
