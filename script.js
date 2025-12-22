import { ingredientes } from "./data/ingredientes.js";

const METAS = {
  solidos: 0.40,
  gordura: 0.10,
  proteina: 0.06,
  pod: 180,
  pac: 270
};

document
  .getElementById("btnCalcular")
  .addEventListener("click", calcular);

function calcular() {
  const saborKey = document.getElementById("sabor").value;
  const qtdSabor = Number(document.getElementById("qtdSabor").value);

  if (!saborKey || qtdSabor <= 0) return;

  const sabor = ingredientes[saborKey];

  // =========================
  // 1️⃣ BASE INICIAL (SABOR)
  // =========================
  let r = {
    peso: qtdSabor,
    solidos: qtdSabor * sabor.solidos,
    gordura: qtdSabor * sabor.gordura,
    proteina: qtdSabor * sabor.proteina,
    pod: qtdSabor * sabor.pod,
    pac: qtdSabor * sabor.pac
  };

  // =========================
  // 2️⃣ BASE LÍQUIDA FIXA (LEITE)
  // =========================
  // regra simples: para cada 100g de sabor, começa com 300g de leite
  let leite = qtdSabor * 3;

  r.peso += leite;
  r.solidos += leite * ingredientes.leite.solidos;
  r.gordura += leite * ingredientes.leite.gordura;
  r.proteina += leite * ingredientes.leite.proteina;
  r.pod += leite * ingredientes.leite.pod;
  r.pac += leite * ingredientes.leite.pac;

  // =========================
  // 3️⃣ GORDURA → CREME
  // =========================
  let creme = 0;
  const gorduraAtual = r.gordura / r.peso;

  if (gorduraAtual < METAS.gordura) {
    creme =
      (METAS.gordura * r.peso - r.gordura) /
      ingredientes.creme.gordura;

    r.peso += creme;
    r.solidos += creme * ingredientes.creme.solidos;
    r.gordura += creme * ingredientes.creme.gordura;
    r.proteina += creme * ingredientes.creme.proteina;
  }

  // =========================
  // 4️⃣ PROTEÍNA → LEITE EM PÓ
  // =========================
  let leiteEmPo = 0;
  const proteinaAtual = r.proteina / r.peso;

  if (proteinaAtual < METAS.proteina) {
    leiteEmPo =
      (METAS.proteina * r.peso - r.proteina) /
      ingredientes.leiteEmPo.proteina;

    r.peso += leiteEmPo;
    r.solidos += leiteEmPo;
    r.gordura += leiteEmPo * ingredientes.leiteEmPo.gordura;
    r.proteina += leiteEmPo * ingredientes.leiteEmPo.proteina;
    r.pod += leiteEmPo * ingredientes.leiteEmPo.pod;
    r.pac += leiteEmPo * ingredientes.leiteEmPo.pac;
  }

  // =========================
  // 5️⃣ POD → AÇÚCAR
  // =========================
  let acucar =
    (METAS.pod * r.peso - r.pod) /
    ingredientes.acucar.pod;

  acucar = Math.max(0, acucar);

  r.peso += acucar;
  r.solidos += acucar;
  r.pod += acucar * ingredientes.acucar.pod;
  r.pac += acucar * ingredientes.acucar.pac;

  // =========================
  // 6️⃣ PAC → DEXTROSE
  // =========================
  let dextrose =
    (METAS.pac * r.peso - r.pac) /
    ingredientes.dextrose.pac;

  dextrose = Math.max(0, dextrose);

  r.peso += dextrose;
  r.solidos += dextrose;
  r.pod += dextrose * ingredientes.dextrose.pod;
  r.pac += dextrose * ingredientes.dextrose.pac;

  // =========================
  // 7️⃣ ESTABILIZANTES
  // =========================
  const guar = r.peso * ingredientes.gomaGuar.limite;
  const lbg = r.peso * ingredientes.gomaAlfarroba.limite;

  r.peso += guar + lbg;
  r.solidos += guar + lbg;

  // =========================
  // RESULTADOS
  // =========================
  const liquidos = r.peso - r.solidos;

  document.getElementById("resultado").textContent = `
Sabor: ${sabor.nome}

Saborizante: ${qtdSabor.toFixed(1)} g
Leite: ${leite.toFixed(1)} g
Creme: ${creme.toFixed(1)} g
Leite em pó: ${leiteEmPo.toFixed(1)} g
Açúcar: ${acucar.toFixed(1)} g
Dextrose: ${dextrose.toFixed(1)} g
Goma guar: ${guar.toFixed(1)} g
Goma alfarroba: ${lbg.toFixed(1)} g

Peso final da calda: ${r.peso.toFixed(1)} g

Sólidos: ${(r.solidos / r.peso * 100).toFixed(1)} %
Líquidos: ${(liquidos / r.peso * 100).toFixed(1)} %
Gordura: ${(r.gordura / r.peso * 100).toFixed(1)} %
Proteína: ${(r.proteina / r.peso * 100).toFixed(1)} %
POD: ${(r.pod / r.peso).toFixed(0)}
PAC: ${(r.pac / r.peso).toFixed(0)}
`;
}
