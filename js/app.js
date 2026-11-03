const token = localStorage.token;
if (!token) location.href = '/login.html';
const me = JSON.parse(localStorage.user || '{}');
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => '$' + (+n || 0).toFixed(2).replace(/\.00$/, '');
const day = d => d ? String(d).slice(0, 10) : '';
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
function renderAvatar(photo, name) {
  const avatar = $('#av');
  avatar.replaceChildren();
  if (photo) {
    const image = document.createElement('img');
    image.src = photo;
    image.alt = `${name || 'User'} profile photo`;
    avatar.append(image);
  } else {
    avatar.textContent = (name || '?')[0];
  }
}
$('#uname').textContent = me.name || '';
renderAvatar(me.photo, me.name);
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
  const t = document.createElement('div'); t.className = 'toast' + (err ? ' err' : ''); t.textContent = ClinicI18n.translate(msg); t.setAttribute('role', 'status');
  document.body.append(t); setTimeout(() => t.remove(), 3200);
}
const tryDo = fn => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message, true); } };
const permissionFeatures = {
  patients: 'Patient records',
  appointments: 'Appointments',
  sessions: 'Dental sessions',
  invoices: 'Invoices',
  payments: 'Payments',
  expenses: 'Expenses',
  services: 'Services',
  reports: 'Reports and statements',
  users: 'User Management',
  settings: 'Settings'
};
const permissionActions = { view: 'View', create: 'Create', edit: 'Edit', delete: 'Delete' };
const permissionCapabilities = {
  patients: ['view', 'create', 'edit', 'delete'],
  appointments: ['view', 'create', 'edit', 'delete'],
  sessions: ['view', 'create', 'edit', 'delete'],
  invoices: ['view', 'create', 'edit'],
  payments: ['view', 'create', 'edit', 'delete'],
  expenses: ['view', 'create', 'delete'],
  services: ['view', 'create', 'edit'],
  reports: ['view'],
  users: ['view'],
  settings: ['view', 'edit']
};
const can = (feature, action) => me.role === 'admin' || me.permissions?.[feature]?.[action] === true;
const hasFeature = feature => Object.keys(permissionActions).some(action => can(feature, action));
function permissionEditorMarkup(permissionSettings) {
  const rolePermissions = Object.fromEntries((permissionSettings?.roles || []).map(role => [role.role, role.permissions]));
  const roleTable = role => `<div class="table-wrap permission-matrix"><table><thead><tr><th>Feature</th>${Object.values(permissionActions).map(action => `<th>${action}</th>`).join('')}</tr></thead><tbody>
    ${Object.entries(permissionFeatures).map(([feature, title]) => `<tr><th>${title}</th>${Object.keys(permissionActions).map(action => `<td>${permissionCapabilities[feature].includes(action) ? `<input type="checkbox" data-role-feature="${feature}" data-role-action="${action}" ${rolePermissions[role]?.[feature]?.[action] ? 'checked' : ''} aria-label="${title}: ${permissionActions[action]}">` : '<span class="muted" aria-label="Not applicable">—</span>'}</td>`).join('')}</tr>`).join('')}
    </tbody></table></div>`;
  return `<div class="panel permission-settings"><h2 class="title"><b>Feature &amp; Role Permissions</b></h2>
    <p class="muted">Admins always have full access. Configure role permissions for Doctors, Assistants, and Receptionists.</p>
    <p class="muted">Some actions also require related access: creating an appointment or invoice needs patient view, and creating a session needs session edit to complete the new record.</p>
    <form id="rolePermissionForm"><label for="permissionRole">Role defaults</label><select class="field" id="permissionRole"><option value="doctor">Doctor</option><option value="assistant">Assistant</option><option value="receptionist">Receptionist</option></select>
      <div id="rolePermissionTable">${roleTable('doctor')}</div><p style="text-align:center"><button class="btn">Save role permissions</button></p></form>
  </div>`;
}
function bindPermissionEditor(permissionSettings) {
  const rolePermissions = Object.fromEntries((permissionSettings?.roles || []).map(role => [role.role, role.permissions]));
  const roleSelect = $('#permissionRole');
  const roleTable = $('#rolePermissionTable');
  const renderRolePermissions = () => {
    const permissions = rolePermissions[roleSelect.value] || {};
    roleTable.querySelectorAll('[data-role-feature]').forEach(input => {
      input.checked = permissions[input.dataset.roleFeature]?.[input.dataset.roleAction] === true;
    });
  };
  roleSelect.onchange = renderRolePermissions;
  $('#rolePermissionForm').onsubmit = tryDo(async event => {
    event.preventDefault();
    const permissions = Object.fromEntries(Object.keys(permissionFeatures).map(feature => [
      feature,
      Object.fromEntries(Object.keys(permissionActions).map(action => [
        action,
        permissionCapabilities[feature].includes(action)
          ? roleTable.querySelector(`[data-role-feature="${feature}"][data-role-action="${action}"]`).checked
          : false
      ]))
    ]));
    const saved = await api(`/permissions/roles/${roleSelect.value}`, { method: 'PUT', body: { permissions } });
    rolePermissions[saved.role] = saved.permissions;
    renderRolePermissions();
    toast('Role permissions saved');
  });
}
function applyNavigationPermissions() {
  document.querySelectorAll('#nav [data-feature]').forEach(link => {
    const feature = link.dataset.feature;
    const alternate = link.dataset.alternateAction;
    const alternateAllowed = alternate && can(feature, alternate) &&
      (!link.dataset.requiresFeature || can(link.dataset.requiresFeature, link.dataset.requiresAction || 'view'));
    link.hidden = !can(feature, link.dataset.action || 'view') && !alternateAllowed;
  });
}
const logo = '<img class="brand-logo" src="/img/logo.png" alt="52-Dental Clinic logo">';
const head = (sub = '') => `<div class="brand">${sub ? '' : logo}<h1>52-Dental Clinic</h1><hr></div>`;
function printTemplateMarkup(template, section) {
  const mode = template[`${section}_mode`];
  if (!mode || mode === 'none') return '';
  const image = ['image', 'both'].includes(mode) && template[`${section}_image`]
    ? `<img src="${esc(template[`${section}_image`])}" alt="Clinic print ${section}">`
    : '';
  const text = ['text', 'both'].includes(mode) && template[`${section}_text`]
    ? `<div class="print-template-text" translate="no">${esc(template[`${section}_text`]).replace(/\r?\n/g, '<br>')}</div>`
    : '';
  return `<div class="print-template print-${section}">${image}${text}</div>`;
}

const profileReady = api('/me').then(profile => {
  Object.assign(me, profile);
  localStorage.user = JSON.stringify(me);
  $('#uname').textContent = me.name || '';
  renderAvatar(me.photo, me.name);
  applyNavigationPermissions();
  return profile;
}).catch(error => {
  toast(`Could not load your profile: ${error.message}`, true);
  return null;
});

