import { INGREDIENTES, SABORES } from "./ingredientes.js";

const btn = document.getElementById("btnCalcular");
const resultadoEl = document.getElementById("resultado");

btn.addEventListener("click", calcular);

function calcular() {
  const saborKey = document.getElementById("sabor").value;
  const qtdSabor = Number(document.getElementById("qtdSabor").value);

  const sabor = SABORES[saborKey];

  // 🎯 peso final calculado para ~40% sólidos
  const pesoFinal = (qtdSabor * sabor.solidos) / 0.40;

  const leite = pesoFinal * 0.50;
  const creme = pesoFinal * 0.08;
  const acucar = pesoFinal * 0.10;
  const dextrose = pesoFinal * 0.05;
  const glicose = pesoFinal * 0.05;
  const guar = pesoFinal * 0.002;
  const alfarroba = pesoFinal * 0.002;

  // Totais
  const pesoTotal =
    qtdSabor + leite + creme + acucar + dextrose + glicose + guar + alfarroba;

  const solidos =
    qtdSabor * sabor.solidos +
    leite * INGREDIENTES.leite.solidos +
    creme * INGREDIENTES.creme.solidos +
    acucar +
    dextrose +
    glicose * INGREDIENTES.glicose.solidos +
    guar +
    alfarroba;

  const gordura =
    qtdSabor * sabor.gordura +
    leite * INGREDIENTES.leite.gordura +
    creme * INGREDIENTES.creme.gordura;

  const proteina =
    qtdSabor * sabor.proteina +
    leite * INGREDIENTES.leite.proteina +
    creme * INGREDIENTES.creme.proteina;

  resultadoEl.textContent = `
Sabor: ${sabor.nome}

Saborizante: ${qtdSabor.toFixed(1)} g
Leite: ${leite.toFixed(1)} g
Creme: ${creme.toFixed(1)} g
Açúcar: ${acucar.toFixed(1)} g
Dextrose: ${dextrose.toFixed(1)} g
Glicose: ${glicose.toFixed(1)} g
Goma guar: ${guar.toFixed(1)} g
Goma alfarroba: ${alfarroba.toFixed(1)} g

Peso final: ${pesoTotal.toFixed(1)} g

Sólidos: ${(solidos / pesoTotal * 100).toFixed(1)} %
Líquidos: ${(100 - solidos / pesoTotal * 100).toFixed(1)} %
Gordura: ${(gordura / pesoTotal * 100).toFixed(1)} %
Proteína: ${(proteina / pesoTotal * 100).toFixed(1)} %
`;
}
