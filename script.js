import { ingredientes } from "./data/ingredientes.js";

const metasPorModo = {
  gelato: {
    solidos: 0.40,
    gordura: 0.09,
    proteinaMin: 0.05,
    proteinaMax: 0.06,
    pod: 180,
    pac: 280
  },
  sorbet: {
    solidos: 0.32,
    gordura: 0,
    proteinaMin: 0,
    proteinaMax: 0,
    pod: 220,
    pac: 320
  }
};

const saborizantes = [
  "pistache","chocolate","morango","coco",
  "avela","amendoim","cumaru","doceDeLeite"
];

const inputsDiv = document.getElementById("inputs");

saborizantes.forEach(key => {
  inputsDiv.innerHTML += `
    <label>${ingredientes[key].nome}:
      <input type="number" id="${key}" value="0">
    </label><br>
  `;
});

window.calcular = function () {

  const pesoTotal = Number(document.getElementById("pesoTotal").value);
  const modo = document.getElementById("modo").value;
  const metas = metasPorModo[modo];

  let totais = {
    peso: 0,
    solidos: 0,
    gordura: 0,
    proteina: 0,
    pod: 0,
    pac: 0
  };

  // =========================
  // SOMA SABORIZANTES
  // =========================
  saborizantes.forEach(key => {
    const qtd = Number(document.getElementById(key).value);
    const ing = ingredientes[key];

    totais.peso += qtd;
    totais.solidos += qtd * ing.solidos;
    totais.gordura += qtd * ing.gordura;
    totais.proteina += qtd * ing.proteina;
    totais.pod += qtd * ing.pod;
    totais.pac += qtd * ing.pac;
  });

  // =========================
  // ESTABILIZANTES
  // =========================
  const guar = pesoTotal * ingredientes.gomaGuar.limite;
  const lbg = pesoTotal * ingredientes.gomaAlfarroba.limite;

  totais.peso += guar + lbg;
  totais.solidos += guar + lbg;

  // =========================
  // LEITE EM PÓ (só gelato)
  // =========================
  let leiteEmPo = 0;
  if (modo === "gelato") {
    const alvoSolidos = pesoTotal * metas.solidos;
    const faltaSolidos = alvoSolidos - totais.solidos;
    leiteEmPo = Math.max(0, faltaSolidos / ingredientes.leiteEmPo.solidos);

    totais.peso += leiteEmPo;
    totais.solidos += leiteEmPo * ingredientes.leiteEmPo.solidos;
    totais.gordura += leiteEmPo * ingredientes.leiteEmPo.gordura;
    totais.proteina += leiteEmPo * ingredientes.leiteEmPo.proteina;
    totais.pod += leiteEmPo * ingredientes.leiteEmPo.pod;
    totais.pac += leiteEmPo * ingredientes.leiteEmPo.pac;
  }

  // =========================
  // CREME (só gelato)
  // =========================
  let creme = 0;
  if (modo === "gelato") {
    const alvoGordura = pesoTotal * metas.gordura;
    const faltaGordura = alvoGordura - totais.gordura;
    creme = Math.max(0, faltaGordura / ingredientes.creme.gordura);
    totais.peso += creme;
  }

  // =========================
  // AÇÚCARES (POD / PAC)
  // =========================
  const faltaPAC = metas.pac - totais.pac;
  const dextrose = Math.max(0, faltaPAC / ingredientes.dextrose.pac);

  totais.peso += dextrose;
  totais.solidos += dextrose;
  totais.pod += dextrose * ingredientes.dextrose.pod;
  totais.pac += dextrose * ingredientes.dextrose.pac;

  // =========================
  // FECHAMENTO COM ÁGUA
  // =========================
  const agua = Math.max(0, pesoTotal - totais.peso);

  // =========================
  // NORMALIZAÇÃO PAC/POD
  // =========================
  const podFinal = totais.pod / pesoTotal;
  const pacFinal = totais.pac / pesoTotal;

  // =========================
  // RESULTADO
  // =========================
  document.getElementById("resultado").textContent = `
MODO: ${modo.toUpperCase()}

Leite em pó: ${leiteEmPo.toFixed(1)} g
Creme: ${creme.toFixed(1)} g
Dextrose: ${dextrose.toFixed(1)} g
Goma guar: ${guar.toFixed(1)} g
Goma alfarroba: ${lbg.toFixed(1)} g
Água: ${agua.toFixed(1)} g

Sólidos: ${(totais.solidos / pesoTotal * 100).toFixed(2)} %
Gordura: ${(totais.gordura / pesoTotal * 100).toFixed(2)} %
Proteína: ${(totais.proteina / pesoTotal * 100).toFixed(2)} %
POD: ${podFinal.toFixed(0)} 
PAC: ${pacFinal.toFixed(0)}
`;
};
