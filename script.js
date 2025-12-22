import { ingredientes } from "./data/ingredientes.js";

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

document.getElementById("btnCalcular").addEventListener("click", calcular);

function calcular() {

  const saborKey = document.getElementById("sabor").value;
  const qtdSabor = Number(document.getElementById("qtdSabor").value);
  const s = ingredientes[saborKey];

  let r = {
    peso: qtdSabor,
    solidos: qtdSabor * s.solidos,
    gordura: qtdSabor * s.gordura,
    proteina: qtdSabor * s.proteina,
    pod: qtdSabor * s.pod,
    pac: qtdSabor * s.pac
  };

  let leite = 0, creme = 0, leiteEmPo = 0;
  let acucar = 0, dextrose = 0, glicose = 0, maltodextrina = 0;

  // 1️⃣ LÍQUIDOS → LEITE (mínimo estrutural)
  while (r.solidos / r.peso > METAS.solidosMax) {
    leite += 20;
    aplicar(r, ingredientes.leite, 20);
  }

  // 2️⃣ GORDURA → CREME
  while (r.gordura / r.peso < METAS.gorduraMin) {
    creme += 10;
    aplicar(r, ingredientes.creme, 10);
  }

  // 3️⃣ PROTEÍNA → LEITE EM PÓ
  while (r.proteina / r.peso < METAS.proteinaMin) {
    leiteEmPo += 5;
    aplicar(r, ingredientes.leiteEmPo, 5);
  }

  // 4️⃣ POD → SACAROSE
  while ((r.pod / r.peso) * 1000 < METAS.pod) {
    acucar += 5;
    aplicar(r, ingredientes.acucar, 5);
  }

  // 5️⃣ PAC → DEXTROSE + GLICOSE
  while ((r.pac / r.peso) * 1000 < METAS.pac) {
    dextrose += 3;
    aplicar(r, ingredientes.dextrose, 3);

    glicose += 3;
    aplicar(r, ingredientes.glicose, 3);
  }

  // 6️⃣ AJUSTE FINO DE SÓLIDOS
  while (r.solidos / r.peso < METAS.solidosMin) {
    maltodextrina += 5;
    aplicar(r, ingredientes.maltodextrina, 5);
  }

  // 7️⃣ ESTABILIZANTES
  const guar = r.peso * ingredientes.gomaGuar.limite;
  const lbg = r.peso * ingredientes.gomaAlfarroba.limite;

  r.peso += guar + lbg;
  r.solidos += guar + lbg;

  // RESULTADO
  document.getElementById("resultado").textContent = `
Sabor: ${s.nome}

Saborizante: ${qtdSabor.toFixed(1)} g
Leite: ${leite.toFixed(1)} g
Creme: ${creme.toFixed(1)} g
Leite em pó: ${leiteEmPo.toFixed(1)} g
Açúcar: ${acucar.toFixed(1)} g
Dextrose: ${dextrose.toFixed(1)} g
Glicose: ${glicose.toFixed(1)} g
Maltodextrina: ${maltodextrina.toFixed(1)} g
Goma guar: ${guar.toFixed(1)} g
Goma alfarroba: ${lbg.toFixed(1)} g

Peso final da calda: ${r.peso.toFixed(1)} g

Sólidos: ${(r.solidos / r.peso * 100).toFixed(1)} %
Líquidos: ${(100 - r.solidos / r.peso * 100).toFixed(1)} %
Gordura: ${(r.gordura / r.peso * 100).toFixed(1)} %
Proteína: ${(r.proteina / r.peso * 100).toFixed(1)} %
POD: ${((r.pod / r.peso) * 1000).toFixed(0)}
PAC: ${((r.pac / r.peso) * 1000).toFixed(0)}
`;
}

function aplicar(r, ing, qtd) {
  r.peso += qtd;
  r.solidos += qtd * (ing.solidos || 0);
  r.gordura += qtd * (ing.gordura || 0);
  r.proteina += qtd * (ing.proteina || 0);
  r.pod += qtd * (ing.pod || 0);
  r.pac += qtd * (ing.pac || 0);
}
