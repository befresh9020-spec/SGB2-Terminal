// ===== FALLDATEN =====
// Jeder neue Fall wird später einfach hier ergänzt

const cases = [
  {
    text: "Jasmin (32) lebt mit ihrem Partner Alex (35) seit 2 Jahren in einer Wohnung in Ulm. Jasmins Sohn Tom (6) wohnt auch dort. Jasmin und Alex sind nicht verheiratet. Beide können arbeiten. Alex ist nicht der Vater von Tom.",
    persons: [
      {
        name: "Jasmin",
        bg: true,
        reason: "Erwerbsfähige Leistungsberechtigte <br>§ 7 Abs. 3 Nr. 1 SGB II."
      },
      {
        name: "Alex",
        bg: true,
        reason: "Partner in einer Verantwortungs- und Einstehensgemeinschaft <br>§ 7 Abs. 3 Nr. 3c SGB II i.V.m. § 7 Abs. 3a SGB II"
      },
      {
        name: "Tom",
        bg: true,
        reason: "Unverheiratetes Kind eines eLb unter 25, das seinen Lebensunterhalt nicht selbst bestreiten kann <br>§ 7 Abs. 3 Nr. 4 SGB II"
      }
    ]
  },
	
	{
    text: "Max (26) lebt bei seinen Eltern in Ulm. Er ist unverheiratet und hat kein eigenes Einkommen. Max kann in Vollzeit arbeiten.",
    persons: [
      {
        name: "Max",
        bg: true,
        reason: "Erwerbsfähiger Leistungsberechtigter <br>§ 7 Abs. 3 Nr. 1 SGB II"
      },
      {
        name: "Mutter",
        bg: false,
        reason: "Elternteil eines Ü25-Leistungsberechtigten <br>§ 7 Abs. 3 Nr. 4 SGB II - Umkehrschluss"
      },
      {
        name: "Vater",
        bg: false,
        reason: "Elternteil eines Ü25-Leistungsberechtigten <br>§ 7 Abs. 3 Nr. 4 SGB II - Umkehrschluss"
      }
    ]
  },
	
	{
    text: "Rick wohnt mit seiner Ehefrau Sara und dem gemeinsamen Kind Nora (12) in einer Wohnung in Neu-Ulm. Rick arbeitet in Teilzeit als Lagerhelfer. Sara erhält eine volle Erwerbsminderungsrente, da sie nicht erwerbsfähig ist.",
    persons: [
      {
        name: "Rick",
        bg: true,
        reason: "Erwerbsfähiger Leistungsberechtigter <br>§ 7 Abs. 3 Nr. 1 SGB II"
      },
      {
        name: "Sara",
        bg: true,
        reason: "Partnerin des eLb <br>§ 7 Abs. 3 Nr. 3a SGB II"
      },
      {
        name: "Nora",
        bg: true,
        reason: "Gemeinsames Kind des eLb und der Partnerin unter 25, das seinen Lebensunterhalt nicht selbst bestreiten kann <br> § 7 Abs. 3 Nr. 4 SGB II"
      }
    ]
  },
	
	{
    text: "Mona (45) wohnt mit ihren Kindern Mia (16) und James (11) in einer Wohnung in Biberach. Mona ist nicht erwerbsfähig und bezieht eine Erwerbsminderungsrente. Die Kinder besuchen eine allgemeinbildende Schule.",
    persons: [
      {
        name: "Mona",
        bg: true,
        reason: "Kein erwerbsfähiger Leistungsberechtigter im Haushalt mit einem erwerbsfähigen Kind <br>§ 7 Abs. 3 Nr. 2 SGB II"
      },
      {
        name: "Mia",
        bg: true,
        reason: "Erwerbsfähige Leistungsberechtigte <br>§ 7 Abs. 3 Nr. 1 SGB II"
      },
      {
        name: "James",
        bg: true,
        reason: "Kind von Mona <br> § 7 Abs. 3 Nr. 4 SGB II"
      }
    ]
  },
	
	{
    text: "Pierre (40) wohnt mit seinen Kindern Yves (10) und Jacques (14) in einer Wohnung in Konstanz. Pierre ist nicht erwerbsfähig und bezieht eine Erwerbsminderungsrente. Die Kinder besuchen eine allgemeinbildende Schule.",
    persons: [
      {
        name: "Pierre",
        bg: false,
        reason: "Kein erwerbsfähiger Leistungsberechtigter <br>§ 7 Abs. 3 Nr. 1 SGB II"
      },
      {
        name: "Yves",
        bg: false,
        reason: "Kein erwerbsfähiger Leistungsberechtigter & kein Kind eines eLb <br>§ 7 Abs. 3 Nr. 1 SGB II & § 7 Abs. 3 Nr. 4 SGB II"
      },
      {
        name: "Jacques",
        bg: false,
        reason: "Kein erwerbsfähiger Leistungsberechtigter & kein Kind eines eLb <br>§ 7 Abs. 3 Nr. 1 SGB II & § 7 Abs. 3 Nr. 4 SGB II"
      }
    ]
  },
	
];

