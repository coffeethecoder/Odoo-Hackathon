document.addEventListener("DOMContentLoaded", () => {
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

  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const mainAddBtn = document.getElementById("main-add-btn");
  
  let currentTab = "dept"; 

  tabs.forEach(tab => {
      tab.addEventListener("click", () => {
          tabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");

          tabContents.forEach(content => content.classList.add("hidden"));
          const targetId = tab.getAttribute("data-target");
          document.getElementById(targetId).classList.remove("hidden");

          if (targetId === "dept-section") {
              mainAddBtn.textContent = "+ Add Department";
              currentTab = "dept";
          } else if (targetId === "cat-section") {
              mainAddBtn.textContent = "+ Add Category";
              currentTab = "cat";
          } else if (targetId === "emp-section") {
              mainAddBtn.textContent = "+ Add Employee";
              currentTab = "emp";
          }
      });
  });

  const modals = {
      dept: document.getElementById("dept-modal"),
      cat: document.getElementById("cat-modal"),
      emp: document.getElementById("emp-modal")
  };

  const forms = {
      dept: document.getElementById("dept-form"),
      cat: document.getElementById("cat-form"),
      emp: document.getElementById("emp-form")
  };

  const titles = {
      dept: document.getElementById("dept-modal-title"),
      cat: document.getElementById("cat-modal-title"),
      emp: document.getElementById("emp-modal-title")
  };

  function openModal(type, isEdit = false) {
      titles[type].textContent = isEdit ? `Edit ${capitalizeFirstLetter(type)}` : `Add ${capitalizeFirstLetter(type)}`;
      if (!isEdit) {
          forms[type].reset();
      }
      modals[type].classList.remove("hidden");
  }

  function closeModal(type) {
      modals[type].classList.add("hidden");
  }

  function capitalizeFirstLetter(string) {
      const fullNames = { dept: "Department", cat: "Category", emp: "Employee" };
      return fullNames[string];
  }

  if (mainAddBtn) {
      mainAddBtn.addEventListener("click", () => {
          openModal(currentTab, false);
      });
  }

  document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
          const modal = e.target.closest('.modal');
          modal.classList.add('hidden');
      });
  });

  document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
          const type = e.target.getAttribute('data-type');
          openModal(type, true);
      });
  });

  Object.values(forms).forEach(form => {
      if(form) {
          form.addEventListener('submit', (e) => {
              e.preventDefault();
              const modal = e.target.closest('.modal');
              modal.classList.add('hidden');
              console.log("Form saved successfully");
          });
      }
  });
});