const routes = {
  async main() {
    const d = await api('/dashboard');
    const rows = [['Payments today', money(d.payments_today), '$'], ['box (today)', money(d.box), '▣'], ['The patients', d.patients, '👥'],
      ['Appointments today', d.appointments, '🔗'], ['User Management', d.users, '▤'], ["Today's reviews", d.reviews, '🔒']];
    const dataKeys = ['payments_today', 'box', 'patients', 'appointments', 'users', 'reviews'];
    const tiles = [['#/appointments', '📅', 'Appointments', 'appointments', 'view'], ['#/patients', '📁', 'files', 'patients', 'view'],
      ['#/new-patient', '🦷', 'new patient', 'patients', 'create'], ['#/appointments', '📋', "Today's reviews", 'appointments', 'view'],
      ['#/reports', '📊', 'Reports', 'reports', 'view'], ['#/payments', '💵', 'Payments', 'payments', 'view'],
      ['#/box', '🧰', 'box', 'payments', 'view'], ['#/patients', '🔄', 'Pictures', 'patients', 'view'], ['#/users', '🧑‍⚕️', 'User Management', 'users', 'view']];
    const visibleRows = rows.filter((_, index) => d[dataKeys[index]] !== null);
    const visibleTiles = tiles.filter(tile => can(tile[3], tile[4]) ||
      (tile[3] === 'appointments' && tile[4] === 'view' && can('appointments', 'create') && can('patients', 'view')));
    return head() + `<div class="dash"><div class="stats">${visibleRows.map(r => `<div><span>${r[2]}</span><span>${r[0]}</span><span class="badge">${r[1]}</span></div>`).join('')}</div>
      <div class="tiles">${visibleTiles.map(t => `<a class="tile" href="${t[0]}"><span class="ico">${t[1]}</span>${t[2]}</a>`).join('')}</div></div>`;
  },

  'new-patient'() {
    setTimeout(() => $('#pf').onsubmit = tryDo(async e => {
      e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
      const p = await api('/patients', { method: 'POST', body: f }); toast('Patient file created');
      location.hash = can('patients', 'view') ? '#/patient/' + p.id : '#/main';
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
        ${can('patients', 'view') ? `<a class="btn sm" href="#/patient/${p.id}">View file</a>` : ''}
        ${can('patients', 'edit') ? `<a class="btn sm dark" href="#/patient/${p.id}/edit">Edit file</a>` : ''}
        ${can('patients', 'delete') ? `<button class="btn sm red" data-del="${p.id}">delete file</button>` : ''}</div></td><td>${esc(day(p.created_at))}</td><td>${esc(p.phone)}</td><td>${esc(p.name)}</td><td>${p.id}</td></tr>`).join('')
        : `<tr><td colspan="5" class="empty">No patient files match. Try a different name or clear the date.</td></tr>`;
      document.querySelectorAll('[data-del]').forEach(b => b.onclick = tryDo(async () => {
        if (!confirm(ClinicI18n.translate('Delete this patient file and all its sessions and payments?'))) return;
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
      $('#df') && ($('#df').onclick = tryDo(async () => { if (confirm(ClinicI18n.translate('Delete this patient file?'))) { await api('/patients/' + id, { method: 'DELETE' }); location.hash = '#/patients'; } }));
      document.querySelectorAll('[data-ds]').forEach(b => b.onclick = tryDo(async () => { if (confirm(ClinicI18n.translate('Delete this session?'))) { await api('/sessions/' + b.dataset.ds, { method: 'DELETE' }); routeNow(); } }));
    });
    const ro = edit ? '' : 'readonly';
    return `<div class="panel"><div style="text-align:center"><div class="av" style="width:150px;height:150px;border-radius:50%;background:#53b6e3;color:#fff;margin:0 auto;display:grid;place-items:center;font-size:4rem">${esc(p.name[0])}</div>
      <h2 class="title" style="margin-top:14px">${edit ? 'edit file' : 'patient file'} | <b>${esc(p.name)}</b></h2></div>
      <form id="ef"><div class="grid2"><div><label>patient number</label><input class="field" value="${p.id}" readonly></div><div><label>Patient name</label><input class="field" name="name" value="${esc(p.name)}" ${ro}></div></div>
      <div class="grid2"><div><label>Telephone number</label><input class="field" name="phone" value="${esc(p.phone)}" ${ro}></div><div><label>entry date</label><input class="field" value="${esc(String(p.created_at).replace('T', ' ').slice(0, 19))}" readonly></div></div>
      <label>patient's gender</label>${edit ? `<select class="field" name="gender"><option ${p.gender === 'Male' ? 'selected' : ''}>Male</option><option ${p.gender === 'Female' ? 'selected' : ''}>Female</option></select>` : `<input class="field" value="${esc(p.gender || '')}" readonly>`}
      <label style="margin-top:16px">Doctor's notes</label><textarea class="field" name="note" ${ro}>${esc(p.note || '')}</textarea>
      ${edit && can('patients', 'edit') ? '<p style="text-align:center"><button class="btn">Save changes</button></p>' : ''}</form></div>
      <div class="grid2" style="max-width:1100px;margin:0 auto"><div class="panel"><h3 style="text-align:center;font-weight:500">sessions</h3>
      ${can('sessions', 'view') ? `<table><thead><tr><th>the details</th><th>session date</th><th>cost</th></tr></thead><tbody>${p.sessions.map(s => `<tr><td><div class="row-actions">
        ${can('sessions', 'delete') ? `<button class="btn sm red" data-ds="${s.id}">delete session</button>` : ''}
        <a class="btn sm" href="#/session/${s.id}">View details</a></div></td><td>${esc(day(s.session_date))}</td><td>${money(s.cost)}</td></tr>`).join('') || '<tr><td colspan="3" class="empty" style="color:#777">No sessions yet. Add the first one.</td></tr>'}</tbody></table>`
        : '<p class="muted">You do not have permission to view sessions.</p>'}</div>
      <div class="panel"><h3 style="text-align:center;font-weight:500">the procedures</h3><table>
      ${can('patients', 'edit') ? `<tr><td><a href="#/patient/${id}/edit" style="color:inherit;text-decoration:none">Edit file</a></td></tr>` : ''}
      ${can('patients', 'delete') ? '<tr><td><a href="#" id="df" style="color:var(--red);text-decoration:none">delete file</a></td></tr>' : ''}
      ${can('sessions', 'create') && can('sessions', 'edit') ? '<tr><td><a href="#" id="as" style="color:inherit;text-decoration:none">add session</a></td></tr>' : ''}
      ${can('reports', 'view') ? `<tr><td><a href="#/statement/${id}" style="color:var(--green);text-decoration:none">Account statement</a></td></tr>` : ''}</table></div></div>`;
  },

  async statement(id) {
    const [s, template] = await Promise.all([api(`/patients/${id}/statement`), api('/print-template')]);
    setTimeout(() => {
      $('#pdf').onclick = () => print();
      $('#mail').onclick = () => location.href = `mailto:?subject=${encodeURIComponent('Account statement – ' + s.patient.name)}&body=${encodeURIComponent(`Sessions: ${s.sessions}\nCharged: ${money(s.charged)}\nPaid: ${money(s.paid)}\nBalance due: ${money(s.debt)}`)}`;
      if ($('#pay')) $('#pay').onsubmit = tryDo(async e => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)); await api('/payments', { method: 'POST', body: { ...f, patient_id: id } }); toast('Payment saved'); routeNow(); });
    });
    return printTemplateMarkup(template, 'header') + head() + `<div class="panel"><h2 class="title">${esc(s.patient.name)} |<b>Account statement</b> |</h2>
      <div class="cards3"><div class="stat r"><h4>Debt amount</h4><p>${money(s.debt)}</p></div><div class="stat b"><h4>number of sessions</h4><p>${s.sessions}</p></div><div class="stat g"><h4>total payment</h4><p>${money(s.paid)}</p></div></div>
      <h3>Invoices</h3>${s.invoices.length ? `<table><thead><tr><th>Invoice</th><th>Issued</th><th>Due</th><th>Total</th><th>Balance</th><th>Status</th></tr></thead><tbody>${s.invoices.map(invoice => `<tr><td><a href="#/invoice/${invoice.id}">${esc(invoice.invoice_number)}</a></td><td>${day(invoice.issue_date)}</td><td>${day(invoice.due_date)}</td><td>${money(invoice.total)}</td><td>${money(invoice.balance)}</td><td>${esc(invoice.payment_status)}</td></tr>`).join('')}</tbody></table>` : '<p class="empty">No invoices found.</p>'}
      ${s.payments.length ? `<table><thead><tr><th>Date</th><th>Type</th><th>Batch</th><th>Amount</th></tr></thead><tbody>${s.payments.map(p => `<tr><td>${day(p.paid_at)}</td><td>${esc(p.type)}</td><td>${esc(p.batch_number || '')}</td><td>${money(p.amount)}</td></tr>`).join('')}</tbody></table>` : '<p class="empty">There are no payments</p>'}
      ${can('payments', 'create') ? '<form id="pay" class="noprint grid2" style="margin-top:20px;grid-template-columns:2fr 1fr 1fr auto"><input class="field" name="amount" type="number" step="0.01" min="0.01" placeholder="Payment amount" required aria-label="Payment amount"><select class="field" name="type" aria-label="Type"><option>Cash</option><option>Card</option><option>Transfer</option></select><input class="field" name="batch_number" placeholder="batch number" aria-label="Batch number"><button class="btn green">Record payment</button></form>' : ''}
      <div class="actions3 noprint"><button class="btn red" id="pdf">PDF Download</button><button class="btn" id="mail">Send to an email</button><button class="btn green" onclick="print()">Detection printing</button></div></div>` + printTemplateMarkup(template, 'footer');
  },

  async session(id) {
    const [s, catalog, template] = await Promise.all([api('/sessions/' + id), api('/services'), api('/print-template')]);
    const editable = can('sessions', 'edit');
    const state = {}; s.teeth.forEach(t => state[t.tooth] = t);
    const selectedServiceIds = new Set((s.services || []).map(service => service.id).filter(Boolean).map(Number));
    const servicesById = new Map(catalog.map(service => [Number(service.id), service]));
    for (const saved of s.services || []) {
      if (saved.id && !servicesById.has(Number(saved.id)))
        servicesById.set(Number(saved.id), { ...saved, active: false, id: Number(saved.id) });
    }
    const services = [...servicesById.values()].filter(service => service.active || selectedServiceIds.has(Number(service.id)));
    const serviceCards = services.map(service => {
      const selected = selectedServiceIds.has(Number(service.id));
      const saved = (s.services || []).find(item => Number(item.id) === Number(service.id));
      const price = saved ? saved.price : service.price;
      const duration = saved ? saved.duration_minutes : service.duration_minutes;
      return `<button type="button" class="service-card${selected ? ' selected' : ''}" data-service-id="${service.id}" data-price="${Number(price)}" data-duration="${Number(duration)}" aria-pressed="${selected}">
        <span class="service-icon">${esc(service.icon || '🦷')}</span><span class="service-name">${esc(service.name)}</span>
        <span class="service-meta">${esc(String(duration))} min · ${money(price)}</span></button>`;
    }).join('');
    const otherCost = s.other_cost == null && !(s.services || []).length ? Number(s.cost) : Number(s.other_cost || 0);
    let cur = null;
    const upper = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28], lower = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
    const tp = n => `<button class="tooth" data-t="${n}" aria-label="Tooth ${n}" ${editable ? '' : 'disabled'}><svg viewBox="0 0 40 56"><path d="M8 8c6-6 18-6 24 0 4 10-2 18-4 30-1 8-5 14-8 6-1-4-2-7-4-7s-3 3-4 7c-3 8-7 2-8-6C10 26 4 18 8 8Z" fill="#f3f3f3" stroke="#666" stroke-width="2"/></svg><small>${n}</small></button>`;
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
    function updateServiceTotal() {
      const chosen = [...selectedServiceIds].map(serviceId => servicesById.get(serviceId)).filter(Boolean);
      const servicePrice = chosen.reduce((sum, service) => sum + Math.round(Number(
        (s.services || []).find(item => Number(item.id) === Number(service.id))?.price ?? service.price
      ) * 100), 0);
      const duration = chosen.reduce((sum, service) => sum + Number(
        (s.services || []).find(item => Number(item.id) === Number(service.id))?.duration_minutes ?? service.duration_minutes
      ), 0);
      const extra = Math.round(Number($('#otherCost').value || 0) * 100);
      const total = money((servicePrice + extra) / 100);
      $('#serviceTotal').textContent = total;
      $('#sessionCost').value = total;
      $('#printedOtherCost').textContent = money(extra / 100);
      $('#serviceDuration').textContent = `${duration} min`;
    }
    const saveSession = async () => {
      const teeth = Object.values(state).filter(t => t.condition !== 'Normal' || t.details.length || t.surfaces.length || t.note);
      return api('/sessions/' + id, { method: 'PUT', body: {
        session_date: $('#sdate').value,
        service_ids: [...selectedServiceIds],
        other_cost: $('#otherCost').value || 0,
        notes: $('#snotes').value,
        teeth
      } });
    };
    setTimeout(() => {
      document.querySelectorAll('[data-service-id]').forEach(button => {
        button.disabled = !editable;
        if (!editable) return;
        button.onclick = () => {
        const serviceId = Number(button.dataset.serviceId);
        if (selectedServiceIds.has(serviceId)) selectedServiceIds.delete(serviceId);
        else selectedServiceIds.add(serviceId);
        button.classList.toggle('selected', selectedServiceIds.has(serviceId));
        button.setAttribute('aria-pressed', String(selectedServiceIds.has(serviceId)));
        updateServiceTotal();
        };
      });
      if (editable) $('#otherCost').oninput = updateServiceTotal;
      updateServiceTotal();
      if (editable) {
        document.querySelectorAll('.tooth').forEach(b => b.onclick = () => pick(+b.dataset.t));
        $('#chart').closest('.panel').addEventListener('change', () => { if (!cur) return; const t = state[cur]; t.condition = document.querySelector('[name=cond]:checked')?.value || 'Normal'; t.details = [...document.querySelectorAll('[name=det]:checked')].map(x => x.value); paint(); });
        $('#note').oninput = () => { if (cur) { state[cur].note = $('#note').value; paint(); } };
        document.querySelectorAll('.surf [data-s]').forEach(e => e.onclick = () => { if (!cur) return toast('Select a tooth first', true); const t = state[cur], k = e.dataset.s; t.surfaces = t.surfaces.includes(k) ? t.surfaces.filter(x => x !== k) : [...t.surfaces, k]; e.classList.toggle('on'); paint(); });
        $('#save')?.addEventListener('click', tryDo(async () => {
          await saveSession();
          toast('Session saved');
        }));
      }
      $('#printSession').onclick = tryDo(async () => {
        if (editable) await saveSession();
        window.print();
      });
      if (can('invoices', 'create')) $('#createInvoice')?.addEventListener('click', tryDo(async () => {
        if (editable) await saveSession();
        const invoice = await api(`/sessions/${id}/invoice`, { method: 'POST', body: {
          due_date: $('#invoiceDueDateSession').value || null
        }});
        if (can('invoices', 'view')) location.hash = `#/invoice/${invoice.id}`;
        else toast('Invoice created');
      }));
      paint();
    });
    return printTemplateMarkup(template, 'header') + `<div class="brand"><h1>52-Dental Clinic</h1><hr></div>
      <div class="panel"><h2 class="title">${esc(s.patient_name)} | <b>Session</b></h2>
      <section class="service-picker"><h3>Select Service</h3><p class="muted">Choose treatment</p><p class="muted">Record payments from the invoice to track balances and partial payments.</p>
        <div class="service-grid">${serviceCards || '<p class="empty">No services available.</p>'}</div>
        <div class="service-summary"><span><span data-i18n-label="service-duration">Selected duration</span>: <b id="serviceDuration">0 min</b></span><span><span data-i18n-label="service-total">Session total</span>: <b id="serviceTotal">${money(s.cost)}</b></span></div>
        <label for="otherCost">Additional cost</label><input class="field screen-only" id="otherCost" type="number" step="0.01" min="0" value="${otherCost}" aria-label="Additional cost" ${editable ? '' : 'disabled'}><p class="print-only" id="printedOtherCost">${money(otherCost)}</p>
      </section>
      <div class="arch">${upper.map(tp).join('')}</div>
      <div class="chart-box" id="chart"><div><h3>Note</h3><textarea class="field" id="note" placeholder="Note for the selected tooth" style="text-align:left;min-height:240px" ${editable ? '' : 'readonly'}></textarea></div>
        <div><h3 id="cur">Select a tooth</h3><h3>Condition tooth</h3>${C.map(c => `<label class="opt" style="justify-content:flex-start"><input type="radio" name="cond" value="${c}" ${editable ? '' : 'disabled'}> ${c}</label>`).join('')}
        </div><svg class="surf" viewBox="0 0 200 200" role="group" aria-label="Tooth surfaces"><path data-s="top" d="M100 100 L24 24 A108 108 0 0 1 176 24Z"/><path data-s="right" d="M100 100 L176 24 A108 108 0 0 1 176 176Z"/><path data-s="bottom" d="M100 100 L176 176 A108 108 0 0 1 24 176Z"/><path data-s="left" d="M100 100 L24 176 A108 108 0 0 1 24 24Z"/><circle data-s="center" cx="100" cy="100" r="36"/></svg></div>
      <section class="tooth-details"><h3>Details</h3><div class="opts2">${D.map(d => `<label class="opt" style="justify-content:flex-start"><input type="checkbox" name="det" value="${d}" ${editable ? '' : 'disabled'}> ${d}</label>`).join('')}</div></section>
      <div class="arch" style="margin-top:24px">${lower.map(tp).join('')}</div>
      <div class="grid2"><div><label>Session date</label><input class="field" id="sdate" type="date" value="${day(s.session_date)}" ${editable ? '' : 'readonly'}></div><div><label>Session total</label><input class="field" id="sessionCost" value="${money(s.cost)}" readonly></div></div>
      <label>Session notes</label><textarea class="field" id="snotes" ${editable ? '' : 'readonly'}>${esc(s.notes || '')}</textarea>
      ${can('invoices', 'create') ? '<label class="screen-only">Invoice due date (optional)<input class="field" id="invoiceDueDateSession" type="date"></label>' : ''}
      <p class="session-actions noprint" style="text-align:center">${editable ? '<button class="btn" id="save">Save session</button>' : ''} ${can('invoices', 'create') ? '<button class="btn green" id="createInvoice">Create invoice</button>' : ''} <button class="btn" id="printSession">Print session</button> <a class="btn dark" href="#/patient/${s.patient_id}">Back to file</a></p></div>` + printTemplateMarkup(template, 'footer');
  },

  invoices() {
    const canViewInvoices = can('invoices', 'view');
    const canCreateInvoice = can('invoices', 'create') && can('patients', 'view');
    const render = tryDo(async () => {
      if (!canViewInvoices) return;
      const params = new URLSearchParams({ name: $('#invoiceSearch').value, status: $('#invoiceStatus').value });
      const invoices = await api('/invoices?' + params);
      $('#invoiceRows').innerHTML = invoices.length ? invoices.map(invoice =>
        `<tr><td><a href="#/invoice/${invoice.id}">${esc(invoice.invoice_number)}</a></td><td>${esc(invoice.patient_name)}</td><td>${day(invoice.issue_date)}</td><td>${day(invoice.due_date)}</td><td>${money(invoice.total)}</td><td>${money(invoice.balance)}</td><td>${esc(invoice.payment_status)}</td></tr>`
      ).join('') : '<tr><td colspan="7" class="empty">No invoices found.</td></tr>';
    });
    setTimeout(async () => {
      if (canCreateInvoice) {
        const patients = await api('/patients');
        $('#invoicePatient').innerHTML = '<option value="">Choose patient</option>' + patients.map(patient =>
          `<option value="${patient.id}">${esc(patient.name)} · ${esc(patient.phone)}</option>`).join('');
        $('#invoiceIssueDate').value = today();
        const updateTotal = () => {
          const subtotal = [...document.querySelectorAll('.invoice-line')].reduce((sum, line) =>
            sum + Math.round(Number(line.querySelector('[name=quantity]').value || 0) * Number(line.querySelector('[name=unit_price]').value || 0) * 100), 0);
          const discount = Math.round(Number($('#invoiceDiscount').value || 0) * 100);
          $('#invoiceTotal').textContent = money(Math.max(subtotal - discount, 0) / 100);
        };
        const addLine = () => {
          const row = document.createElement('div');
          row.className = 'invoice-line';
          row.innerHTML = '<input class="field" name="description" placeholder="Item or service description" maxlength="200" required><input class="field" name="quantity" type="number" min="0.01" step="0.01" value="1" aria-label="Quantity" required><input class="field" name="unit_price" type="number" min="0" step="0.01" placeholder="Unit price" required><button class="btn sm dark invoice-remove-line" type="button" aria-label="Remove item">×</button>';
          row.querySelectorAll('input').forEach(input => input.oninput = updateTotal);
          row.querySelector('.invoice-remove-line').onclick = () => { if (document.querySelectorAll('.invoice-line').length > 1) row.remove(); updateTotal(); };
          $('#invoiceLines').append(row);
          updateTotal();
        };
        addLine();
        $('#addInvoiceLine').onclick = addLine;
        $('#invoiceDiscount').oninput = updateTotal;
        $('#invoiceForm').onsubmit = tryDo(async event => {
          event.preventDefault();
          const items = [...document.querySelectorAll('.invoice-line')].map(line => ({
            description: line.querySelector('[name=description]').value,
            quantity: line.querySelector('[name=quantity]').value,
            unit_price: line.querySelector('[name=unit_price]').value
          }));
          const invoice = await api('/invoices', { method: 'POST', body: {
            patient_id: $('#invoicePatient').value,
            issue_date: $('#invoiceIssueDate').value,
            due_date: $('#invoiceDueDate').value || null,
            discount: $('#invoiceDiscount').value || 0,
            items
          }});
          toast('Invoice created');
          location.hash = canViewInvoices ? `#/invoice/${invoice.id}` : '#/main';
        });
      }
      if (canViewInvoices) {
        $('#invoiceSearch').oninput = render;
        $('#invoiceStatus').onchange = render;
        render();
      }
    });
    return head() + `${canCreateInvoice ? `<form class="panel" id="invoiceForm"><h2 class="title"><b>Create invoice</b></h2>
      <div class="grid2"><select class="field" id="invoicePatient" required aria-label="Patient"></select><input class="field" id="invoiceIssueDate" type="date" required aria-label="Issue date"></div>
      <div class="grid2"><label>Due date (optional)<input class="field" id="invoiceDueDate" type="date"></label><label>Discount ($)<input class="field" id="invoiceDiscount" type="number" min="0" step="0.01" value="0"></label></div>
      <div id="invoiceLines"></div><button class="btn dark" type="button" id="addInvoiceLine">Add item</button>
      <p class="invoice-total">Total: <b id="invoiceTotal">$0</b></p><p style="text-align:center"><button class="btn green">Create invoice</button></p></form>` : ''}
      ${canViewInvoices ? `
      <div class="panel"><h2 class="title"><b>Billing &amp; Invoices</b></h2><div class="filters"><input class="field" id="invoiceSearch" placeholder="Patient name"><select class="field" id="invoiceStatus" aria-label="Invoice status"><option value="">All statuses</option><option>unpaid</option><option>partially paid</option><option>paid</option><option>overdue</option><option>void</option></select></div>
      <div class="table-wrap"><table><thead><tr><th>Invoice</th><th>Patient</th><th>Issued</th><th>Due</th><th>Total</th><th>Balance</th><th>Status</th></tr></thead><tbody id="invoiceRows"><tr><td colspan="7">Loading...</td></tr></tbody></table></div></div>` : ''}`;
  },

  async invoice(id) {
    const [invoice, template] = await Promise.all([api(`/invoices/${id}`), api('/print-template')]);
    const refundable = Math.max(Number(invoice.paid) - Number(invoice.refunded), 0);
    const canVoid = invoice.can_void;
    setTimeout(() => {
      $('#invoicePayment')?.addEventListener('submit', tryDo(async event => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target));
        await api(`/invoices/${id}/payments`, { method: 'POST', body: data });
        toast('Payment saved');
        routeNow();
      }));
      $('#invoiceRefund')?.addEventListener('submit', tryDo(async event => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target));
        await api(`/invoices/${id}/refunds`, { method: 'POST', body: data });
        toast('Refund recorded');
        routeNow();
      }));
      $('#invoiceVoid')?.addEventListener('submit', tryDo(async event => {
        event.preventDefault();
        if (!confirm(ClinicI18n.translate('Void this invoice?'))) return;
        const data = Object.fromEntries(new FormData(event.target));
        await api(`/invoices/${id}/void`, { method: 'PATCH', body: data });
        toast('Invoice voided');
        routeNow();
      }));
      $('#printInvoice')?.addEventListener('click', () => print());
    });
    const canViewPayments = can('payments', 'view');
    const paymentRows = invoice.payments.length ? invoice.payments.map(payment =>
      `<tr><td>${day(payment.paid_at)}</td><td>${esc(payment.type)}</td><td>${esc(payment.batch_number || '')}</td><td>${money(payment.amount)}</td></tr>`).join('')
      : '<tr><td colspan="4" class="empty">No payments recorded.</td></tr>';
    const refundRows = invoice.refunds.length ? invoice.refunds.map(refund =>
      `<tr><td>${day(refund.refunded_at)}</td><td>${esc(refund.type)}</td><td>${esc(refund.reason)}</td><td>${money(refund.amount)}</td></tr>`).join('')
      : '<tr><td colspan="4" class="empty">No refunds recorded.</td></tr>';
    const printItems = invoice.items.map((item, index) =>
      `<tr><td>${index + 1}</td><td>${esc(item.description)}</td><td>${Number(item.quantity)}</td><td>${money(item.unit_price)}</td><td>—</td><td>${money(item.line_total)}</td></tr>`).join('');
    const totalQuantity = invoice.items.reduce((sum, item) => sum + Number(item.quantity), 0);
    return printTemplateMarkup(template, 'header') + `<div class="invoice-page">${head()}<div class="panel invoice-document">
      <div class="invoice-heading"><h2>Invoice ${esc(invoice.invoice_number)}</h2><span class="invoice-status">${esc(invoice.payment_status)}</span></div>
      <p><b>${esc(invoice.patient_name)}</b> · <a href="#/patient/${invoice.patient_id}">Patient file</a></p>
      <p>Issue date: ${day(invoice.issue_date)}${invoice.due_date ? ` · Due date: ${day(invoice.due_date)}` : ''}</p>
      <div class="table-wrap"><table><thead><tr><th>Description</th><th>Quantity</th><th>Unit price</th><th>Total</th></tr></thead><tbody>
      ${invoice.items.map(item => `<tr><td>${esc(item.description)}</td><td>${Number(item.quantity)}</td><td>${money(item.unit_price)}</td><td>${money(item.line_total)}</td></tr>`).join('')}
      </tbody><tfoot><tr><th colspan="3">Subtotal</th><td>${money(invoice.subtotal)}</td></tr><tr><th colspan="3">Discount</th><td>−${money(invoice.discount)}</td></tr><tr><th colspan="3">Invoice total</th><td><b>${money(invoice.total)}</b></td></tr>${canViewPayments ? `<tr><th colspan="3">Paid</th><td>${money(invoice.paid)}</td></tr><tr><th colspan="3">Refunded</th><td>${money(invoice.refunded)}</td></tr>` : ''}<tr><th colspan="3">Balance due</th><td><b>${money(invoice.balance)}</b></td></tr></tfoot></table></div>
      ${invoice.status === 'void' ? `<p class="invoice-warning">Voided: ${esc(invoice.void_reason || '')}</p>` : ''}
      ${canViewPayments ? `<h3>Payment history</h3><div class="table-wrap"><table><thead><tr><th>Date</th><th>Method</th><th>Reference</th><th>Amount</th></tr></thead><tbody>${paymentRows}</tbody></table></div>
      <h3>Refund history</h3><div class="table-wrap"><table><thead><tr><th>Date</th><th>Method</th><th>Reason</th><th>Amount</th></tr></thead><tbody>${refundRows}</tbody></table></div>` : ''}
      <div class="noprint invoice-actions">
        ${can('payments', 'create') && invoice.status !== 'void' && invoice.balance > 0.001 ? `<form id="invoicePayment" class="panel"><h3>Record payment</h3><div class="filters"><input class="field" name="amount" type="number" min="0.01" max="${Number(invoice.balance).toFixed(2)}" step="0.01" placeholder="Amount (balance ${money(invoice.balance)})" required><select class="field" name="type"><option>Cash</option><option>Card</option><option>Transfer</option></select><input class="field" name="batch_number" placeholder="Reference (optional)"><input class="field" name="paid_at" type="date" aria-label="Payment date"></div><button class="btn green">Record payment</button></form>` : ''}
        ${can('payments', 'view') && can('payments', 'edit') && invoice.status !== 'void' && refundable > 0.001 ? `<form id="invoiceRefund" class="panel"><h3>Record refund</h3><div class="filters"><input class="field" name="amount" type="number" min="0.01" max="${refundable.toFixed(2)}" step="0.01" placeholder="Refund (available ${money(refundable)})" required><select class="field" name="type"><option>Cash</option><option>Card</option><option>Transfer</option></select><input class="field" name="reason" maxlength="500" placeholder="Refund reason" required><input class="field" name="refunded_at" type="date" aria-label="Refund date"></div><button class="btn">Record refund</button></form>` : ''}
        ${canVoid && can('invoices', 'edit') ? `<form id="invoiceVoid" class="panel"><h3>Void invoice</h3><input class="field" name="reason" maxlength="500" placeholder="Reason for voiding" required><button class="btn red">Void invoice</button></form>` : ''}
        <button class="btn" id="printInvoice">Print invoice</button> <a class="btn dark" href="#/invoices">Back to invoices</a>
      </div></div><section class="invoice-print-document" aria-label="Printable invoice">
        <h2 class="invoice-print-title"><span>INVOICE</span></h2>
        <div class="invoice-print-parties">
          <div class="invoice-print-box">
            <p><b>Patient Code / លេខកូដ</b><span>${invoice.patient_id}</span></p>
            <p><b>Name / ឈ្មោះ</b><span>${esc(invoice.patient_name)}</span></p>
            <p><b>Sex / ភេទ</b><span>${esc(invoice.patient_gender || '—')}</span></p>
            <p><b>Phone / ទូរស័ព្ទ</b><span>${esc(invoice.patient_phone || '—')}</span></p>
          </div>
          <div class="invoice-print-box">
            <p><b>Invoice No.</b><span>${esc(invoice.invoice_number)}</span></p>
            <p><b>Invoice Date</b><span>${day(invoice.issue_date)}</span></p>
            ${invoice.due_date ? `<p><b>Due Date</b><span>${day(invoice.due_date)}</span></p>` : ''}
            <p><b>Doctor</b><span>${esc(me.name || 'Clinic')}</span></p>
            <p><b>Status</b><span>${esc(invoice.payment_status)}</span></p>
          </div>
        </div>
        <table class="invoice-print-items"><thead><tr><th>No.</th><th>Dental Treatment Procedures</th><th>Qty</th><th>Price</th><th>Disc.</th><th>Amount</th></tr></thead>
          <tbody>${printItems}</tbody>
          <tfoot><tr><th colspan="2">Total items</th><td>${invoice.items.length}</td><th colspan="2">Total quantity</th><td>${totalQuantity}</td></tr></tfoot>
        </table>
        <div class="invoice-print-bottom">
          <p class="invoice-print-note"><b>Note:</b> Please keep this invoice for your records.</p>
          <table class="invoice-print-totals"><tbody>
            <tr><th>Subtotal</th><td>${money(invoice.subtotal)}</td></tr>
            <tr><th>Discount</th><td>−${money(invoice.discount)}</td></tr>
            <tr class="invoice-print-grand-total"><th>Grand Total</th><td>${money(invoice.total)}</td></tr>
            ${canViewPayments ? `<tr><th>Paid Amount</th><td>${money(invoice.paid)}</td></tr><tr><th>Refunded</th><td>${money(invoice.refunded)}</td></tr>` : ''}
            <tr class="invoice-print-balance"><th>Balance</th><td>${money(invoice.balance)}</td></tr>
          </tbody></table>
        </div>
        <div class="invoice-print-signatures"><div>Doctor</div><div>Receiver</div><div>Deliver</div></div>
        ${invoice.status === 'void' ? `<p class="invoice-warning">Voided: ${esc(invoice.void_reason || '')}</p>` : ''}
      </section></div>` + printTemplateMarkup(template, 'footer');
  },

  payments() {
    const render = tryDo(async () => {
      const qs = new URLSearchParams({ date: $('#fd').value, name: $('#fn').value, amount: $('#fa').value, batch: $('#fb').value });
      const l = await api('/payments?' + qs);
      $('#tb').innerHTML = l.length ? l.map(p => `<tr><td>${p.invoice_id ? `<a class="btn sm" href="#/invoice/${p.invoice_id}">View invoice</a>` : (can('payments', 'delete') ? `<button class="btn sm red" data-d="${p.id}">Delete</button>` : '')}</td><td>${p.amount < 0 ? `-${money(-p.amount)}` : money(p.amount)}</td><td>${esc(p.type)}</td><td>${esc(p.batch_number || '')}</td><td>${day(p.paid_at)}</td><td>${esc(p.patient_name)}</td></tr>`).join('') : '<tr><td colspan="6" class="empty">No payments found.</td></tr>';
      document.querySelectorAll('[data-d]').forEach(b => b.onclick = tryDo(async () => { if (confirm(ClinicI18n.translate('Delete this payment?'))) { await api('/payments/' + b.dataset.d, { method: 'DELETE' }); render(); } }));
    });
    setTimeout(() => { $('#go').onclick = render; render(); });
    return head() + `<div class="panel"><div class="grid2"><input class="field" id="fd" type="date" aria-label="Payment date"><input class="field" id="fn" placeholder="Patient name"></div>
      <div class="filters"><button class="btn" id="go">research 🔍</button><input class="field" id="fa" type="number" placeholder="Payment amount"><input class="field" id="fb" placeholder="batch number"></div></div>
      <div class="panel"><table><thead><tr><th>Action</th><th>Payment amount</th><th>Type</th><th>Payment value</th><th>Payment date</th><th>the customer</th></tr></thead><tbody id="tb"></tbody></table></div>`;
  },

  expenses() {
    const canViewExpenses = can('expenses', 'view');
    const render = tryDo(async () => {
      if (!canViewExpenses) return;
      const l = await api('/expenses');
      $('#tb').innerHTML = l.length ? l.map(x => `<tr><td>${day(x.spent_at)}</td><td>${esc(x.title)}</td><td>${money(x.amount)}</td><td>${esc(x.note || '')}</td><td>${can('expenses', 'delete') ? `<button class="btn sm red" data-d="${x.id}">Delete</button>` : ''}</td></tr>`).join('') : '<tr><td colspan="5" class="empty">No expenses yet.</td></tr>';
      document.querySelectorAll('[data-d]').forEach(b => b.onclick = tryDo(async () => { if (confirm(ClinicI18n.translate('Delete this expense?'))) { await api('/expenses/' + b.dataset.d, { method: 'DELETE' }); render(); } }));
    });
    setTimeout(() => {
      if (canViewExpenses) render();
      if ($('#ef')) $('#ef').onsubmit = tryDo(async e => { e.preventDefault(); await api('/expenses', { method: 'POST', body: Object.fromEntries(new FormData(e.target)) }); e.target.reset(); toast('Expense saved'); render(); });
    });
    return head() + `${can('expenses', 'create') ? `<form class="panel" id="ef"><h2 class="title"><b>Expenses</b></h2><div class="filters"><input class="field" name="title" placeholder="Title" required><input class="field" name="amount" type="number" step="0.01" min="0.01" placeholder="Amount" required><input class="field" name="spent_at" type="date"></div>
      <input class="field" name="note" placeholder="note" style="margin-top:16px"><p style="text-align:center"><button class="btn">Add expense</button></p></form>
      ` : ''}${canViewExpenses ? '<div class="panel"><table><thead><tr><th>Date</th><th>Title</th><th>Amount</th><th>Note</th><th>Action</th></tr></thead><tbody id="tb"></tbody></table></div>' : ''}`;
  },

  appointments() {
    const canViewAppointments = can('appointments', 'view');
    const canCreateAppointment = can('appointments', 'create') && can('patients', 'view');
    const render = tryDo(async () => {
      if (!canViewAppointments) return;
      const l = await api('/appointments?day=' + $('#ad').value);
      $('#tb').innerHTML = l.length ? l.map(a => `<tr><td>${esc(String(a.appt_at).replace('T', ' ').slice(0, 16))}</td><td>${can('patients', 'view') ? `<a href="#/patient/${a.patient_id}">${esc(a.patient_name)}</a>` : esc(a.patient_name)}</td><td>${esc(a.phone)}</td><td>${esc(a.reason || '')}</td><td>${a.status}</td><td><div class="row-actions">${can('appointments', 'edit') ? `<button class="btn sm green" data-s="${a.id}:done">Done</button><button class="btn sm red" data-s="${a.id}:cancelled">Cancel</button>` : ''}</div></td></tr>`).join('') : '<tr><td colspan="6" class="empty">No appointments for this day.</td></tr>';
      document.querySelectorAll('[data-s]').forEach(b => b.onclick = tryDo(async () => { const [i, st] = b.dataset.s.split(':'); await api('/appointments/' + i, { method: 'PATCH', body: { status: st } }); render(); }));
    });
    setTimeout(async () => {
      if (canViewAppointments) {
        $('#ad').value = new Date().toISOString().slice(0, 10);
        $('#ad').onchange = render;
        render();
      }
      if (canCreateAppointment) {
        const pts = await api('/patients'); $('#ap').innerHTML = pts.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('');
        $('#af').onsubmit = tryDo(async e => { e.preventDefault(); await api('/appointments', { method: 'POST', body: Object.fromEntries(new FormData(e.target)) }); toast('Appointment booked'); render(); });
      }
    });
    return head() + `${canCreateAppointment ? `<form class="panel" id="af"><h2 class="title"><b>Appointments</b></h2><div class="filters"><select class="field" name="patient_id" id="ap" aria-label="Patient"></select><input class="field" name="appt_at" type="datetime-local" required><input class="field" name="reason" placeholder="Reason"></div><p style="text-align:center"><button class="btn">Book appointment</button></p></form>` : ''}
      ${canViewAppointments ? '<div class="panel"><input class="field" id="ad" type="date" style="max-width:260px;margin-bottom:16px" aria-label="Day"><table><thead><tr><th>Time</th><th>Patient</th><th>Phone</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead><tbody id="tb"></tbody></table></div>' : ''}`;
  },

  async box() {
    const d = await api('/dashboard');
    const cards = [
      can('payments', 'view') && `<div class="stat g"><h4>Payments today</h4><p>${money(d.payments_today)}</p></div>`,
      can('payments', 'view') && can('expenses', 'view') && `<div class="stat b"><h4>Cash in box</h4><p>${money(d.box)}</p></div>`,
      can('sessions', 'view') && `<div class="stat r"><h4>Sessions today</h4><p>${d.reviews}</p></div>`
    ].filter(Boolean);
    return head() + `<div class="panel"><h2 class="title"><b>box</b> | today</h2><div class="cards3">${cards.join('')}</div></div>`;
  },

  async reports() {
    const [pay, exp] = await Promise.all([
      can('payments', 'view') ? api('/payments') : Promise.resolve([]),
      can('expenses', 'view') ? api('/expenses') : Promise.resolve([])
    ]);
    const by = {}; pay.forEach(p => (by[day(p.paid_at).slice(0, 7)] ||= { i: 0, o: 0 }).i += +p.amount); exp.forEach(x => (by[day(x.spent_at).slice(0, 7)] ||= { i: 0, o: 0 }).o += +x.amount);
    const rows = Object.entries(by).sort().reverse();
    return head() + `<div class="panel"><h2 class="title"><b>Reports</b></h2><table><thead><tr><th>Month</th><th>Income</th><th>Expenses</th><th>Net</th></tr></thead><tbody>${rows.map(([m, v]) => `<tr><td>${m}</td><td>${money(v.i)}</td><td>${money(v.o)}</td><td style="color:${v.i - v.o < 0 ? 'var(--red)' : 'var(--green)'}">${money(v.i - v.o)}</td></tr>`).join('') || '<tr><td colspan="4" class="empty">No payments or expenses recorded yet.</td></tr>'}</tbody></table></div>`;
  },

  async users() {
    const isAdmin = me.role === 'admin';
    const [l, permissionSettings] = await Promise.all([
      api('/users'),
      isAdmin ? api('/permissions') : Promise.resolve(null)
    ]);
    setTimeout(() => {
      if ($('#uf')) $('#uf').onsubmit = tryDo(async e => { e.preventDefault(); await api('/users', { method: 'POST', body: Object.fromEntries(new FormData(e.target)) }); toast('User added'); routeNow(); });
      if (!isAdmin) return;
      document.querySelectorAll('[data-a]').forEach(b => b.onclick = tryDo(async () => { const [i, v] = b.dataset.a.split(':'); await api('/users/' + i, { method: 'PATCH', body: { active: v === '1' } }); routeNow(); }));
      const editForm = $('#userEditForm');
      document.querySelectorAll('[data-edit-user]').forEach(button => button.onclick = () => {
        const user = l.find(item => String(item.id) === button.dataset.editUser);
        if (!user) return;
        editForm.elements.id.value = user.id;
        editForm.elements.name.value = user.name || '';
        editForm.elements.email.value = user.email || '';
        editForm.elements.phone.value = user.phone || '';
        editForm.elements.role.value = user.role;
        editForm.elements.password.value = '';
        editForm.hidden = false;
        editForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      editForm.onsubmit = tryDo(async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const body = Object.fromEntries(new FormData(form));
        const id = body.id;
        delete body.id;
        if (!body.password) delete body.password;
        await api(`/users/${id}`, { method: 'PATCH', body });
        toast('User saved');
        routeNow();
      });
      $('#cancelUserEdit').onclick = () => { editForm.hidden = true; editForm.reset(); };
      bindPermissionEditor(permissionSettings);
    });
    return head() + `<h2 class="title"><b>User Management</b></h2>${isAdmin ? `<form class="panel" id="uf"><h2 class="title"><b>Add user</b></h2><div class="filters"><input class="field" name="name" placeholder="Name" required><input class="field" name="email" type="email" placeholder="E-mail" required><input class="field" name="password" type="password" minlength="8" placeholder="Password (8+ characters)" required></div>
      <div class="grid2" style="margin-top:16px"><input class="field" name="phone" placeholder="Phone"><select class="field" name="role"><option value="doctor">doctor</option><option value="assistant">assistant</option><option value="receptionist">receptionist</option><option value="admin">admin</option></select></div><p style="text-align:center"><button class="btn">Add user</button></p></form>` : ''}
      <div class="panel"><table><thead><tr><th>Name</th>${isAdmin ? '<th>E-mail</th>' : ''}<th>Role</th><th>Status</th>${isAdmin ? '<th>Action</th>' : ''}</tr></thead><tbody>${l.map(u => `<tr><td>${esc(u.name)}</td>${isAdmin ? `<td>${esc(u.email)}</td>` : ''}<td>${u.role}</td><td>${u.active ? 'Active' : 'Disabled'}</td>${isAdmin ? `<td><button class="btn sm" type="button" data-edit-user="${u.id}">Edit</button> ${u.id === me.id ? '' : `<button class="btn sm ${u.active ? 'red' : 'green'}" data-a="${u.id}:${u.active ? 0 : 1}">${u.active ? 'Disable' : 'Enable'}</button>`}</td>` : ''}</tr>`).join('')}</tbody></table></div>
      ${isAdmin ? `<form class="panel" id="userEditForm" hidden><h2 class="title"><b>Edit user</b></h2><input type="hidden" name="id"><div class="filters"><label>Name<input class="field" name="name" required></label><label>E-mail<input class="field" name="email" type="email" required></label><label>Phone<input class="field" name="phone"></label><label>Role<select class="field" name="role"><option value="doctor">Doctor</option><option value="assistant">Assistant</option><option value="receptionist">Receptionist</option><option value="admin">Admin</option></select></label><label>New password (leave blank to keep current)<input class="field" name="password" type="password" minlength="8" autocomplete="new-password"></label></div><p style="text-align:center"><button class="btn" type="submit">Save user</button> <button class="btn dark" id="cancelUserEdit" type="button">Cancel</button></p></form>` : ''}
      ${isAdmin ? permissionEditorMarkup(permissionSettings) : ''}`;
  },

  async services() {
    const canViewServices = can('services', 'view');
    const list = canViewServices ? await api('/services?include_inactive=true') : [];
    const canCreate = can('services', 'create');
    const canEdit = can('services', 'edit');
    setTimeout(() => {
      if ($('#serviceForm')) $('#serviceForm').onsubmit = tryDo(async event => {
        event.preventDefault();
        await api('/services', { method: 'POST', body: Object.fromEntries(new FormData(event.target)) });
        event.target.reset();
        toast('Service added');
        routeNow();
      });
      document.querySelectorAll('[data-service-form]').forEach(form => form.onsubmit = tryDo(async event => {
        event.preventDefault();
        const fields = Object.fromEntries(new FormData(event.target));
        await api('/services/' + event.target.dataset.serviceForm, {
          method: 'PATCH',
          body: {
            name: fields.name,
            icon: fields.icon,
            duration_minutes: Number(fields.duration_minutes),
            price: Number(fields.price)
          }
        });
        toast('Service saved');
        routeNow();
      }));
      document.querySelectorAll('[data-service-active]').forEach(button => button.onclick = tryDo(async () => {
        await api('/services/' + button.dataset.serviceActive, {
          method: 'PATCH',
          body: { active: button.dataset.active !== 'true' }
        });
        toast(button.dataset.active === 'true' ? 'Service deactivated' : 'Service activated');
        routeNow();
      }));
    });
    return head() + `<div class="panel"><h2 class="title"><b>Services</b></h2>
      <p class="muted">Set treatment prices and appointment durations. New services start at $0.00; configure prices before adding them to a session.</p>
      ${canCreate ? `<form class="grid2" id="serviceForm">
        <input class="field" name="name" placeholder="Service name" maxlength="100" required>
        <input class="field" name="icon" placeholder="Icon (emoji)" maxlength="16" value="🦷" aria-label="Icon">
        <input class="field" name="duration_minutes" type="number" min="1" max="1440" placeholder="Duration in minutes" required>
        <input class="field" name="price" type="number" min="0" step="0.01" placeholder="Price ($)" required>
        <p style="grid-column:1/-1;text-align:center"><button class="btn">Add service</button></p>
      </form>` : ''}</div>
      ${canViewServices ? `<div class="panel service-management"><table><thead><tr><th>Service</th><th>Duration (min)</th><th>Price ($)</th><th>Status</th>${canEdit ? '<th>Action</th>' : ''}</tr></thead><tbody>
      ${list.map(service => `<tr><td><form class="service-row" id="service-${service.id}" data-service-form="${service.id}">
        <input class="field service-icon-field" name="icon" value="${esc(service.icon)}" maxlength="16" aria-label="Service icon" ${canEdit ? '' : 'readonly'}>
        <input class="field" name="name" value="${esc(service.name)}" maxlength="100" required aria-label="Service name" ${canEdit ? '' : 'readonly'}></form></td>
        <td><input class="field service-duration-field" form="service-${service.id}" name="duration_minutes" type="number" min="1" max="1440" value="${service.duration_minutes}" required aria-label="Duration in minutes" ${canEdit ? '' : 'readonly'}></td>
        <td><input class="field service-price-field" form="service-${service.id}" name="price" type="number" min="0" step="0.01" value="${service.price}" required aria-label="Price" ${canEdit ? '' : 'readonly'}></td>
        <td>${service.active ? 'Active' : 'Inactive'}</td>
        ${canEdit ? `<td><div class="row-actions"><button class="btn sm" form="service-${service.id}">Save</button>
          <button type="button" class="btn sm ${service.active ? 'red' : 'green'}" data-service-active="${service.id}" data-active="${service.active}">${service.active ? 'Deactivate' : 'Activate'}</button></div></td>` : ''}
        </tr>`).join('')}</tbody></table></div>` : ''}`;
  },

  async settings() {
    const [profile, template] = await Promise.all([api('/me'), api('/print-template')]);
    const isAdmin = profile.role === 'admin';
    setTimeout(() => {
      let photo = profile.photo || null;
      let photoChanged = false;
      const preview = $('#profilePreview');
      const savePhoto = $('#savePhoto');
      const fileInput = $('#photoFile');
      fileInput.onchange = tryDo(async () => {
        const [file] = fileInput.files;
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
          throw new Error('Choose a JPG, PNG or WebP image.');
        if (file.size > 10 * 1024 * 1024) throw new Error('Choose an image smaller than 10 MB.');
        const bitmap = await createImageBitmap(file);
        try {
          const side = Math.min(bitmap.width, bitmap.height);
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 256;
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Your browser could not process this image.');
          context.fillStyle = '#fff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 256, 256);
          photo = canvas.toDataURL('image/jpeg', 0.82);
        } finally {
          bitmap.close();
        }
        photoChanged = true;
        preview.src = photo;
        preview.hidden = false;
        savePhoto.disabled = false;
      });
      $('#clearPhoto').onclick = () => {
        photo = null;
        photoChanged = true;
        preview.removeAttribute('src');
        preview.hidden = true;
        savePhoto.disabled = false;
        fileInput.value = '';
      };
      $('#profileForm').onsubmit = tryDo(async e => {
        e.preventDefault();
        if (!photoChanged) return;
        const updated = await api('/me/profile', { method: 'PATCH', body: { photo } });
        Object.assign(me, updated);
        localStorage.user = JSON.stringify(me);
        renderAvatar(me.photo, me.name);
        photoChanged = false;
        savePhoto.disabled = true;
        toast('Profile photo saved');
      });
      $('#sf').onsubmit = tryDo(async e => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)); await api('/me/password', { method: 'POST', body: f }); e.target.reset(); toast('Password changed'); });

      if (!isAdmin) return;

      const images = {
        header: template.header_image || null,
        footer: template.footer_image || null
      };
      const syncTemplateSection = section => {
        const mode = $(`#${section}Mode`).value;
        $(`#${section}TextGroup`).hidden = !['text', 'both'].includes(mode);
        $(`#${section}ImageGroup`).hidden = !['image', 'both'].includes(mode);
        $(`#${section}ImagePreview`).hidden = !images[section];
        $(`#${section}RemoveImage`).disabled = !images[section];
      };
      for (const section of ['header', 'footer']) {
        $(`#${section}Mode`).onchange = () => {
          syncTemplateSection(section);
          $('#savePrintTemplate').disabled = false;
        };
        $(`#${section}Text`).oninput = () => { $('#savePrintTemplate').disabled = false; };
        $(`#${section}ImageFile`).onchange = tryDo(async () => {
          const [file] = $(`#${section}ImageFile`).files;
          if (!file) return;
          if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
            throw new Error('Choose a JPG, PNG or WebP image.');
          if (file.size > 10 * 1024 * 1024)
            throw new Error('Choose an image smaller than 10 MB.');

          const bitmap = await createImageBitmap(file);
          try {
            const scale = Math.min(1, 1400 / bitmap.width, 350 / bitmap.height);
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(bitmap.width * scale));
            canvas.height = Math.max(1, Math.round(bitmap.height * scale));
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Your browser could not process this image.');
            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
            const data = canvas.toDataURL('image/jpeg', 0.82);
            if (data.length > 600000)
              throw new Error('Image is too detailed. Choose a smaller or simpler image.');
            images[section] = data;
          } finally {
            bitmap.close();
          }

          $(`#${section}ImagePreview`).src = images[section];
          syncTemplateSection(section);
          $('#savePrintTemplate').disabled = false;
        });
        $(`#${section}RemoveImage`).onclick = () => {
          images[section] = null;
          $(`#${section}ImagePreview`).removeAttribute('src');
          $(`#${section}ImageFile`).value = '';
          syncTemplateSection(section);
          $('#savePrintTemplate').disabled = false;
        };
        syncTemplateSection(section);
      }

      $('#printTemplateForm').onsubmit = tryDo(async event => {
        event.preventDefault();
        const updated = await api('/print-template', {
          method: 'PATCH',
          body: {
            header_mode: $('#headerMode').value,
            header_text: $('#headerText').value,
            header_image: images.header,
            footer_mode: $('#footerMode').value,
            footer_text: $('#footerText').value,
            footer_image: images.footer
          }
        });
        images.header = updated.header_image;
        images.footer = updated.footer_image;
        $('#savePrintTemplate').disabled = true;
        toast('Print template saved');
      });

    });
    const templateSection = (section, title) => {
      const mode = template[`${section}_mode`];
      const image = template[`${section}_image`];
      return `<section class="template-section"><h3>${title}</h3>
        <label for="${section}Mode">Layout</label><select class="field" id="${section}Mode">
          <option value="none" ${mode === 'none' ? 'selected' : ''}>None</option>
          <option value="text" ${mode === 'text' ? 'selected' : ''}>Text only</option>
          <option value="image" ${mode === 'image' ? 'selected' : ''}>Image only</option>
          <option value="both" ${mode === 'both' ? 'selected' : ''}>Text + Image</option>
        </select>
        <div id="${section}TextGroup" class="template-editor"><label for="${section}Text">Custom text</label><textarea class="field" id="${section}Text" maxlength="2000" placeholder="Enter text; line breaks are kept">${esc(template[`${section}_text`] || '')}</textarea></div>
        <div id="${section}ImageGroup" class="template-editor"><label for="${section}ImageFile">Upload image</label><input class="field" id="${section}ImageFile" type="file" accept="image/jpeg,image/png,image/webp">
          <p class="muted">JPG, PNG or WebP; images are resized to fit a print header or footer.</p>
          <img class="template-image-preview" id="${section}ImagePreview" src="${esc(image || '')}" alt="${title} image preview" ${image ? '' : 'hidden'}>
          <button type="button" class="btn dark" id="${section}RemoveImage" ${image ? '' : 'disabled'}>Remove image</button>
        </div></section>`;
    };
    return head() + `<div class="panel" style="max-width:700px"><h2 class="title"><b>Profile</b></h2><form id="profileForm" class="profile-form"><img id="profilePreview" class="profile-preview" src="${esc(profile.photo || '')}" alt="Profile photo preview" ${profile.photo ? '' : 'hidden'}><label for="photoFile">Profile photo</label><input class="field" id="photoFile" type="file" accept="image/jpeg,image/png,image/webp"><p class="muted">JPG, PNG or WebP; images are cropped and resized before upload.</p><div class="row-actions"><button class="btn" id="savePhoto" disabled>Save photo</button><button class="btn dark" id="clearPhoto" type="button">Remove photo</button></div></form></div>
      <form class="panel" id="sf" style="max-width:700px"><h2 class="title"><b>Change password</b></h2><label>Current password</label><input class="field" type="password" name="current" required autocomplete="current-password"><label style="margin-top:16px">New password (8+ characters)</label><input class="field" type="password" name="next" minlength="8" required autocomplete="new-password"><p style="text-align:center"><button class="btn">Change password</button></p></form>
      <div class="panel print-template-settings" style="max-width:700px"><h2 class="title"><b>Printing template</b></h2>
        ${isAdmin ? `<p class="muted">This clinic-wide template appears on printed patient sessions and account statements.</p>
        <form id="printTemplateForm">${templateSection('header', 'Print header')}${templateSection('footer', 'Print footer')}
          <p style="text-align:center"><button class="btn" id="savePrintTemplate" disabled>Save print template</button></p></form>`
        : '<p class="muted">Clinic printing templates are managed by an administrator.</p>'}
      </div>
      `;
  },
};

