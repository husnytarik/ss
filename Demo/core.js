window.App = window.App || {};
(function(){
  const root = document.documentElement;
  const userMenu = document.getElementById('userMenu');
  const mainTabs = document.getElementById('mainTabs');
  const subTabs = document.getElementById('subTabs');
  const roleSelect = document.getElementById('roleSelect');
  const custTagSelect = document.getElementById('custTagSelect');
  const view = document.getElementById('view');

  document.getElementById('toggleBtn').addEventListener('click', () => {
    const exp = root.classList.toggle('expanded');
    document.getElementById('toggleBtn').setAttribute('aria-expanded', exp ? 'true' : 'false');
  });

  userMenu.querySelector('.user-toggle').addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !userMenu.classList.contains('open');
    userMenu.classList.toggle('open', open);
    userMenu.querySelector('.user-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', e => { if(!userMenu.contains(e.target)) userMenu.classList.remove('open'); });

  const SUBS_BY_ROLE = {
    'perakende':       [{key:'tedarikciler', label:'Tedarikçiler'}],
    'satici-perakende':[ {key:'urunler', label:'Ürünler'}, {key:'tedarikciler', label:'Tedarikçiler'} ]
  };

  let state = {
    currentMain: 'magaza',
    currentSub:  null,
    role: roleSelect.value,
    custTag: custTagSelect.value,
  };
  window.App.state = state;

  Array.from(mainTabs.children).forEach(pill => {
    pill.addEventListener('click', (e) => { e.preventDefault(); activateMain(pill.dataset.tab); });
  });
  roleSelect.addEventListener('change', () => { state.role = roleSelect.value; renderSubTabs(); });
  custTagSelect.addEventListener('change', () => { state.custTag = custTagSelect.value; renderView(); });

  function renderSubTabs(){
    subTabs.innerHTML = '';
    if(state.currentMain !== 'magaza'){ subTabs.style.display='none'; state.currentSub=null; renderView(); return; }
    subTabs.style.display = 'flex';
    const subs = SUBS_BY_ROLE[state.role] || [];
    subs.forEach((s,idx) => {
      const el = document.createElement('span');
      el.className = 'subpill' + (idx===0 ? ' active' : '');
      el.dataset.sub = s.key;
      el.textContent = s.label;
      el.addEventListener('click', () => activateSub(s.key));
      subTabs.appendChild(el);
      if(idx===0) state.currentSub = s.key;
    });
    renderView();
  }
  function activateMain(tab){
    state.currentMain = tab;
    Array.from(mainTabs.children).forEach(p => p.classList.toggle('active', p.dataset.tab===tab));
    renderSubTabs();
  }
  function activateSub(subKey){
    state.currentSub = subKey;
    Array.from(subTabs.children).forEach(p => p.classList.toggle('active', p.dataset.sub===subKey));
    renderView();
  }

  function renderDefault(){
    view.innerHTML = `<strong>Mağaza</strong><p class="muted" style="margin-top:6px">Mağazaya ait içerik burada görünecek.</p>`;
  }
  function renderSuppliers(){
   // Tedarikçi ekranında ürün kataloğunu, sepet butonu olmadan göster
  if (window.App.renderSupplierCatalog) {
    window.App.renderSupplierCatalog();
  } else {
     view.innerHTML = `<strong>Mağaza — Tedarikçiler</strong>
       <p class="muted" style="margin-top:6px">Tedarikçi kataloğu yüklenemedi.</p>`;
  }
}
  function renderView(){
    if(state.currentMain !== 'magaza'){ view.innerHTML = `<strong>${state.currentMain[0].toUpperCase()+state.currentMain.slice(1)}</strong>`; return; }
    if(state.role === 'perakende'){ renderSuppliers(); return; }
    if(state.currentSub === 'urunler'){ if(window.App.renderProducts) window.App.renderProducts(); else renderDefault(); return; }
    if(state.currentSub === 'tedarikciler'){ renderSuppliers(); return; }
    renderDefault();
  }

  window.App.renderView = renderView;
  window.App.renderSubTabs = renderSubTabs;

  renderSubTabs();
  renderView();
})();