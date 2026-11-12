// Supply the private release-code JSON via A2_QA_CODES; never commit that file.
const fs=require('node:fs'), path=require('node:path'), http=require('node:http'), assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const codes=JSON.parse(fs.readFileSync(process.env.A2_QA_CODES,'utf8'));
 const server=http.createServer((req,res)=>{
  if(req.url==='/'){res.setHeader('Content-Type','text/html');return res.end('<script src="/assets/scenario-art.js"></script><link rel="stylesheet" href="/assets/scenario-art.css"><div data-scenario-art data-art-base="/assets/scenario-two/"></div><script>RippersScenarioArt.mount(document.querySelector("[data-scenario-art]"))</script>');}
  const file=path.join(root,req.url);if(!file.startsWith(root+'/')||!fs.existsSync(file)){res.statusCode=404;return res.end();}
  res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':'application/octet-stream');res.end(fs.readFileSync(file));
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:process.env.QA_CHROMIUM_PATH,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  assert.equal(await page.locator('article').count(),10);assert.equal(requests.filter(x=>/record-/.test(x)).length,0);
  for(const c of codes)assert.equal((await page.locator('body').textContent()).includes(c.title),false);
  const first=page.locator('article').first();await first.locator('input').fill('incorrect');await first.locator('button').click();await first.getByRole('status').filter({hasText:'Unable'}).waitFor();assert.equal(await first.locator('img').count(),0);
  for(const c of codes){const card=page.locator(`[data-art-record="${String(c.record).padStart(2,'0')}"]`);await card.locator('input').fill(c.password.toLowerCase());await card.locator('button').click();await card.locator('img').waitFor();assert.equal(await card.locator('h4').textContent(),c.title);assert(await card.locator('img').evaluate(i=>i.complete&&i.naturalWidth>0));}
  await page.reload();await page.waitForFunction(()=>document.querySelectorAll('article img').length===10);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
  console.log('PASS: ten sealed records, no preload/title leaks, wrong password rejection, all ten decrypt/render, case normalization, reload persistence, mobile fit, no JS errors.');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})();
