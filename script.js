import { ingredientes } from "./data/ingredientes.js";

const METAS = {
  solidos: 0.40,
  solidosBaseMin: 0.32,
  gordura: 0.10,
  proteina: 0.06,

  // limites estruturais
  acucarMax: 0.22,     // 22%
  dextroseMax: 0.08    // 8%
};

document
  .getElementById("btnCalcular")
  .addEventListener("click", calcular);

function calcular() {

  const saborKey = document.getElementById("sabor").value;
  const qtdSabor = Number(document.getElementById("qtdSabor").value);
  const sabor = ingredientes[saborKey];

  let r = {
    peso: qtdSabor,
    solidos: qtdSabor * sabor.solidos,
    gordura: qtdSabor * sabor.gordura,
    proteina: qtdSabor * sabor.proteina,
    pod: qtdSabor * sabor.pod,
    pac: qtdSabor * sabor.pac
  };

  // =========================
  // 1️⃣ BASE LÍQUIDA → LEITE
  // =========================
  let leite = 0;

  while (r.solidos / r.peso < METAS.solidosBaseMin) {
    leite += 10;
    r.peso += 10;
    r.solidos += 10 * ingredientes.leite.solidos;
    r.gordura += 10 * ingredientes.leite.gordura;
    r.proteina += 10 * ingredientes.leite.proteina;
    r.pod += 10 * ingredientes.leite.pod;
    r.pac += 10 * ingredientes.leite.pac;
  }

  // =========================
  // 2️⃣ GORDURA → CREME
  // =========================
  let creme = 0;

  if (r.gordura / r.peso < METAS.gordura) {
    creme =
      (METAS.gordura * r.peso - r.gordura) /
      ingredientes.creme.gordura;

    creme = Math.max(0, creme);

    r.peso += creme;
    r.solidos += creme * ingredientes.creme.solidos;
    r.gordura += creme * ingredientes.creme.gordura;
    r.proteina += creme * ingredientes.creme.proteina;
  }

  // =========================
  // 3️⃣ PROTEÍNA → LEITE EM PÓ
  // =========================
  let leiteEmPo = 0;

  if (r.proteina / r.peso < METAS.proteina) {
    leiteEmPo =
      (METAS.proteina * r.peso - r.proteina) /
      ingredientes.leiteEmPo.proteina;

    leiteEmPo = Math.max(0, leiteEmPo);

    r.peso += leiteEmPo;
    r.solidos += leiteEmPo;
    r.gordura += leiteEmPo * ingredientes.leiteEmPo.gordura;
    r.proteina += leiteEmPo * ingredientes.leiteEmPo.proteina;
    r.pod += leiteEmPo * ingredientes.leiteEmPo.pod;
    r.pac += leiteEmPo * ingredientes.leiteEmPo.pac;
  }

  // =========================
  // 4️⃣ AÇÚCARES (FAIXA REALISTA)
  // =========================
  let acucar = r.peso * 0.14;    // 14%
  let dextrose = r.peso * 0.05;  // 5%

  acucar = Math.min(acucar, r.peso * METAS.acucarMax);
  dextrose = Math.min(dextrose, r.peso * METAS.dextroseMax);

  r.peso += acucar + dextrose;
  r.solidos += acucar + dextrose;

  r.pod += acucar * ingredientes.acucar.pod;
  r.pac += acucar * ingredientes.acucar.pac;

  r.pod += dextrose * ingredientes.dextrose.pod;
  r.pac += dextrose * ingredientes.dextrose.pac;

  // =========================
  // 5️⃣ AJUSTE FINO DE SÓLIDOS
  // =========================
  let maltodextrina =
    METAS.solidos * r.peso - r.solidos;

  maltodextrina = Math.max(0, maltodextrina);

  r.peso += maltodextrina;
  r.solidos += maltodextrina;

  // =========================
  // 6️⃣ ESTABILIZANTES
  // =========================
  const guar = r.peso * ingredientes.gomaGuar.limite;
  const lbg = r.peso * ingredientes.gomaAlfarroba.limite;

  r.peso += guar + lbg;
  r.solidos += guar + lbg;

  // =========================
  // RESULTADOS FINAIS
  // =========================
  document.getElementById("resultado").textContent = `
Sabor: ${sabor.nome}

Saborizante: ${qtdSabor.toFixed(1)} g
Leite: ${leite.toFixed(1)} g
Leite em pó: ${leiteEmPo.toFixed(1)} g
Creme: ${creme.toFixed(1)} g
Açúcar: ${acucar.toFixed(1)} g
Dextrose: ${dextrose.toFixed(1)} g
Maltodextrina: ${maltodextrina.toFixed(1)} g
Goma guar: ${guar.toFixed(1)} g
Goma alfarroba: ${lbg.toFixed(1)} g

Peso final da calda: ${r.peso.toFixed(1)} g

Sólidos: ${(r.solidos / r.peso * 100).toFixed(1)} %
Gordura: ${(r.gordura / r.peso * 100).toFixed(1)} %
Proteína: ${(r.proteina / r.peso * 100).toFixed(1)} %
POD: ${(r.pod / r.peso).toFixed(0)}
PAC: ${(r.pac / r.peso).toFixed(0)}
`;
}
