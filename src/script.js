document.addEventListener('DOMContentLoaded', function() {
  // Debug inicial
  console.log('Script carregado');

  // ========== CARROSSEL ==========
  const carrossel = document.querySelector('.carrossel');
  if (carrossel) {
    const slides = document.querySelectorAll('.slide');
    const pontos = document.querySelectorAll('.ponto');
    let slideAtual = 0;
    const totalSlides = slides.length;
    let intervaloCarrossel;
    const tempoTransicao = 5000;

    // Cria elementos das setas se não existirem
    if (!document.querySelector('.seta-carrossel')) {
      const setaEsquerda = document.createElement('button');
      setaEsquerda.className = 'seta-carrossel seta-esquerda';
      setaEsquerda.innerHTML = '❮';
      setaEsquerda.setAttribute('aria-label', 'Slide anterior');
      
      const setaDireita = document.createElement('button');
      setaDireita.className = 'seta-carrossel seta-direita';
      setaDireita.innerHTML = '❯';
      setaDireita.setAttribute('aria-label', 'Próximo slide');
      
      carrossel.appendChild(setaEsquerda);
      carrossel.appendChild(setaDireita);
    }

    // Função para mostrar slide
    function mostrarSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.opacity = '0';
        slide.classList.remove('ativo');
        slide.setAttribute('aria-hidden', 'true');
        
        if (pontos[i]) {
          pontos[i].classList.remove('ativo');
          pontos[i].setAttribute('aria-label', `Ir para slide ${i + 1}`);
        }
      });

      slideAtual = (index + totalSlides) % totalSlides;
      
      slides[slideAtual].style.opacity = '1';
      slides[slideAtual].classList.add('ativo');
      slides[slideAtual].setAttribute('aria-hidden', 'false');
      
      if (pontos[slideAtual]) {
        pontos[slideAtual].classList.add('ativo');
      }
    }

    // Funções de navegação
    function proximoSlide() {
      mostrarSlide(slideAtual + 1);
    }

    function slideAnterior() {
      mostrarSlide(slideAtual - 1);
    }

    // Event listeners para as setas
    document.querySelector('.seta-direita')?.addEventListener('click', function(e) {
      e.stopPropagation();
      clearInterval(intervaloCarrossel);
      proximoSlide();
      iniciarCarrossel();
    });

    document.querySelector('.seta-esquerda')?.addEventListener('click', function(e) {
      e.stopPropagation();
      clearInterval(intervaloCarrossel);
      slideAnterior();
      iniciarCarrossel();
    });

    // Event listeners para os pontos/indicadores
    pontos.forEach((ponto, index) => {
      ponto.addEventListener('click', (e) => {
        e.stopPropagation();
        clearInterval(intervaloCarrossel);
        mostrarSlide(index);
        iniciarCarrossel();
      });
    });

    // Inicia o carrossel automático
    function iniciarCarrossel() {
      clearInterval(intervaloCarrossel);
      intervaloCarrossel = setInterval(proximoSlide, tempoTransicao);
    }

    // Pausa o carrossel quando o mouse está sobre ele
    carrossel.addEventListener('mouseenter', () => {
      clearInterval(intervaloCarrossel);
    });

    carrossel.addEventListener('mouseleave', iniciarCarrossel);

    // Inicializa
    mostrarSlide(0);
    iniciarCarrossel();

    // Adiciona navegação por teclado
    carrossel.addEventListener('keydown', (e) => {
      if (document.activeElement === carrossel || carrossel.contains(document.activeElement)) {
        if (e.key === 'ArrowRight') {
          proximoSlide();
        } else if (e.key === 'ArrowLeft') {
          slideAnterior();
        }
      }
    });
  }

  // ========== MENU RESPONSIVO ==========
  function initResponsiveMenu() {
    const menu = document.querySelector('.menu > ul');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    if (!menu || !hamburgerBtn) {
      console.error('Menu ou botão hamburger não encontrados');
      return;
    }

    console.log('Inicializando menu responsivo');

    // Cria o overlay
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'menu-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }

    // Fecha o menu
    function closeMenu() {
      console.log('Fechando menu');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('mobile-active');
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      document.querySelectorAll('.submenu').forEach(sub => {
        sub.classList.remove('active');
      });
      document.querySelectorAll('.submenu-toggle').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('i')?.classList.remove('fa-chevron-up');
        btn.querySelector('i')?.classList.add('fa-chevron-down');
      });
    }

    // Abre o menu
    function openMenu() {
      console.log('Abrindo menu');
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      menu.classList.add('mobile-active');
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    // Event listener para o botão hamburger
    hamburgerBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      console.log('Botão hamburger clicado, isExpanded:', isExpanded);
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Fecha o menu ao clicar no overlay
    overlay.addEventListener('click', () => {
      console.log('Overlay clicado');
      closeMenu();
    });

    // Fecha o menu ao clicar em um item (exceto se tiver submenu)
    menu.querySelectorAll('a').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!item.nextElementSibling || !item.nextElementSibling.classList.contains('submenu-toggle')) {
          console.log('Item de menu clicado:', item.textContent);
          closeMenu();
        }
      });
    });

    // Fecha o menu ao pressionar Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('mobile-active')) {
        console.log('Tecla Esc pressionada');
        closeMenu();
      }
    });

    // Inicializa submenus mobile
    initMobileSubmenus();
  }

  // ========== SUBMENUS MOBILE ==========
  function initMobileSubmenus() {
    const menuItems = document.querySelectorAll('.menu > ul > li');

    menuItems.forEach(item => {
      const link = item.querySelector('a');
      const submenu = item.querySelector('.submenu');
      
      if (submenu) {
        if (!item.querySelector('.submenu-toggle')) {
          const toggleBtn = document.createElement('button');
          toggleBtn.className = 'submenu-toggle';
          toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.setAttribute('aria-label', 'Expandir submenu');
          
          link.parentNode.insertBefore(toggleBtn, link.nextSibling);
        }

        const toggleBtn = item.querySelector('.submenu-toggle');
        
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
          console.log('Submenu toggle clicado, isExpanded:', isExpanded);
          toggleBtn.setAttribute('aria-expanded', !isExpanded);
          submenu.classList.toggle('active');
          
          const icon = toggleBtn.querySelector('i');
          if (icon) {
            icon.classList.toggle('fa-chevron-up');
            icon.classList.toggle('fa-chevron-down');
          }
        });
      }
    });
  }

  // ========== SISTEMA DE ACESSIBILIDADE ==========
  function initAccessibility() {
    const increaseFont = document.getElementById('increaseFont');
    const decreaseFont = document.getElementById('decreaseFont');
    const fontIndicator = document.querySelector('.font-size-indicator');

    if (!increaseFont || !decreaseFont) {
      console.error('Botões de acessibilidade não encontrados');
      return;
    }

    const elementosAjustaveis = 'body, p, a, span, li, h1, h2, h3, h4, h5, h6';
    const minFontSize = 12;
    const maxFontSize = 24;
    const defaultFontSize = 16;
    let currentFontSize = defaultFontSize;

    function saveFontPreference(size) {
      localStorage.setItem('fontSizePreference', size);
    }

    function loadFontPreference() {
      const savedSize = localStorage.getItem('fontSizePreference');
      if (savedSize) {
        currentFontSize = parseInt(savedSize);
        aplicarTamanhos();
        atualizarIndicadorAcessibilidade();
      }
    }

    function atualizarIndicadorAcessibilidade() {
      if (fontIndicator) {
        const porcentagem = Math.round((currentFontSize / defaultFontSize) * 100);
        fontIndicator.textContent = `${porcentagem}%`;
        saveFontPreference(currentFontSize);
      }
    }

    function aplicarTamanhos() {
      document.querySelectorAll(elementosAjustaveis).forEach(elemento => {
        elemento.style.fontSize = '';
      });
      
      document.documentElement.style.setProperty('--base-font-size', `${currentFontSize}px`);
    }

    function alterarTamanhoFonte(direcao) {
      currentFontSize += (direcao * 2);
      currentFontSize = Math.max(minFontSize, Math.min(maxFontSize, currentFontSize));
      aplicarTamanhos();
      atualizarIndicadorAcessibilidade();
    }

    increaseFont.addEventListener('click', () => alterarTamanhoFonte(1));
    decreaseFont.addEventListener('click', () => alterarTamanhoFonte(-1));

    loadFontPreference();
  }

  // ========== OBSERVADOR DE MUDANÇA DE TAMANHO ==========
  function initResizeObserver() {
    const secretariaInfo = document.querySelector('.secretaria-info');
    if (!secretariaInfo) return;

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const mapaContainer = entry.target.querySelector('.mapa-container');
        if (mapaContainer) {
          const textoInfo = entry.target.querySelector('.texto-info');
          if (textoInfo && window.innerWidth >= 768) {
            mapaContainer.style.height = `${textoInfo.offsetHeight}px`;
          } else {
            mapaContainer.style.height = '';
          }
        }
      }
    });

    observer.observe(secretariaInfo);
  }

  // ========== INICIALIZAÇÃO ==========
  console.log('Inicializando scripts');
  initResponsiveMenu();
  initAccessibility();
  initResizeObserver();

  document.documentElement.classList.add('js-enabled');
});
