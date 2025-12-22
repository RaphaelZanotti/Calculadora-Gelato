import { ingredientes } from "./data/ingredientes.js";

const METAS = {
  solidos: 0.40,
  gordura: 0.10,
  proteina: 0.06,
  pod: 180,
  pac: 270
};

window.calcular = function () {

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

  // ========================
  // PROTEÍNA → LEITE EM PÓ
  // ========================
  let leiteEmPo = 0;
  if (r.proteina / r.peso < METAS.proteina) {
    leiteEmPo = (METAS.proteina * r.peso - r.proteina) / ingredientes.leiteEmPo.proteina;
    r.peso += leiteEmPo;
    r.solidos += leiteEmPo;
    r.gordura += leiteEmPo * ingredientes.leiteEmPo.gordura;
    r.proteina += leiteEmPo * ingredientes.leiteEmPo.proteina;
    r.pod += leiteEmPo * ingredientes.leiteEmPo.pod;
    r.pac += leiteEmPo * ingredientes.leiteEmPo.pac;
  }

  // ========================
  // GORDURA → CREME
  // ========================
  let creme = 0;
  if (r.gordura / r.peso < METAS.gordura) {
    creme = (METAS.gordura * r.peso - r.gordura) / ingredientes.creme.gordura;
    r.peso += creme;
    r.solidos += creme * ingredientes.creme.solidos;
    r.gordura += creme * ingredientes.creme.gordura;
    r.proteina += creme * ingredientes.creme.proteina;
  }

  // ========================
  // AÇÚCAR BASE → SACAROSE
  // ========================
  let sacarose = (METAS.pod * r.peso - r.pod) / ingredientes.sacarose.pod;
  sacarose = Math.max(0, sacarose);

  r.peso += sacarose;
  r.solidos += sacarose;
  r.pod += sacarose * ingredientes.sacarose.pod;
  r.pac += sacarose * ingredientes.sacarose.pac;

  // ========================
  // AJUSTE PAC → DEXTROSE
  // ========================
  let dextrose = (METAS.pac * r.peso - r.pac) / ingredientes.dextrose.pac;
  dextrose = Math.max(0, dextrose);

  r.peso += dextrose;
  r.solidos += dextrose;
  r.pod += dextrose * ingredientes.dextrose.pod;
  r.pac += dextrose * ingredientes.dextrose.pac;

  // ========================
  // SÓLIDOS → MALTODEXTRINA
  // ========================
  let maltodextrina = (METAS.solidos * r.peso - r.solidos);
  maltodextrina = Math.max(0, maltodextrina);

  r.peso += maltodextrina;
  r.solidos += maltodextrina;

  // ========================
  // ESTABILIZANTES
  // ========================
  const guar = r.peso * ingredientes.gomaGuar.limite;
  const lbg = r.peso * ingredientes.gomaAlfarroba.limite;

  r.peso += guar + lbg;
  r.solidos += guar + lbg;

  // ========================
  // ÁGUA (FECHAMENTO)
  // ========================
  const agua = r.peso * (1 - METAS.solidos);

  // ========================
  // RESULTADO FINAL
  // ========================
  document.getElementById("resultado").textContent = `
Sabor: ${sabor.nome}

Saborizante: ${qtdSabor.toFixed(1)} g
Leite em pó: ${leiteEmPo.toFixed(1)} g
Creme: ${creme.toFixed(1)} g
Açúcar: ${sacarose.toFixed(1)} g
Dextrose: ${dextrose.toFixed(1)} g
Maltodextrina: ${maltodextrina.toFixed(1)} g
Goma guar: ${guar.toFixed(1)} g
Goma alfarroba: ${lbg.toFixed(1)} g
Água: ${agua.toFixed(1)} g

Peso final da calda: ${(r.peso + agua).toFixed(1)} g

Sólidos: ${(METAS.solidos * 100).toFixed(1)} %
Gordura: ${(r.gordura / r.peso * 100).toFixed(1)} %
Proteína: ${(r.proteina / r.peso * 100).toFixed(1)} %
POD: ${(r.pod / r.peso).toFixed(0)}
PAC: ${(r.pac / r.peso).toFixed(0)}
`;
};
