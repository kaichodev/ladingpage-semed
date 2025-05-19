document.addEventListener('DOMContentLoaded', function() {
  console.log('Script de paper carregado');

  const carouselContainer = document.querySelector('.carousel-container');
  const carouselTrack = document.querySelector('.carousel-track');
  let cards = Array.from(document.querySelectorAll('.carousel-card'));

  if (!carouselContainer || !carouselTrack || !cards.length) {
    console.error('Elementos do carrossel não encontrados');
    return;
  }

  const cardWidth = cards[0].offsetWidth + 20; // Largura do card + gap
  let currentPosition = 0;
  let maxScroll = (cards.length * cardWidth) - carouselContainer.offsetWidth;
  const scrollStep = 50; // Passo de rolagem por evento de wheel

  // Clonar cards para rolagem infinita
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    carouselTrack.appendChild(clone);
  });

  // Atualizar a lista de cards com os clones
  cards = Array.from(document.querySelectorAll('.carousel-card'));
  const totalWidth = cards.length * cardWidth;
  carouselTrack.style.width = `${totalWidth}px`;

  // Função para atualizar maxScroll dinamicamente
  function updateMaxScroll() {
    maxScroll = (cards.length * cardWidth) - carouselContainer.offsetWidth;
    if (currentPosition > 0) currentPosition = 0;
    if (currentPosition < -maxScroll) currentPosition = -maxScroll + (cards.length / 2 * cardWidth); // Ajuste para infinito
  }

  // Adicionar evento de redimensionamento
  window.addEventListener('resize', updateMaxScroll);

  // Função para mover o carrossel com rolagem infinita
  function moveCarousel(delta) {
    let newPosition = currentPosition + (delta * scrollStep);

    // Rolagem infinita: ajusta quando atinge o final
    if (newPosition <= -maxScroll) {
      newPosition += maxScroll;
      carouselTrack.style.transition = 'none';
      carouselTrack.style.transform = `translateX(${newPosition}px)`;
      setTimeout(() => {
        carouselTrack.style.transition = 'transform 0.3s ease';
      }, 50);
    } else if (newPosition >= 0) {
      newPosition -= maxScroll;
      carouselTrack.style.transition = 'none';
      carouselTrack.style.transform = `translateX(${newPosition}px)`;
      setTimeout(() => {
        carouselTrack.style.transition = 'transform 0.3s ease';
      }, 50);
    }

    currentPosition = newPosition;
    carouselTrack.style.transform = `translateX(${currentPosition}px)`;
  }

  // Função para expandir o card
  function expandCard(card) {
    if (card.classList.contains('expanded')) return;

    // Remover expansão de outros cards
    document.querySelectorAll('.carousel-card.expanded').forEach(c => {
      c.classList.remove('expanded');
      c.querySelector('.expanded-content')?.remove();
    });

    card.classList.add('expanded');

    // Criar conteúdo expandido
    const expandedContent = document.createElement('div');
    expandedContent.classList.add('expanded-content');

    const mapContainer = document.createElement('div');
    mapContainer.classList.add('map-container');
    const mapIframe = document.createElement('iframe');
    mapIframe.src = card.getAttribute('data-map');
    mapIframe.width = "100%";
    mapIframe.height = "100%";
    mapIframe.style.border = "0";
    mapIframe.allowFullscreen = true;
    mapContainer.appendChild(mapIframe);

    const description = document.createElement('div');
    description.classList.add('description');
    const extraInfo = card.getAttribute('data-extra-info').split(' - ');
    const h4 = document.createElement('h4');
    h4.textContent = 'Detalhes do Projeto';
    const p = document.createElement('p');
    p.innerHTML = extraInfo.map(info => `<strong>${info.split(': ')[0]}:</strong> ${info.split(': ')[1]}`).join('<br>');
    description.appendChild(h4);
    description.appendChild(p);

    expandedContent.appendChild(mapContainer);
    expandedContent.appendChild(description);
    card.appendChild(expandedContent);
  }

  // Função para recolher o card
  function collapseCard(card) {
    card.classList.remove('expanded');
    card.querySelector('.expanded-content')?.remove();
  }

  // Adicionar eventos de mouse
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => expandCard(card));
    card.addEventListener('mouseleave', () => collapseCard(card));
  });

  // Detectar rolagem do mouse no container, não nos cards
  carouselContainer.addEventListener('wheel', function(e) {
    e.preventDefault(); // Impede a rolagem da página
    if (e.deltaY < 0) {
      moveCarousel(1); // Roda para cima = mover para a direita
    } else if (e.deltaY > 0) {
      moveCarousel(-1); // Roda para baixo = mover para a esquerda
    }
  }, { passive: false });

  // Suporte a navegação por teclado
  carouselContainer.setAttribute('tabindex', '0');
  carouselContainer.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
      moveCarousel(1);
    } else if (e.key === 'ArrowLeft') {
      moveCarousel(-1);
    }
  });

  // Inicializar maxScroll
  updateMaxScroll();
});