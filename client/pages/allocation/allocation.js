const assetAllocations = {
  "AF-0119": { allocatedTo: "Priya Shah", department: "Engineering" },
  "AF-0120": null, // available
  "AF-0121": { allocatedTo: "Rahul Mehta", department: "Sales" }
};

const assetHistory = {
  "AF-0119": [
    { date: "Mar 12", text: "Allocated to Priya Shah - Engineering" },
    { date: "Jan 04", text: "Returned by Arjun Nair - condition: good" }
  ],
  "AF-0120": [
    { date: "Feb 20", text: "Returned by Sneha Kapoor - condition: good" }
  ],
  "AF-0121": [
    { date: "Apr 02", text: "Allocated to Rahul Mehta - Sales" }
  ]
};

const assetSelect = document.getElementById('asset-select');
const warningBanner = document.getElementById('alloc-warning');
const fromInput = document.getElementById('from-employee');
const toSelect = document.getElementById('to-employee');
const reasonInput = document.getElementById('reason');
const form = document.getElementById('transfer-form');
const historyList = document.getElementById('history-list');

const toast = document.createElement('div');
toast.className = 'alloc-toast';
toast.id = 'alloc-toast';
document.body.appendChild(toast);

function updateAssetView() {
  const assetId = assetSelect.value;
  const allocation = assetAllocations[assetId];

  if (allocation) {
    
    warningBanner.querySelector('strong').textContent =
      `Already Allocated to ${allocation.allocatedTo} (${allocation.department})`;
    fromInput.value = allocation.allocatedTo;
  } else {
  
    warningBanner.style.display = 'none';
    fromInput.value = '(unassigned)';
  }

  renderHistory(assetId);
}

function renderHistory(assetId) {
  const history = assetHistory[assetId] || [];
  historyList.innerHTML = '';

  if (history.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No history for this asset yet.';
    historyList.appendChild(li);
    return;
  }

  history.forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="history-date">${entry.date}</span> ${entry.text}`;
    historyList.appendChild(li);
  });
}

function showError(inputEl, errorEl, show) {
  errorEl.style.display = show ? 'block' : 'none';
  inputEl.classList.toggle('invalid', show);
}

function validateForm() {
  let valid = true;

  if (!toSelect.value) {
    showError(toSelect, document.getElementById('to-error'), true);
    valid = false;
  } else {
    showError(toSelect, document.getElementById('to-error'), false);
  }

  if (reasonInput.value.trim().length < 10) {
    showError(reasonInput, document.getElementById('reason-error'), true);
    valid = false;
  } else {
    showError(reasonInput, document.getElementById('reason-error'), false);
  }

  return valid;
}

function showToast(message) {
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 2500);
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  const assetId = assetSelect.value;
  const toEmployeeName = toSelect.options[toSelect.selectedIndex].text;

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  if (!assetHistory[assetId]) assetHistory[assetId] = [];
  assetHistory[assetId].unshift({
    date: today,
    text: `Transfer request submitted: ${fromInput.value} -> ${toEmployeeName}`
  });

  renderHistory(assetId);
  showToast('Transfer request submitted!');
  form.reset();
  fromInput.value = fromInput.value; 
});

assetSelect.addEventListener('change', updateAssetView);

updateAssetView();