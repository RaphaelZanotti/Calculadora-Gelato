import { INGREDIENTES, SABORES } from "./data/ingredientes.js";

console.log("SCRIPT CARREGADO");

function calcular() {
  console.log("CALCULANDO...");

  const saborKey = document.getElementById("sabor").value;
  const qtd = Number(document.getElementById("qtdSabor").value);
  const sabor = SABORES[saborKey];

  const pesoFinal = (qtd * sabor.solidos) / 0.40;
  const leite = pesoFinal * 0.55;
  const creme = pesoFinal * 0.08;

  document.getElementById("resultado").textContent = `
Sabor: ${sabor.nome}

Saborizante: ${qtd.toFixed(1)} g
Leite: ${leite.toFixed(1)} g
Creme: ${creme.toFixed(1)} g

Peso final: ${(qtd + leite + creme).toFixed(1)} g
`;
}

document.getElementById("btnCalcular").addEventListener("click", calcular);

// 👉 se quiser calcular ao carregar
calcular();
