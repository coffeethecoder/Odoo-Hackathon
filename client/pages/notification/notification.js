const notifications = [
  { id: 1, category: 'bookings',  color: 'blue',   text: 'Laptop AF-0014 assigned to Priya Shah', time: '2m ago' },
  { id: 2, category: 'approvals', color: 'green',  text: 'Maintenance request AF-0055 approved', time: '18m ago' },
  { id: 3, category: 'bookings',  color: 'blue',   text: 'Booking confirmed: Room B2, 2:00 to 3:00 PM', time: '1h ago' },
  { id: 4, category: 'approvals', color: 'red',    text: 'Transfer approved: AF-0033 to Facilities dept', time: '3h ago' },
  { id: 5, category: 'alerts',    color: 'orange', text: 'Overdue return: AF-0021 was due 3 days ago', time: '1d ago' },
  { id: 6, category: 'alerts',    color: 'red',    text: 'Audit discrepancy flagged: AF-0088 damaged', time: '2d ago' }
];

const notifList = document.getElementById('notif-list');
const tabButtons = document.querySelectorAll('.tab-btn');

function renderNotifications(filter) {
  notifList.innerHTML = '';

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => n.category === filter);

  if (filtered.length === 0) {
    const li = document.createElement('li');
    li.className = 'notif-item';
    li.innerHTML = `<span class="notif-text">No notifications in this category.</span>`;
    notifList.appendChild(li);
    return;
  }

  filtered.forEach(n => {
    const li = document.createElement('li');
    li.className = 'notif-item';
    li.innerHTML = `
      <span class="notif-dot ${n.color}"></span>
      <span class="notif-text">${n.text}</span>
      <span class="notif-time">${n.time}</span>
    `;
    notifList.appendChild(li);
  });
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderNotifications(btn.dataset.filter);
  });
});

renderNotifications('all');