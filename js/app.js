/* SK BF International–CAA portal
   Data is intentionally separated from the UI so verified records can be swapped in later. */

const $ = id => document.getElementById(id);
const peso = n => new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(n);
const pct = (a,b) => b ? Math.round(a/b*1000)/10 : 0;
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store = {
  get(k,d){try{return JSON.parse(localStorage.getItem(k)) ?? d}catch{return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
};
const pill = s => `<span class="status-pill ${s==='Completed'?'status-complete':s==='Pending'?'status-pending':s==='Upcoming'?'status-upcoming':'status-ongoing'}">${esc(s)}</span>`;

/* Budget data retained from the original uploaded prototype. */
const budgetData = {
  2026:{annual:1250000,programs:[
    ["Youth Development & Education",400000,300000,250000],
    ["Sports & Recreation",300000,220000,190000],
    ["Health & Wellness",180000,100000,75000],
    ["Livelihood & Skills",120000,60000,52500],
    ["Administration / Operations",80000,80000,75000]
  ]},
  2025:{annual:1100000,programs:[
    ["Youth Development & Education",350000,335000,322500],
    ["Sports & Recreation",260000,215000,210000],
    ["Health & Wellness",160000,125000,120000],
    ["Livelihood & Skills",100000,85000,83750],
    ["Administration / Operations",75000,70000,65000]
  ]}
};

/* Source-based 2026 records transcribed from the images supplied in this chat.
   These are displayed separately because the supplied pages do not establish a complete annual total. */
const sourceBudgetRecords = [
  ["Summer Sports League", "Sports Development", 2623320, "Provided budget image"],
  ["Other Maintenance and Operating Expenses", "Operations", 2513320, "Provided budget image"],
  ["Sports Uniforms", "Sports Development", 1713220, "Provided budget image"],
  ["Provision of Educational Assistance / Donations", "Education", 773500, "Provided budget image"],
  ["Brigada Eskwela Project", "Education / Community", 207350, "Provided budget image"],
  ["Information and Communication Technology Equipment", "Capability Building / ICT", 500000, "Provided budget image"],
  ["Office / General Equipment Procurement Items", "Administration", 547594.69, "Sum of listed line items in provided image; not an annual total"]
];

const procurementRecords = [
  ["Sublimation Jersey – Basketball 15–18",384,"sets",466560,"Competitive bidding / shopping"],
  ["Sublimation Jersey – Basketball 19–22",384,"sets",466560,"Competitive bidding / shopping"],
  ["Sublimation Jersey – Basketball 23–30",384,"sets",466560,"Competitive bidding / shopping"],
  ["Sublimation Jersey – Volleyball Mix Men’s/Women’s",100,"sets",121500,"Competitive bidding / shopping"],
  ["Sublimation Jersey – Chess Tournament",16,"sets",19440,"Competitive bidding / shopping"],
  ["Sublimation Jersey – Badminton Tournament",16,"sets",19440,"Competitive bidding / shopping"],
  ["T-Shirt with print and logo",100,"pcs",85000,"Competitive bidding / shopping"],
  ["Full Sublimation Warmer with Hood",48,"pcs",68160,"Competitive bidding / shopping"],
  ["Cash Incentives (₱1,000 per youth)",773,"youth",773500,"Provided budget record"],
  ["Desktop Computer",5,"units",500000,"Competitive bidding"],
  ["Stickbroom with Handle",60,"pcs",18000,"Provided budget record"],
  ["Softbroom",15,"pcs",8400,"Provided budget record"],
  ["Dustpan, Big",60,"pcs",18000,"Provided budget record"],
  ["Big Mop",15,"pcs",33750,"Provided budget record"],
  ["170 g Disinfectant",30,"pcs",9600,"Provided budget record"],
  ["Legal 8 1/2 x 13” sub 20 GSM coupon bond",50,"reams",21500,"Provided budget record"],
  ["Foldable table – Brigada Eskwela",9,"pcs",76500,"Provided budget record"],
  ["SK Recycle Bin",3,"pcs",21600,"Provided budget record"]
];

/* Projects shown in the prototype. The Summer League item is based on the supplied 2026 poster.
   Other entries are carried from the original uploaded system and remain marked as prototype data. */
const projects = [
  {name:"SK Summer League 2026",cat:"Sports",office:"SK BF International–CAA",budget:300000,status:"Ongoing",icon:"bi-dribbble",t:6,a:4,u:"league activities",docs:["Summer League 2026 poster","Activity design (prototype)","Accomplishment report (prototype)"],photos:1,desc:"Youth sports activity highlighted in the supplied SK Summer League 2026 poster.",featured:true},
  {name:"Sports Uniforms Procurement 2026",cat:"Sports",office:"SK BF International–CAA",budget:1713220,status:"Procurement",icon:"bi-person-standing",t:8,a:8,u:"listed uniform packages",docs:["Sports uniforms budget image (provided)","Procurement / bidding note (provided image)"],photos:1,desc:"Source-based procurement record for basketball, volleyball, chess, badminton, shirts, and warmers shown in the supplied budget image."},
  {name:"Educational Assistance – Cash Incentives",cat:"Education",office:"SK BF International–CAA",budget:773500,status:"Planned / Recorded",icon:"bi-mortarboard",t:773,a:773,u:"youth beneficiaries",docs:["Educational assistance budget image (provided)"],photos:1,desc:"The supplied record shows cash incentives of ₱1,000 per youth for 773 youth, totaling ₱773,500."},
  {name:"Brigada Eskwela Project",cat:"Education",office:"SK BF International–CAA",budget:207350,status:"Recorded",icon:"bi-building-check",t:8,a:8,u:"listed supply items",docs:["Brigada Eskwela budget image (provided)"],photos:1,desc:"Source-based Brigada Eskwela line items shown in the supplied budget record."},
  {name:"ICT Equipment – Desktop Computers",cat:"Capability Building",office:"SK BF International–CAA",budget:500000,status:"Procurement",icon:"bi-pc-display",t:5,a:5,u:"desktop computers",docs:["ICT equipment budget image (provided)"],photos:1,desc:"The supplied record lists five desktop computers with an estimated budget of ₱500,000."},
  {name:"Educational Financial Assistance",cat:"Education",office:"SK Committee on Education",budget:400000,status:"Ongoing",icon:"bi-mortarboard",t:120,a:74,u:"student beneficiaries",docs:["Approved project proposal (prototype)","Beneficiary masterlist (prototype)","Payout acknowledgment (prototype)"],photos:2,desc:"Prototype education-support project carried over from the original portal."},
  {name:"Youth Sports Program",cat:"Sports",office:"SK Committee on Sports",budget:300000,status:"Ongoing",icon:"bi-trophy",t:6,a:4,u:"events held",docs:["Activity design (prototype)","Equipment inventory (prototype)","Accomplishment report (prototype)"],photos:3,desc:"Prototype sports program carried over from the original portal."},
  {name:"Free Printing Service",cat:"Education",office:"SK Committee on Education",budget:80000,status:"Completed",icon:"bi-printer",t:2000,a:2350,u:"pages printed",docs:["Supply purchase requests (prototype)","Service logbook summary (prototype)"],photos:1,desc:"Prototype free-printing project carried over from the original portal."},
  {name:"Youth Skills Workshop",cat:"Livelihood",office:"SK Committee on Livelihood",budget:120000,status:"Pending",icon:"bi-lightbulb",t:60,a:0,u:"participants trained",docs:["Approved training design (prototype)"],photos:0,desc:"Prototype skills-training activity carried over from the original portal."},
  {name:"Community Wellness Drive",cat:"Health",office:"SK Committee on Health",budget:180000,status:"Ongoing",icon:"bi-heart-pulse",t:4,a:2,u:"wellness activities",docs:["Activity design (prototype)","Attendance sheets (prototype)","Accomplishment report (prototype)"],photos:2,desc:"Prototype wellness activity carried over from the original portal."},
  {name:"Youth Consultation Forum",cat:"Governance",office:"SK Chairperson's Office",budget:45000,status:"Completed",icon:"bi-people",t:1,a:1,u:"forum held",docs:["Minutes of forum (prototype)","Attendance sheet (prototype)"],photos:2,desc:"Prototype youth-consultation activity carried over from the original portal."}
];

const documents = [
  ["Approved Annual Budget 2026","Annual financial plan and approved allocations.","bi-file-earmark-spreadsheet","Budget","Jan 2026"],
  ["Annual Barangay Youth Investment Program (ABYIP)","Programs, projects, and activities for the year.","bi-journal-text","Budget","Jan 2026"],
  ["Comprehensive Barangay Youth Development Plan (CBYDP)","Multi-year youth development plan.","bi-diagram-3","Budget","2023"],
  ["Quarterly Financial Report","Receipts, disbursements, and balances per quarter.","bi-receipt-cutoff","Financial Reports","Q2 2026"],
  ["Statement of Cash Receipts & Disbursements","Cash flow summary for the period.","bi-cash-coin","Financial Reports","Jun 2026"],
  ["Resolution: Approval of Annual Budget","SK resolution approving the annual budget.","bi-patch-check","Resolutions","Dec 2025"],
  ["Resolution: Approval of ABYIP","SK resolution approving the ABYIP.","bi-patch-check","Resolutions","Dec 2025"],
  ["Accomplishment Report, 1st Half 2026","Targets and results per project.","bi-clipboard2-check","Accomplishments","Jul 2026"],
  ["Purchase Requests, Monthly","Itemized purchase request records.","bi-cart-check","Procurement","Monthly"],
  ["Abstract of Quotations","Price comparisons for purchases.","bi-table","Procurement","2026"]
];
const docCats=["All","Budget","Financial Reports","Resolutions","Accomplishments","Procurement"];

/* Names transcribed from the supplied Summer League poster. */
const officials = [
  ["SK Secretary","Jerome Cobilo","SK Council / Secretariat"],
  ["SK Kagawad","Lester Javier","SK Council"],
  ["SK Kagawad","Mira Millicent Que","SK Council"],
  ["SK Kagawad","Shene Caraig","SK Council"],
  ["SK Kagawad","Shiela Borja","SK Council"],
  ["SK Chairwoman","Princess Nicole Olger","SK Chairperson"],
  ["SK Kagawad","Marinela Adlan","SK Council"],
  ["SK Kagawad","Angelica Obuyes","SK Council"],
  ["SK Kagawad","Leojames Gonzales","SK Council"],
  ["SK Treasurer","Juvelyn Labrador","Treasury"],
  ["SK Assistant Secretary","John Mark Corpuz","Secretariat"],
  ["Barangay Captain","Asuncion C. Aguilar","Barangay BF International–CAA"],
  ["Barangay Kagawad","Darwin Appari","Barangay Council"],
  ["Barangay Official","Joel Crystal","Barangay Council"],
  ["Barangay Official","Jun Bernales","Barangay Council"]
];

const auditSeed=[
  ["2026-07-15","Published","Accomplishment Report, 1st Half 2026","SK Secretary (prototype)"],
  ["2026-06-25","Updated","PR-2026-004 status set to Pending","SK Treasurer (prototype)"],
  ["2026-05-12","Published","PR-2026-003 documents","SK Secretary (prototype)"],
  ["2026-04-20","Published","PR-2026-002 documents","SK Secretary (prototype)"],
  ["2026-01-15","Published","Approved Annual Budget 2026","SK Secretary (prototype)"]
];

function toast(msg){$('toastMessage').textContent=msg;bootstrap.Toast.getOrCreateInstance($('liveToast')).show()}
function log(action,record){const l=store.get('skLog',[]);l.push([new Date().toISOString().slice(0,10),action,record,'Public user']);store.set('skLog',l);renderAudit()}
function options(sel,first,values){sel.innerHTML=`<option value="">${first}</option>`+values.map(v=>`<option>${esc(v)}</option>`).join('')}
const hit=(text,q)=>text.toLowerCase().includes(q.toLowerCase());

function renderHero(year){
  const d=budgetData[year], disb=d.programs.reduce((s,p)=>s+p[3],0);
  const stats=[
    ["bi-wallet2",peso(d.annual),"Annual budget "+year],
    ["bi-kanban",projects.length,"Projects"],
    ["bi-people",officials.length,"SK officials"],
    ["bi-folder2-open",documents.length,"Public records"]
  ];
  $('heroStats').innerHTML=stats.map(s=>`<div class="col-6"><div class="mini-stat"><i class="bi ${s[0]}"></i><strong>${s[1]}</strong><span>${s[2]}</span></div></div>`).join('');
}

function renderBudget(year){
  const d=budgetData[year],P=d.programs,sum=i=>P.reduce((s,p)=>s+p[i],0),alloc=sum(1),obl=sum(2),disb=sum(3);
  const cards=[
    ["Annual budget",peso(d.annual),"Approved appropriation","bi-wallet2"],
    ["Allocated",peso(alloc),pct(alloc,d.annual)+"% of budget","bi-pie-chart"],
    ["Obligations",peso(obl),pct(obl,alloc)+"% of allocated","bi-journal-check"],
    ["Disbursements",peso(disb),pct(disb,alloc)+"% of allocated","bi-cash-stack"],
    ["Remaining",peso(d.annual-disb),"Annual budget minus disbursed","bi-safe2"]
  ];
  $('budgetCards').innerHTML=cards.map(c=>`<div class="col"><div class="stat-card"><div class="stat-icon"><i class="bi ${c[3]}"></i></div><div class="stat-label">${c[0]}</div><div class="stat-value">${c[1]}</div><div class="stat-foot">${c[2]}</div></div></div>`).join('');
  $('budgetTable').innerHTML=P.map(p=>{const u=pct(p[3],p[1]);return `<tr><td><strong>${esc(p[0])}</strong></td><td>${peso(p[1])}</td><td>${peso(p[2])}</td><td>${peso(p[3])}</td><td>${peso(p[1]-p[3])}</td><td style="min-width:150px"><div class="small mb-1">${u}%</div><div class="progress" style="height:7px"><div class="progress-bar bg-success" style="width:${u}%"></div></div></td></tr>`}).join('');
  renderHero(year);
}

function renderSourceBudget(){
  const body=$('sourceBudgetTable');
  if(!body) return;
  body.innerHTML=sourceBudgetRecords.map(r=>`<tr><td><strong>${esc(r[0])}</strong></td><td>${esc(r[1])}</td><td>${peso(r[2])}</td><td><span class="source-badge">${esc(r[3])}</span></td></tr>`).join('');
  const pbody=$('procurementTable');
  if(pbody) pbody.innerHTML=procurementRecords.map(r=>`<tr><td>${esc(r[0])}</td><td>${r[1].toLocaleString('en-PH')}</td><td>${esc(r[2])}</td><td>${peso(r[3])}</td><td><span class="source-badge">${esc(r[4])}</span></td></tr>`).join('');
}

function renderSourceMedia(){
  const media=[
    ['summer-league-officials-poster.png','SK Summer League 2026 poster','Officials + Summer League coordination reference'],
    ['source-sports-uniforms.png','Sports uniforms budget','Sports uniform quantities and estimated budgets'],
    ['source-office-procurement.png','Office and equipment procurement','Office, signage, furniture, and equipment line items'],
    ['source-education-assistance.png','Educational assistance','Cash incentive record: 773 youth / ₱773,500'],
    ['source-brigada-eskwela.png','Brigada Eskwela','Cleaning and school-support supplies'],
    ['source-ict-equipment.png','ICT equipment','Five desktop computers / ₱500,000'],
    ['source-budget-allotment.jpg','Budget allotment presentation','Category allocation reference shown on the supplied presentation'],
    ['source-audit-statement.png','Audit statement','Commission on Audit document supplied as a reference']
  ];
  const grid=$('sourceMediaGrid');
  if(grid) grid.innerHTML=media.map(m=>`<div class="col-md-6 col-xl-3"><div class="source-media-card"><a href="assets/${m[0]}" target="_blank" rel="noopener"><img src="assets/${m[0]}" alt="${esc(m[1])}"></a><div class="p-3"><span class="section-kicker">SOURCE IMAGE</span><h6>${esc(m[1])}</h6><p>${esc(m[2])}</p><a class="btn btn-sm btn-outline-dark rounded-pill" href="assets/${m[0]}" target="_blank" rel="noopener"><i class="bi bi-arrows-fullscreen me-1"></i>Open</a></div></div></div>`).join('');
}

function renderProjects(){
  const q=$('projectSearch').value,c=$('projectCat').value,s=$('projectStatus').value;
  const list=projects.map((p,i)=>({p,i})).filter(({p})=>hit(`${p.name} ${p.cat} ${p.office}`,q)&&(!c||p.cat===c)&&(!s||p.status===s));
  $('projectCount').textContent=`${list.length} project${list.length===1?'':'s'} shown`;
  $('projectGrid').innerHTML=list.map(({p,i})=>`<div class="col-md-6 col-xl-4"><div class="project-card" tabindex="0" role="button" onclick="openProject(${i})" onkeydown="if(event.key==='Enter')openProject(${i})">
    <div class="d-flex justify-content-between align-items-start"><div class="project-icon"><i class="bi ${p.icon}"></i></div>${pill(p.status)}</div>
    <h5>${esc(p.name)}</h5><p class="text-muted small mb-3">${esc(p.desc)}</p>
    <div class="small mb-1">${p.a} of ${p.t} ${esc(p.u)}</div>
    <div class="progress" style="height:7px"><div class="progress-bar bg-success" style="width:${Math.min(100,pct(p.a,p.t))}%"></div></div>
    <div class="project-meta"><span><i class="bi bi-tag me-1"></i>${esc(p.cat)}</span><strong>${peso(p.budget)}</strong></div>
  </div></div>`).join('')||`<div class="col-12"><div class="alert alert-light border">No project matches these filters.</div></div>`;
}

function openProject(i){
  const p=projects[i],r=pct(p.a,p.t);
  $('pmCat').textContent=p.cat+' • '+p.status;
  $('pmTitle').textContent=p.name;
  $('pmBody').innerHTML=`
    <div class="row g-3 mb-3">
      <div class="col-sm-4"><small class="text-muted d-block">Implementing office</small><strong>${esc(p.office)}</strong></div>
      <div class="col-sm-4"><small class="text-muted d-block">Budget</small><strong>${peso(p.budget)}</strong></div>
      <div class="col-sm-4"><small class="text-muted d-block">Status</small>${pill(p.status)}</div>
    </div>
    <div class="p-3 rounded-4 bg-light mb-4"><strong>About this project</strong><p class="mb-0 mt-1 text-muted">${esc(p.desc)}</p></div>
    <h6>Target vs. actual</h6>
    <div class="d-flex justify-content-between small mb-1"><span>${p.a} actual</span><span>${p.t} target ${esc(p.u)}</span></div>
    <div class="progress mb-1" style="height:10px"><div class="progress-bar bg-success" style="width:${Math.min(100,r)}%"></div></div>
    <small class="text-muted">${r}% of target</small>
    <h6 class="mt-4">Supporting information</h6>
    <ul class="list-unstyled">${p.docs.map(d=>`<li class="d-flex justify-content-between align-items-center py-2 border-bottom"><span><i class="bi bi-file-earmark-text me-2 text-success"></i>${esc(d)}</span><button class="btn btn-sm btn-outline-dark rounded-pill" onclick="viewDoc('${esc(d).replace(/'/g,'')}')">View</button></li>`).join('')}</ul>
    <h6 class="mt-4">Photos / media</h6>
    <div class="row g-2">${p.photos?Array.from({length:p.photos},(_,k)=>`<div class="col-4"><div class="photo-ph"><i class="bi bi-image"></i><br>Photo ${k+1}<br><small>placeholder</small></div></div>`).join(''):'<div class="col-12 text-muted small">No photos uploaded yet.</div>'}</div>`;
  bootstrap.Modal.getOrCreateInstance($('projectModal')).show();
}
function viewDoc(name){log('Document viewed',name);toast('Demo only: connect official document storage to open this file.')}
let docCat='All';
function renderDocs(){
  $('docChips').innerHTML=docCats.map(c=>`<button class="chip btn ${c===docCat?'active':''}" onclick="docCat='${c}';renderDocs()">${c}</button>`).join('');
  $('documentGrid').innerHTML=documents.filter(d=>docCat==='All'||d[3]===docCat).map(d=>`<div class="col-md-6 col-xl-4"><div class="project-card d-flex gap-3" style="cursor:default"><div class="project-icon flex-shrink-0"><i class="bi ${d[2]}"></i></div><div><span class="small text-success fw-bold">${d[3]}</span><h5 class="mb-1 mt-1" style="font-size:1rem">${esc(d[0])}</h5><p class="small text-muted mb-1">${esc(d[1])}</p><p class="small text-muted mb-3">${esc(d[4])}</p><button class="btn btn-sm btn-outline-dark rounded-pill" onclick="viewDoc('${esc(d[0]).replace(/'/g,'')}')"><i class="bi bi-eye me-1"></i>View</button></div></div></div>`).join('');
}
function renderOfficials(){
  $('officialGrid').innerHTML=officials.map(o=>`<div class="col-md-6 col-xl-4"><div class="project-card d-flex gap-3 align-items-center" style="cursor:default"><div class="official-avatar"><i class="bi bi-person"></i></div><div><div class="official-role">${esc(o[0])}</div><div class="official-name">${esc(o[1])}</div><div class="official-note">${esc(o[2])}</div></div></div></div>`).join('');
}
function renderAudit(){
  const rows=[...store.get('skLog',[]),...auditSeed].sort((a,b)=>b[0].localeCompare(a[0]));
  $('auditTable').innerHTML=rows.map(r=>`<tr><td class="text-nowrap">${r[0]}</td><td><span class="badge text-bg-light me-1">${esc(r[1])}</span></td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('');
}
function bindForm(formId,modalId,prefix,key,label){
  $(formId).addEventListener('submit',e=>{
    e.preventDefault();
    const list=store.get(key,[]),ref=`${prefix}-${new Date().getFullYear()}-${String(list.length+1).padStart(4,'0')}`;
    list.push({ref,date:new Date().toISOString(),status:'Received',...Object.fromEntries(new FormData(e.target))});
    store.set(key,list);log(`${label} received`,ref);
    bootstrap.Modal.getInstance($(modalId)).hide();e.target.reset();toast(`${label} sent. Reference: ${ref}.`);
  });
}
function setTheme(dark){document.body.classList.toggle('dark',dark);$('themeBtn').innerHTML=`<i class="bi ${dark?'bi-sun':'bi-moon-stars'}"></i>`;store.set('skTheme',dark?'dark':'light')}
$('themeBtn').addEventListener('click',()=>setTheme(!document.body.classList.contains('dark')));
if(store.get('skTheme')==='dark')setTheme(true);

$('yearFilter').addEventListener('change',e=>renderBudget(e.target.value));
['projectSearch','projectCat','projectStatus'].forEach(id=>$(id).addEventListener('input',renderProjects));
bindForm('requestForm','requestModal','RFI','skRequests','Request');
bindForm('reportForm','reportModal','CON','skConcerns','Concern');
bindForm('feedbackForm','feedbackModal','FBK','skFeedback','Feedback');

options($('projectCat'),'All categories',[...new Set(projects.map(p=>p.cat))]);
renderBudget('2026');renderSourceBudget();renderProjects();renderDocs();renderOfficials();renderSourceMedia();renderAudit();
