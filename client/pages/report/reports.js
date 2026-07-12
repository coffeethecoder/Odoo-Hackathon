document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', function() {
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

    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            alert('Initiating report export as CSV...');
        });
    }

    const ctxUtilization = document.getElementById('utilizationChart').getContext('2d');
    new Chart(ctxUtilization, {
        type: 'bar',
        data: {
            labels: ['IT', 'HR', 'Sales', 'Ops', 'Eng', 'Mkt'],
            datasets: [{
                label: 'Utilization %',
                data: [40, 65, 80, 55, 35, 75],
                backgroundColor: 'rgba(37, 99, 235, 0.8)', 
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#e5e7eb' },
                    ticks: { color: '#4b5563' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#4b5563' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    const ctxMaintenance = document.getElementById('maintenanceChart').getContext('2d');
    new Chart(ctxMaintenance, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Maintenance Incidents',
                data: [12, 19, 15, 25, 22, 30],
                borderColor: 'rgba(220, 38, 38, 1)',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: 'rgba(220, 38, 38, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#e5e7eb' },
                    ticks: { color: '#4b5563' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#4b5563' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
});