/* ---------- datos ---------- */
const subjects = {
  matematica: { name:"Matemática", icon:"📐", grade:6.7, evaluations:[
    {name:"Prueba 1", grade:6.5},
    {name:"Tarea 1", grade:7.0},
    {name:"Prueba 2", grade:6.3},
    {name:"Trabajo", grade:7.0},
  ]},
  lenguaje: { name:"Lenguaje", icon:"📖", grade:6.4, evaluations:[
    {name:"Prueba 1", grade:6.0},
    {name:"Ensayo", grade:6.8},
    {name:"Prueba 2", grade:6.2},
    {name:"Disertación", grade:6.6},
  ]},
  historia: { name:"Historia", icon:"🏛️", grade:6.2, evaluations:[
    {name:"Prueba 1", grade:5.8},
    {name:"Trabajo grupal", grade:6.5},
    {name:"Prueba 2", grade:6.1},
    {name:"Guía", grade:6.4},
  ]},
  ciencias: { name:"Ciencias", icon:"🔬", grade:6.6, evaluations:[
    {name:"Laboratorio 1", grade:6.7},
    {name:"Prueba 1", grade:6.4},
    {name:"Informe", grade:6.9},
    {name:"Prueba 2", grade:6.4},
  ]},
  ingles: { name:"Inglés", icon:"🇬🇧", grade:6.5, evaluations:[
    {name:"Listening", grade:6.6},
    {name:"Prueba 1", grade:6.3},
    {name:"Speaking", grade:6.8},
    {name:"Prueba 2", grade:6.3},
  ]},
};
const promedioGeneral = (
  Object.values(subjects).reduce((s,x)=>s+x.grade,0) / Object.keys(subjects).length
).toFixed(1);

/* ---------- navegación ---------- */
let stack = ["home"]; // pila de pantallas
let currentSubject = null;

const screensEl = document.getElementById("screens");

function go(screen, opts={}){
  if(opts.subject) currentSubject = opts.subject;
  stack.push(screen);
  render("forward");
}
function goBack(){
  if(stack.length > 1){
    stack.pop();
    render("back");
  }
}

function backButton(){
  return `<button class="back-btn" onclick="goBack()" aria-label="Volver">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  </button>`;
}

function screenHome(){
  const cards = Object.entries(subjects).filter(([key])=>key!=="ingles").map(([key,s])=>`
    <button class="subject-card" onclick="go('detail',{subject:'${key}'})">
      <span class="name">${s.name}</span>
      <span class="icon">${s.icon}</span>
    </button>
  `).join("");
  return `
    <header class="topbar">
      <h1 class="title">Classroom <span class="title-icon">🧑‍🎓📚</span></h1>
    </header>
    <main>
      <button class="panel button" style="margin-bottom:22px;" onclick="go('notas')">
        Mis asignaturas
        <span class="chev">›</span>
      </button>
      <p class="section-label">Asignaturas</p>
      <div class="grid2">${cards}</div>
    </main>
    <footer>
      <button class="cta" onclick="go('notas')">Mis Notas 📊</button>
    </footer>
  `;
}

function screenNotas(){
  const rows = Object.entries(subjects).map(([key,s])=>`
    <button class="row-card" onclick="go('detail',{subject:'${key}'})">
      <span class="subject">${s.name.toUpperCase()}</span>
      <span class="grade">${s.grade.toFixed(1).replace('.',',')}</span>
    </button>
  `).join("");
  return `
    <header class="topbar">
      ${backButton()}
      <h1 class="title">Mis notas</h1>
    </header>
    <main>
      <div class="panel">
        <div class="label">PROMEDIO GENERAL</div>
        <div class="value">${promedioGeneral.replace('.',',')}</div>
      </div>
      <p class="section-label">Mis asignaturas</p>
      ${rows}
    </main>
  `;
}

function screenDetail(){
  const s = subjects[currentSubject];
  const evalRows = s.evaluations.map(e=>`
    <div class="eval-row">
      <span>${e.name}</span>
      <span class="grade">${e.grade.toFixed(1).replace('.',',')}</span>
    </div>
  `).join("");
  return `
    <header class="topbar">
      ${backButton()}
      <h1 class="title">${s.name} <span class="title-icon">${s.icon}</span></h1>
    </header>
    <main>
      <div class="panel">
        <div class="label">PROMEDIO</div>
        <div class="value">${s.grade.toFixed(1).replace('.',',')}</div>
      </div>
      <p class="section-label">Evaluaciones</p>
      <div class="eval-table">
        <div class="eval-head"><span>Evaluación</span><span>Nota</span></div>
        ${evalRows}
      </div>
    </main>
    <footer>
      <div class="final">
        <span>Promedio final</span>
        <span>${s.grade.toFixed(1).replace('.',',')}</span>
      </div>
    </footer>
  `;
}

const renderers = { home:screenHome, notas:screenNotas, detail:screenDetail };

function render(dir="forward"){
  screensEl.innerHTML = "";
  stack.forEach((name, i)=>{
    const isActive = i === stack.length - 1;
    const div = document.createElement("div");
    div.className = "screen";
    div.setAttribute("data-active", isActive ? "true":"false");
    div.setAttribute("data-dir", dir);
    div.innerHTML = renderers[name]();
    screensEl.appendChild(div);
  });
}

render();
