document.addEventListener('DOMContentLoaded', function() {
    // ========== CARROSSEL ==========
    const slides = document.querySelectorAll('.slide');
    const pontos = document.querySelectorAll('.ponto');
    const btnAnterior = document.querySelector('.anterior');
    const btnProximo = document.querySelector('.proximo');
    let slideAtual = 0;
    const totalSlides = slides.length;
    let intervaloCarrossel;
    const tempoTransicao = 10000; // 10 segundos (corrigido)
  
    // Função para mostrar slide
    function mostrarSlide(index) {
      // Esconde todos os slides
      slides.forEach(slide => {
        slide.style.opacity = '0';
        slide.classList.remove('ativo');
      });
      
      // Remove a classe ativo de todos os pontos
      pontos.forEach(ponto => {
        ponto.classList.remove('ativo');
      });
  
      // Atualiza o slide atual
      slideAtual = (index + totalSlides) % totalSlides;
      
      // Mostra o slide atual
      slides[slideAtual].style.opacity = '1';
      slides[slideAtual].classList.add('ativo');
      pontos[slideAtual].classList.add('ativo');
    }
  
    // Função para próximo slide
    function proximoSlide() {
      mostrarSlide(slideAtual + 1);
    }
  
    // Inicia o carrossel automático
    function iniciarCarrossel() {
      clearInterval(intervaloCarrossel); // Limpa qualquer intervalo existente
      intervaloCarrossel = setInterval(proximoSlide, tempoTransicao);
    }
  
    // Event listeners
    btnProximo.addEventListener('click', () => {
      clearInterval(intervaloCarrossel);
      proximoSlide();
      iniciarCarrossel();
    });
  
    btnAnterior.addEventListener('click', () => {
      clearInterval(intervaloCarrossel);
      mostrarSlide(slideAtual - 1);
      iniciarCarrossel();
    });
  
    // Adiciona eventos para os pontos indicadores
    pontos.forEach((ponto, index) => {
      ponto.addEventListener('click', () => {
        clearInterval(intervaloCarrossel);
        mostrarSlide(index);
        iniciarCarrossel();
      });
    });
  
    // Pausa o carrossel quando o mouse está sobre ele
    const carrossel = document.querySelector('.carrossel');
    carrossel.addEventListener('mouseenter', () => {
      clearInterval(intervaloCarrossel);
    });
  
    carrossel.addEventListener('mouseleave', iniciarCarrossel);
  
    // ========== ACESSIBILIDADE ==========
    const increaseFont = document.getElementById('increaseFont');
    const decreaseFont = document.getElementById('decreaseFont');
    const html = document.documentElement;
    const elementosFonte = document.querySelectorAll('.font-adjust');
  
    // Tamanhos mínimo e máximo de fonte
    const minFontSize = 12;
    const maxFontSize = 24;
    let currentFontSize = parseInt(getComputedStyle(html).fontSize);
  
    increaseFont.addEventListener('click', () => {
      alterarTamanhoFonte(1);
    });
  
    decreaseFont.addEventListener('click', () => {
      alterarTamanhoFonte(-1);
    });
  
    function alterarTamanhoFonte(direcao) {
      currentFontSize += (direcao * 2);
      
      // Limita entre os valores mínimo e máximo
      currentFontSize = Math.max(minFontSize, Math.min(maxFontSize, currentFontSize));
      html.style.setProperty('--base-font-size', `${currentFontSize}px`);
    }
  
    // Inicia o carrossel
    mostrarSlide(0);
    iniciarCarrossel();
  });