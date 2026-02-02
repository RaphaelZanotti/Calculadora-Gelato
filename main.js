import { DB } from './ingredientes.js';
import { GelatoCalculadora } from './Calculadora.js';

const calc = new GelatoCalculadora(DB);

window.formularReceita = () => {
    const pesoTotal = parseFloat(document.getElementById('inputPesoFinal').value);
    const saborId = document.getElementById('selectSabor').value;
    const qtdSabor = parseFloat(document.getElementById('inputQtdSabor').value);

    const novaReceita = calc.resolver(saborId, qtdSabor, pesoTotal);
    renderTable(novaReceita);
    atualizarBarras(novaReceita, pesoTotal);
};

function renderTable(receita) {
    const lista = document.getElementById('listaIngredientes');
    lista.innerHTML = '';
    for (let ing in receita) {
        lista.innerHTML += `<li>${DB[ing].nome}: <strong>${receita[ing].toFixed(1)}g</strong></li>`;
    }
}