// ingredientes.js

export const INGREDIENTES_BASE = {
  leite: {
    nome: "Leite integral",
    agua: 0.88,
    solidos: 0.12,
    gordura: 0.035,
    proteina: 0.032,
    pod: 0,
    pac: 0
  },
  creme: {
    nome: "Creme de leite",
    agua: 0.60,
    solidos: 0.40,
    gordura: 0.35,
    proteina: 0.025,
    pod: 0,
    pac: 0
  },
  acucar: {
    nome: "Açúcar",
    agua: 0,
    solidos: 1,
    gordura: 0,
    proteina: 0,
    pod: 100,
    pac: 100
  },
  dextrose: {
    nome: "Dextrose",
    agua: 0,
    solidos: 1,
    gordura: 0,
    proteina: 0,
    pod: 70,
    pac: 190
  },
  glicose: {
    nome: "Glicose de milho",
    agua: 0.20,
    solidos: 0.80,
    gordura: 0,
    proteina: 0,
    pod: 40,
    pac: 60
  },
  guar: {
    nome: "Goma guar",
    agua: 0,
    solidos: 1,
    gordura: 0,
    proteina: 0,
    pod: 0,
    pac: 0
  },
  alfarroba: {
    nome: "Goma alfarroba",
    agua: 0,
    solidos: 1,
    gordura: 0,
    proteina: 0,
    pod: 0,
    pac: 0
  }
}

export const SABORES = {
  avela: {
    nome: "Pasta de avelã",
    agua: 0.05,
    solidos: 0.95,
    gordura: 0.60,
    proteina: 0.15,
    tipo: "concentrado"
  },
  pistache: {
    nome: "Pasta de pistache",
    agua: 0.08,
    solidos: 0.92,
    gordura: 0.55,
    proteina: 0.18,
    tipo: "concentrado"
  },
  amendoim: {
    nome: "Pasta de amendoim",
    agua: 0.05,
    solidos: 0.95,
    gordura: 0.50,
    proteina: 0.25,
    tipo: "concentrado"
  },
  morango: {
    nome: "Morango in natura",
    agua: 0.90,
    solidos: 0.10,
    gordura: 0,
    proteina: 0.01,
    tipo: "aquoso"
  },
  baunilha: {
    nome: "Baunilha",
    agua: 0.95,
    solidos: 0.05,
    gordura: 0,
    proteina: 0,
    tipo: "infusao"
  }
}
