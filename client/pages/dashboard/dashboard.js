document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
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

  if (menuToggle && overlay) {
    menuToggle.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);
  }

  let dashboardData = {
    available: 124,
    allocated: 56,
    maintenance: 3,
    activeBookings: 12,
    pendingTransfers: 5,
    upcomingReturns: 8,
    overdueReturns: 0
  };

  function renderKPIs(data) {
    const kpiNodes = document.querySelectorAll('.kpi-value');
    
    if (kpiNodes.length === 7) {
      kpiNodes[0].textContent = data.available;
      kpiNodes[1].textContent = data.allocated;
      kpiNodes[2].textContent = data.maintenance;
      kpiNodes[3].textContent = data.activeBookings;
      kpiNodes[4].textContent = data.pendingTransfers;
      kpiNodes[5].textContent = data.upcomingReturns;
      kpiNodes[6].textContent = data.overdueReturns;
    }
  }

  function fetchDashboardData() {
    setTimeout(() => {
      renderKPIs(dashboardData);
    }, 500);
  }

  fetchDashboardData();

  const btnRegister = document.getElementById('btn-register-asset');
  const btnBook = document.getElementById('btn-book-resource');
  const btnRequest = document.getElementById('btn-raise-request');

  if (btnRegister) {
    btnRegister.addEventListener('click', () => {
      window.location.href = '../assetRegistration/assetRegPage.html';
    });
  }

  if (btnBook) {
    btnBook.addEventListener('click', () => {
      window.location.href = '../booking/booking.html';
    });
  }

  if (btnRequest) {
    btnRequest.addEventListener('click', () => {
      window.location.href = '../maintainanceManage/maintenanceManage.html';
    });
  }
});