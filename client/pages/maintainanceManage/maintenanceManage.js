document.addEventListener("DOMContentLoaded", () => {
    // 1. Sidebar Logic (Retained from original)
    const navItems = document.querySelectorAll('.nav-item');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
  
    navItems.forEach(item => {
      item.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) closeSidebar();
      });
    });
  
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

    // 2. Mock Databases for Automated Updates
    const mockAssetDB = {
        "AF-0062": { status: "Available", history: [] },
        "AF-0034": { status: "Available", history: [] },
        "AF-0078": { status: "Under Maintenance", history: [] },
        "AF-0897": { status: "Under Maintenance", history: [] },
        "AF-0873": { status: "Available", history: [] },
        "AF-0114": { status: "Available", history: [] }
    };

    const toast = document.getElementById('maintenance-toast');
    function showToast(message, isWarning = false) {
        toast.textContent = message;
        toast.style.background = isWarning ? '#f59e0b' : '#10b981';
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 3500);
    }

    // 3. Kanban Drag and Drop Logic
    function initializeDragAndDrop() {
        const cards = document.querySelectorAll('.kanban-card');
        const containers = document.querySelectorAll('.kanban-cards-container');

        cards.forEach(card => {
            // Prevent re-attaching multiple event listeners
            card.removeEventListener('dragstart', handleDragStart);
            card.removeEventListener('dragend', handleDragEnd);
            
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragend', handleDragEnd);
        });

        containers.forEach(container => {
            container.addEventListener('dragover', handleDragOver);
        });
    }

    function handleDragStart(e) {
        e.target.classList.add('dragging');
    }

    function handleDragEnd(e) {
        const card = e.target;
        card.classList.remove('dragging');
        processStateChange(card);
    }

    function handleDragOver(e) {
        e.preventDefault();
        const container = e.currentTarget;
        const draggingCard = document.querySelector('.dragging');
        if (!draggingCard) return;

        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(draggingCard);
        } else {
            container.insertBefore(draggingCard, afterElement);
        }
    }

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

    // 4. Automated Workflow & Status Rules
    function processStateChange(card) {
        const columnId = card.closest('.kanban-column').id;
        const assetId = card.getAttribute('data-asset');
        const today = new Date().toLocaleDateString();
        
        // Remove styling first
        card.classList.remove('resolved');

        let newStatus = "";
        let historyMsg = "";

        if (columnId === 'col-approved') {
            newStatus = "Under Maintenance";
            historyMsg = `Request approved on ${today}`;
            showToast(`Asset ${assetId} status automatically set to Under Maintenance.`);
        } 
        else if (columnId === 'col-rejected') {
            newStatus = "Available";
            historyMsg = `Request rejected on ${today}`;
            showToast(`Asset ${assetId} request rejected. Status is Available.`, true);
        }
        else if (columnId === 'col-resolved') {
            card.classList.add('resolved');
            newStatus = "Available";
            historyMsg = `Maintenance resolved on ${today}`;
            showToast(`Asset ${assetId} repaired. Status automatically reverted to Available.`);
        }
        else if (columnId === 'col-technician') {
            newStatus = "Under Maintenance";
            historyMsg = `Technician assigned on ${today}`;
        }
        
        if (newStatus && mockAssetDB[assetId]) {
            mockAssetDB[assetId].status = newStatus;
            mockAssetDB[assetId].history.push(historyMsg);
            console.log(`[DB UPDATE] ${assetId}: ${newStatus} | History:`, mockAssetDB[assetId].history);
        }
    }

    // 5. Raise Request Form Handling
    const btnRaiseRequest = document.getElementById('btn-raise-request');
    const requestModal = document.getElementById('request-modal');
    const requestForm = document.getElementById('request-form');
    const colPending = document.querySelector('#col-pending .kanban-cards-container');

    btnRaiseRequest.addEventListener('click', () => {
        requestModal.classList.remove('hidden');
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.add('hidden');
        });
    });

    requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const assetId = document.getElementById('req-asset').value;
        const priority = document.getElementById('req-priority').value;
        const issue = document.getElementById('req-issue').value;

        // Initialize missing asset in mock DB if needed
        if (!mockAssetDB[assetId]) mockAssetDB[assetId] = { status: "Available", history: [] };
        mockAssetDB[assetId].history.push(`Maintenance requested: ${issue} on ${new Date().toLocaleDateString()}`);

        // Construct Card Element
        const newCard = document.createElement('div');
        newCard.className = 'kanban-card';
        newCard.setAttribute('draggable', 'true');
        newCard.setAttribute('data-asset', assetId);

        let badgeClass = priority === 'high' ? 'badge-high' : priority === 'medium' ? 'badge-medium' : 'badge-low';
        let priorityText = priority.charAt(0).toUpperCase() + priority.slice(1);

        newCard.innerHTML = `
            <strong>${assetId}</strong>
            <span class="badge ${badgeClass}">${priorityText}</span>
            <p>${issue}</p>
        `;

        colPending.appendChild(newCard);
        
        // Re-init drag listeners for the new element
        initializeDragAndDrop();

        requestModal.classList.add('hidden');
        requestForm.reset();
        showToast(`Request submitted for ${assetId} and routed for approval.`);
    });

    // Run initial configuration
    initializeDragAndDrop();
});