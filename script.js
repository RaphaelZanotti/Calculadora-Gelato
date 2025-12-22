import { INGREDIENTES, SABORES } from "./data/ingredientes.js";

function calcular() {
  const saborKey = document.getElementById("sabor").value;
  const qtdSabor = Number(document.getElementById("qtdSabor").value);
  const sabor = SABORES[saborKey];

  // ===============================
  // ACUMULADORES
  // ===============================
  let r = {
    peso: qtdSabor,
    solidos: qtdSabor * sabor.solidos,
    gordura: qtdSabor * sabor.gordura,
    proteina: qtdSabor * sabor.proteina,
    pod: qtdSabor * (sabor.pod || 0),
    pac: qtdSabor * (sabor.pac || 0)
  };

  // ===============================
  // 1️⃣ BASE LÁCTEA FIXA (NUNCA NEGATIVA)
  // ===============================
  let leite, creme;

  if (sabor.tipo === "fruta") {
    leite = qtdSabor * 0.6;
    creme = qtdSabor * 0.15;
  } else {
    leite = qtdSabor * 0.9;
    creme = qtdSabor * 0.3;
  }

  r.peso += leite + creme;

  r.solidos +=
    leite * INGREDIENTES.leite.solidos +
    creme * INGREDIENTES.creme.solidos;

  r.gordura +=
    leite * INGREDIENTES.leite.gordura +
    creme * INGREDIENTES.creme.gordura;

  r.proteina +=
    leite * INGREDIENTES.leite.proteina +
    creme * INGREDIENTES.creme.proteina;

  // ===============================
  // 2️⃣ AÇÚCARES (MODELO PROFISSIONAL)
  // ===============================
  const percAcucares = sabor.tipo === "fruta" ? 0.16 : 0.20;
  const totalAcucares = r.peso * percAcucares;

  const acucar   = totalAcucares * 0.50;
  const dextrose = totalAcucares * 0.30;
  const glicose  = totalAcucares * 0.20;

  r.peso += acucar + dextrose + glicose;

  // Sacarose
  r.solidos += acucar;
  r.pod += acucar * INGREDIENTES.acucar.pod;
  r.pac += acucar * INGREDIENTES.acucar.pac;

  // Dextrose
  r.solidos += dextrose;
  r.pod += dextrose * INGREDIENTES.dextrose.pod;
  r.pac += dextrose * INGREDIENTES.dextrose.pac;

  // Glicose de milho
  r.solidos += glicose * INGREDIENTES.glicose.solidos;
  r.pod += glicose * INGREDIENTES.glicose.pod;
  r.pac += glicose * INGREDIENTES.glicose.pac;

  // ===============================
  // 3️⃣ ESTABILIZANTES
  // ===============================
  const guar = r.peso * INGREDIENTES.gomaGuar.limite;
  const lbg  = r.peso * INGREDIENTES.gomaAlfarroba.limite;

  r.peso += guar + lbg;
  r.solidos += guar + lbg;

  // ===============================
  // 4️⃣ RESULTADO
  // ===============================
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
