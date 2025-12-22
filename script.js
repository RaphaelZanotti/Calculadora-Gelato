import { ingredientes } from "./data/ingredientes.js";

/*
  METAS TÉCNICAS – PROPORÇÕES
*/
const METAS = {
  solidos: 0.40,
  gordura: 0.10,
  proteina: 0.06,

  // valores de referência (ajustáveis depois)
  pod: 170,
  pac: 260,

  // limites estruturais
  acucarMax: 0.22,      // 22%
  dextroseMax: 0.08,    // 8%
  glicoseMax: 0.06      // 6%
};

document
  .getElementById("btnCalcular")
  .addEventListener("click", calcular);

function calcular() {

  const saborKey = document.getElementById("sabor").value;
  const qtdSabor = Number(document.getElementById("qtdSabor").value);

  if (!qtdSabor || qtdSabor <= 0) {
    alert("Informe a quantidade do saborizante");
    return;
  }

  const sabor = ingredientes[saborKey];

  // =========================
  // BASE INICIAL
  // =========================
  let r = {
    peso: qtdSabor,
    solidos: qtdSabor * sabor.solidos,
    gordura: qtdSabor * sabor.gordura,
    proteina: qtdSabor * sabor.proteina,
    pod: qtdSabor * sabor.pod,
    pac: qtdSabor * sabor.pac
  };

  let leite = 0;
  let creme = 0;
  let leiteEmPo = 0;
  let sacarose = 0;
  let dextrose = 0;
  let glicose = 0;
  let maltodextrina = 0;

  // =========================
  // 1️⃣ FECHAMENTO LÍQUIDO (LEITE)
  // =========================
  // cria volume antes de açúcar
  const leiteBase = qtdSabor * 2.2; // fator realista
  leite += leiteBase;

  r.peso += leiteBase;
  r.solidos += leiteBase * ingredientes.leite.solidos;
  r.gordura += leiteBase * ingredientes.leite.gordura;
  r.proteina += leiteBase * ingredientes.leite.proteina;
  r.pod += leiteBase * ingredientes.leite.pod;
  r.pac += leiteBase * ingredientes.leite.pac;

  // =========================
  // 2️⃣ GORDURA → CREME
  // =========================
  const gorduraAlvo = METAS.gordura * r.peso;
  if (r.gordura < gorduraAlvo) {
    creme = (gorduraAlvo - r.gordura) / ingredientes.creme.gordura;

    r.peso += creme;
    r.solidos += creme * ingredientes.creme.solidos;
    r.gordura += creme * ingredientes.creme.gordura;
    r.proteina += creme * ingredientes.creme.proteina;
  }

  // =========================
  // 3️⃣ PROTEÍNA → LEITE EM PÓ
  // =========================
  const proteinaAlvo = METAS.proteina * r.peso;
  if (r.proteina < proteinaAlvo) {
    leiteEmPo =
      (proteinaAlvo - r.proteina) / ingredientes.leiteEmPo.proteina;

    r.peso += leiteEmPo;
    r.solidos += leiteEmPo;
    r.gordura += leiteEmPo * ingredientes.leiteEmPo.gordura;
    r.proteina += leiteEmPo * ingredientes.leiteEmPo.proteina;
    r.pod += leiteEmPo * ingredientes.leiteEmPo.pod;
    r.pac += leiteEmPo * ingredientes.leiteEmPo.pac;
  }

  // =========================
  // 4️⃣ AÇÚCARES – PROPORÇÃO REAL
  // =========================
  sacarose = r.peso * 0.14;   // 14%
  dextrose = r.peso * 0.05;   // 5%
  glicose  = r.peso * 0.04;   // 4%

  // limites de segurança
  sacarose = Math.min(sacarose, r.peso * METAS.acucarMax);
  dextrose = Math.min(dextrose, r.peso * METAS.dextroseMax);
  glicose  = Math.min(glicose,  r.peso * METAS.glicoseMax);

  const totalAcucares = sacarose + dextrose + glicose;

  r.peso += totalAcucares;
  r.solidos += totalAcucares;

  r.pod +=
    sacarose * ingredientes.sacarose.pod +
    dextrose * ingredientes.dextrose.pod +
    glicose * ingredientes.glicose.pod;

  r.pac +=
    sacarose * ingredientes.sacarose.pac +
    dextrose * ingredientes.dextrose.pac +
    glicose * ingredientes.glicose.pac;

  // =========================
  // 5️⃣ SÓLIDOS FINOS → MALTODEXTRINA
  // =========================
  const solidosAlvo = METAS.solidos * r.peso;
  if (r.solidos < solidosAlvo) {
    maltodextrina = solidosAlvo - r.solidos;
    r.peso += maltodextrina;
    r.solidos += maltodextrina;
  }

  // =========================
  // 6️⃣ ESTABILIZANTES
  // =========================
  const guar = r.peso * ingredientes.gomaGuar.limite;
  const lbg = r.peso * ingredientes.gomaAlfarroba.limite;

  r.peso += guar + lbg;
  r.solidos += guar + lbg;

  // =========================
  // 7️⃣ CÁLCULOS FINAIS
  // =========================
  const solidosPct = (r.solidos / r.peso) * 100;
  const gorduraPct = (r.gordura / r.peso) * 100;
  const proteinaPct = (r.proteina / r.peso) * 100;
  const podFinal = r.pod / r.peso;
  const pacFinal = r.pac / r.peso;

  // =========================
  // RESULTADO
  // =========================
  document.getElementById("resultado").textContent = `
Sabor: ${sabor.nome}

Saborizante: ${qtdSabor.toFixed(1)} g
Leite: ${leite.toFixed(1)} g
Creme: ${creme.toFixed(1)} g
Leite em pó: ${leiteEmPo.toFixed(1)} g
Açúcar: ${sacarose.toFixed(1)} g
Dextrose: ${dextrose.toFixed(1)} g
Glicose: ${glicose.toFixed(1)} g
Maltodextrina: ${maltodextrina.toFixed(1)} g
Goma guar: ${guar.toFixed(1)} g
Goma alfarroba: ${lbg.toFixed(1)} g

Peso final da calda: ${r.peso.toFixed(1)} g

Sólidos: ${solidosPct.toFixed(1)} %
Gordura: ${gorduraPct.toFixed(1)} %
Proteína: ${proteinaPct.toFixed(1)} %
POD: ${podFinal.toFixed(0)}
PAC: ${pacFinal.toFixed(0)}
`;
}
