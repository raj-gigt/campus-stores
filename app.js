(() => {
  const storageKey = "campus-stores.shift.v1";
  const root = document.getElementById("campus-stores");
  const q = (selector) => root.querySelector(selector);
  const requests = [
    {
      id: "RQ-214",
      club: "Film Society",
      event: "Courtyard screening",
      owner: "Isha Rao",
      due: "Fri 8 pm",
      items: ["HDMI projector", "Portable speaker", "USB-C → HDMI adapter"],
      note: "Playback is from a USB-C-only laptop. The host will collect at 4 pm.",
    },
    {
      id: "RQ-209",
      club: "Debate Union",
      event: "Finals rehearsal",
      owner: "Tara Shah",
      due: "Sat 10 am",
      items: ["Wireless microphone"],
      note: "Rehearsal runs into the evening.",
    },
    {
      id: "RQ-217",
      club: "Photo Circle",
      event: "Street portrait walk",
      owner: "Dev Menon",
      due: "Sat noon",
      items: ["Digital camera"],
      note: "Collection on Saturday morning.",
    },
  ];
  const assets = [
    { id: "PR-04", type: "HDMI projector", model: "BenQ MH550", bin: "A2" },
    {
      id: "PR-06",
      type: "HDMI projector",
      model: "Epson EB-X49",
      bin: "Workshop",
      repair: true,
    },
    { id: "SP-02", type: "Portable speaker", model: "JBL Eon One", bin: "B1" },
    { id: "SP-05", type: "Portable speaker", model: "Bose S1", bin: "B2" },
    {
      id: "AD-12",
      type: "USB-C → HDMI adapter",
      model: "Belkin AVC002",
      bin: "C4",
    },
    {
      id: "AD-15",
      type: "USB-C → HDMI adapter",
      model: "Anker A8312",
      bin: "C4",
    },
    { id: "MI-09", type: "Wireless microphone", model: "Shure BLX", bin: "B3" },
    { id: "CA-03", type: "Digital camera", model: "Sony A6400", bin: "D2" },
  ];
  const people = [
    "Isha Rao",
    "Kabir Sen",
    "Leela Das",
    "Tara Shah",
    "Dev Menon",
  ];
  const shifts = [
    {
      time: "Friday · 3:45 pm",
      title: "Pickup at the counter",
      text: "Kabir is here for the Film Society screening. The film starts at four. Can he leave with everything he needs?",
      next: "Move to return time",
    },
    {
      time: "Friday · 7:30 pm",
      title: "The kit comes back in pieces",
      text: "Kabir has brought back the projector and speaker. “Leela still has the adapter. She’ll drop it off tomorrow at nine.” Take the return and hand over to the morning shift.",
      next: "Move to next morning",
    },
    {
      time: "Saturday · 9:00 am",
      title: "Morning shift",
      text: "You’ve just taken over. Leela walks in with an adapter. Work out what was outstanding from the screening and close the loan for the right item.",
    },
  ];
  const pages = [
    ["Requests", "clipboard-list"],
    ["Inventory", "package"],
    ["Loan register", "book-open"],
    ["Desk book", "messages-square"],
  ];
  const original = () => ({
    version: 1,
    tab: "Requests",
    phase: 0,
    selected: "RQ-214",
    filter: "All items",
    loans: [
      {
        num: 401,
        req: "RQ-209",
        asset: "MI-09",
        who: "Tara Shah",
        due: "Sat 10 am",
        back: false,
      },
    ],
    notes: [],
    editing: false,
    onlyOpen: true,
    notice: "Sample shift · All records are fictional.",
  });
  let s = original();
  const getAsset = (id) => assets.find((x) => x.id === id);
  const getReq = (id) => requests.find((x) => x.id === id);
  const out = (id) => s.loans.find((l) => l.asset === id && !l.back);
  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const opts = (list) =>
    list
      .map(([v, t]) => '<option value="' + esc(v) + '">' + esc(t) + "</option>")
      .join("");
  const btn = (label, act, val = "", style = "") =>
    '<button type="button" data-action="' +
    act +
    '" data-val="' +
    esc(val) +
    '" class="' +
    style +
    '">' +
    esc(label) +
    "</button>";
  const head = (title, sub, control = "") =>
    '<div class="sectionhead"><div><h2>' +
    title +
    "</h2><small>" +
    sub +
    "</small></div>" +
    control +
    "</div>";
  const row = (label, sub, right) =>
    '<div class="row"><div><strong>' +
    esc(label) +
    "</strong><small>" +
    esc(sub) +
    "</small></div><div>" +
    right +
    "</div></div>";
  const badge = (t, good = false) =>
    '<span class="tag' + (good ? " good" : "") + '">' + esc(t) + "</span>";
  function kitSummary(r) {
    const slips = s.loans.filter((l) => l.req === r.id);
    const active = slips.filter((l) => !l.back);
    const issued = new Set(slips.map((l) => getAsset(l.asset).type)).size;
    const returned = new Set(slips.filter((l) => l.back && !active.some((a) => getAsset(a.asset).type === getAsset(l.asset).type)).map((l) => getAsset(l.asset).type)).size;
    if (!issued) return "Not issued · " + r.items.length + " items needed";
    if (!active.length && issued === r.items.length) return "Kit complete · " + returned + " of " + r.items.length + " returned";
    if (returned) return returned + " of " + r.items.length + " returned · " + active.length + " outstanding" + (issued < r.items.length ? " · " + (r.items.length - issued) + " not issued" : "");
    return issued + " of " + r.items.length + " issued";
  }
  function kit(r) {
    const slips = s.loans.filter((l) => l.req === r.id);
    const missing = r.items.filter((type) => !slips.some((l) => getAsset(l.asset).type === type));
    let html = '<section class="kit" aria-label="Request kit"><div class="sectionhead"><div><h3>Approved kit & handover</h3><small>' + esc(kitSummary(r)) + '</small></div></div>';
    for (const type of r.items) {
      const matches = slips.filter((l) => getAsset(l.asset).type === type);
      const l = matches.find((l) => !l.back) || matches[matches.length - 1];
      if (!l) continue;
      html += '<article class="kit-item"><div class="row"><div><strong>' + esc(type) + '</strong><small>' + (l ? esc(l.asset + ' · ' + getAsset(l.asset).model + ' · L-' + l.num) : 'Choose a physical unit below') + '</small></div>' + badge(l ? (l.back ? 'Returned' : 'Outstanding') : 'Not issued', !!l && l.back) + '</div>';
      if (l) {
        html += '<p class="muted">Collected by ' + esc(l.who) + ' · Due ' + esc(l.due) + '</p>';
        if (!l.back) {
          if (l.expectedFrom || l.expectedAt || l.handover) html += '<div class="handover"><strong>Next shift</strong><p>' + esc([l.expectedFrom && 'Expected from ' + l.expectedFrom, l.expectedAt].filter(Boolean).join(' · ')) + '</p><p>' + esc(l.handover || '') + '</p></div>';
          html += '<div class="buttons">' + btn('Record return · ' + l.asset, 'return', String(l.num)) + '</div><details class="handover-edit"><summary>' + (l.expectedFrom || l.expectedAt || l.handover ? 'Edit item handover' : 'Add item handover') + '</summary><form data-handover="' + l.num + '"><div class="form"><label><span>Expected from</span><select name="expectedFrom"><option value="">Not known</option>' + people.map((p) => '<option' + (p === l.expectedFrom ? ' selected' : '') + '>' + esc(p) + '</option>').join('') + '</select></label><label><span>Expected return</span><input name="expectedAt" maxlength="80" placeholder="e.g. Saturday, 9 am" value="' + esc(l.expectedAt || '') + '"></label><label class="full"><span>Note for this item</span><textarea name="handover" maxlength="400" rows="2">' + esc(l.handover || '') + '</textarea></label></div><button type="submit">Save item handover</button></form></details>';
        } else if (l.expectedFrom || l.expectedAt || l.handover) html += '<p class="muted">Handover resolved · ' + esc(l.expectedFrom || '') + ' · ' + esc(l.expectedAt || '') + '</p>';
      }
      html += '</article>';
    }
    if (missing.length) {
      html += '<form data-kit="' + r.id + '"><h3>Prepare ' + (slips.length ? 'remaining items' : 'the kit') + '</h3><p class="muted">Check all ' + r.items.length + ' approved items before the collector leaves.</p><div class="form">';
      for (const type of missing) {
        const available = assets.filter((a) => a.type === type && !a.repair && !out(a.id));
        html += '<label class="full"><span>' + esc(type) + '</span><select name="unit" required><option value="">' + (available.length ? 'Select unit…' : 'No units available') + '</option>' + opts(available.map((a) => [a.id, a.id + ' · ' + a.model + ' · Shelf ' + a.bin])) + '</select></label>';
      }
      html += '<label><span>Collected by</span><select name="who" required><option value="">Select collector…</option>' + opts(people.map((p) => [p,p])) + '</select></label><label><span>Return by</span><input name="due" value="' + esc(r.due) + '" maxlength="80" required></label></div><button type="submit" class="primary">Issue ' + missing.length + ' kit items</button></form>';
    }
    return html + '</section>';
  }
  function requestPage() {
    let html = head(
      "Approved requests",
      "Student Activities Office · 3 approved forms",
    );
    if (s.selected) {
      const r = getReq(s.selected);
      html +=
        btn("Back to list", "close") +
        '<div class="record"><small>' +
        r.id +
        " · Approved</small><h3>" +
        r.event +
        "</h3><p>" +
        r.club +
        " · Filed by " +
        r.owner +
        "</p><p><b>Return by</b> " +
        r.due +
        "</p><p>" +
        r.note +
        "</p></div>" + kit(r);
    } else
      html += requests
        .map((r) =>
          row(
            r.event,
            r.id + " · " + r.club + " · " + kitSummary(r),
            btn("Open kit", "request", r.id),
          ),
        )
        .join("");
    return html;
  }
  function inventory() {
    let html = head(
      "Inventory",
      "Physical units · home shelf and current availability",
    );
    html +=
      '<div class="buttons"><label>Show <select data-filter>' +
      opts(
        ["All items", "On shelf", "On loan", "In repair"].map((f) => [f, f]),
      ) +
      "</select></label></div>";
    for (const a of assets) {
      const status = a.repair
        ? "In repair"
        : out(a.id)
          ? "On loan"
          : "On shelf";
      if (s.filter !== "All items" && s.filter !== status) continue;
      html += row(
        a.id + " · " + a.type,
        a.model + " · " + a.bin,
        badge(status, status === "On shelf"),
      );
    }
    return html;
  }
  function register() {
    let html = head(
      "Loan register",
      "One slip per physical unit",
      s.editing
        ? btn("Cancel", "cancel")
        : btn("New issue slip", "new", "", "primary"),
    );
    if (s.editing) {
      const available = assets.filter((a) => !a.repair && !out(a.id));
      const select = (label, key, options) =>
        "<label><span>" +
        label +
        '</span><select name="' +
        key +
        '" required><option value="">Select…</option>' +
        opts(options) +
        "</select></label>";
      return (
        html +
        '<form data-issue><div class="form">' +
        select(
          "Approved request",
          "req",
          requests.map((r) => [r.id, r.id + " · " + r.club]),
        ) +
        select(
          "Unit leaving the desk",
          "asset",
          available.map((a) => [a.id, a.id + " · " + a.type]),
        ) +
        select(
          "Collected by",
          "who",
          people.map((p) => [p, p]),
        ) +
        select(
          "Return by",
          "due",
          ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"].map((d) => [d, d]),
        ) +
        '</div><button type="submit" class="primary">Save issue slip</button></form>'
      );
    }
    html +=
      '<div class="buttons">' +
      ["Outstanding", "All slips"]
        .map(
          (v, i) =>
            '<button type="button" data-action="scope" data-val="' +
            i +
            '" aria-pressed="' +
            (s.onlyOpen === (i === 0)) +
            '">' +
            v +
            "</button>",
        )
        .join("") +
      "</div>";
    const shown = s.loans
      .filter((l) => !s.onlyOpen || !l.back)
      .slice()
      .reverse();
    if (!shown.length) html += "<p>No outstanding slips.</p>";
    for (const l of shown)
      html += row(
        "L-" + l.num + " · " + l.asset,
        l.req + " · " + l.who + " · Due " + l.due,
        l.back
          ? badge("Returned")
          : btn("Record return", "return", String(l.num)),
      );
    return html;
  }
  const hasHandover = (l) => l.expectedFrom || l.expectedAt || l.handover;
  function shiftHandover() {
    const handovers = s.loans.filter(hasHandover);
    const pending = handovers.filter((l) => !l.back);
    const resolved = handovers.filter((l) => l.back);
    const groups = (loans) => requests.map((r) => {
      const items = loans.filter((l) => l.req === r.id);
      if (!items.length) return "";
      return '<section class="handover-group"><div class="sectionhead"><div><h3>' + esc(r.club + ' · ' + r.event) + '</h3><small>' + esc(r.id + ' · ' + kitSummary(r)) + '</small></div>' + btn('Open kit', 'request', r.id) + '</div>' + items.map((l) => {
        const a = getAsset(l.asset);
        return '<article class="record"><div class="sectionhead"><h3>' + esc(l.asset + ' · ' + a.type) + '</h3>' + badge(l.back ? 'Resolved · returned' : 'Outstanding', l.back) + '</div><small>' + esc('L-' + l.num + ' · Collected by ' + l.who + ' · Due ' + l.due) + '</small>' + (l.expectedFrom ? '<p><b>Expected from</b> ' + esc(l.expectedFrom) + '</p>' : '') + (l.expectedAt ? '<p><b>Expected return</b> ' + esc(l.expectedAt) + '</p>' : '') + (l.handover ? '<p>' + esc(l.handover) + '</p>' : '') + (shifts[l.handoverPhase] ? '<p><small>Last updated ' + esc(shifts[l.handoverPhase].time) + '</small></p>' : '') + '</article>';
      }).join('') + '</section>';
    }).join('');
    const notes = s.notes.slice().reverse().map((n) =>
      '<article class="record"><small>' + esc(shifts[n.phase].time) + '</small><p>' + esc(n.text) + '</p></article>'
    ).join('');
    const noteForm = '<form data-note><div class="form"><label class="full"><span>Note for the next shift</span><textarea name="note" rows="2" maxlength="400" required></textarea></label></div><button type="submit">Add handover note</button></form>';
    return '<section class="shift-handover" aria-label="Next shift handover">' +
      head('Next shift handover', pending.length + ' outstanding item' + (pending.length === 1 ? '' : 's') + ' · ' + s.notes.length + ' general note' + (s.notes.length === 1 ? '' : 's')) +
      (pending.length ? groups(pending) : '') + notes +
      (!pending.length && !s.notes.length ? '<p class="muted">No handover notes yet. Add a note below or save an item handover in a kit.</p>' : '') +
      noteForm +
      (resolved.length ? '<details class="resolved-handovers"><summary>Resolved item handovers (' + resolved.length + ')</summary>' + groups(resolved) + '</details>' : '') + '</section>';
  }
  function deskbook() {
    let html = head(
      "Desk book",
      "Messages from clubs and notes for the next shift",
    );
    html += shiftHandover();
    html += '<h3 class="desk-messages-title">Club messages</h3>';
    const entries = [
      [
        "Friday · 3:20 pm",
        "Isha Rao · Film Society",
        "Kabir Sen is picking up our whole screening kit. Please issue it in his name. I’m setting up in the courtyard.",
      ],
      [
        "Friday · 3:30 pm",
        "Tara Shah · Debate Union",
        "Our microphone stays with me overnight. I’ll return it by 10 am Saturday.",
      ],
    ];
    if (s.phase >= 1)
      entries.push([
        "Friday · 7:30 pm",
        "Kabir Sen · Film Society",
        "I brought the projector and speaker. Leela Das has our adapter. She’ll be at the counter at 9 am tomorrow.",
      ]);
    for (const [t, author, body] of entries.slice().reverse())
      html +=
        '<article class="record"><small>' +
        esc(t) +
        "</small><h3>" +
        esc(author) +
        "</h3><p>" +
        esc(body) +
        "</p></article>";
    return html;
  }
  const screens = {
    Requests: requestPage,
    Inventory: inventory,
    "Loan register": register,
    "Desk book": deskbook,
  };
  function paint() {
    const phase = shifts[s.phase];
    q("[data-clock]").textContent = phase.time;
    q("[data-shift-title]").textContent = phase.title;
    q("[data-shift]").textContent = phase.text;
    q("[data-comment]").textContent = [
      "My change: the request now has one kit checklist. Select all three physical units and issue them together to Kabir. This makes the adapter visible before he leaves; individual loan slips and availability checks are kept.",
      "My change: record the projector and speaker returns in the same kit view. The count shows 2 of 3 returned. Add Leela and Saturday, 9 am to the adapter’s item handover so the next shift inherits the exact outstanding unit. Saved item handovers also appear together in Desk book automatically.",
      "My change: the kit and Desk book carry the saved handover into the morning. Match Leela’s adapter ID to the outstanding unit before recording its return. The kit then shows all 3 returned and the item handover is resolved. Test at a real counter: can the next operator finish without asking the previous shift?"
    ][s.phase];
    const advance = q('[data-action="advance"]');
    advance.hidden = !phase.next;
    advance.textContent = phase.next || "";
    q("[data-nav]").innerHTML = pages
      .map(
        ([n, icon]) =>
          '<button type="button" data-action="tab" data-val="' +
          n +
          '" aria-pressed="' +
          (s.tab === n) +
          '"><svg aria-hidden="true" class="store-icon"><use href="#icon-' +
          icon +
          '"></use></svg>' +
          n +
          "</button>",
      )
      .join("");
    q("[data-page]").innerHTML = screens[s.tab]();
    if (q("[data-filter]")) q("[data-filter]").value = s.filter;
    q("[data-status]").textContent = s.notice;
  }
  function commit(msg) {
    if (msg) s.notice = msg;
    paint();
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      q("[data-status]").textContent +=
        " Browser storage is unavailable. Progress lasts for this visit.";
    }
  }
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const v = b.dataset.val;
    switch (b.dataset.action) {
      case "restart":
        s = original();
        break;
      case "advance":
        if (s.phase < 2) s.phase++;
        s.notice = "Shift time updated.";
        break;
      case "tab":
        s.tab = v;
        s.editing = false;
        break;
      case "close":
        s.selected = "";
        break;
      case "request":
        s.tab = "Requests";
        s.selected = v;
        break;
      case "new":
        s.editing = true;
        break;
      case "cancel":
        s.editing = false;
        break;
      case "scope":
        s.onlyOpen = v === "0";
        break;
      case "return": {
        const l = s.loans.find((l) => l.num === Number(v));
        if (!l || l.back) return;
        l.back = true;
        s.notice = l.asset + " returned to stock. Slip L-" + l.num + " closed.";
        break;
      }
    }
    commit();
  });
  root.addEventListener("change", (e) => {
    if (e.target.matches("[data-filter]")) {
      s.filter = e.target.value;
      commit();
    }
  });
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const form = new FormData(f);
    if (f.matches("[data-handover]")) {
      const l = s.loans.find((l) => l.num === Number(f.dataset.handover) && !l.back);
      if (!l) return;
      l.expectedFrom = String(form.get("expectedFrom") || "");
      l.expectedAt = String(form.get("expectedAt") || "").trim().slice(0, 80);
      l.handover = String(form.get("handover") || "").trim().slice(0, 400);
      l.handoverPhase = s.phase;
      commit("Item handover saved for " + l.asset + " and shared in Desk book.");
      return;
    }
    if (f.matches("[data-kit]")) {
      const r = getReq(f.dataset.kit);
      if (!r) return;
      const missing = r.items.filter((type) => !s.loans.some((l) => l.req === r.id && getAsset(l.asset).type === type));
      const units = form.getAll("unit").map(getAsset);
      const who = form.get("who"), due = String(form.get("due") || "").trim().slice(0, 80);
      if (!people.includes(who) || !due || !missing.length || units.length !== missing.length || units.some((a, i) => !a || a.repair || out(a.id) || a.type !== missing[i])) {
        q("[data-status]").textContent = "Check the collector and available unit for every missing kit item.";
        return;
      }
      let num = Math.max(400, ...s.loans.map((l) => l.num));
      for (const a of units) s.loans.push({ num: ++num, req: r.id, asset: a.id, who, due, back: false });
      commit("Issued " + units.length + " items to " + who + ". Kit checklist updated.");
      return;
    }
    if (f.matches("[data-note]")) {
      const text = String(form.get("note")).trim();
      if (!text) return;
      s.notes.push({ phase: s.phase, text });
      commit("Handover note saved.");
      return;
    }
    if (!f.matches("[data-issue]")) return;
    const [req, asset, who, due] = ["req", "asset", "who", "due"].map((k) =>
      form.get(k),
    );
    const unit = getAsset(asset),
      r = getReq(req);
    if (!r || !unit || unit.repair || out(asset) || !people.includes(who))
      return;
    if (!r.items.includes(unit.type)) {
      q("[data-status]").textContent =
        "This equipment type is outside the approved request. Choose an approved unit.";
      return;
    }
    if (
      s.loans.some(
        (l) => l.req === req && !l.back && getAsset(l.asset).type === unit.type,
      )
    ) {
      q("[data-status]").textContent =
        "The approved quantity of this equipment type is already on loan.";
      return;
    }
    const num = Math.max(...s.loans.map((l) => l.num)) + 1;
    s.loans.push({ num, req, asset, who, due, back: false });
    s.editing = false;
    commit("Issued " + asset + " to " + who + " on slip L-" + num + ".");
  });
  function restore(d) {
    if (
      !d ||
      d.version !== 1 ||
      !Object.hasOwn(screens, d.tab) ||
      !shifts[d.phase] ||
      (d.selected && !getReq(d.selected)) ||
      !Array.isArray(d.notes) ||
      !d.notes.every(
        (n) => n && shifts[n.phase] && typeof n.text === "string",
      ) ||
      !Array.isArray(d.loans) ||
      !d.loans.length ||
      !d.loans.every(
        (l) =>
          l && getReq(l.req) && getAsset(l.asset) && Number.isInteger(l.num),
      )
    )
      return;
    s = {
      ...original(),
      ...d,
      loans: d.loans.map((l) => ({ ...l })),
      notes: d.notes.map((n) => ({ ...n })),
    };
    paint();
  }
  paint();
  try {
    restore(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
    // Keep the fresh shift when storage is unavailable or the saved data is invalid.
  }
})();
