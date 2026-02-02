import { DB } from './ingredientes.js';
import { GelatoCalculadora } from './Calculadora.js';

const calc = new GelatoCalculadora(DB);
let receitaAtiva = {
    leiteIntegral: 510, cremeLeite: 120, pastaAvela: 100, 
    açucar: 110, dextrose: 70, leitePoDesn: 45, inulina: 40, gomaGuar: 3
};

function atualizarInterface() {
    const resultados = calc.calcular(receitaAtiva);
    
    // Atualiza o DOM (Exemplo para Gordura)
    document.getElementById('res-gordura').innerHTML = `Gordura: ${resultados.gordura.toFixed(1)}%`;
    validar('res-gordura', resultados.gordura, 6, 12);
    
    // Repetir para os outros campos...
    document.getElementById('total-massa').innerText = `${resultados.totalG.toFixed(0)}g`;
}

function validar(id, valor, min, max) {
    const el = document.getElementById(id);
    if (valor >= min && valor <= max) {
        el.className = 'metric-card status-ok';
        el.querySelector('.metric-status').innerText = '✓ Balanceado';
    } else if (valor < min) {
        el.className = 'metric-card status-low';
        el.querySelector('.metric-status').innerText = '⚠ Abaixo do Ideal';
    } else {
        el.className = 'metric-card status-high';
        el.querySelector('.metric-status').innerText = '⚠ Excesso';
    }
}

// Escutador de inputs
window.atualizarPeso = (ing, valor) => {
    receitaAtiva[ing] = parseFloat(valor) || 0;
    atualizarInterface();
};

atualizarInterface();