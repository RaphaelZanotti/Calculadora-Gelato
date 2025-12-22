import { ingredientes } from "./data/ingredientes.js";
import { sabores } from "./data/sabores.js";

export function calcularReceita(input) {
  const pesoTotal = input.pesoTotal;
  const modo = input.modo;

  const metas = modo === "SORBET"
    ? { pod: 220, pac: 320 }
    : { pod: 180, pac: 280 };

  const LIMITES = {
    gorduraMax: 0.10,
    proteinaMax: 0.06,
    gorduraMin: 0.07,
    proteinaMin: 0.045
  };

  let receita = {};
  let totais = {
    peso: 0,
    solidos: 0,
    gordura: 0,
    proteina: 0,
    pod: 0,
    pac: 0
  };

  // 1️⃣ Saborizantes
  Object.entries(input.saborizantes).forEach(([nome, qtd]) => {
    if (qtd <= 0) return;
    const ing = ingredientes[nome];
    receita[nome] = qtd;

    totais.peso += qtd;
    totais.solidos += qtd * ing.solidos;
    totais.gordura += qtd * ing.gordura;
    totais.proteina += qtd * ing.proteina;
    totais.pod += qtd * ing.pod;
    totais.pac += qtd * ing.pac;
  });

  // 2️⃣ Gomas (fixas por kg)
  const gomaGuar = pesoTotal * 0.003;
  const gomaAlfarroba = pesoTotal * 0.002;

  receita["goma_guar"] = gomaGuar;
  receita["goma_alfarroba"] = gomaAlfarroba;

  totais.peso += gomaGuar + gomaAlfarroba;
  totais.solidos += (gomaGuar + gomaAlfarroba);

  // 3️⃣ Base láctea controlada
  if (modo === "GELATO") {
    let leitePo = pesoTotal * 0.30;

    const gorduraAtual = totais.gordura / totais.peso;
    const proteinaAtual = totais.proteina / totais.peso;

    if (proteinaAtual > LIMITES.proteinaMax) leitePo *= 0.7;
    if (gorduraAtual > LIMITES.gorduraMax) leitePo *= 0.6;

    receita["leite_po"] = leitePo;

    const lp = ingredientes["leite_po"];
    totais.peso += leitePo;
    totais.solidos += leitePo * lp.solidos;
    totais.gordura += leitePo * lp.gordura;
    totais.proteina += leitePo * lp.proteina;
    totais.pod += leitePo * lp.pod;
    totais.pac += leitePo * lp.pac;
  }

  // 4️⃣ Correção de POD/PAC com dextrose
  let podAtual = totais.pod / totais.peso;
  let pacAtual = totais.pac / totais.peso;

  let dextrose = 0;
  if (podAtual < metas.pod || pacAtual < metas.pac) {
    dextrose = pesoTotal * 0.06;
    receita["dextrose"] = dextrose;

    const dx = ingredientes["dextrose"];
    totais.peso += dextrose;
    totais.solidos += dextrose;
    totais.pod += dextrose * dx.pod;
    totais.pac += dextrose * dx.pac;
  }

  // 5️⃣ Sólidos neutros (sem mexer em gordura/proteína)
  const solidosAtual = totais.solidos / totais.peso;
  if (solidosAtual < 0.40) {
    const maltodextrina = pesoTotal * 0.04;
    receita["maltodextrina"] = maltodextrina;

    totais.peso += maltodextrina;
    totais.solidos += maltodextrina;
  }

  // 6️⃣ Água para fechar peso
  const agua = pesoTotal - totais.peso;
  receita["agua"] = agua;

  totais.peso += agua;

  // 🔢 Resultados finais normalizados
  return {
    receita,
    resultados: {
      solidos: (totais.solidos / totais.peso * 100).toFixed(2),
      gordura: (totais.gordura / totais.peso * 100).toFixed(2),
      proteina: (totais.proteina / totais.peso * 100).toFixed(2),
      pod: (totais.pod / totais.peso).toFixed(0),
      pac: (totais.pac / totais.peso).toFixed(0)
    }
  };
}