async function routeNow() {
  const [, name = 'main', a, b] = location.hash.split('/');
  const profile = await profileReady;
  if (!profile) {
    $('#app').innerHTML = '<div class="panel"><p class="empty">Could not load your account permissions. Please refresh or sign in again.</p></div>';
    return;
  }
  try {
    const refreshedProfile = await api('/me');
    Object.assign(me, refreshedProfile);
    localStorage.user = JSON.stringify(me);
    $('#uname').textContent = me.name || '';
    renderAvatar(me.photo, me.name);
  } catch (error) {
    $('#app').innerHTML = `<div class="panel"><p class="empty">${esc(error.message)}</p></div>`;
    return;
  }
  applyNavigationPermissions();
  document.querySelectorAll('#nav a').forEach(x => x.classList.toggle('on', x.getAttribute('href') === '#/' + name));
  const fn = routes[name] || routes.main;
  const access = {
    'new-patient': ['patients', 'create'],
    patients: ['patients', 'view'],
    patient: ['patients', b === 'edit' ? 'edit' : 'view'],
    statement: ['reports', 'view'],
    session: ['sessions', 'view'],
    invoices: ['invoices', 'view'],
    invoice: ['invoices', 'view'],
    payments: ['payments', 'view'],
    expenses: ['expenses', 'view'],
    appointments: ['appointments', 'view'],
    services: ['services', 'view'],
    users: ['users', 'view'],
    settings: ['settings', 'view'],
    reports: ['reports', 'view']
  }[name];
  const createAccess = {
    invoices: can('invoices', 'create') && can('patients', 'view'),
    expenses: can('expenses', 'create'),
    appointments: can('appointments', 'create') && can('patients', 'view'),
    services: can('services', 'create')
  }[name];
  const allowed = ['invoices', 'expenses', 'appointments', 'services'].includes(name)
    ? can(name, 'view') || createAccess
    : !access || can(...access);
  if (!allowed) {
    $('#app').innerHTML = '<div class="panel"><p class="empty">You do not have permission to view this feature.</p></div>';
    return;
  }
  if (name === 'box' && !can('payments', 'view') && !can('sessions', 'view')) {
    $('#app').innerHTML = '<div class="panel"><p class="empty">You do not have permission to view this feature.</p></div>';
    return;
  }
  try { $('#app').innerHTML = await fn(a, b); scrollTo(0, 0); }
  catch (e) { $('#app').innerHTML = `<div class="panel"><p class="empty">${esc(e.message)}</p></div>`; }
}
addEventListener('hashchange', routeNow);
routeNow();
