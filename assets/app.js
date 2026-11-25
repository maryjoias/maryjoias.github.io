/* MARY JOIAS · catálogo  (sem dependências) */
(() => {
  "use strict";

  const CATS = window.MJ_CATEGORIAS;
  const MATS = window.MJ_MATERIAIS;
  const PRODS = window.MJ_PRODUTOS;
  const LOJAS = window.MJ_LOJAS;
  const FAIXAS = window.MJ_FAIXAS || [];
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
  const lojaSalva = store.get("mj-loja", null);
  const state = {
    cat: "todos",
    mats: new Set(),
    faixa: "",
    q: "",
    loja: LOJAS[lojaSalva] ? lojaSalva : null,
    view: store.get("mj-view", "lista") === "grade" ? "grade" : "lista",
    bag: store.get("mj-sacola", []).filter(i => prodById[i?.id]).slice(0, 40)
  };
  const temPreco = PRODS.some(p => typeof p.preco === "number" && p.preco > 0);

  /* ---------- diálogos + botão "voltar" do celular ----------
     Cada diálogo aberto cria um passo no histórico. O "voltar" fecha o
     diálogo do topo em vez de sair do site. */
  const pilha = [];
  let fechandoPeloVoltar = false;
  let ignorarPop = 0; // pops causados pelo próprio site ao fechar um diálogo
  function abrirDlg(dlg, hash) {
    if (dlg.open) return;
    dlg.showModal();
    pilha.push(dlg);
    history.pushState({ mjDlg: dlg.id }, "", hash || location.pathname + location.search);
  }
  window.addEventListener("popstate", () => {
    if (ignorarPop > 0) { ignorarPop--; return; }
    const topo = pilha[pilha.length - 1];
    if (topo && topo.open) { fechandoPeloVoltar = true; topo.close(); fechandoPeloVoltar = false; }
  });
  $$("dialog").forEach(dlg => {
    dlg.addEventListener("close", () => {
      const i = pilha.lastIndexOf(dlg);
      if (i > -1) pilha.splice(i, 1);
      if (!fechandoPeloVoltar && history.state && history.state.mjDlg === dlg.id) { ignorarPop++; history.back(); }
    });
    dlg.addEventListener("click", e => {
      if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
    });
  });

  /* ---------- WhatsApp ---------- */
  const pageUrl = id => `${location.origin}${location.pathname}#p/${id}`;
  const limpaTxt = s => String(s || "").replace(/[\u0000-\u001f\u007f<>]/g, "").trim().slice(0, 40);
  function linhaItem(i) {
    const p = prodById[i.id];
    let t = `• ${p.nome} (cód. ${p.id}) | ${matById[p.mat]?.nome || ""}`;
    if (p.cat === "alianca") t += i.par === "unidade" ? " | 1 unidade" : " | Par";
    if (i.aro) t += ` | Aro${i.par !== "unidade" && p.cat === "alianca" ? " 1" : ""}: ${i.aro}`;
    if (i.aro2) t += ` | Aro 2: ${i.aro2}`;
    if (catById[p.cat].aro && !i.aro) t += " | Aro: não sei (preciso de ajuda)";
    if (i.grav) t += ` | Gravação: "${i.grav}"`;
    return t;
  }
  const waLink = (texto, loja = state.loja) => `https://wa.me/${LOJAS[loja].wa}?text=${encodeURIComponent(texto)}`;
  const textoPeca = (i, loja) =>
    `Olá, Mary Joias ${LOJAS[loja].nome}! Vi esta peça no catálogo e tenho interesse:\n${linhaItem(i)}\n${pageUrl(i.id)}\n\nPode me informar valor e disponibilidade?`;
  const textoSacola = loja =>
    `Olá, Mary Joias ${LOJAS[loja].nome}! Montei esta sacola no catálogo:\n${state.bag.map(linhaItem).join("\n")}\n\nPode me informar valores e disponibilidade?`;

  // Abre o WhatsApp; se a loja ainda não foi escolhida, pergunta antes.
  let pendente = null;
  function irWhats(gerarTexto, evento, dados) {
    const enviar = loja => {
      const url = waLink(gerarTexto(loja), loja);
      track(evento, { ...dados, loja });
      const w = window.open(url, "_blank", "noopener");
      if (!w) location.href = url;
    };
    if (state.loja) { enviar(state.loja); return; }
    pendente = enviar;
    abrirDlg($("#loja-dlg"));
  }

  /* ---------- loja ---------- */
  function setLoja(l) {
    if (!LOJAS[l]) return;
    state.loja = l; store.set("mj-loja", l);
    $$('input[name="loja"]').forEach(r => { r.checked = r.value === l; });
    atualizaLojaUI();
  }
  function atualizaLojaUI() {
    $$("[data-loja-nome]").forEach(el => { el.textContent = state.loja ? LOJAS[state.loja].nome : (el.dataset.vazio || "escolher"); });
    $$('input[name="loja"]').forEach(r => { r.checked = r.value === state.loja; });
    atualizaLinksWhats();
  }
  // Links reais (para abrir em nova aba / copiar), sempre coerentes com a loja escolhida
  function atualizaLinksWhats() {
    const loja = state.loja || "tucano";
    $$("[data-wa]", grid).forEach(a => { a.href = waLink(textoPeca({ id: a.dataset.wa }, loja), loja); });
    if (aberto) $("#m-wa").href = waLink(textoPeca(itemDoModal(), loja), loja);
    $("#bag-wa").href = state.bag.length ? waLink(textoSacola(loja), loja) : "#";
  }
  $$('input[name="loja"]').forEach(r => r.addEventListener("change", () => setLoja(r.value)));
  document.addEventListener("click", e => {
    if (e.target.closest("[data-open-store]")) { pendente = null; abrirDlg($("#loja-dlg")); }
    const esc = e.target.closest("[data-escolher-loja]");
    if (esc) {
      setLoja(esc.dataset.escolherLoja);
      const acao = pendente; pendente = null;
      $("#loja-dlg").close();
      toast(`Atendimento pela loja de ${LOJAS[state.loja].nome}.`);
      if (acao) acao(state.loja);
    }
  });
  $("#loja-dlg").addEventListener("close", () => { pendente = null; });

  /* ---------- toast ---------- */
  const toastEl = $("#toast"); let tToast;
  function toast(msg) {
    // dentro de um diálogo aberto, o toast precisa estar na camada de cima
    const topo = pilha[pilha.length - 1];
    (topo && topo.open ? topo : document.body).appendChild(toastEl);
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(tToast); tToast = setTimeout(() => toastEl.classList.remove("is-on"), 2400);
  }

  /* ---------- categorias ---------- */
  const catsEl = $("#cats");
  const thumbFor = c => { const p = PRODS.find(x => x.cat === c.id); return p ? desenho(p, "ouro") : ""; };
  catsEl.innerHTML =
    `<button class="cat is-active" type="button" data-cat="todos" aria-pressed="true"><span class="cat__img cat__img--all" aria-hidden="true">MJ</span><span class="cat__nome">Todas</span></button>` +
    CATS.map(c => `<button class="cat" type="button" data-cat="${c.id}" aria-pressed="false"><span class="cat__img" aria-hidden="true">${thumbFor(c)}</span><span class="cat__nome">${esc(c.nome)}</span></button>`).join("");

  /* ---------- filtros (gaveta) ---------- */
  const optMat = m => `<label class="opt"><input type="checkbox" value="${m.id}" data-mat><span><i class="dot dot--${m.metal}" aria-hidden="true"></i>${esc(m.nome)} <em data-count-mat="${m.id}"></em></span></label>`;
  $$("[data-mat-grupo]").forEach(box => { box.innerHTML = MATS.filter(m => m.grupo === box.dataset.matGrupo).map(optMat).join(""); });
  if (temPreco) {
    $("#faixa-wrap").hidden = false;
    $("#faixas").innerHTML = `<label class="opt"><input type="radio" name="faixa" value="" checked><span>Todas</span></label>` +
      FAIXAS.map(f => `<label class="opt"><input type="radio" name="faixa" value="${f.id}"><span>${esc(f.nome)}</span></label>`).join("");
  }
  $("#filtros").addEventListener("change", e => {
    const t = e.target;
    if (t.matches("[data-mat]")) { t.checked ? state.mats.add(t.value) : state.mats.delete(t.value); render(); }
    if (t.name === "faixa") { state.faixa = t.value; render(); }
  });
  $("#abrir-filtros").addEventListener("click", () => { contarMateriais(); abrirDlg($("#filtros")); });
  $("#filtros-limpar").addEventListener("click", () => { state.mats.clear(); state.faixa = ""; sincronizaFiltros(); render(); });
  function sincronizaFiltros() {
    $$("[data-mat]").forEach(i => { i.checked = state.mats.has(i.value); });
    $$('input[name="faixa"]').forEach(i => { i.checked = i.value === state.faixa; });
  }

  /* ---------- filtragem ---------- */
  const faixaOk = p => {
    if (!state.faixa) return true;
    const f = FAIXAS.find(x => x.id === state.faixa);
    return typeof p.preco === "number" && p.preco >= f.min && p.preco <= f.max;
  };
  const buscaOk = p => {
    const q = norm(state.q.trim());
    return !q || norm(`${p.nome} ${p.desc} ${matById[p.mat]?.nome} ${catById[p.cat]?.nome} ${p.id}`).includes(q);
  };
  const filtrar = () => PRODS.filter(p =>
    (state.cat === "todos" || p.cat === state.cat) &&
    (!state.mats.size || state.mats.has(p.mat)) && faixaOk(p) && buscaOk(p));

  function contarMateriais() {
    const base = PRODS.filter(p => (state.cat === "todos" || p.cat === state.cat) && faixaOk(p) && buscaOk(p));
    MATS.forEach(m => {
      const n = base.filter(p => p.mat === m.id).length;
      const el = $(`[data-count-mat="${m.id}"]`);
      if (el) el.textContent = `(${n})`;
      const inp = $(`[data-mat][value="${m.id}"]`);
      if (inp) { inp.disabled = n === 0 && !state.mats.has(m.id); inp.closest(".opt").classList.toggle("is-off", inp.disabled); }
    });
  }

  /* ---------- vitrine ---------- */
  const grid = $("#grid");
  const WA_ICON = `<svg class="btn__wa" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 20.5 11.7Z"/></svg>`;
  const BAG_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`;

  function render() {
    const lista = filtrar();
    grid.classList.toggle("grid--grade", state.view === "grade");
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
          <a class="btn btn--dark btn--sm" href="#" target="_blank" rel="noopener" data-wa="${p.id}" aria-label="Pedir ${esc(p.nome)} no WhatsApp">${WA_ICON}<span>Pedir<span class="hide-sm"> no WhatsApp</span></span></a>
          <button class="icon-btn icon-btn--line" type="button" data-add="${p.id}" aria-label="Colocar ${esc(p.nome)} na sacola" title="Colocar na sacola">${BAG_ICON}</button>
        </div>
      </article>`).join("");

    const n = lista.length;
    const catNome = state.cat === "todos" ? "todas as categorias" : catById[state.cat].nome.toLowerCase();
    $("#resultado").textContent = `${n} ${n === 1 ? "peça" : "peças"} em ${catNome}`;
    $("#vazio").hidden = n > 0;

    // filtros ativos
    const ativos = [...state.mats].map(id => ({ k: "mat", id, nome: matById[id].nome }));
    if (state.faixa) ativos.push({ k: "faixa", id: state.faixa, nome: FAIXAS.find(f => f.id === state.faixa).nome });
    $("#ativos").innerHTML = ativos.map(a => `<button type="button" class="chip chip--on" data-rm-filtro="${a.k}:${a.id}" aria-label="Remover filtro ${esc(a.nome)}">${esc(a.nome)} <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg></button>`).join("");
    const fc = $("#filtro-count"); fc.hidden = !ativos.length; fc.textContent = ativos.length;
    contarMateriais();
    atualizaLinksWhats();
  }

  $("#ativos").addEventListener("click", e => {
    const b = e.target.closest("[data-rm-filtro]"); if (!b) return;
    const [k, id] = b.dataset.rmFiltro.split(":");
    if (k === "mat") state.mats.delete(id); else state.faixa = "";
    sincronizaFiltros(); render();
  });

  catsEl.addEventListener("click", e => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    state.cat = b.dataset.cat;
    $$(".cat", catsEl).forEach(x => { const on = x === b; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", on); });
    b.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    track("filtro_categoria", { categoria: state.cat });
    render();
  });
  let tBusca;
  $("#busca").addEventListener("input", e => {
    clearTimeout(tBusca);
    tBusca = setTimeout(() => { state.q = e.target.value.slice(0, 40); render(); }, 120);
  });
  $("#limpar").addEventListener("click", () => {
    state.mats.clear(); state.faixa = ""; state.q = ""; $("#busca").value = "";
    sincronizaFiltros();
    $('[data-cat="todos"]', catsEl).click();
  });

  // grade / lista (desktop)
  $$("[data-view]").forEach(b => b.addEventListener("click", () => {
    state.view = b.dataset.view; store.set("mj-view", state.view);
    $$("[data-view]").forEach(x => x.setAttribute("aria-pressed", x === b));
    render();
  }));
  $$("[data-view]").forEach(x => x.setAttribute("aria-pressed", x.dataset.view === state.view));

  /* ---------- novidades ---------- */
  const novos = PRODS.filter(p => p.novo);
  if (!novos.length) $(".novidades").hidden = true;
  $("#novidades").innerHTML = novos.map(p => `
    <button class="mini" type="button" data-open="${p.id}">
      <span class="mini__img">${media(p)}</span>
      <span class="mini__mat">${esc(matById[p.mat]?.nome || "")}</span>
      <span class="mini__nome">${esc(p.nome)}</span>
    </button>`).join("");
  $("#novidades").addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) abrir(b.dataset.open); });

  /* ---------- sacola ---------- */
  const bagDlg = $("#bag");
  function addBag(item) {
    if (!prodById[item.id]) return;
    if (state.bag.length >= 40) { toast("Sua sacola chegou ao limite de 40 peças."); return; }
    state.bag.push(item);
    store.set("mj-sacola", state.bag);
    renderBag();
    track("adicionar_sacola", { produto: item.id });
    toast(`${prodById[item.id].nome} foi para a sacola.`);
  }
  function renderBag() {
    const n = state.bag.length;
    $$("[data-bag-count]").forEach(el => { el.textContent = n; });
    $("#fab").hidden = n === 0;
    document.body.classList.toggle("tem-sacola", n > 0);
    $("#bag-empty").hidden = n > 0;
    $("#bag-wa").classList.toggle("is-disabled", n === 0);
    $("#bag-wa").setAttribute("aria-disabled", n === 0);
    $("#bag-list").innerHTML = state.bag.map((i, idx) => {
      const p = prodById[i.id];
      const det = [matById[p.mat]?.nome, p.id, p.cat === "alianca" ? (i.par === "unidade" ? "1 unidade" : "Par") : "",
        i.aro ? `Aro ${esc(i.aro)}${i.aro2 ? ` e ${esc(i.aro2)}` : ""}` : "", i.grav ? `Gravação: ${esc(i.grav)}` : ""].filter(Boolean).join(" · ");
      return `<li class="bag-item">
        <span class="bag-item__img" aria-hidden="true">${media(p)}</span>
        <span class="bag-item__txt"><strong>${esc(p.nome)}</strong><small>${det}</small></span>
        <button class="icon-btn" type="button" data-rm="${idx}" aria-label="Remover ${esc(p.nome)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </li>`;
    }).join("");
    atualizaLinksWhats();
  }
  $("#bag-list").addEventListener("click", e => {
    const b = e.target.closest("[data-rm]"); if (!b) return;
    state.bag.splice(Number(b.dataset.rm), 1);
    store.set("mj-sacola", state.bag); renderBag();
  });
  $("#bag-clear").addEventListener("click", () => { state.bag = []; store.set("mj-sacola", []); renderBag(); });
  $("#bag-wa").addEventListener("click", e => {
    e.preventDefault();
    if (!state.bag.length) return;
    irWhats(textoSacola, "whatsapp_sacola", { itens: state.bag.length });
  });
  $$("[data-open-bag]").forEach(b => b.addEventListener("click", () => { renderBag(); abrirDlg(bagDlg); }));

  /* ---------- peça (modal) ---------- */
  const modal = $("#modal");
  let aberto = null;
  const opAros = `<option value="">Não sei meu aro</option>` + Array.from({ length: 26 }, (_, i) => `<option>${8 + i}</option>`).join("");
  $("#m-aro").innerHTML = opAros; $("#m-aro2").innerHTML = opAros;

  function itemDoModal() {
    const p = aberto, cat = catById[p.cat];
    const ehAlianca = p.cat === "alianca";
    const par = ehAlianca ? ($('input[name="m-par"]:checked')?.value || "par") : "";
    return {
      id: p.id,
      par,
      aro: cat.aro ? $("#m-aro").value : "",
      aro2: ehAlianca && par === "par" ? $("#m-aro2").value : "",
      grav: ehAlianca ? limpaTxt($("#m-grav").value) : ""
    };
  }
  function ajustaOpcoes() {
    const p = aberto; if (!p) return;
    const cat = catById[p.cat], ehAlianca = p.cat === "alianca";
    const par = ehAlianca && ($('input[name="m-par"]:checked')?.value || "par") === "par";
    $("#m-par-wrap").hidden = !ehAlianca;
    $("#m-aro-wrap").hidden = !cat.aro;
    $("#m-aro2-wrap").hidden = !par;
    $("#m-aro-wrap").classList.toggle("is-par", par);
    $("#m-aro-label").textContent = par ? "Aro da 1ª aliança" : "Tamanho do aro";
    $("#m-grav-wrap").hidden = !ehAlianca;
    atualizaLinksWhats();
  }
  function abrir(id) {
    const p = prodById[id]; if (!p) return;
    aberto = p;
    $("#m-aro").value = ""; $("#m-aro2").value = ""; $("#m-grav").value = "";
    const r = $('input[name="m-par"][value="par"]'); if (r) r.checked = true;
    $("#m-media").innerHTML = media(p);
    $("#m-kicker").textContent = `${catById[p.cat].nome} · ${matById[p.mat]?.nome || ""}`;
    $("#m-nome").textContent = p.nome;
    $("#m-cod").textContent = `Código ${p.id}${p.foto ? "" : " · imagem ilustrativa"}`;
    $("#m-desc").textContent = p.desc;
    $("#m-preco").textContent = precoTxt(p);
    $("#m-add").textContent = "Colocar na sacola";
    ajustaOpcoes();
    abrirDlg(modal, `#p/${id}`);
    track("ver_peca", { produto: id });
  }
  modal.addEventListener("close", () => { aberto = null; });
  $("#m-opcoes").addEventListener("change", ajustaOpcoes);
  $("#m-grav").addEventListener("input", atualizaLinksWhats);
  $("#m-add").addEventListener("click", () => {
    if (!aberto) return;
    addBag(itemDoModal());
    const b = $("#m-add"); b.textContent = "Está na sacola";
    clearTimeout(b._t); b._t = setTimeout(() => { b.textContent = "Colocar na sacola"; }, 1800);
  });
  $("#m-wa").addEventListener("click", e => {
    e.preventDefault();
    if (!aberto) return;
    const item = itemDoModal();
    irWhats(loja => textoPeca(item, loja), "whatsapp_peca", { produto: item.id });
  });
  $("#m-share").addEventListener("click", async () => {
    if (!aberto) return;
    const url = pageUrl(aberto.id);
    try {
      if (navigator.share) await navigator.share({ title: `${aberto.nome} | Mary Joias`, url });
      else { await navigator.clipboard.writeText(url); toast("Link da peça copiado."); }
    } catch { /* cancelado */ }
  });

  /* ---------- cliques na vitrine ---------- */
  grid.addEventListener("click", e => {
    const open = e.target.closest("[data-open]");
    if (open) { abrir(open.dataset.open); return; }
    const add = e.target.closest("[data-add]");
    if (add) { const p = prodById[add.dataset.add]; addBag({ id: p.id, par: p.cat === "alianca" ? "par" : "", aro: "", aro2: "", grav: "" }); return; }
    const wa = e.target.closest("[data-wa]");
    if (wa) {
      e.preventDefault();
      const p = prodById[wa.dataset.wa];
      const item = { id: p.id, par: p.cat === "alianca" ? "par" : "", aro: "", aro2: "", grav: "" };
      irWhats(loja => textoPeca(item, loja), "whatsapp_peca", { produto: p.id });
    }
  });

  /* ---------- guia de aro ---------- */
  const guia = $("#guia");
  let guiaDoModal = false;
  $("#tabela-aros").innerHTML = Array.from({ length: 23 }, (_, i) => {
    const aro = 8 + i, circ = aro + 40;
    return `<tr><td>${aro}</td><td>${circ} mm</td><td>${(circ / Math.PI).toFixed(1).replace(".", ",")} mm</td></tr>`;
  }).join("");
  function calcular() {
    const v = parseFloat(String($("#calc-mm").value).replace(",", "."));
    const tipo = $('input[name="calc-tipo"]:checked').value;
    const out = $("#calc-out"), usar = $("#calc-usar");
    if (!isFinite(v) || v <= 0) { out.textContent = "Digite a medida para ver seu aro."; usar.hidden = true; return; }
    const circ = tipo === "diam" ? v * Math.PI : v;
    const aro = Math.round(circ - 40);
    if (aro < 8 || aro > 33) { out.textContent = "Essa medida está fora da tabela. Confira se mediu em milímetros."; usar.hidden = true; return; }
    out.innerHTML = `Seu aro é aproximadamente <strong>${aro}</strong>.`;
    usar.hidden = !guiaDoModal; usar.dataset.aro = aro;
  }
  $("#calc-mm").addEventListener("input", calcular);
  $$('input[name="calc-tipo"]').forEach(r => r.addEventListener("change", calcular));
  $("#calc-usar").addEventListener("click", () => {
    $("#m-aro").value = $("#calc-usar").dataset.aro;
    guia.close(); ajustaOpcoes();
    toast(`Aro ${$("#m-aro").value} selecionado.`);
  });
  document.addEventListener("click", e => {
    if (!e.target.closest("[data-open-guia]")) return;
    guiaDoModal = modal.open;
    calcular();
    abrirDlg(guia);
    track("guia_aro");
  });

  /* ---------- rastreio dos links fixos ---------- */
  $$("[data-track]").forEach(a => a.addEventListener("click", () => track(a.dataset.track)));

  /* ---------- barra superior ---------- */
  const topbar = $("#topbar");
  const sentinel = $(".links");
  if ("IntersectionObserver" in window && sentinel) {
    new IntersectionObserver(([en]) => topbar.classList.toggle("is-on", !en.isIntersecting && en.boundingClientRect.top < 0)).observe(sentinel);
  }

  /* ---------- link direto para uma peça: #p/CODIGO ---------- */
  const m = location.hash.match(/^#p\/([A-Za-z0-9-]{1,20})$/);
  if (m && prodById[m[1]]) {
    history.replaceState(null, "", location.pathname + location.search);
    abrir(m[1]);
  }

  window.addEventListener("hashchange", () => {
    const h = location.hash.match(/^#p\/([A-Za-z0-9-]{1,20})$/);
    if (h && prodById[h[1]] && !modal.open) { history.replaceState(null, "", location.pathname + location.search); abrir(h[1]); }
  });

  /* ---------- início ---------- */
  $("#ano").textContent = new Date().getFullYear();
  render();
  renderBag();
  atualizaLojaUI();
})();
