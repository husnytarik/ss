window.App = window.App || {};
(function () {
  const view = document.getElementById("view");
  const state = window.App.state;

  function escapeHtml(s = "") {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  const PRODUCTS = [
    {
      id: "p1",
      sku: "",
      currency: "TRY",
      name: "Kenya AA",
      category: "Kahve",
      type: "Filtre",
      baseUnitValue: 250,
      baseUnit: "g",
      price: 420,
      stock: 24,
      description: "",
      image: "",
      theme: "#C3E8D5",
      badges: ["Yeni", "Çok Satan"],
      variants: [
        {
          id: "p1v1",
          label: "250 g",
          unitValue: 250,
          unit: "g",
          price: 120,
          enabled: true,
        },
        {
          id: "p1v2",
          label: "500 g",
          unitValue: 500,
          unit: "g",
          price: 220,
          enabled: true,
        },
        {
          id: "p1v3",
          label: "1000 g",
          unitValue: 1000,
          unit: "g",
          price: 420,
          enabled: true,
        },
      ],
      fields: [
        {
          label: "Tadım Notu",
          type: "note",
          value: "Narenciye, siyah frenk üzümü",
          visibility: "public",
        },
        {
          label: "Hasat Yılı",
          type: "text",
          value: "2025",
          visibility: "public",
        },
        {
          label: "Tedarik MOQ",
          type: "number",
          value: 10,
          visibility: "tier:pro",
        },
        { label: "Diskonto", type: "price", value: 30, visibility: "tier:vip" },
      ],
    },
    {
      id: "p2",
      sku: "DRNK-330",
      currency: "TRY",
      name: "Soğuk Çay Şişe",
      category: "İçecek",
      type: "Şişe",
      baseUnitValue: 330,
      baseUnit: "ml",
      price: 35,
      stock: 120,
      description: "",
      image: "",
      theme: "#E8D5C3",
      badges: ["İndirim"],
      variants: [
        {
          id: "p2v1",
          label: "330 ml",
          unitValue: 330,
          unit: "ml",
          price: 35,
          enabled: true,
        },
        {
          id: "p2v2",
          label: "500 ml",
          unitValue: 500,
          unit: "ml",
          price: 48,
          enabled: true,
        },
      ],
      fields: [
        {
          label: "Şeker",
          type: "text",
          value: "Az şekerli",
          visibility: "public",
        },
        {
          label: "Koli Bilgisi",
          type: "unit",
          value: "24 adet/koli",
          visibility: "tier:pro",
        },
      ],
    },
  ];
  let products = (window.App.products = [...PRODUCTS]);

  function canSee(visibility) {
    if (!visibility || visibility === "public") return true;
    return visibility === state.custTag;
  }
  function norm(s) {
    return String(s ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ı/g, "i")
      .replace(/İ/g, "i");
  }
  function formatPrice(x, ccy) {
    try {
      return Number(x || 0).toLocaleString("tr-TR", {
        style: "currency",
        currency: ccy || "TRY",
      });
    } catch {
      return (x ?? 0) + " " + (ccy || "");
    }
  }
  function unitText(obj) {
    const val = obj.unitValue ?? obj.baseUnitValue;
    const u = obj.unit ?? obj.baseUnit;
    return `${val} ${u}`;
  }

  function renderProductCardHTML(p, { mode = "catalog" } = {}) {
    // Fiyat, görsel, rozet ve seçenekler için güvenli değerler
    const priceText =
      p.price != null ? formatPrice(p.price, p.currency || "TRY") : "-";
    const desc = (p.description || "").trim();
    const img =
      p.image && p.image.length ? p.image : window.App?.storeLogo || "";
    const badges = (p.badges || [])
      .map((b) => `<span class="badge">${b}</span>`)
      .join("");
    const variants = (p.variants || [])
      .map(
        (v) => `
    <button type="button" class="v-pill" data-vid="${v.id}" title="${v.label}">
      ${v.label}
    </button>`
      )
      .join("");

    // Birim gösterimi (artık ürün tarafında “birim değeri” yok; seçeneğe/miktara kaydı)
    // Burada ürünün genel birimi (ör. kg, ml, adet) görünsün:
    const unitText = p.baseUnit ? p.baseUnit : p.unit || "";

    return `
  <div class="product-card p-card" data-id="${p.id}">
    <div class="thumb">
      ${img ? `<img src="${img}" alt="">` : ``}
    </div>
    <div class="info">
      <div>
        <div class="name">${escapeHtml(p.name || "")}</div>
        ${desc ? `<div class="desc">${escapeHtml(desc)}</div>` : ``}
        ${badges ? `<div class="badges">${badges}</div>` : ``}
      </div>
      <div class="meta">
        <span class="unit">${escapeHtml(unitText || "")}</span>
        <span class="price">${priceText}</span>
      </div>
      ${variants ? `<div class="variants">${variants}</div>` : ``}
    </div>
  </div>`;
  }

  function exportCSV() {
    const headers = [
      "id",
      "sku",
      "name",
      "category",
      "type",
      "baseUnitValue",
      "baseUnit",
      "price",
      "currency",
      "stock",
      "badges",
      "theme",
      "image",
      "variants",
      "fields",
      "description",
    ];
    const rows = [headers.join(",")].concat(
      products.map((p) =>
        [
          p.id,
          p.sku || "",
          p.name,
          p.category || "",
          p.type || "",
          p.baseUnitValue,
          p.baseUnit,
          p.price,
          p.currency || "TRY",
          p.stock,
          JSON.stringify(p.badges || []),
          p.theme || "",
          p.image || "",
          JSON.stringify(p.variants || []),
          JSON.stringify(p.fields || []),
          (p.description || "").replace(/\n/g, " "),
        ]
          .map((v) => {
            const s = String(v ?? "");
            return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
          })
          .join(",")
      )
    );
    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "urunler.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function drawGrid() {
    const grid = document.getElementById("grid");
    const qv = norm(document.getElementById("fSearch")?.value || "");
    const c = document.getElementById("fCategory")?.value || "";
    const t = document.getElementById("fType")?.value || "";

    const list = products.filter((p) => {
      const okC = !c || (p.category || "") === c;
      const okT = !t || (p.type || "") === t;
      const okQ =
        !qv ||
        [p.name, p.category, p.type, p.sku].some((x) => norm(x).includes(qv));
      return okC && okT && okQ;
    });

    grid.innerHTML = list
      .map((p) => renderProductCardHTML(p, { mode: "catalog" }))
      .join("");

    grid.querySelectorAll(".p-card").forEach((card) => {
      const id = card.getAttribute("data-id");
      const p = products.find((x) => x.id === id);

      // Varyant rozetleri
      card.querySelectorAll(".v-pill").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const vid = btn.getAttribute("data-vid");
          const v = (p.variants || []).find((xx) => xx.id === vid);
          if (!v) return;
          alert(`Seçenek: ${p.name} — ${v.label}
Birim: ${v.unitValue ?? p.baseUnitValue} ${v.unit ?? p.baseUnit}
Fiyat: ${v.price != null ? formatPrice(v.price, p.currency) : "-"}`);
        });
      });

      // Düzenle
      const editBtn = card.querySelector('[data-act="edit"]');
      editBtn &&
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          alert("Düzenle: " + p.id);
        });

      // Kart boşluğuna tık
      card.addEventListener("click", () => {
        alert(`Ürün: ${p.name}\nBirim: ${p.baseUnitValue} ${p.baseUnit}`);
      });
    });
  }

  function renderProducts() {
    const cats = Array.from(
      new Set(products.map((p) => p.category || "Genel"))
    ).sort();
    const types = Array.from(
      new Set(products.map((p) => p.type || "Genel"))
    ).sort();

    const el = document.createElement("div");
    el.innerHTML = `
      <div class="toolbar">
        <div class="toolbar-left">
          <button class="btn" id="csvBtn" type="button">Excel (CSV) indir</button>
          <button class="btn primary" id="newBtn" type="button">Yeni Ürün</button>
        </div>
        <div class="toolbar-right">
          <select class="select" id="fCategory">
            <option value="">Kategori</option>
            ${cats.map((c) => `<option>${c}</option>`).join("")}
          </select>
          <select class="select" id="fType">
            <option value="">Tür</option>
            ${types.map((t) => `<option>${t}</option>`).join("")}
          </select>
          <input class="input" id="fSearch" placeholder="Ara (ad, kategori, tür, sku)" />
        </div>
      </div>
      <div id="grid" class="grid" aria-live="polite"></div>
    `;
    view.replaceChildren(el);

    document.getElementById("fCategory").addEventListener("change", drawGrid);
    document.getElementById("fType").addEventListener("change", drawGrid);
    document.getElementById("fSearch").addEventListener("input", drawGrid);
    document.getElementById("csvBtn").addEventListener("click", exportCSV);
    document
      .getElementById("newBtn")
      .addEventListener("click", () => window.cpOpen && window.cpOpen());

    drawGrid();
  }

  window.App.renderProducts = renderProducts;
})();
