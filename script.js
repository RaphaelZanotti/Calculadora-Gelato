export class GelatoCalculadora {
    constructor(db) {
        this.db = db;
    }

    calcular(receita) {
        let totais = { peso: 0, gord: 0, pac: 0, pod: 0, sol: 0, smp: 0 };

        for (let id in receita) {
            const peso = receita[id];
            const ficha = this.db[id];

            if (ficha) {
                totais.peso += peso;
                totais.gord += peso * ficha.gord;
                totais.pac  += peso * ficha.pac;
                totais.pod  += peso * ficha.pod;
                totais.sol  += peso * ficha.sol;
                totais.smp  += peso * ficha.smp;
            }
        }

        // Retorna as porcentagens finais
        return {
            totalG: totais.peso,
            gordura: (totais.gord / totais.peso) * 100,
            pac: (totais.pac / totais.peso) * 100,
            pod: (totais.pod / totais.peso) * 100,
            solidos: (totais.sol / totais.peso) * 100,
            smp: (totais.smp / totais.peso) * 100
        };
    }
}