document.addEventListener('DOMContentLoaded', function() {
  // ========== ACESSIBILIDADE ==========
  const increaseFont = document.getElementById('increaseFont');
  const decreaseFont = document.getElementById('decreaseFont');
  const fontIndicator = document.querySelector('.font-size-indicator');
  
  // Elementos que devem ser afetados (excluindo títulos e elementos específicos)
  const elementosAjustaveis = [
      'p', 'a:not(.service-btn)', 'li', 
      'span:not(.service-btn span):not(.font-size-indicator):not(.accessibility *)',
      'div:not(.service-btn):not(.mapa-container)'
  ].join(', ');
  
  const elementosParaAjuste = document.querySelectorAll(elementosAjustaveis);

  // Tamanhos de fonte
  const minFontSize = 12;  // 50%
  const maxFontSize = 24;  // 200%
  const defaultFontSize = 16; // 100% (tamanho padrão)
  let currentFontSize = defaultFontSize;

  // Tamanhos originais dos títulos (em px)
  const tamanhosOriginais = {
      'H1': 32,
      'H2': 28,
      'H3': 24,
      'H4': 20,
      'H5': 18,
      'H6': 16
  };

  // Função para atualizar o indicador de acessibilidade
  function atualizarIndicadorAcessibilidade() {
      if (fontIndicator) {
          // Calcula a porcentagem baseada na escala 12px=50% a 24px=200%
          const porcentagem = Math.round(((currentFontSize - minFontSize) / (maxFontSize - minFontSize)) * 150 + 50);
          fontIndicator.textContent = `${porcentagem}%`;
      }
  }

  // Função para calcular tamanho com acessibilidade
  function calcularTamanhoAjustado(tagName, fontSize) {
      const proporcao = currentFontSize / defaultFontSize;
      return tagName in tamanhosOriginais 
          ? tamanhosOriginais[tagName] * proporcao
          : fontSize * proporcao;
  }

  // Função para aplicar os tamanhos
  function aplicarTamanhos() {
      // Ajusta elementos comuns
      elementosParaAjuste.forEach(elemento => {
          const estilo = window.getComputedStyle(elemento);
          const fontSize = parseFloat(estilo.fontSize);
          elemento.style.fontSize = `${calcularTamanhoAjustado('', fontSize)}px`;
      });
      
      // Ajusta títulos mantendo proporções originais
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(titulo => {
          const tagName = titulo.tagName;
          titulo.style.fontSize = `${calcularTamanhoAjustado(tagName, 0)}px`;
      });
  }

  // Função para alterar o tamanho da fonte
  function alterarTamanhoFonte(direcao) {
      currentFontSize += (direcao * 2);
      currentFontSize = Math.max(minFontSize, Math.min(maxFontSize, currentFontSize));
      aplicarTamanhos();
      atualizarIndicadorAcessibilidade();
  }

  // Event listeners para os botões de acessibilidade
  if (increaseFont && decreaseFont) {
      increaseFont.addEventListener('click', () => {
          alterarTamanhoFonte(1);
      });

      decreaseFont.addEventListener('click', () => {
          alterarTamanhoFonte(-1);
      });
  }

  // Inicia o sistema com os valores padrão
  aplicarTamanhos();
  atualizarIndicadorAcessibilidade();
});
