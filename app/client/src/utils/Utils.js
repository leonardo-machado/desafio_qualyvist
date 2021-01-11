class Utils {

    addMessage(messages, message){
        messages = messages || '';

        if(messages !== ''){
            messages += '\n';
        }

        messages += message;

        return messages;
    }

    clone(obj){
        return JSON.parse(JSON.stringify(obj));
    }

    removeNullElements(test_array){
        let index = -1;
        const arr_length = test_array ? test_array.length : 0;
        let resIndex = -1;
        const result = [];
        
        while (++index < arr_length) {
            const value = test_array[index];
        
            if (value) {
                result[++resIndex] = value;
            }
        }
        
        return result;
    }
    
    validarCpfCnpj(tipo, valor) {
        if (valor === undefined || valor === null || valor === '') {
            return false
        } else {
            // Lógica de validação do CPF
            // Fonte: https://www.devmedia.com.br/validar-cpf-com-javascript/23916
            if (tipo === 'cpf') { // trocar a palavra particula para CPF

                // Elimina os simpolos da string
                let strCPF = valor.replace(/[^\d]+/g, '');
    
                let soma;
                let resto;
                soma = 0;

                // Elimina CPFs inválidos conhecidos
                if (
                    strCPF === "00000000000" || 
                    strCPF === "11111111111" ||
                    strCPF === "22222222222" ||
                    strCPF === "33333333333" ||
                    strCPF === "44444444444" ||
                    strCPF === "55555555555" ||
                    strCPF === "66666666666" ||
                    strCPF === "77777777777" ||
                    strCPF === "88888888888" ||
                    strCPF === "99999999999") {
                    return false;
                }

                for (let i = 1; i <= 9; i++) {
                    soma = soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
                    resto = (soma * 10) % 11;
                }

                if ((resto === 10) || (resto === 11)) {
                    resto = 0;
                }

                if (resto !== parseInt(strCPF.substring(9, 10))) {
                    return false;
                }

                soma = 0;

                for (let i = 1; i <= 10; i++) {
                    soma = soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
                    resto = (soma * 10) % 11;
                }

                if ((resto === 10) || (resto === 11)) {
                    resto = 0;
                }

                if (resto !== parseInt(strCPF.substring(10, 11))) {
                    return false;
                }

                return true;

            } else { 
                // Lógica de validação do CNPJ
                // Fonte: https://www.geradorcnpj.com/javascript-validar-cnpj.htm
               
                // Elimina os símbolos da string
                let strCNPJ = valor.replace(/[^\d]+/g, '');

                let tamanho;
                let numeros;
                let digitos;
                let soma;
                let pos;
                let resultado;
                let i;

                if (strCNPJ === '') {
                    return false;
                    
                }

                if (strCNPJ.length !== 14) {
                    return false;
                }

                // Elimina CNPJs inválidos conhecidos
                if (strCNPJ === "00000000000000" ||
                    strCNPJ === "11111111111111" ||
                    strCNPJ === "22222222222222" ||
                    strCNPJ === "33333333333333" ||
                    strCNPJ === "44444444444444" ||
                    strCNPJ === "55555555555555" ||
                    strCNPJ === "66666666666666" ||
                    strCNPJ === "77777777777777" ||
                    strCNPJ === "88888888888888" ||
                    strCNPJ === "99999999999999") {
                    return false;
                    
                }

                // Valida DVs
                tamanho = strCNPJ.length - 2
                numeros = strCNPJ.substring(0, tamanho);
                digitos = strCNPJ.substring(tamanho);
                soma = 0;
                pos = tamanho - 7;

                for (i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2) {
                        pos = 9;
                    }
                }

                resultado = (soma % 11 < 2 ? 0 : 11 - soma % 11).toString();

                if (resultado !== digitos.charAt(0)) {
                    return false;
                }

                tamanho = tamanho + 1;
                numeros = strCNPJ.substring(0, tamanho);
                soma = 0;
                pos = tamanho - 7;

                for (i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2) {
                        pos = 9;
                    }
                }

                resultado = (soma % 11 < 2 ? 0 : 11 - soma % 11).toString();

                if (resultado !== digitos.charAt(1)) {
                    return false;
                }

                return true;
            }
        }
    }

    validaEmail(email) {
        let user = email.substring(0, email.indexOf("@"));
        let domain = email.substring(email.indexOf("@") + 1, email.length);
        if ((user.length >= 1) &&
            (domain.length >= 3) &&
            (user.search("@") === -1) &&
            (domain.search("@") === -1) &&
            (user.search(" ") === -1) &&
            (domain.search(" ") === -1) &&
            (domain.search(".") !== -1) &&
            (domain.indexOf(".") >= 1) &&
            (domain.lastIndexOf(".") < domain.length - 1)) {
            return true;
        } else {
            return false;
        }
    }

}

export default new Utils();