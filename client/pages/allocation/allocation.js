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

  if(menuToggle) menuToggle.addEventListener('click', openSidebar);
  if(overlay) overlay.addEventListener('click', closeSidebar);

  const mockDb = {
    "AF-0114": { status: "allocated", holder: "Priya Shah", dept: "Engineering", dueDate: "2026-12-31" },
    "AF-0115": { status: "available" },
    "AF-0116": { status: "allocated", holder: "Amit Singh", dept: "Marketing", dueDate: "2026-05-15" }, 
    "AF-0117": { status: "available" }
  };

  const mockHistory = {
    "AF-0114": [{ date: "2026-01-10", text: "Allocated to Priya Shah - Engineering" }],
    "AF-0115": [{ date: "2025-11-20", text: "Returned by Raj Patel - Condition: Good" }],
    "AF-0116": [{ date: "2026-02-01", text: "Allocated to Amit Singh - Marketing" }],
    "AF-0117": []
  };

  const assetSelect = document.getElementById('asset-select');
  const dynamicActionArea = document.getElementById('dynamic-action-area');
  const allocateSection = document.getElementById('allocate-section');
  const transferSection = document.getElementById('transfer-section');
  const historySection = document.getElementById('history-section');
  const historyList = document.getElementById('history-list');

  const warningBanner = document.getElementById('alloc-warning');
  const warningTitle = document.getElementById('warning-title');
  const warningSubtitle = document.getElementById('warning-subtitle');
  const fromEmployeeInput = document.getElementById('from-employee');

  const allocateForm = document.getElementById('allocate-form');
  const transferForm = document.getElementById('transfer-form');
  const returnForm = document.getElementById('return-form');

  const btnReturnModal = document.getElementById('btn-return-modal');
  const returnModal = document.getElementById('return-modal');
  const toast = document.getElementById('alloc-toast');

  let currentAssetId = null;

  function showToast(message) {
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  function getTodayStr() {
    return new Date().toISOString().split('T')[0];
  }

  function renderHistory(assetId) {
    historySection.classList.remove('hidden');
    const history = mockHistory[assetId] || [];
    historyList.innerHTML = '';

    if (history.length === 0) {
      historyList.innerHTML = '<li>No history found for this asset.</li>';
      return;
    }

    history.forEach(entry => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="history-date">${formatDate(entry.date)}</span> ${entry.text}`;
      historyList.appendChild(li);
    });
  }

  function updateView() {
    currentAssetId = assetSelect.value;
    if (!currentAssetId) return;

    dynamicActionArea.classList.remove('hidden');
    const asset = mockDb[currentAssetId];
    
    allocateSection.classList.add('hidden');
    transferSection.classList.add('hidden');

    if (asset.status === 'available') {
      allocateSection.classList.remove('hidden');
    } else if (asset.status === 'allocated') {
      transferSection.classList.remove('hidden');
      fromEmployeeInput.value = asset.holder;

      const today = getTodayStr();
      const isOverdue = asset.dueDate && asset.dueDate < today;

      if (isOverdue) {
        warningBanner.className = 'alert-banner danger-banner';
        warningTitle.innerHTML = `Overdue: Currently held by ${asset.holder} <span class="history-badge badge-overdue">Overdue</span>`;
        warningSubtitle.textContent = `Expected return date was ${formatDate(asset.dueDate)}. Direct allocation is blocked.`;
      } else {
        warningBanner.className = 'alert-banner warning-banner';
        warningTitle.textContent = `Currently held by ${asset.holder}`;
        warningSubtitle.textContent = `Direct allocation is blocked. Submit a transfer request below.`;
      }
    }

    renderHistory(currentAssetId);
  }

  assetSelect.addEventListener('change', updateView);

  allocateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const employee = document.getElementById('alloc-employee').value;
    const dept = document.getElementById('alloc-dept').value;
    const returnDate = document.getElementById('alloc-return-date').value;

    mockDb[currentAssetId] = {
      status: "allocated",
      holder: employee,
      dept: dept,
      dueDate: returnDate || null
    };

    mockHistory[currentAssetId].unshift({
      date: getTodayStr(),
      text: `Allocated to ${employee} - ${dept}${returnDate ? ` (Due: ${formatDate(returnDate)})` : ''}`
    });

    showToast('Asset successfully allocated');
    allocateForm.reset();
    updateView();
  });

  transferForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const toEmployee = document.getElementById('to-employee').value;
    
    mockHistory[currentAssetId].unshift({
      date: getTodayStr(),
      text: `Transfer requested: ${mockDb[currentAssetId].holder} → ${toEmployee} (Pending Approval)`
    });

    showToast('Transfer request submitted to Asset Manager');
    transferForm.reset();
    updateView();
  });

  btnReturnModal.addEventListener('click', () => {
    returnModal.classList.remove('hidden');
  });

  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.modal').classList.add('hidden');
    });
  });

  returnForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const condition = document.getElementById('return-condition').value;
    const notes = document.getElementById('return-notes').value;

    mockHistory[currentAssetId].unshift({
      date: getTodayStr(),
      text: `Returned by ${mockDb[currentAssetId].holder} - Condition: ${condition} (Notes: ${notes})`
    });

    mockDb[currentAssetId] = { status: "available" };

    returnModal.classList.add('hidden');
    returnForm.reset();
    showToast('Asset returned successfully');
    updateView();
  });
});