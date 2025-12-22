import { ingredientes } from "./data/ingredientes.js";

const METAS = {
  solidos: 0.40,
  gordura: 0.10,
  proteina: 0.06,
  pod: 170,
  pac: 260
};

document.getElementById("btnCalcular")
  .addEventListener("click", calcular);

function calcular() {

  const saborKey = document.getElementById("sabor").value;
  const qtdSabor = Number(document.getElementById("qtdSabor").value);

  if (!qtdSabor || qtdSabor <= 0) {
    alert("Informe a quantidade do saborizante");
    return;
  }

  const sabor = ingredientes[saborKey];

  let r = {
    peso: qtdSabor,
    solidos: qtdSabor * sabor.solidos,
    gordura: qtdSabor * sabor.gordura,
    proteina: qtdSabor * sabor.proteina,
    pod: qtdSabor * sabor.pod,
    pac: qtdSabor * sabor.pac
  };

  let leite = qtdSabor * 2.2;
  r.peso += leite;
  r.solidos += leite * ingredientes.leite.solidos;
  r.gordura += leite * ingredientes.leite.gordura;
  r.proteina += leite * ingredientes.leite.proteina;

  let creme = 0;
  const gorduraAlvo = METAS.gordura * r.peso;
  if (r.gordura < gorduraAlvo) {
    creme = (gorduraAlvo - r.gordura) / ingredientes.creme.gordura;
    r.peso += creme;
    r.solidos += creme * ingredientes.creme.solidos;
    r.gordura += creme * ingredientes.creme.gordura;
    r.proteina += creme * ingredientes.creme.proteina;
  }

  let leiteEmPo = 0;
  const proteinaAlvo = METAS.proteina * r.peso;
  if (r.proteina < proteinaAlvo) {
    leiteEmPo =
      (proteinaAlvo - r.proteina) / ingredientes.leiteEmPo.proteina;
    r.peso += leiteEmPo;
    r.solidos += leiteEmPo;
    r.gordura += leiteEmPo * ingredientes.leiteEmPo.gordura;
    r.proteina += leiteEmPo * ingredientes.leiteEmPo.proteina;
  }

  // Açúcares (proporção segura)
  const sacarose = r.peso * 0.14;
  const dextrose = r.peso * 0.05;

  r.peso += sacarose + dextrose;
  r.solidos += sacarose + dextrose;

  r.pod +=
    sacarose * ingredientes.sacarose.pod +
    dextrose * ingredientes.dextrose.pod;

  r.pac +=
    sacarose * ingredientes.sacarose.pac +
    dextrose * ingredientes.dextrose.pac;

  // Glicose de milho (opcional)
  let glicose = 0;
  if (ingredientes.glicoseMilho) {
    glicose = r.peso * 0.04;
    r.peso += glicose;
    r.solidos += glicose;
    r.pod += glicose * ingredientes.glicoseMilho.pod;
    r.pac += glicose * ingredientes.glicoseMilho.pac;
  }

  // Estabilizantes
  const guar = r.peso * ingredientes.gomaGuar.limite;
  const lbg = r.peso * ingredientes.gomaAlfarroba.limite;

  r.peso += guar + lbg;
  r.solidos += guar + lbg;

  const resultado = `
Sabor: ${sabor.nome}

Saborizante: ${qtdSabor.toFixed(1)} g
Leite: ${leite.toFixed(1)} g
Creme: ${creme.toFixed(1)} g
Leite em pó: ${leiteEmPo.toFixed(1)} g
Açúcar: ${sacarose.toFixed(1)} g
Dextrose: ${dextrose.toFixed(1)} g
Glicose: ${glicose.toFixed(1)} g
Goma guar: ${guar.toFixed(1)} g
Goma alfarroba: ${lbg.toFixed(1)} g

Peso final da calda: ${r.peso.toFixed(1)} g

Sólidos: ${(r.solidos / r.peso * 100).toFixed(1)} %
Gordura: ${(r.gordura / r.peso * 100).toFixed(1)} %
Proteína: ${(r.proteina / r.peso * 100).toFixed(1)} %
POD: ${(r.pod / r.peso).toFixed(0)}
PAC: ${(r.pac / r.peso).toFixed(0)}
`;

  document.getElementById("resultado").textContent = resultado;
}
