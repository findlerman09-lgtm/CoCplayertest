(() => {
  'use strict';
  const prefix = 'rippers-a2-art-key:';
  const bytes = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));
  const element = (tag, text) => { const n = document.createElement(tag); if (text) n.textContent = text; return n; };
  async function decrypt(bundle, key) {
    const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(bundle.iv) }, key, bytes(bundle.ciphertext));
    return JSON.parse(new TextDecoder().decode(raw));
  }
  function mount(root) {
    if (!root || root.dataset.mounted) return;
    root.dataset.mounted = 'true';
    const base = root.dataset.artBase;
    const banner = element('img'); banner.src = base + 'banner.webp'; banner.alt = 'How is Jack? — a lamplit London street'; banner.width = 766; banner.height = 684; banner.className = 'a2-banner';
    root.append(banner, element('h2', 'Case illustrations'), element('p', 'Enter the image password supplied by the Keeper when a person, place or scene is revealed. Opened records remain available in this browser.'));
    for (const [heading, ids] of [['People',[1,2,3,4,5]],['Places',[6,7,8,9]],['Sealed scene',[10]]]) {
      const section = element('section'); section.append(element('h3', heading));
      const grid = element('div'); grid.className = 'a2-art-grid'; section.append(grid); root.append(section);
      for (const id of ids) {
        const number = String(id).padStart(2,'0');
        const card = element('article'); card.className = 'a2-art-card'; card.dataset.artRecord = number;
        const title = element('h4', `Visual record ${number}`);
        const form = element('form');
        const label = element('label', 'Keeper image password');
        const input = element('input'); input.type = 'password'; input.autocomplete = 'off'; input.required = true; label.append(input);
        const button = element('button', 'Open image'); button.type = 'submit'; button.className = 'small-action';
        const status = element('p'); status.setAttribute('role', 'status');
        form.append(label,button);card.append(title,form,status);grid.append(card);
        let bundle;
        const load = async () => {
          if (!bundle) { const response = await fetch(base + `record-${number}.json`); if (!response.ok) throw new Error('load'); bundle = await response.json(); }
          return bundle;
        };
        const show = data => {
          title.textContent = data.title;
          const figure = element('figure');const image = element('img');
          image.alt = data.alt; image.width = data.width; image.height = data.height;
          image.src = 'data:image/webp;base64,' + data.image;
          figure.append(image,element('figcaption',data.title));
          card.querySelector('figure')?.remove();card.append(figure);form.hidden=true;
        };
        form.addEventListener('submit',async event => {
          event.preventDefault();button.disabled=true;status.textContent='Opening…';
          try {
            const data = await load();
            const material = await crypto.subtle.importKey('raw',new TextEncoder().encode(input.value.trim().toUpperCase()),'PBKDF2',false,['deriveKey']);
            const key = await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:bytes(data.salt),iterations:data.iterations},material,{name:'AES-GCM',length:256},true,['decrypt']);
            const art = await decrypt(data,key);show(art);input.value='';
            try { const exported = new Uint8Array(await crypto.subtle.exportKey('raw',key));localStorage.setItem(prefix+number,btoa(String.fromCharCode(...exported)));status.textContent='Opened. Saved on this browser.'; }
            catch { status.textContent='Opened for this visit. Browser storage is unavailable.'; }
          } catch { status.textContent='Unable to open. Check the Keeper password and your connection, then try again.'; }
          finally { button.disabled=false; }
        });
        // Only already-opened records are fetched on return; sealed art is never preloaded.
        (async () => {
          let saved;try { saved=localStorage.getItem(prefix+number); } catch { return; }
          if (!saved) return;
          try { const key=await crypto.subtle.importKey('raw',bytes(saved),'AES-GCM',false,['decrypt']);show(await decrypt(await load(),key));status.textContent='Previously opened on this browser.'; }
          catch { status.textContent='Enter the Keeper password to reopen this record.'; }
        })();
      }
    }
  }
  window.RippersScenarioArt=Object.freeze({mount});
})();
