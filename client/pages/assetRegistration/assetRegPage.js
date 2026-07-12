document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
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

  menuToggle.addEventListener('click', openSidebar);
  overlay.addEventListener('click', closeSidebar);

  const registerBtn = document.getElementById('register-btn');
  const registerModal = document.getElementById('register-modal');
  const registerForm = document.getElementById('register-form');
  const assetTagInput = document.getElementById('asset-tag');

  const historyModal = document.getElementById('history-modal');
  const historyTitle = document.getElementById('history-title');
  const viewHistoryBtns = document.querySelectorAll('.view-history');

  function generateAssetTag() {
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `AF-${randomNum}`;
  }

  if (registerBtn) {
      registerBtn.addEventListener('click', () => {
          registerForm.reset();
          assetTagInput.value = generateAssetTag();
          registerModal.classList.remove('hidden');
      });
  }

  if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
          e.preventDefault();
          console.log('Asset Registered:', assetTagInput.value);
          registerModal.classList.add('hidden');
      });
  }

  viewHistoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
          const assetId = e.target.getAttribute('data-id');
          historyTitle.textContent = `Asset History: ${assetId}`;
          historyModal.classList.remove('hidden');
      });
  });

  document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
          const modal = e.target.closest('.modal');
          if (modal) {
              modal.classList.add('hidden');
          }
      });
  });
});