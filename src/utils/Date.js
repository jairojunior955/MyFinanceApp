export function formatarData(data) {
    const dia = data.getDate().toString().padStart(2, '0'); // Garante que o dia tenha sempre 2 dígitos
    const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // getMonth() retorna 0-11; soma 1 para ajustar
    const ano = data.getFullYear();
  
    return `${dia}-${mes}-${ano}`;
  }


  export function converterParaData(dataString) {
    const partes = dataString.split('-');

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; 
    const ano = parseInt(partes[2], 10);
    
    const data = new Date(ano, mes, dia);
  
    return data;
  }