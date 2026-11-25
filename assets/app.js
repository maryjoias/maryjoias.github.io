/* MARY JOIAS · catálogo  (sem dependências) */
(() => {
  "use strict";

  const CATS = window.MJ_CATEGORIAS;
  const MATS = window.MJ_MATERIAIS;
  const PRODS = window.MJ_PRODUTOS;
  const LOJAS = window.MJ_LOJAS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const catById = Object.fromEntries(CATS.map(c => [c.id, c]));
  const matById = Object.fromEntries(MATS.map(m => [m.id, m]));
  const prodById = Object.fromEntries(PRODS.map(p => [p.id, p]));

  /* ---------- utilidades ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const precoTxt = p => (typeof p.preco === "number" && p.preco > 0) ? brl(p.preco) : "Sob consulta";
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* modo privado */ } }
  };
  const track = (event, data = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...data });
  };

  /* ---------- ilustrações provisórias (SVG) ---------- */
  const shadow = (cx = 100, cy = 172, rx = 58) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="7" fill="#3b2a12" fill-opacity=".07"/>`;
  const ring = (cx, cy, rx, ry, sw, M) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${M}" stroke-width="${sw}"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx - sw / 4}" ry="${ry - sw / 4}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/>`;
  const stone = (cx, cy, r, M) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#m-pedra)" stroke="${M}" stroke-width="${Math.max(1, r / 5)}"/>`;
  const onEllipse = (cx, cy, rx, ry, n, a0 = 0, a1 = Math.PI * 2) =>
    Array.from({ length: n }, (_, i) => { const a = a0 + (a1 - a0) * (i / (n - (a1 - a0 >= 6.28 ? 0 : 1))); return [cx + rx * Math.cos(a), cy + ry * Math.sin(a), a]; });
  const bez = (p0, p1, p2, p3, n) => Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1), u = 1 - t;
    return [u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
            u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1]];
  });
  const star = (cx, cy, r, M) => {
    const pts = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`; });
    return `<polygon points="${pts.join(" ")}" fill="${M}"/>`;
  };
  const heart = (cx, cy, s, M, sw) => `<path transform="translate(${cx} ${cy}) scale(${s})" d="M0 32 C-40 4 -42 -26 -20 -32 C-8 -35 -2 -26 0 -20 C2 -26 8 -35 20 -32 C42 -26 40 4 0 32Z" fill="${sw ? "none" : M}" stroke="${M}" stroke-width="${sw || 0}"/>`;
  const drop = (cx, cy, s, M) => `<path transform="translate(${cx} ${cy}) scale(${s})" d="M0 -26 C12 -6 22 8 22 22 A22 22 0 0 1 -22 22 C-22 8 -12 -6 0 -26Z" fill="url(#m-pedra)" stroke="${M}" stroke-width="${3.5 / s}"/>`;
  const pendantChain = M => `<path d="M38 16 Q100 92 162 16" fill="none" stroke="${M}" stroke-width="2.2" stroke-dasharray="3 2.4"/><ellipse cx="100" cy="64" rx="4.5" ry="6.5" fill="none" stroke="${M}" stroke-width="2.6"/>`;

  function desenho(p, metalOverride) {
    const metal = metalOverride || (matById[p.mat] || MATS[0]).metal;
    const M = `url(#m-${metal})`;
    const d = p.desenho;
    let g = "";
    switch (p.cat) {
      case "alianca":
        g = shadow() + ring(80, 112, 42, 40, 13, M) + ring(122, 96, 42, 40, 13, M);
        break;
      case "anel":
        if (d === "aparador") {
          g = shadow() + ring(100, 115, 48, 46, 10, M) +
            onEllipse(100, 115, 48, 46, 9, Math.PI * 1.12, Math.PI * 1.88).map(([x, y]) => stone(x.toFixed(1), y.toFixed(1), 5, M)).join("");
        } else if (d === "formatura") {
          g = shadow() + ring(100, 122, 46, 44, 12, M) +
            `<ellipse cx="100" cy="74" rx="22" ry="17" fill="#8e1f30" stroke="${M}" stroke-width="6"/><ellipse cx="93" cy="69" rx="6" ry="4" fill="#fff" fill-opacity=".35"/>`;
        } else if (d === "flor") {
          g = shadow() + ring(100, 124, 44, 42, 6, M) +
            Array.from({ length: 6 }, (_, i) => { const a = i * Math.PI / 3; return `<circle cx="${(100 + 13 * Math.cos(a)).toFixed(1)}" cy="${(72 + 13 * Math.sin(a)).toFixed(1)}" r="10" fill="${M}"/>`; }).join("") +
            stone(100, 72, 7, M);
        } else {
          g = shadow() + ring(100, 122, 46, 44, 8, M) +
            `<path d="M89 84 Q100 98 111 84" fill="none" stroke="${M}" stroke-width="4"/>` +
            `<path d="M86 76 L100 56 L114 76 L100 92Z" fill="url(#m-pedra)" stroke="${M}" stroke-width="2"/><path d="M86 76 H114 M100 56 V92" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>`;
        }
        break;
      case "pingente":
        g = shadow(100, 172, 36) + pendantChain(M);
        if (d === "coracao") g += heart(100, 112, 1.15, M, 6);
        else if (d === "letra") g += `<circle cx="100" cy="106" r="30" fill="${M}"/><circle cx="100" cy="106" r="24" fill="none" stroke="#fff" stroke-opacity=".4"/><text x="100" y="118" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="36" fill="#fff" fill-opacity=".8">M</text>`;
        else g += drop(100, 100, 1.1, M);
        break;
      case "brinco":
        if (d === "argola") g = shadow() + `<circle cx="68" cy="104" r="32" fill="none" stroke="${M}" stroke-width="6"/><circle cx="132" cy="104" r="32" fill="none" stroke="${M}" stroke-width="6"/>`;
        else if (d === "ponto") g = shadow(100, 150, 50) + [72, 128].map(x => stone(x, 100, 16, M) + [[-12, -12], [12, -12], [-12, 12], [12, 12]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${100 + dy}" r="2.6" fill="${M}"/>`).join("")).join("");
        else if (d === "cuff") g = shadow() + `<path d="M74 52 C140 40 150 140 82 152" fill="none" stroke="${M}" stroke-width="9" stroke-linecap="round"/>` + bez([74, 52], [140, 40], [150, 140], [82, 152], 7).slice(1, 6).map(([x, y]) => stone(x.toFixed(1), y.toFixed(1), 4.5, M)).join("");
        else g = shadow() + [70, 130].map(x => `<path d="M${x} 82 V60 q0 -12 10 -12 q10 0 10 10" fill="none" stroke="${M}" stroke-width="3" stroke-linecap="round"/>` + drop(x, 112, .95, M)).join("");
        break;
      case "pulseira":
        if (d === "elos") {
          g = shadow() + onEllipse(100, 104, 70, 38, 16).map(([x, y, a], i) => {
            const ang = Math.atan2(38 * Math.cos(a), -70 * Math.sin(a)) * 180 / Math.PI;
            const big = i % 2 === 0;
            return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${big ? 10 : 6}" ry="${big ? 5.5 : 4}" transform="rotate(${ang.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="${M}" stroke-width="3"/>`;
          }).join("");
        } else if (d === "berloques") {
          g = shadow() + `<ellipse cx="100" cy="94" rx="70" ry="36" fill="none" stroke="${M}" stroke-width="3" stroke-dasharray="4 2"/>` +
            heart(70, 140, .35, M) + `<circle cx="100" cy="142" r="8" fill="url(#m-pedra)" stroke="${M}" stroke-width="2"/>` + star(130, 138, 10, M) +
            [[70, 126], [100, 130], [130, 126]].map(([x, y]) => `<line x1="${x}" y1="${y - 6}" x2="${x}" y2="${y}" stroke="${M}" stroke-width="2"/>`).join("");
        } else {
          g = shadow() + `<ellipse cx="100" cy="104" rx="70" ry="38" fill="none" stroke="${M}" stroke-width="4"/>` +
            onEllipse(100, 104, 70, 38, 24).map(([x, y]) => stone(x.toFixed(1), y.toFixed(1), 4.6, M)).join("");
        }
        break;
      case "colar":
        if (d === "perolas") g = shadow() + bez([30, 36], [44, 140], [156, 140], [170, 36], 17).map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7.5" fill="url(#m-perola)"/>`).join("");
        else if (d === "gravatinha") g = shadow() + `<path d="M30 20 C40 120 160 120 170 20" fill="none" stroke="${M}" stroke-width="2.2"/><line x1="100" y1="96" x2="100" y2="146" stroke="${M}" stroke-width="2"/>` + stone(100, 96, 6, M) + drop(100, 152, .38, M);
        else g = shadow() + `<path d="M30 20 C40 120 160 120 170 20" fill="none" stroke="${M}" stroke-width="2.2"/>` + `<path d="M93 98 L100 92 L107 98" fill="none" stroke="${M}" stroke-width="2"/>` + stone(100, 108, 10, M);
        break;
      case "corrente": {
        const path = "M18 70 C70 18 96 170 182 118";
        const w = d === "baiano" ? 13 : d === "grumet" ? 10 : 7;
        const dash = d === "baiano" ? "5 2" : d === "grumet" ? "9 3" : "4 2";
        g = shadow() + `<path d="${path}" fill="none" stroke="${M}" stroke-width="${w}" stroke-opacity=".55"/>` +
          `<path d="${path}" fill="none" stroke="${M}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="${d === "grumet" ? "round" : "butt"}"/>` +
          `<path d="${path}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.2" stroke-dasharray="${dash}" transform="translate(0 -${w / 4})"/>`;
        break;
      }
      case "tornozeleira":
        g = shadow() + `<ellipse cx="100" cy="98" rx="74" ry="32" fill="none" stroke="${M}" stroke-width="2" stroke-dasharray="2.5 1.5"/>`;
        if (d === "estrelas") g += onEllipse(100, 98, 74, 32, 5, Math.PI * .15, Math.PI * .85).map(([x, y]) => `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y + 8).toFixed(1)}" stroke="${M}" stroke-width="1.5"/>` + star(x, y + 15, 8, M)).join("");
        else g += onEllipse(100, 98, 74, 32, 18).map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${M}"/>`).join("");
        break;
      case "piercing":
        if (d === "tragus") g = shadow(100, 168, 30) + `<line x1="100" y1="74" x2="100" y2="140" stroke="${M}" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="142" r="9" fill="${M}"/>` + stone(100, 70, 18, M);
        else if (d === "helix") g = shadow(100, 166, 40) + `<path d="M126 92 A30 30 0 1 1 112 74" fill="none" stroke="${M}" stroke-width="4.5" stroke-linecap="round"/><circle cx="121" cy="81" r="9" fill="${M}"/>`;
        else g = shadow(100, 166, 40) + `<path d="M130 96 A34 34 0 1 1 120 76" fill="none" stroke="${M}" stroke-width="4" stroke-linecap="round"/>`;
        break;
    }
    return `<svg viewBox="0 0 200 190" role="img" aria-label="Ilustração: ${esc(p.nome)}">${g}</svg>`;
  }

  const media = (p, cls = "") => p.foto
    ? `<img class="${cls}" src="${esc(p.foto)}" alt="${esc(p.nome)} em ${esc(matById[p.mat]?.nome || "")}" loading="lazy" decoding="async" width="600" height="600">`
    : desenho(p);

  /* ---------- estado ---------- */
  const state = {
    cat: "todos",
    mat: "todos",
    q: "",
    loja: store.get("mj-loja", "tucano"),
    bag: store.get("mj-lista", []).filter(i => prodById[i?.id]).slice(0, 40)
  };
  if (!LOJAS[state.loja]) state.loja = "tucano";

  /* ---------- WhatsApp ---------- */
  const pageUrl = id => `${location.origin}${location.pathname}#p/${id}`;
  const linhaItem = (p, aro) => `• ${p.nome} (cód. ${p.id}) | ${matById[p.mat]?.nome || ""}${aro ? ` | Aro: ${aro}` : ""}`;
  const waLink = texto => `https://wa.me/${LOJAS[state.loja].wa}?text=${encodeURIComponent(texto)}`;
  const waProduto = (p, aro) => waLink(
    `Olá, Mary Joias ${LOJAS[state.loja].nome}! Vi esta peça no catálogo e tenho interesse:\n${linhaItem(p, aro)}\n${pageUrl(p.id)}\n\nPode me informar valor e disponibilidade?`
  );
  const waLista = () => waLink(
    `Olá, Mary Joias ${LOJAS[state.loja].nome}! Montei esta lista no catálogo:\n${state.bag.map(i => linhaItem(prodById[i.id], i.aro)).join("\n")}\n\nPode me informar valores e disponibilidade?`
  );

  /* ---------- categorias e materiais ---------- */
  const catsEl = $("#cats");
  const thumbFor = c => {
    const p = PRODS.find(x => x.cat === c.id);
    return p ? desenho(p, "ouro") : "";
  };
  catsEl.innerHTML =
    `<button class="cat is-active" type="button" data-cat="todos" aria-pressed="true" role="listitem"><span class="cat__img cat__img--all" aria-hidden="true">MJ</span><span class="cat__nome">Todas</span></button>` +
    CATS.map(c => `<button class="cat" type="button" data-cat="${c.id}" aria-pressed="false" role="listitem"><span class="cat__img" aria-hidden="true">${thumbFor(c)}</span><span class="cat__nome">${esc(c.nome)}</span></button>`).join("");

  const matsEl = $("#mats");
  matsEl.innerHTML =
    `<button class="chip is-active" type="button" data-mat="todos" aria-pressed="true">Todos os materiais</button>` +
    MATS.map(m => `<button class="chip" type="button" data-mat="${m.id}" aria-pressed="false"><i class="dot dot--${m.metal}" aria-hidden="true"></i>${esc(m.nome)}</button>`).join("");

  /* ---------- vitrine ---------- */
  const grid = $("#grid");
  const filtrar = () => {
    const q = norm(state.q.trim());
    return PRODS.filter(p =>
      (state.cat === "todos" || p.cat === state.cat) &&
      (state.mat === "todos" || p.mat === state.mat) &&
      (!q || norm(`${p.nome} ${p.desc} ${matById[p.mat]?.nome} ${catById[p.cat]?.nome} ${p.id}`).includes(q))
    );
  };

  function render() {
    const lista = filtrar();
    grid.innerHTML = lista.map(p => `
      <article class="card">
        <button class="card__media" type="button" data-open="${p.id}" aria-label="Ver detalhes: ${esc(p.nome)}">
          ${media(p)}
          ${p.novo ? `<span class="tag">Novidade</span>` : ""}
        </button>
        <div class="card__body">
          <p class="card__mat"><i class="dot dot--${matById[p.mat]?.metal}" aria-hidden="true"></i>${esc(matById[p.mat]?.nome || "")}</p>
          <h3 class="card__nome"><button type="button" data-open="${p.id}">${esc(p.nome)}</button></h3>
          <p class="card__desc">${esc(p.desc)}</p>
          <p class="card__preco">${precoTxt(p)}</p>
        </div>
        <div class="card__actions">
          <a class="btn btn--gold btn--sm" href="${waProduto(p)}" target="_blank" rel="noopener" data-wa="${p.id}" aria-label="Pedir ${esc(p.nome)} no WhatsApp"><svg class="btn__wa" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 20.5 11.7Z"/></svg><span>Pedir<span class="hide-sm"> no WhatsApp</span></span></a>
          <button class="icon-btn icon-btn--line" type="button" data-add="${p.id}" aria-label="Adicionar ${esc(p.nome)} à lista">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>
          </button>
        </div>
      </article>`).join("");

    const n = lista.length;
    const catNome = state.cat === "todos" ? "todas as categorias" : catById[state.cat].nome.toLowerCase();
    $("#resultado").textContent = `${n} ${n === 1 ? "peça" : "peças"} em ${catNome}${state.mat !== "todos" ? `, ${matById[state.mat].nome}` : ""}`;
    $("#vazio").hidden = n > 0;
  }

  /* ---------- eventos de filtro ---------- */
  catsEl.addEventListener("click", e => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    state.cat = b.dataset.cat;
    $$(".cat", catsEl).forEach(x => { const on = x === b; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", on); });
    b.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    track("filtro_categoria", { categoria: state.cat });
    render();
  });
  matsEl.addEventListener("click", e => {
    const b = e.target.closest("[data-mat]"); if (!b) return;
    state.mat = b.dataset.mat;
    $$(".chip", matsEl).forEach(x => { const on = x === b; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", on); });
    track("filtro_material", { material: state.mat });
    render();
  });
  let tBusca;
  $("#busca").addEventListener("input", e => {
    clearTimeout(tBusca);
    tBusca = setTimeout(() => { state.q = e.target.value.slice(0, 40); render(); }, 120);
  });
  $("#limpar").addEventListener("click", () => {
    state.cat = "todos"; state.mat = "todos"; state.q = ""; $("#busca").value = "";
    $('[data-cat="todos"]', catsEl).click();
    $('[data-mat="todos"]', matsEl).click();
  });

  /* ---------- loja selecionada ---------- */
  function setLoja(l) {
    if (!LOJAS[l]) return;
    state.loja = l; store.set("mj-loja", l);
    $$('input[name="loja"]').forEach(r => { r.checked = r.value === l; });
    $$("[data-loja-nome]").forEach(el => { el.textContent = LOJAS[l].nome; });
    render(); renderBag();
    if (modal.open && aberto) preencherModal(aberto);
  }
  $$('input[name="loja"]').forEach(r => r.addEventListener("change", () => setLoja(r.value)));

  /* ---------- toast ---------- */
  const toastEl = $("#toast"); let tToast;
  const toast = msg => {
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(tToast); tToast = setTimeout(() => toastEl.classList.remove("is-on"), 2400);
  };

  /* ---------- lista (sacola) ---------- */
  const bagDlg = $("#bag");
  function addBag(id, aro = "") {
    if (!prodById[id]) return;
    if (state.bag.length >= 40) { toast("Sua lista chegou ao limite de 40 peças."); return; }
    state.bag.push({ id, aro });
    store.set("mj-lista", state.bag);
    renderBag();
    track("adicionar_lista", { produto: id });
    toast(`${prodById[id].nome} foi para a sua lista.`);
  }
  function renderBag() {
    const n = state.bag.length;
    $$("[data-bag-count]").forEach(el => { el.textContent = n; });
    $("#fab").hidden = n === 0;
    $("#bag-empty").hidden = n > 0;
    $("#bag-wa").classList.toggle("is-disabled", n === 0);
    $("#bag-wa").setAttribute("aria-disabled", n === 0);
    $("#bag-wa").href = n ? waLista() : "#";
    $("#bag-list").innerHTML = state.bag.map((i, idx) => {
      const p = prodById[i.id];
      return `<li class="bag-item">
        <span class="bag-item__img" aria-hidden="true">${media(p)}</span>
        <span class="bag-item__txt"><strong>${esc(p.nome)}</strong><small>${esc(matById[p.mat]?.nome || "")} · ${p.id}${i.aro ? ` · Aro ${esc(i.aro)}` : ""}</small></span>
        <button class="icon-btn" type="button" data-rm="${idx}" aria-label="Remover ${esc(p.nome)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </li>`;
    }).join("");
  }
  $("#bag-list").addEventListener("click", e => {
    const b = e.target.closest("[data-rm]"); if (!b) return;
    state.bag.splice(Number(b.dataset.rm), 1);
    store.set("mj-lista", state.bag); renderBag();
  });
  $("#bag-clear").addEventListener("click", () => { state.bag = []; store.set("mj-lista", []); renderBag(); });
  $("#bag-wa").addEventListener("click", e => {
    if (!state.bag.length) { e.preventDefault(); return; }
    track("whatsapp_lista", { loja: state.loja, itens: state.bag.length });
  });
  $$("[data-open-bag]").forEach(b => b.addEventListener("click", () => { renderBag(); bagDlg.showModal(); }));

  /* ---------- modal da peça ---------- */
  const modal = $("#modal");
  let aberto = null;
  function preencherModal(p) {
    const cat = catById[p.cat];
    $("#m-media").innerHTML = media(p);
    $("#m-kicker").textContent = `${cat.nome} ·${matById[p.mat]?.nome || ""}`;
    $("#m-nome").textContent = p.nome;
    $("#m-cod").textContent = `Código ${p.id}`;
    $("#m-desc").textContent = p.desc;
    $("#m-preco").textContent = precoTxt(p);
    $("#m-loja").textContent = LOJAS[state.loja].nome;
    const aroWrap = $("#m-aro-wrap");
    aroWrap.hidden = !cat.aro;
    $("#m-aro-label").textContent = p.cat === "alianca" ? "Tamanho do aro (se for par, informe o segundo no WhatsApp)" : "Tamanho do aro";
    $("#m-wa").href = waProduto(p, cat.aro ? $("#m-aro").value : "");
  }
  $("#m-aro").innerHTML = `<option value="">Não sei meu aro</option>` + Array.from({ length: 21 }, (_, i) => `<option>${10 + i}</option>`).join("");
  $("#m-aro").addEventListener("change", () => { if (aberto) $("#m-wa").href = waProduto(aberto, $("#m-aro").value); });

  function abrir(id, push = true) {
    const p = prodById[id]; if (!p) return;
    aberto = p;
    $("#m-aro").value = "";
    preencherModal(p);
    if (!modal.open) modal.showModal();
    if (push) history.replaceState(null, "", `#p/${id}`);
    track("ver_peca", { produto: id });
  }
  function fecharModal() {
    if (modal.open) modal.close();
  }
  modal.addEventListener("close", () => {
    aberto = null;
    if (location.hash.startsWith("#p/")) history.replaceState(null, "", location.pathname + location.search);
  });
  $("#m-add").addEventListener("click", () => {
    if (!aberto) return;
    addBag(aberto.id, catById[aberto.cat].aro ? $("#m-aro").value : "");
    const b = $("#m-add"); b.textContent = "Adicionada à sua lista";
    clearTimeout(b._t); b._t = setTimeout(() => { b.textContent = "Adicionar à lista"; }, 1800);
  });
  $("#m-wa").addEventListener("click", () => { if (aberto) track("whatsapp_peca", { produto: aberto.id, loja: state.loja }); });
  $("#m-trocar").addEventListener("click", () => setLoja(state.loja === "tucano" ? "pombal" : "tucano"));
  $("#m-share").addEventListener("click", async () => {
    if (!aberto) return;
    const url = pageUrl(aberto.id);
    try {
      if (navigator.share) await navigator.share({ title: `${aberto.nome} | Mary Joias`, url });
      else { await navigator.clipboard.writeText(url); toast("Link da peça copiado."); }
    } catch { /* cancelado */ }
  });

  // fechar diálogos: botão X e clique fora da caixa
  $$("dialog").forEach(dlg => {
    dlg.addEventListener("click", e => {
      if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
    });
  });

  /* ---------- cliques na vitrine ---------- */
  grid.addEventListener("click", e => {
    const open = e.target.closest("[data-open]");
    if (open) { abrir(open.dataset.open); return; }
    const add = e.target.closest("[data-add]");
    if (add) { addBag(add.dataset.add); return; }
    const wa = e.target.closest("[data-wa]");
    if (wa) track("whatsapp_peca", { produto: wa.dataset.wa, loja: state.loja });
  });

  /* ---------- rastreio dos links fixos ---------- */
  $$("[data-track]").forEach(a => a.addEventListener("click", () => track(a.dataset.track)));

  /* ---------- barra superior ---------- */
  const topbar = $("#topbar");
  const sentinel = $(".links");
  if ("IntersectionObserver" in window && sentinel) {
    new IntersectionObserver(([en]) => topbar.classList.toggle("is-on", !en.isIntersecting && en.boundingClientRect.top < 0)).observe(sentinel);
  }

  /* ---------- deep link #p/CODIGO ---------- */
  const abrirDoHash = () => {
    const m = location.hash.match(/^#p\/([A-Za-z0-9-]{1,20})$/);
    if (m && prodById[m[1]]) abrir(m[1], false);
  };
  window.addEventListener("hashchange", abrirDoHash);

  /* ---------- início ---------- */
  $("#ano").textContent = new Date().getFullYear();
  setLoja(state.loja);
  abrirDoHash();
})();
