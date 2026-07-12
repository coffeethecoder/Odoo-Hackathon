document.addEventListener("DOMContentLoaded", () => {
  const notifications = [
      { type: "general", text: "Laptop AF-0014 assigned to Priya shah", time: "2m ago", color: "blue" },
      { type: "approvals", text: "Maintenance request AF-0055 approved", time: "18m ago", color: "green" },
      { type: "bookings", text: "Booking confirmed : Room B2 : 2:00 to 3:00 PM", time: "1h ago", color: "blue" },
      { type: "approvals", text: "Transfer approved : AF-0033 to facilities dept", time: "3h ago", color: "red" },
      { type: "alerts", text: "Overdue return : AF-0021 was due 3 days ago", time: "1d ago", color: "orange" },
      { type: "alerts", text: "audit discrepancy flagged : AF-0088 damaged", time: "2d ago", color: "orange" }
  ];

  const notifList = document.getElementById("notif-list");
  const filterTabs = document.querySelectorAll(".tab-btn");

  function renderNotifications() {
      notifList.innerHTML = ""; 

      notifications.forEach(notif => {
          const li = document.createElement("li");
          li.className = "notif-item";
          li.dataset.type = notif.type;
          
          li.innerHTML = `
              <div class="notif-square ${notif.color}"></div>
              <div class="notif-text">${notif.text}</div>
              <div class="notif-time">${notif.time}</div>
          `;
          
          notifList.appendChild(li);
      });
  }

  filterTabs.forEach(btn => {
      btn.addEventListener("click", () => {
          // Update active state on buttons
          filterTabs.forEach(t => t.classList.remove("active"));
          btn.classList.add("active");

          const filterValue = btn.dataset.filter;
          const items = document.querySelectorAll(".notif-item");

          items.forEach(item => {
              if (filterValue === "all" || item.dataset.type === filterValue) {
                  item.classList.remove("hidden");
              } else {
                  item.classList.add("hidden");
              }
          });
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

  renderNotifications();
});