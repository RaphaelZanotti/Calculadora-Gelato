import { INGREDIENTES, SABORES } from "./ingredientes.js";

console.log("SCRIPT CARREGADO COM SUCESSO");

document.getElementById("btnCalcular").addEventListener("click", () => {
  console.log("BOTÃO CLICADO");

  const saborKey = document.getElementById("sabor").value;
  const qtd = Number(document.getElementById("qtdSabor").value);

  const sabor = SABORES[saborKey];

  if (!sabor) {
    console.error("Sabor não encontrado:", saborKey);
    return;
  }

  // cálculo simples de teste
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
});
