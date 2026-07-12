document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', function(e) {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
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
  
    menuToggle.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);

    const tabs = document.querySelectorAll(".tab");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            console.log(tab.textContent + " selected");
        });
    });

    const addBtn = document.querySelector(".add-btn");

    if (addBtn) {
        addBtn.addEventListener("click", () => {
            alert("Add functionality will be implemented later.");
        });
    }
});