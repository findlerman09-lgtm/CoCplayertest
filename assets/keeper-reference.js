(() => {
  const root = document.querySelector('[data-keeper-reference]');
  if (!root) return;

  const openKey = 'rippers-keeper-reference-open:v1';
  const tabKey = 'rippers-keeper-reference-tab:v1';
  const button = root.querySelector('[data-keeper-open]');
  const closed = root.querySelector('[data-keeper-closed]');
  const content = root.querySelector('[data-keeper-content]');
  const tabs = [...root.querySelectorAll('[data-keeper-tab]')];
  const panels = [...root.querySelectorAll('[data-keeper-panel]')];

  function read(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function remember(key, value) {
    try { localStorage.setItem(key, value); } catch { /* The panel still works for this visit. */ }
  }
  function select(index, focus = false) {
    tabs.forEach((tab, position) => {
      const selected = position === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[position].hidden = !selected;
    });
    remember(tabKey, tabs[index].dataset.keeperTab);
    if (focus) tabs[index].focus();
  }
  function open() {
    closed.hidden = true;
    content.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    remember(openKey, 'open');
    const saved = tabs.findIndex(tab => tab.dataset.keeperTab === read(tabKey));
    select(saved < 0 ? 0 : saved);
  }

  button.addEventListener('click', open);
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(next, true);
    });
  });
  if (read(openKey) === 'open') open();
})();
