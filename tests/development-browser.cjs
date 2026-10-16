// Run with NODE_PATH pointing to installed liquidjs, js-yaml and playwright.
// The upstream adapter, completion state and deterministic dice here are QA
// fixtures only. None is emitted by the production site.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { Liquid } = require('liquidjs');
const yaml = require('js-yaml');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const key = 'rippers-character-state:arthur-bell';
(async () => {
  const data = {};
  for (const name of fs.readdirSync(path.join(root, '_data'))) {
    const file = path.join(root, '_data', name);
    if (name.endsWith('.yml')) data[name.slice(0, -4)] = yaml.load(fs.readFileSync(file, 'utf8'));
    else if (fs.statSync(file).isDirectory()) data[name] = Object.fromEntries(fs.readdirSync(file).filter(n => n.endsWith('.yml')).map(n => [n.slice(0, -4), yaml.load(fs.readFileSync(path.join(file, n), 'utf8'))]));
  }
  const liquid = new Liquid({ root: path.join(root, '_includes'), jekyllInclude: true });
  liquid.registerFilter('relative_url', value => value);
  // Jekyll uses integer division for integer operands.
  liquid.registerFilter('divided_by', (a,b) => Math.floor(a/b));
  const scope = { site: { title: 'The Rippers', data }, page: { character_slug: 'arthur-bell', title: 'Character Sheet', context_nav: 'sheet', top_nav: 'investigators' } };
  scope.content = await liquid.parseAndRender(fs.readFileSync(path.join(root, '_includes/character-sheet.html'), 'utf8'), scope);
  const html = await liquid.parseAndRender(fs.readFileSync(path.join(root, '_layouts/base.html'), 'utf8'), scope);
  const scenarioScope = { ...scope, page: { ...scope.page, title: 'Scenario Workspace', context_nav: 'scenario' } };
  scenarioScope.content = await liquid.parseAndRender(fs.readFileSync(path.join(root, '_includes/scenario-workspace.html'), 'utf8'), scenarioScope);
  const scenarioHTML = await liquid.parseAndRender(fs.readFileSync(path.join(root, '_layouts/base.html'), 'utf8'), scenarioScope);
  const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url.startsWith('/characters/')) { res.setHeader('Content-Type','text/html'); res.end(req.url.includes('/scenario/') ? scenarioHTML : html); return; }
    const file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.statusCode = 404; res.end(); return; }
    res.setHeader('Content-Type', file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream');
    res.end(fs.readFileSync(file));
  });
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.QA_CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    context.on('page', page => { page.on('pageerror', error => errors.push(error.message)); page.on('dialog', dialog => dialog.accept()); });
    await context.addInitScript(({ archive, dossier, fixtureProvider }) => {
      if (location.origin === 'null') return;
      if (!sessionStorage.getItem('qa-logged-out')) {
        localStorage.setItem('rippers-archive-access', archive);
        localStorage.setItem('rippers-dossier-access:arthur-bell', dossier);
      }
      if (fixtureProvider) window.RippersDevelopmentContext = { read: () => JSON.parse(localStorage.getItem('qa-context') || 'null') };
      Object.defineProperty(crypto, 'getRandomValues', { value: array => {
        const rolls = JSON.parse(localStorage.getItem('qa-rolls') || '[]');
        if (!rolls.length) throw Error('Unexpected random draw');
        array[0] = rolls.shift() - 1;
        localStorage.setItem('qa-rolls', JSON.stringify(rolls));
        localStorage.setItem('qa-draws', String(Number(localStorage.getItem('qa-draws') || 0) + 1));
        return array;
      }});
    }, { archive: data.site_state.archive.verifier, dossier: data.characters['arthur-bell'].lock.verifier, fixtureProvider: !process.env.QA_REAL_ADVENTURE });
    const page = await context.newPage();
    const url = `http://127.0.0.1:${server.address().port}/characters/arthur-bell/sheet/`;
    await page.goto(url);
    const panel = page.locator('[data-development]');
    const status = page.locator('[data-development-status]');
    if (process.env.QA_REAL_ADVENTURE) {
      const scenarioURL = url.replace('/sheet/', '/scenario/');
      await page.waitForFunction(() => document.querySelector('[data-development-status]').textContent==='LOCKED');
      assert.equal(await page.locator('[data-next-scenario-link]:visible').count(), 0);
      await page.goto(scenarioURL);
      await page.waitForFunction(() => document.querySelector('[data-scenario-workspace]').textContent.includes('locked'));
      assert.doesNotMatch(await page.locator('main').textContent(), /How is Jack/);
      await page.evaluate(key => {
        localStorage.setItem(key, JSON.stringify({schemaVersion:2,dataVersion:'2',state:{hp:13,sanity:60,luck:55,skillChecks:['spot-hidden']}}));
        localStorage.setItem('qa-rolls',JSON.stringify([82,6,1]));
        localStorage.setItem('qa-draws','0');
        localStorage.setItem('rippers-unlock-preserve-fixture','yes');
      },key);
      await page.goto(url);
      assert.equal(await page.locator('[data-confirm-legacy-checks]').count(),1);
      await page.locator('[data-skill-check="stealth"]').check();
      await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).state.experienceChecks.some(c=>c.skill_id==='stealth' && c.adventure_id==='who-is-jack'),key);
      const finish = page.getByRole('button',{name:'Finish Adventure (Keeper confirmed)'});
      assert.equal(await finish.isEnabled(),false);
      await page.locator('[data-confirm-adventure]').check();
      assert.equal(await finish.isEnabled(),false);
      await page.locator('[data-confirm-legacy-checks]').check();
      await finish.click();
      await page.waitForFunction(() => document.querySelector('[data-development-status]').textContent==='AVAILABLE');
      assert.equal(await page.locator('[data-skill-check="spot-hidden"]').isDisabled(),true);
      assert.equal(await page.locator('[data-next-scenario-link]:visible').count(),0);
      await panel.getByRole('button',{name:'Make Development Roll'}).click();
      await page.waitForFunction(() => document.querySelector('[data-development-status]').textContent==='IN PROGRESS');
      assert.equal(await page.locator('[data-next-scenario-link]:visible').count(),0);
      await panel.getByRole('button',{name:'Make Development Roll'}).click();
      await page.waitForFunction(() => document.querySelector('[data-development-status]').textContent==='COMPLETE');
      await page.waitForFunction(() => [...document.querySelectorAll('[data-next-scenario-link]')].some(link=>!link.hidden));
      const upgraded = await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).state,key);
      assert.equal(upgraded.adventureProgress.current,'who-is-jack');
      assert.equal(upgraded.skillValues['spot-hidden'],76);
      assert.equal(upgraded.developmentHistory.length,2);
      assert.ok(upgraded.experienceChecks.every(c=>c.resolved && !c.earned));
      assert.equal(await page.evaluate(()=>localStorage.getItem('qa-draws')),'3');
      console.log('PASS integrated: Keeper completion, explicit legacy origins, permanent upgrades and automatic workspace unlock');
      await page.getByRole('link',{name:'Open next scenario workspace'}).click();
      await page.waitForFunction(()=>document.querySelector('[data-scenario-workspace]').textContent.includes('How is Jack?'));
      assert.equal(await page.getByRole('link',{name:'Character Sheet & Development'}).count(),1);
      if (process.env.QA_SCREENSHOT_DIR) await page.locator('[data-scenario-workspace]').screenshot({path:path.join(process.env.QA_SCREENSHOT_DIR,'scenario-two.png')});
      await page.getByRole('button',{name:'Begin Scenario (Keeper confirmed)'}).click();
      await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).state.adventureProgress.current==='how-is-jack',key);
      await page.getByRole('link',{name:'Character Sheet & Development'}).click();
      await page.waitForFunction(()=>document.querySelector('[data-development-status]').textContent==='LOCKED');
      assert.equal(await page.locator('[data-skill-check="spot-hidden"]').isChecked(),false);
      assert.equal(await page.locator('[data-current-skill="spot-hidden"]').textContent(),'76%');
      await page.locator('[data-skill-check="spot-hidden"]').check();
      await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).state.experienceChecks.some(c=>c.skill_id==='spot-hidden' && c.adventure_id==='how-is-jack' && c.earned && !c.resolved),key);
      await page.reload();
      assert.equal(await page.locator('[data-current-skill="spot-hidden"]').textContent(),'76%');
      assert.equal(await page.locator('[data-skill-check="spot-hidden"]').isChecked(),true);
      assert.equal(await page.evaluate(()=>localStorage.getItem('rippers-unlock-preserve-fixture')),'yes');
      console.log('PASS integrated: second scenario starts separately, new marks get second origin, values/history and releases survive reload');
      // Independent no-check profile simulation; no development dice should run.
      await page.evaluate(key=>{ localStorage.setItem(key,JSON.stringify({schemaVersion:2,dataVersion:'2',state:{hp:13,sanity:60,luck:55,skillChecks:[]}})); },key);
      await page.reload();
      await page.locator('[data-confirm-adventure]').check();
      await page.getByRole('button',{name:'Finish Adventure (Keeper confirmed)'}).click();
      await page.waitForFunction(()=>[...document.querySelectorAll('[data-next-scenario-link]')].some(link=>!link.hidden));
      assert.match(await panel.textContent(), /No eligible experience checks/);
      assert.equal(await page.evaluate(()=>localStorage.getItem('qa-draws')),'3');
      await page.setViewportSize({width:390,height:844});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if (process.env.QA_SCREENSHOT_DIR) await page.locator('[data-adventure-controls]').screenshot({path:path.join(process.env.QA_SCREENSHOT_DIR,'completion-mobile.png')});
      assert.deepEqual(errors,[]);
      console.log('PASS integrated: no-check completion unlocks automatically with no dice, mobile fits, no JavaScript errors');
      return;
    }
    await page.waitForFunction(() => document.querySelector('[data-development-content]').textContent.includes('unavailable'));
    assert.equal(await panel.locator('button').count(), 0);
    console.log('PASS browser: missing upstream adapter fails closed');
    const state = { hp: 13, sanity: 95, luck: 55, cthulhuMythos: 0, skillChecks: ['spot-hidden','first-aid','stealth'], skillValues: { 'first-aid':88 }, developmentHistory: [], developmentSummaries: [], masteryClaimed: {}, developmentJournal: null };
    const scenario = { investigator_id:'arthur-bell', adventure_id:'qa-case-one', adventure_title:'QA Completed Case', status:'active', active_adventure:true, participated:true, checks_complete:true,
      checks:['spot-hidden','first-aid','stealth'].map(skill_id => ({ skill_id, adventure_id:'qa-case-one', earned:true, resolved:false })) };
    await page.evaluate(({state,scenario,key}) => {
      localStorage.setItem(key,JSON.stringify({schemaVersion:3,dataVersion:'2',state}));
      localStorage.setItem('qa-context', JSON.stringify(scenario));
      localStorage.setItem('qa-rolls', JSON.stringify([82,6,96,7,4,5,1]));
      localStorage.setItem('rippers-unlock-qa-preserve','yes');
      localStorage.setItem('qa-draws','0');
    }, {state,scenario,key});
    await page.reload();
    await page.waitForFunction(() => document.querySelector('[data-development-content]').textContent.includes('locked while'));
    assert.equal(await panel.locator('button').count(), 0);
    scenario.status='completed'; scenario.active_adventure=false;
    await page.evaluate(scenario => { localStorage.setItem('qa-context',JSON.stringify(scenario)); window.dispatchEvent(new Event('rippers:development-context-change')); },scenario);
    await page.waitForFunction(() => document.querySelector('[data-development-status]').textContent === 'AVAILABLE');
    if (process.env.QA_SCREENSHOT_DIR) { fs.mkdirSync(process.env.QA_SCREENSHOT_DIR,{recursive:true}); await panel.screenshot({path:path.join(process.env.QA_SCREENSHOT_DIR,'available.png')}); }
    const second = await context.newPage(); await second.goto(url);
    await second.waitForFunction(() => document.querySelector('[data-development-status]').textContent === 'AVAILABLE');
    // Both clicks are captured before either tab commits. A barrier holds the
    // shared write lock so both requests queue against the same displayed skill.
    await page.evaluate(() => { window.qaRelease = null; navigator.locks.request('rippers-character-write:arthur-bell', () => new Promise(resolve => { window.qaRelease=resolve; })); });
    await page.waitForFunction(() => Boolean(window.qaRelease));
    await Promise.all([page,second].map(tab => tab.evaluate(() => document.querySelector('[data-development] button').click())));
    await page.evaluate(() => window.qaRelease());
    await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).state.developmentHistory.length===1,key);
    await second.waitForFunction(() => document.querySelector('[data-development-status]').textContent === 'IN PROGRESS');
    assert.equal(await page.evaluate(() => localStorage.getItem('qa-draws')), '2');
    assert.equal(await page.locator('[data-current-skill="spot-hidden"]').textContent(),'76%');
    assert.equal(await page.locator('[data-current-thresholds="spot-hidden"]').textContent(),'Hard 38 · Extreme 15');
    assert.equal(await page.locator('[data-skill-check="spot-hidden"]').isChecked(),false);
    await second.close();
    console.log('PASS browser: simultaneous tabs produce one D100, one D10 and one history entry');
    await page.reload();
    await context.setOffline(true);
    await panel.getByRole('button',{name:'Make Development Roll'}).click();
    await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).state.developmentHistory.length===2,key);
    await context.setOffline(false);
    assert.match(await panel.textContent(), /5 points limited by maximum Sanity/);
    assert.equal(await page.locator('[data-state-input="sanity"]').inputValue(),'99');
    await panel.getByRole('button',{name:'Make Development Roll'}).click();
    await page.waitForFunction(() => document.querySelector('[data-development-status]').textContent==='COMPLETE');
    assert.equal(await panel.locator('button').count(),0);
    assert.equal(await page.evaluate(() => localStorage.getItem('qa-draws')), '7');
    const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).state,key);
    if (process.env.QA_SCREENSHOT_DIR) await panel.screenshot({path:path.join(process.env.QA_SCREENSHOT_DIR,'complete.png')});
    console.log('PASS browser: sequential results, failed roll, mastery, SAN cap and completion');
    await page.locator('[data-state-key="hp"][data-state-delta="-1"]').click();
    await page.waitForFunction(() => document.querySelector('[data-state-input="hp"]').value==='12');
    await page.locator('[data-reset-character-state]').click();
    await page.waitForFunction(() => document.querySelector('[data-state-input="hp"]').value==='13');
    const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).state,key);
    assert.deepEqual(after.developmentHistory,before.developmentHistory);
    assert.deepEqual(after.masteryClaimed,before.masteryClaimed);
    assert.equal(after.skillValues['first-aid'],95);
    // An old tracker backup cannot erase committed progression or resurrect checks.
    await page.locator('[data-state-settings-open]').click();
    await page.locator('[data-import-player-state]').setInputFiles({name:'legacy.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'rippers-player-state',version:2,character:'arthur-bell',characterState:{hp:11,sanity:60,luck:55,skillChecks:['spot-hidden']}}))});
    await page.waitForFunction(() => document.querySelector('[data-state-input="hp"]').value==='11');
    assert.equal(await page.locator('[data-skill-check="spot-hidden"]').isChecked(),false);
    assert.equal(await page.locator('[data-current-skill="spot-hidden"]').textContent(),'76%');
    console.log('PASS browser: ordinary tracker edits, reset and legacy import preserve progression');
    await page.evaluate(() => sessionStorage.setItem('qa-logged-out','true'));
    await page.locator('[data-lock-dossier]').click();
    await page.waitForFunction(() => document.querySelector('[data-protected-character]').hidden);
    assert.equal(await page.locator('[data-protected-character]').isVisible(),false);
    await page.evaluate(() => sessionStorage.removeItem('qa-logged-out'));
    await page.reload(); // QA unlock fixture simulates returning with issued credentials.
    await page.waitForFunction(() => document.querySelector('[data-development-status]').textContent==='COMPLETE');
    assert.equal(await page.evaluate(() => localStorage.getItem('qa-draws')), '7');
    await page.goto(url+'?reopen=1'); await page.goBack();
    assert.equal(await page.evaluate(() => localStorage.getItem('qa-draws')), '7');
    scenario.adventure_id='qa-case-two'; scenario.adventure_title='QA Next Case'; scenario.status='active'; scenario.active_adventure=true; scenario.checks=[];
    await page.evaluate(scenario => { localStorage.setItem('qa-context',JSON.stringify(scenario)); window.dispatchEvent(new Event('rippers:development-context-change')); },scenario);
    await page.waitForFunction(() => document.querySelector('[data-development-status]').textContent==='LOCKED');
    assert.equal(await panel.locator('button').count(),0);
    assert.equal(await page.locator('[data-development-history] details').count(),1);
    assert.equal(await page.evaluate(() => localStorage.getItem('rippers-unlock-qa-preserve')), 'yes');
    console.log('PASS browser: lock/return/back retain results, later active case archives history, release state unchanged');
    scenario.status='completed'; scenario.active_adventure=false;
    await page.evaluate(scenario => { localStorage.setItem('qa-context',JSON.stringify(scenario)); window.dispatchEvent(new Event('rippers:development-context-change')); },scenario);
    await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).state.developmentSummaries.length===2,key);
    assert.match(await panel.textContent(), /No eligible experience checks/);
    await page.setViewportSize({width:390,height:844});
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth<=window.innerWidth), 'mobile horizontal overflow');
    if (process.env.QA_SCREENSHOT_DIR) await panel.screenshot({path:path.join(process.env.QA_SCREENSHOT_DIR,'mobile.png')});
    assert.deepEqual(errors,[]);
    console.log('PASS browser: empty completion persisted, mobile layout fits, no JavaScript exceptions');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exit(1); });
