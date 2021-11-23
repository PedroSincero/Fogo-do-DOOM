// Estas 3 variaveis serão utilizadas no 'createFireDataStructures', para popular o firePixelsArray
// 1 - firePixelsArray: utilização de um Array Linear, ou seja. Todos os Pixels do Fogo estarão 1 do lado do outro.
const firePixelsArray = [];
// 1.2 - fireWidth, fireHeight: Utilizado para definir o tamanho do Fogo, tanto para a sua largura quanto a altura.
const fireWidth = 40;
const fireHeight = 40;

// 7 - está é a palleta de cores do fogo, nele contem um Array com as 36 intensidades
const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]

// 0 - Função de Inicialização
const start = () => {
createFireDataStructures();
createFireSource();
renderFire();
  setInterval(calculateFirePropagation, 50);
}

// 2 - Função para a Estrutura dos Dados 
const createFireDataStructures = () => {
  // Multiplico a largura pela altura criar estrutura dos dados que irão nos servir como pixels do nosso fogo.
  const numberOfPixels = fireWidth * fireHeight;
  // Utilizo o 'numberOfPixels' como parametro do for para percorrer até que ele seja menor que o 'numberOfPixels'. (caso o 'numberOfPixels' tivesse um valor de 24, o for iria percorrer 24 vezes)
  for (let i = 0; i < numberOfPixels; i++) {
    // E para cada percurso eu incremento ao indice do array X o valor 0 que representa a intensidade do fogo
    firePixelsArray[i] = 0
  }
}

// 6 - Altera o valor da Intensidade, por parametro ela irá receber o pixel atual 
const updateFireIntensityPerPixels = (currentPixelIndex) => {
  //  pegamos o valor de referencia do pixel e somamos com a altura para pegarmos o pixel de baixo.
  const belowPixelIndex = currentPixelIndex + fireWidth
// aqui, indentificamos quando chegamos no ultimo pixel, dito isso. se o pixel de baixo for maior que o tamanho * altura, não faço nada.
  if(belowPixelIndex >= fireWidth * fireHeight) {
    return 
  }
// decay representa o decaimento do fogo, adicionamos um valor 'random' para quebrar a linearidade do fogo.
  const decay = Math.floor(Math.random() * 3);
  // armazenamos o valor do pixel de baixo
  const belowPixelFireIntensity = firePixelsArray[belowPixelIndex]
  // Definimos o novo valor de intensidade do fogo, porém antes verificamos se o pixel de baixo - o decay é maior que 0, isso nos ajudará para que não tenha valores negativos nos pixels 
  const newFireIntensity = belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0
// adicionando o decay  e fazemos uma subtração na posição do 'firePixelsArray' para dar um pequeno efeito de vento ao fogo. Que ira se propagar e atualizar o valor do lado.
  firePixelsArray[currentPixelIndex - decay] = newFireIntensity
}

// 3 - Função que Renderiza na tela o Fogo
// Criamos uma 'Table' que por natureza ja tem o formato de uma matriz e para cada celula da matriz iremos mostrar as informações da estrutura de dados do Fogo.
// Está parte é a mais chatinha, pois teremos que fazer um pequeno calculo para irmos adicionando os valores do indice do array para cada pixel que será renderizado na pagina.
const renderFire = () => {
  // 7.1 - Utilizamos o debug para renderizar as celulas coloridas, caso queira visualizar sem o CSS, podemos alterar o valor de 'debug' para true.
  const debug = false;
  let html = '<table cellpadding=0 cellspacing=0>'

// Percorremos a altura do fogo, primeiro interamos as linhas
  for (let row = 0; row < fireHeight; row++) {
// E para Cada Pixel da altura do fogo será adicionado um '<tr>'
    html += '<tr>'

// Percorremos a Largura do Fogo para adicionar suas Colunas, e para cada percurso do for iremos adicionar o indice do Array dentro das celulas.
      for( let column = 0; column < fireWidth; column++) {
// Com isso, fazemos um pequeno calculo para que possamos ir para a coluna de baixo. Então, se eu conheço minha posição vertical e multiplico a minha largura pelo numero que eu estou iterando(no caso, colum) eu irei ter o valor da proxima linha.
// por exemplo, se eu estou na coluna 1, e somar 1 largura, devo descer 1 linha. No caso de 2, devo descer 2 linhas
        const pixelIndex = column + (fireWidth * row);
        // Agora vamos utilizar o 'pixelIndex' e acessar o valor contido dentro do 'firePixelsArray'.
        const fireIntensity = firePixelsArray[pixelIndex];
        
        if (debug === true) {
          html += '<td>'
          // Para deixarmos o valor do 'pixelIndex' mais visivel, adicionamos ele dentro de uma Div
          html += `<div class="pixel-index">${pixelIndex}</div>`
          html += fireIntensity
          html += '</td>'
        }else {
          // 7.2 - Para cada Intensidade do pixel, pegaremos os valores do 'fireColorsPalette' e iremos injetar dentro delas
          const color = fireColorsPalette[fireIntensity]
          const colorString = `${color.r}, ${color.g}, ${color.b}`
          html += `<td class="pixel" style="background-color: rgb(${colorString}">`
          html += '</td>'
        }

      }

    html += '</tr>'
  }
  html += '</table>'

  document.querySelector('#fireCanvas').innerHTML = html
}

// 5 - Função para o Algoritmo, que calcula a propagação do fogo. Ela é uma função que estará em loop a todo momento, calculando a intensidade de todos os pixels do fogo 0 > 10.
const calculateFirePropagation = () => {
  // Percorremos coluna por coluna, para depois dentro da coluna percorrer em cada altura. Finalizando a altura, será percorrido a proxima coluna.
  for (let column = 0; column < fireWidth; column++) {
    for ( let row = 0; row < fireHeight; row++) {
      // Com o loop feito, poderemos descobrir em qual pixel estamos
      const pixelIndex = column + (fireWidth * row)

      // console.log(pixelIndex);
      // Está função irá verificar o pixel de baixo e alterar o valor da intensidade
      updateFireIntensityPerPixels(pixelIndex)
    }
  }
// 6 -  Depois que todos os pixels serem calculados, renderizamos ele na tela.
  renderFire();
}

// 4 - Cria a propagação do Fogo
const createFireSource = () => {
  // Percorremos por todas as Colunas, e para cada interação da coluna. Iremos alterar o valor do Pixel.
  for(let column = 0; column <= fireWidth; column++) {
    // Multiplicamos a largura pela altura, para nos darmos um valor fora da estrutura de dados, isso será utilizado para eu descobrir  qual é a ultima coluna da tabela.
    const overflowPixelIndex = fireWidth * fireHeight
    //  Dito isso, iremos utilizar para fazer um percurso de baixo para cima. No processo anterior quando adicionamos uma largura, a gente pula para uma linha de baixo, então fazemos um processo contrário para subir uma linha.
    const pixelIndex = (overflowPixelIndex - fireWidth) + column

    firePixelsArray[pixelIndex] = 36
  }
}

// Aqui é onde iniciamos o Fogo
start();
