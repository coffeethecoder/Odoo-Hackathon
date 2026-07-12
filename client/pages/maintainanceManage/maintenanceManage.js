document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          closeSidebar();
        }
      });
    });
  
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
  
    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('show');
    }
  
    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    }
  
    if(menuToggle && overlay) {
        menuToggle.addEventListener('click', openSidebar);
        overlay.addEventListener('click', closeSidebar);
    }

    const cards = document.querySelectorAll('.kanban-card');
    const containers = document.querySelectorAll('.kanban-cards-container');

    cards.forEach(card => {
        card.addEventListener('dragstart', () => {
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            checkResolvedState(card);
        });
    });

    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const draggingCard = document.querySelector('.dragging');
            
            const afterElement = getDragAfterElement(container, e.clientY);
            if (afterElement == null) {
                container.appendChild(draggingCard);
            } else {
                container.insertBefore(draggingCard, afterElement);
            }
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.kanban-card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function checkResolvedState(card) {
        const parentColumnHeader = card.closest('.kanban-column').querySelector('.kanban-column-header').textContent.trim().toLowerCase();
        
        if (parentColumnHeader === 'resolved') {
            card.classList.add('resolved');
        } else {
            card.classList.remove('resolved');
        }
    }
});