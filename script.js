import { INGREDIENTES, SABORES } from "./data/ingredientes.js";

const METAS = {
  solidosMin: 0.35,
  solidosMax: 0.45,
  gorduraMin: 0.06,
  gorduraMax: 0.10,
  proteinaMin: 0.03,
  proteinaMax: 0.05,
  pod: 180,
  pac: 270
};

function calcular() {
  const saborKey = document.getElementById("sabor").value;
  const qtdSabor = Number(document.getElementById("qtdSabor").value);
  const sabor = SABORES[saborKey];

  let r = {
    peso: qtdSabor,
    solidos: qtdSabor * sabor.solidos,
    gordura: qtdSabor * sabor.gordura,
    proteina: qtdSabor * sabor.proteina,
    pod: qtdSabor * sabor.pod,
    pac: qtdSabor * sabor.pac
  };

  // 1️⃣ Definir peso alvo (40% sólidos)
  const pesoAlvo = r.solidos / 0.40;
  const liquidos = pesoAlvo - r.peso;

  const leite = liquidos * 0.75;
  const creme = liquidos * 0.25;

  r.peso += leite + creme;
  r.solidos += leite * INGREDIENTES.leite.solidos + creme * INGREDIENTES.creme.solidos;
  r.gordura += leite * INGREDIENTES.leite.gordura + creme * INGREDIENTES.creme.gordura;
  r.proteina += leite * INGREDIENTES.leite.proteina + creme * INGREDIENTES.creme.proteina;

  // 2️⃣ Açúcares (estrutura correta)
  let acucar = 0;
  let dextrose = 0;
  let glicose = 0;

  // Glicose obrigatória: ~6% do peso
  glicose = r.peso * 0.06;

  r.peso += glicose;
  r.solidos += glicose * INGREDIENTES.glicose.solidos;
  r.pod += glicose * INGREDIENTES.glicose.pod;
  r.pac += glicose * INGREDIENTES.glicose.pac;

  // Sacarose → POD
  acucar = (METAS.pod * r.peso - r.pod) / INGREDIENTES.acucar.pod;
  acucar = Math.max(0, acucar);

  r.peso += acucar;
  r.solidos += acucar;
  r.pod += acucar * INGREDIENTES.acucar.pod;
  r.pac += acucar * INGREDIENTES.acucar.pac;

  // Dextrose → PAC
  dextrose = (METAS.pac * r.peso - r.pac) / INGREDIENTES.dextrose.pac;
  dextrose = Math.max(0, dextrose);

  r.peso += dextrose;
  r.solidos += dextrose;
  r.pod += dextrose * INGREDIENTES.dextrose.pod;
  r.pac += dextrose * INGREDIENTES.dextrose.pac;

  // 3️⃣ Estabilizantes
  const guar = r.peso * INGREDIENTES.gomaGuar.limite;
  const lbg = r.peso * INGREDIENTES.gomaAlfarroba.limite;

  r.peso += guar + lbg;
  r.solidos += guar + lbg;

  document.getElementById("resultado").textContent = `
Sabor: ${sabor.nome}

Saborizante: ${qtdSabor.toFixed(1)} g
Leite: ${leite.toFixed(1)} g
Creme: ${creme.toFixed(1)} g
Açúcar: ${acucar.toFixed(1)} g
Dextrose: ${dextrose.toFixed(1)} g
Glicose de milho: ${glicose.toFixed(1)} g
Goma guar: ${guar.toFixed(2)} g
Goma alfarroba: ${lbg.toFixed(2)} g

Peso final da calda: ${r.peso.toFixed(1)} g

Sólidos: ${(r.solidos / r.peso * 100).toFixed(1)} %
Líquidos: ${(100 - (r.solidos / r.peso * 100)).toFixed(1)} %
Gordura: ${(r.gordura / r.peso * 100).toFixed(1)} %
Proteína: ${(r.proteina / r.peso * 100).toFixed(1)} %
POD: ${(r.pod / r.peso).toFixed(0)}
PAC: ${(r.pac / r.peso).toFixed(0)}
`;
}

document
  .getElementById("btnCalcular")
  .addEventListener("click", calcular);
