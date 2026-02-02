export class GelatoCalculadora {
    constructor(db) {
        this.db = db;
    }

    // Método que calcula a receita baseada em alvos técnicos
    resolver(saborizanteId, qtdSaborizante, pesoFinal) {
        // Alvos fixos para Gelato Profissional
        const alvoGordura = 0.08; // 8%
        const alvoPAC = 0.27;     // 27 (Macio no freezer)
        const alvoPOD = 0.17;     // 17%
        const alvoSMP = 0.09;     // 9%

        // Cálculo simplificado de balanço de massa
        // Aqui o script define os ingredientes fixos primeiro
        let pasta = qtdSaborizante;
        let guar = pesoFinal * 0.003; 
        let inulina = pesoFinal * 0.04;

        // O restante é distribuído via álgebra para bater Gordura e PAC
        // Para fins didáticos, vamos estruturar o retorno proporcional:
        let leitePo = (pesoFinal * alvoSMP) / 0.96;
        let gorduraNecessaria = (pesoFinal * alvoGordura) - (pasta * this.db[saborizanteId].gord);
        let creme = gorduraNecessaria / 0.35;
        
        // Açúcares para bater o PAC
        let açucar = pesoFinal * 0.11; 
        let dextrose = pesoFinal * 0.06;

        let leite = pesoFinal - (creme + pasta + açucar + dextrose + leitePo + inulina + guar);

        return {
            leiteIntegral: leite,
            cremeLeite: creme,
            [saborizanteId]: pasta,
            açucar: açucar,
            dextrose: dextrose,
            leitePoDesn: leitePo,
            inulina: inulina,
            gomaGuar: guar
        };
    }
}