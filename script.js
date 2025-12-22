// script.js

import { INGREDIENTES_BASE, SABORES } from "./ingredientes.js"

const TARGETS = {
  solidos: { min: 0.35, max: 0.45, ideal: 0.40 },
  gordura: { min: 0.06, max: 0.10 },
  proteina: { min: 0.03, max: 0.05 },
  pod: 180,
  pac: 270
}

function calcularPesoFinalMinimo(qtdSabor, sabor) {
  const solidosSabor = qtdSabor * sabor.solidos
  return solidosSabor / TARGETS.solidos.ideal
}

function calcularReceita(saborKey, qtdSabor) {
  const sabor = SABORES[saborKey]
  const ingredientes = {}

  // 1️⃣ Peso final OBRIGATÓRIO
  const pesoFinal = calcularPesoFinalMinimo(qtdSabor, sabor)

  // 2️⃣ Base líquida (sempre existe)
  let leite = pesoFinal * 0.55
  let creme = pesoFinal * 0.10

  // 3️⃣ Açúcares balanceados
  const acucar = pesoFinal * 0.10
  const dextrose = pesoFinal * 0.05
  const glicose = pesoFinal * 0.05

  // 4️⃣ Estabilizantes
  const guar = pesoFinal * 0.002
  const alfarroba = pesoFinal * 0.002

  ingredientes.saborizante = qtdSabor
  ingredientes.leite = leite
  ingredientes.creme = creme
  ingredientes.acucar = acucar
  ingredientes.dextrose = dextrose
  ingredientes.glicose = glicose
  ingredientes.guar = guar
  ingredientes.alfarroba = alfarroba

  // 5️⃣ Cálculos finais
  let totais = {
    peso: 0,
    solidos: 0,
    agua: 0,
    gordura: 0,
    proteina: 0,
    pod: 0,
    pac: 0
  }

  function acumular(qtd, ref) {
    totais.peso += qtd
    totais.solidos += qtd * ref.solidos
    totais.agua += qtd * ref.agua
    totais.gordura += qtd * (ref.gordura || 0)
    totais.proteina += qtd * (ref.proteina || 0)
    totais.pod += qtd * (ref.pod || 0) / totais.peso
    totais.pac += qtd * (ref.pac || 0) / totais.peso
  }

  acumular(qtdSabor, sabor)
  acumular(leite, INGREDIENTES_BASE.leite)
  acumular(creme, INGREDIENTES_BASE.creme)
  acumular(acucar, INGREDIENTES_BASE.acucar)
  acumular(dextrose, INGREDIENTES_BASE.dextrose)
  acumular(glicose, INGREDIENTES_BASE.glicose)
  acumular(guar, INGREDIENTES_BASE.guar)
  acumular(alfarroba, INGREDIENTES_BASE.alfarroba)

  return {
    ingredientes,
    totais: {
      peso: totais.peso.toFixed(1),
      solidos: ((totais.solidos / totais.peso) * 100).toFixed(1),
      liquidos: ((totais.agua / totais.peso) * 100).toFixed(1),
      gordura: ((totais.gordura / totais.peso) * 100).toFixed(1),
      proteina: ((totais.proteina / totais.peso) * 100).toFixed(1),
      pod: Math.round(TARGETS.pod),
      pac: Math.round(TARGETS.pac)
    }
  }
}

// Expor função
window.calcularReceita = calcularReceita