let selectedPersons = [];
let currentIndex = 0;
let currentCase = cases[currentIndex];

// ===== DOM-ELEMENTE =====

const caseTextEl = document.getElementById("case-text");
const personsEl = document.getElementById("persons");
const feedbackEl = document.getElementById("feedback");
const checkBtn = document.getElementById("check-btn");
const restartBtn = document.getElementById("restart-btn");

// ===== FALL LADEN =====

function loadCase() {
  caseTextEl.textContent = currentCase.text;
  personsEl.innerHTML = "";
  feedbackEl.innerHTML = "";
  selectedPersons = [];

  currentCase.persons.forEach((person, index) => {
    const div = document.createElement("div");
    div.classList.add("person");
    div.textContent = person.name;

    div.addEventListener("click", () => {
      div.classList.toggle("selected");

      if (selectedPersons.includes(index)) {
        selectedPersons = selectedPersons.filter(i => i !== index);
      } else {
        selectedPersons.push(index);
      }
    });

    personsEl.appendChild(div);
  });
}

// ===== ANTWORT PRÜFEN =====

function highlightNorms(text) {
  const normRegex =
    /§\s*\d+[a-zA-Z]*\s*(Abs\.?\s*\d+[a-zA-Z]*)?\s*(Nr\.?\s*\d+[a-zA-Z]*)?\s*(Satz\s*\d+)?\s*SGB\s*[IVX]+/g;

  return text.replace(normRegex, match => {
    return `<span class="norm">${match}</span>`;
  });
}

checkBtn.addEventListener("click", () => {
  feedbackEl.innerHTML = "";
  let allCorrect = true;

  currentCase.persons.forEach((person, index) => {
    const userSelected = selectedPersons.includes(index);
    const personDiv = personsEl.children[index];

    const result = document.createElement("div");
result.classList.add("feedback-item");

if (userSelected === person.bg) {
  result.classList.add("feedback-correct");
  result.innerHTML = `
    <strong>${person.name}: richtig</strong>
    ${highlightNorms(person.reason)}
  `;
} else {
  result.classList.add("feedback-wrong");
  result.innerHTML = `
    <strong>${person.name}: falsch</strong>
    ${highlightNorms(person.reason)}
  `;
  allCorrect = false;
}

    feedbackEl.appendChild(result);
  });
});

function nextCase() {
  if (currentIndex < cases.length - 1) {
    currentIndex++;
    currentCase = cases[currentIndex];
    loadCase();
  } else {
    showEndScreen();
  }

function showEndScreen() {
  caseTextEl.innerHTML = "<h2>Training abgeschlossen</h2>";
  personsEl.innerHTML = "";
  feedbackEl.innerHTML = "Alle Fälle wurden bearbeitet.";
  restartBtn.style.display = "block";
}

restartBtn.addEventListener("click", () => {
  currentIndex = 0;
  currentCase = cases[currentIndex];
  restartBtn.style.display = "none";
  loadCase();
});

}

// ===== START =====

loadCase();

// ===== DIGITALER BACKGROUND =====
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const symbols = "01<>[]{}#@$%&";
const particles = [];

for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    speed: 0.3 + Math.random() * 1.2,
    size: 12 + Math.random() * 10,
    char: symbols[Math.floor(Math.random() * symbols.length)]
  });
}

function animateBG() {
  ctx.fillStyle = "rgba(2, 6, 23, 0.25)";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "14px monospace";

  particles.forEach(p => {
    ctx.fillText(p.char, p.x, p.y);
    p.y += p.speed;

    if (p.y > h) {
      p.y = -20;
      p.x = Math.random() * w;
    }
  });

  requestAnimationFrame(animateBG);
}

animateBG();

function setTheme(theme){
  document.body.classList.remove("theme-blue","theme-amber","theme-green");
  document.body.classList.add("theme-" + theme);
}