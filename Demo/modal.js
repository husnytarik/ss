window.App = window.App || {};
(function () {
  const CP_COMPANIES = [
    { id: "c1", name: "Acme Gıda A.Ş." },
    { id: "c2", name: "Kuzey Marketler" },
    { id: "c3", name: "Delta Cafe" },
    { id: "c4", name: "Olive Wholesale" },
  ];

  // ============ Modal refs ============
  const cpModal = document.getElementById("cpModal");
  const cpClose = document.getElementById("cpClose");
  const cpSave = document.getElementById("cpSave");
  const cpReset = document.getElementById("cpReset");
  const cpVisRulesBtn = document.getElementById("cpVisRules");
  const cpVisor = document.getElementById("cpVisor");
  const cpVisorClose = document.getElementById("cpVisorClose");
  const cpVisorApply = document.getElementById("cpVisorApply");
  const cpVisorList = document.getElementById("cpVisorList");

  // ============ Modal open/close ============
  function cpOpen() {
    cpModal.classList.add("open");
    cpModal.setAttribute("aria-hidden", "false");
  }
  function cpCloseFn() {
    cpModal.classList.remove("open");
    cpModal.setAttribute("aria-hidden", "true");
  }
  window.cpOpen = cpOpen;

  // ============ Image preview ============
  const cpImage = document.getElementById("cp_image");
  const cpThumb = document.getElementById("cp_thumb");
  if (cpImage && cpThumb) {
    cpImage.addEventListener("change", () => {
      const f = cpImage.files?.[0];
      if (!f) {
        cpThumb.innerHTML = "<span>Görsel seçilmedi</span>";
        return;
      }
      const fr = new FileReader();
      fr.onload = () => {
        cpThumb.innerHTML = `<img src="${fr.result}" alt="">`;
      };
      fr.readAsDataURL(f);
    });
  }

  cpClose?.addEventListener("click", cpCloseFn);
  cpModal?.addEventListener("click", (e) => {
    if (e.target === cpModal) cpCloseFn();
  });

  // ============ Product Dynamic Fields ============
  const cpProductFields = document.getElementById("cpProductFields");
  document
    .getElementById("cpAddProductField")
    ?.addEventListener("click", () => cpAddProductField());

  function cpAddProductField(pref = {}) {
    const row = document.createElement("div");
    row.className = "row";
    row.style.cssText = "align-items:flex-end;margin-top:8px";
    row.innerHTML = `
      <div class="cp-field" style="max-width:220px">
        <label class="cp-label">Alan Adı</label>
        <input class="cp-input pf_key" placeholder="örn: ogutmeTuru" value="${
          pref.key || ""
        }">
      </div>
      <div class="cp-field" style="max-width:180px">
        <label class="cp-label">Tür</label>
        <select class="cp-select pf_type">
          <option value="text">Metin</option>
          <option value="textarea">Uzun Metin</option>
          <option value="number">Sayı</option>
          <option value="price">Fiyat</option>
          <option value="unit">Ölçü</option>
          <option value="tags">Etiketler</option>
          <option value="boolean">Durum</option>
          <option value="color">Renk</option>
          <option value="enum">Seçenek (Enum)</option>
        </select>
      </div>
      <div class="cp-field" style="max-width:320px">
        <label class="cp-label">Değer</label>
        <div class="pf_value_holder"></div>
      </div>
      <button class="cp-btn secondary pf_del" type="button">Sil</button>
    `;
    cpProductFields.append(row);

    const typeSel = row.querySelector(".pf_type");
    const holder = row.querySelector(".pf_value_holder");

    function renderValueInput(t) {
      holder.innerHTML = "";
      if (t === "textarea") {
        holder.innerHTML = `<textarea class="cp-textarea pf_value" placeholder="Metin girin"></textarea>`;
      } else if (t === "number" || t === "price") {
        holder.innerHTML = `<input class="cp-input pf_value" type="number" step="${
          t === "price" ? "0.01" : "1"
        }" placeholder="${t === "price" ? "Fiyat" : "Sayı"}">`;
      } else if (t === "unit") {
        holder.innerHTML = `
          <div class="row">
            <input class="cp-input pf_value_num" type="number" step="0.01" placeholder="Değer">
            <select class="cp-select pf_value_unit" style="min-width:120px">
              <option value="adet">adet</option><option value="paket">paket</option><option value="koli">koli</option>
              <option value="g">g</option><option value="kg">kg</option><option value="ml">ml</option><option value="l">L</option>
            </select>
          </div>`;
      } else if (t === "tags") {
        holder.innerHTML = `<input class="cp-input pf_value" placeholder="Etiketleri virgülle ayırın">`;
      } else if (t === "boolean") {
        holder.innerHTML = `<label class="row" style="align-items:center"><input type="checkbox" class="pf_value_bool"> <span>Açık/Kapalı</span></label>`;
      } else if (t === "color") {
        holder.innerHTML = `<input class="cp-input pf_value" type="color" value="#eeeeee">`;
      } else if (t === "enum") {
        holder.innerHTML = `
          <input class="cp-input pf_enum_options" placeholder="Seçenekleri virgülle yaz: Çekirdek, Filtre, Cold Brew">
          <label class="row" style="align-items:center;margin-top:6px">
            <input type="checkbox" class="pf_enum_multi"> <span>Çoklu seçim</span>
          </label>`;
      } else {
        holder.innerHTML = `<input class="cp-input pf_value" placeholder="Değer">`;
      }
    }
    typeSel.addEventListener("change", () => renderValueInput(typeSel.value));
    renderValueInput(typeSel.value);

    row.querySelector(".pf_del").addEventListener("click", () => row.remove());
  }

  // ============ Variants ============
  const cpVarTbody = document.querySelector("#cpVariantsTable tbody");
  document
    .getElementById("cpAddVariant")
    ?.addEventListener("click", () => cpAddVariantRow());
  document.getElementById("cpPresetCoffee")?.addEventListener("click", () => {
    cpAddVariantRow({ name: "250 g", qty: "250 g", price: "120", stock: "20" });
    cpAddVariantRow({ name: "500 g", qty: "500 g", price: "220", stock: "12" });
    cpAddVariantRow({
      name: "1000 g",
      qty: "1000 g",
      price: "420",
      stock: "6",
    });
  });

  function cpAddVariantField(container, pref = {}) {
    const row = document.createElement("div");
    row.className = "row";
    row.style.cssText = "align-items:flex-end;margin-top:6px";
    row.innerHTML = `
      <div class="cp-field" style="max-width:200px">
        <label class="cp-label">Alan Adı</label>
        <input class="cp-input vf_key" placeholder="örn: ogutmeTuru" value="${
          pref.key || ""
        }">
      </div>
      <div class="cp-field" style="max-width:160px">
        <label class="cp-label">Tür</label>
        <select class="cp-select vf_type">
          <option value="text">Metin</option>
          <option value="number">Sayı</option>
          <option value="price">Fiyat</option>
          <option value="unit">Ölçü</option>
          <option value="note">Not</option>
          <option value="enum">Seçenek (Enum)</option>
        </select>
      </div>
      <div class="cp-field" style="max-width:260px">
        <label class="cp-label">Değer</label>
        <input class="cp-input vf_value" placeholder="Değer">
      </div>
      <button class="cp-btn secondary vf_del" type="button">Sil</button>
    `;
    container.append(row);

    const typeSel = row.querySelector(".vf_type");
    const val = row.querySelector(".vf_value");
    function updateVPlaceholder() {
      val.placeholder =
        typeSel.value === "enum" ? "Seçenekleri virgülle yazın" : "Değer";
    }
    typeSel.addEventListener("change", updateVPlaceholder);
    updateVPlaceholder();

    row.querySelector(".vf_del").addEventListener("click", () => row.remove());
  }

  function cpAddVariantRow(pref = {}) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input class="cp-input v_name" placeholder="Örn: 250 g" value="${
        pref.name || ""
      }"></td>
      <td><input class="cp-input v_qty"  placeholder="Örn: 250 g / 12 adet" value="${
        pref.qty || ""
      }"></td>
      <td><input class="cp-input v_price" type="number" step="0.01" min="0" placeholder="Örn: 120" value="${
        pref.price || ""
      }"></td>
      <td><input class="cp-input v_stock" type="number" step="1" min="0" placeholder="Örn: 10" value="${
        pref.stock || ""
      }"></td>
      <td>
        <div class="row"><button class="cp-btn ghost v_add_field" type="button">+ Alan Ekle</button></div>
        <div class="v_fields" style="margin-top:6px"></div>
      </td>
      <td><button class="cp-btn secondary v_del" type="button">Sil</button></td>
    `;
    cpVarTbody.append(tr);
    tr.querySelector(".v_del").addEventListener("click", () => tr.remove());
    tr.querySelector(".v_add_field").addEventListener("click", () =>
      cpAddVariantField(tr.querySelector(".v_fields"))
    );
  }

  // ============ Visibility helpers ============
  function addVisRow(container, targetId, label, type) {
    const row = document.createElement("div");
    row.className = "rowline";
    row.dataset.target = targetId;

    const v = (typeof visState !== "undefined" && visState.get(targetId)) || {
      visibility: "public",
      overrides: [],
    };

    row.innerHTML = `
      <div><strong>${label}</strong></div>
      <div>
        <select class="cp-select vis_mode">
          <option value="public" ${
            v.visibility === "public" ? "selected" : ""
          }>Görünür</option>
          <option value="hidden" ${
            v.visibility === "hidden" ? "selected" : ""
          }>Gizli</option>
          <option value="special" ${
            v.visibility === "special" ? "selected" : ""
          }>Özel</option>
        </select>
      </div>
      <div class="vis_conf"></div>
    `;

    const conf = row.querySelector(".vis_conf");
    const mode = row.querySelector(".vis_mode");

    function renderCompanyChips(container) {
      container.innerHTML = "";
      CP_COMPANIES.forEach((c) => {
        const lab = document.createElement("label");
        lab.className = "cp-company";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.dataset.companyId = c.id;
        lab.append(cb, document.createTextNode(c.name));
        container.append(lab);
      });
    }

    function drawConf() {
      conf.innerHTML = "";
      if (mode.value !== "special") return;

      const valWrap = document.createElement("div");
      valWrap.className = "row";

      if (type === "unit") {
        valWrap.innerHTML = `
          <input class="cp-input sp_val_num" type="number" step="0.01" placeholder="Değer">
          <select class="cp-select sp_val_unit" style="min-width:120px">
            <option value="adet">adet</option><option value="paket">paket</option><option value="koli">koli</option>
            <option value="g">g</option><option value="kg">kg</option><option value="ml">ml</option><option value="l">L</option>
          </select>`;
      } else if (type === "price" || type === "number") {
        valWrap.innerHTML = `<input class="cp-input sp_val" type="number" step="0.01" placeholder="Özel değer">`;
      } else if (type === "color") {
        valWrap.innerHTML = `<input class="cp-input sp_val" type="color" value="#eeeeee">`;
      } else {
        valWrap.innerHTML = `<input class="cp-input sp_val" placeholder="Özel değer">`;
      }

      const chips = document.createElement("div");
      chips.className = "row";
      chips.style.flexWrap = "wrap";
      renderCompanyChips(chips);

      conf.append(valWrap, chips);
    }

    mode.addEventListener("change", drawConf);
    drawConf();

    container.append(row);
  }

  const VIS_TARGETS = [
    {
      id: "name",
      label: "Ürün Adı",
      type: "text",
      get: () => document.getElementById("cp_name").value,
    },
    {
      id: "sku",
      label: "SKU",
      type: "text",
      get: () => document.getElementById("cp_sku").value,
    },
    {
      id: "category",
      label: "Kategori",
      type: "text",
      get: () => document.getElementById("cp_category").value,
    },
    {
      id: "type",
      label: "Tür",
      type: "text",
      get: () => document.getElementById("cp_type").value,
    },
    {
      id: "unit",
      label: "Birim",
      type: "unit",
      get: () => ({
        amount: document.getElementById("cp_unit_value").value,
        unit: document.getElementById("cp_unit").value,
      }),
    },
    {
      id: "currency",
      label: "Para Birimi",
      type: "text",
      get: () => document.getElementById("cp_currency").value,
    },
    {
      id: "desc",
      label: "Açıklama",
      type: "text",
      get: () => document.getElementById("cp_desc").value,
    },
    {
      id: "image",
      label: "Fotoğraf",
      type: "image",
      get: () =>
        document.getElementById("cp_image").files?.[0] ? "uploaded" : "",
    },
    { id: "v_price", label: "Varyant Fiyatı", type: "price", get: () => null },
  ];
  const visState = new Map();

  function openVisor() {
    cpVisor.classList.add("open");
    cpVisor.setAttribute("aria-hidden", "false");
    cpVisorList.innerHTML = "";

    // Product core fields
    VIS_TARGETS.forEach((t) => {
      addVisRow(cpVisorList, t.id, t.label, t.type);
    });

    // Product dynamic fields
    const dynRows = document.querySelectorAll("#cpProductFields > .row");
    dynRows.forEach((r, idx) => {
      const key =
        r.querySelector(".pf_key")?.value?.trim() || `Ek alan ${idx + 1}`;
      addVisRow(cpVisorList, "pf:" + key, "Ek: " + key, "text");
    });

    // Variants (options)
    const vRows = document.querySelectorAll("#cpVariantsTable tbody tr");
    vRows.forEach((tr, i) => {
      const vname =
        tr.querySelector(".v_name")?.value?.trim() || `Seçenek ${i + 1}`;
      addVisRow(cpVisorList, `v:name:${i}`, `Varyant: ${vname} — Ad`, "text");
      addVisRow(
        cpVisorList,
        `v:qty:${i}`,
        `Varyant: ${vname} — Miktar`,
        "text"
      );
      addVisRow(
        cpVisorList,
        `v:price:${i}`,
        `Varyant: ${vname} — Fiyat`,
        "price"
      );
      addVisRow(
        cpVisorList,
        `v:stock:${i}`,
        `Varyant: ${vname} — Stok`,
        "number"
      );

      tr.querySelectorAll(".v_fields > .row").forEach((vr, j) => {
        const k = vr.querySelector(".vf_key")?.value?.trim() || `alan${j + 1}`;
        addVisRow(
          cpVisorList,
          `vf:${i}:${k}`,
          `Varyant: ${vname} — Ek: ${k}`,
          "text"
        );
      });
    });
  }

  function closeVisor() {
    cpVisor.classList.remove("open");
    cpVisor.setAttribute("aria-hidden", "true");
  }
  cpVisRulesBtn?.addEventListener("click", openVisor);
  cpVisorClose?.addEventListener("click", closeVisor);
  cpVisorApply?.addEventListener("click", () => {
    visState.clear();
    cpVisorList.querySelectorAll(".rowline").forEach((row) => {
      const id = row.dataset.target;
      const mode = row.querySelector(".vis_mode").value;
      const overrides = [];
      if (mode === "special") {
        const num = row.querySelector(".sp_val_num");
        const unit = row.querySelector(".sp_val_unit");
        const valEl = row.querySelector(".sp_val");
        let value = null;
        if (num && unit) {
          value = { amount: Number(num.value || 0), unit: unit.value };
        } else if (valEl) {
          value =
            valEl.type === "number" ? Number(valEl.value || 0) : valEl.value;
        }
        row
          .querySelectorAll('input[type="checkbox"][data-company-id]:checked')
          .forEach((cb) =>
            overrides.push({ companyId: cb.dataset.companyId, value })
          );
      }
      visState.set(id, { visibility: mode, overrides });
    });
    closeVisor();
    alert("Görünürlük kuralları kaydedildi.");
  });

  // ============ Save / Reset ============
  function fileToDataURL(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
  }

  cpSave?.addEventListener("click", async () => {
    const name = document.getElementById("cp_name").value.trim();
    const unit = document.getElementById("cp_unit").value;
    const unitValue = Number(
      document.getElementById("cp_unit_value").value || 0
    );
    if (!name) {
      alert("Ürün adı zorunlu.");
      return;
    }
    if (!unit) {
      alert("Birim zorunlu.");
      return;
    }

    const imageFile = document.getElementById("cp_image").files?.[0];
    const image = imageFile ? await fileToDataURL(imageFile) : "";

    function pack(id, baseValue) {
      const st = visState.get(id) || { visibility: "public", overrides: [] };
      return {
        value: baseValue,
        visibility: st.visibility,
        overrides: st.overrides || [],
      };
    }

    // Product dynamic fields (with enum support)
    const productFields = [];
    document.querySelectorAll("#cpProductFields > .row").forEach((r) => {
      const key = r.querySelector(".pf_key").value.trim();
      if (!key) return;
      const type = r.querySelector(".pf_type").value;
      let value = "";
      if (type === "unit") {
        const num = r.querySelector(".pf_value_num")?.value;
        const un = r.querySelector(".pf_value_unit")?.value;
        value = { amount: Number(num || 0), unit: un || "" };
      } else if (type === "boolean") {
        value = !!r.querySelector(".pf_value_bool")?.checked;
      } else if (type === "enum") {
        const raw = r.querySelector(".pf_enum_options")?.value || "";
        const multi = !!r.querySelector(".pf_enum_multi")?.checked;
        value = {
          options: raw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          multi,
        };
      } else {
        value = r.querySelector(".pf_value")?.value ?? "";
      }
      const vk = "pf:" + key;
      const st = visState.get(vk) || { visibility: "public", overrides: [] };
      productFields.push({
        key,
        type,
        value,
        visibility: st.visibility,
        overrides: st.overrides || [],
      });
    });

    // Variants
    const variants = [];
    document.querySelectorAll("#cpVariantsTable tbody tr").forEach((tr, i) => {
      const vname = tr.querySelector(".v_name").value.trim();
      const vqty = tr.querySelector(".v_qty").value.trim();
      if (!vname || !vqty) return;
      const price = tr.querySelector(".v_price").value;
      const stock = tr.querySelector(".v_stock").value;

      // variant extra fields (enum support)
      const vfields = [];
      tr.querySelectorAll(".v_fields > .row").forEach((vr) => {
        const key = vr.querySelector(".vf_key").value.trim();
        if (!key) return;
        const type = vr.querySelector(".vf_type").value;
        const raw = vr.querySelector(".vf_value")?.value ?? "";
        const value =
          type === "enum"
            ? raw
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : raw;
        const pfVis = visState.get(`vf:${i}:${key}`) || {
          visibility: "public",
          overrides: [],
        };
        vfields.push({
          key,
          type,
          value,
          visibility: pfVis.visibility,
          overrides: pfVis.overrides || [],
        });
      });

      // core vis for variant
      const vNameVis = visState.get(`v:name:${i}`) || {
        visibility: "public",
        overrides: [],
      };
      const vQtyVis = visState.get(`v:qty:${i}`) || {
        visibility: "public",
        overrides: [],
      };
      const vPriceVis = visState.get(`v:price:${i}`) || {
        visibility: "public",
        overrides: [],
      };
      const vStockVis = visState.get(`v:stock:${i}`) || {
        visibility: "public",
        overrides: [],
      };

      variants.push({
        id: "v" + (Date.now() + i),
        name: vname,
        quantity: vqty,
        price: price === "" ? null : Number(price),
        stock: stock === "" ? null : Number(stock),
        nameVisibility: vNameVis.visibility,
        nameOverrides: vNameVis.overrides || [],
        qtyVisibility: vQtyVis.visibility,
        qtyOverrides: vQtyVis.overrides || [],
        priceVisibility: vPriceVis.visibility,
        priceOverrides: vPriceVis.overrides || [],
        stockVisibility: vStockVis.visibility,
        stockOverrides: vStockVis.overrides || [],
        fields: vfields,
      });
    });

    const product = {
      id: "p" + Date.now(),
      name: pack("name", document.getElementById("cp_name").value.trim()),
      sku: pack("sku", document.getElementById("cp_sku").value.trim()),
      category: pack(
        "category",
        document.getElementById("cp_category").value.trim()
      ),
      type: pack("type", document.getElementById("cp_type").value.trim()),
      unit: pack("unit", {
        value: document.getElementById("cp_unit").value,
        amount: Number(document.getElementById("cp_unit_value").value || 0),
      }),
      currency: pack(
        "currency",
        document.getElementById("cp_currency").value || "TRY"
      ),
      description: pack(
        "desc",
        document.getElementById("cp_desc").value.trim()
      ),
      image: pack("image", image),
      fields: productFields,
      variants,
    };

    console.log("CREATE_PRODUCT", product);

    // push to demo list for grid render
    if (Array.isArray(window.App.products)) {
      const firstPrice = product.variants?.[0]?.price ?? 0;
      const base = {
        id: product.id,
        sku: product.sku?.value || "",
        currency: product.currency?.value || "TRY",
        name: product.name?.value || "",
        category: product.category?.value || "Genel",
        type: product.type?.value || "Genel",
        baseUnitValue: product.unit?.value?.amount || 0,
        baseUnit:
          product.unit?.value?.value ||
          document.getElementById("cp_unit").value,
        price: firstPrice,
        stock: 0,
        description: product.description?.value || "",
        image: product.image?.value || "",
        theme: "#ffffff",
        badges: [],
        variants: (product.variants || []).map((v) => ({
          id: v.id,
          label: v.name,
          unitValue: null,
          unit: null,
          price: v.price ?? 0,
          enabled: true,
          stock: v.stock ?? null,
        })),
        fields: (product.fields || []).map((f) => ({
          label: f.key,
          type: f.type,
          value:
            typeof f.value === "object" ? JSON.stringify(f.value) : f.value,
          visibility: f.visibility,
        })),
      };
      window.App.products.unshift(base);
      if (window.App.renderProducts) window.App.renderProducts();
    }

    alert("Ürün eklendi (konsola JSON yazıldı).");
    cpCloseFn();
  });

  cpReset?.addEventListener("click", () => {
    cpModal.querySelectorAll("input, textarea").forEach((el) => {
      if (el.type === "checkbox" || el.type === "radio") el.checked = false;
      else if (el.type === "file") el.value = "";
      else if (el.type === "color") el.value = "#ffffff";
      else el.value = "";
    });
    cpModal.querySelectorAll("select").forEach((s) => {
      s.value = s.querySelector("option")?.value || "";
    });
    document.getElementById("cp_currency").value = "TRY";
    document.getElementById("cpProductFields").innerHTML = "";
    document.querySelector("#cpVariantsTable tbody").innerHTML = "";
    document.getElementById("cp_thumb").innerHTML =
      "<span>Görsel seçilmedi</span>";
  });
})();
