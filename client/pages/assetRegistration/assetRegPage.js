const API_URL = "http://localhost:3001/api/assets";

document.addEventListener("DOMContentLoaded", () => {

    // =============================
    // Sidebar
    // =============================

    const navItems = document.querySelectorAll(".nav-item");
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    navItems.forEach(item => {

        item.addEventListener("click", function () {

            navItems.forEach(nav => nav.classList.remove("active"));

            this.classList.add("active");

            if (window.innerWidth <= 768) {

                closeSidebar();

            }

        });

    });

    function openSidebar() {

        sidebar.classList.add("open");
        overlay.classList.add("show");

    }

    function closeSidebar() {

        sidebar.classList.remove("open");
        overlay.classList.remove("show");

    }

    menuToggle.addEventListener("click", openSidebar);

    overlay.addEventListener("click", closeSidebar);

    // =============================
    // Elements
    // =============================

    const registerBtn = document.getElementById("register-btn");
    const registerModal = document.getElementById("register-modal");
    const registerForm = document.getElementById("register-form");
    const historyModal = document.getElementById("history-modal");
    const historyTitle = document.getElementById("history-title");
    const assetTagInput = document.getElementById("asset-tag");
    const tableBody = document.getElementById("assetTableBody");

    // =============================
    // Load Assets on Page Load
    // =============================

    loadAssets();

    // =============================
    // Register Button
    // =============================

    registerBtn.addEventListener("click", () => {

        registerForm.reset();

        assetTagInput.value = "Auto Generated";

        registerModal.classList.remove("hidden");

    });

    // =============================
    // Register Asset
    // =============================

    registerForm.addEventListener("submit", registerAsset);

    async function registerAsset(e) {

        e.preventDefault();

        const asset = {

            asset_name:
                document.getElementById("asset-name").value,

            category:
                document.getElementById("asset-category").value,

            department:
                document.getElementById("asset-department").value,

            serial_number:
                document.getElementById("asset-serial").value,

            acquisition_date:
                document.getElementById("asset-date").value,

            acquisition_cost:
                document.getElementById("asset-cost").value,

            asset_condition:
                document.getElementById("asset-condition").value,

            location:
                document.getElementById("asset-location").value,

            shared:
                document.getElementById("asset-shared").checked

        };

        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(asset)

            });

            const data = await response.json();

            if (data.success) {

                alert("Asset Registered Successfully!");

                registerModal.classList.add("hidden");

                registerForm.reset();

                loadAssets();

            }

            else {

                alert(data.message);

            }

        }

        catch (err) {

            console.error(err);

            alert("Unable to connect to server.");

        }

    }

    // =============================
    // Load Assets
    // =============================

    async function loadAssets() {

        try {

            const response = await fetch(API_URL);

            const data = await response.json();

            if (!data.success) return;

            renderAssets(data.assets);

        }

        catch (err) {

            console.error(err);

        }

    }

    // =============================
    // Render Assets
    // =============================

    function renderAssets(assets) {

        tableBody.innerHTML = "";

        assets.forEach(asset => {

            tableBody.innerHTML += `

            <tr>

                <td class="fw-semibold">

                    ${asset.asset_code}

                </td>

                <td>

                    ${asset.asset_name}

                </td>

                <td>

                    ${asset.category}

                </td>

                <td>

                    <span class="badge badge-success">

                        ${asset.status}

                    </span>

                </td>

                <td>

                    ${asset.location}

                </td>

                <td>

                    <button
                        class="btn-action view-history"
                        data-id="${asset.asset_code}">

                        History

                    </button>

                </td>

            </tr>

            `;

        });

        document.querySelectorAll(".view-history").forEach(btn => {

            btn.addEventListener("click", () => {

                historyTitle.textContent =
                    `Asset History : ${btn.dataset.id}`;

                historyModal.classList.remove("hidden");

            });

        });

    }

    // =============================
    // Close Modals
    // =============================

    document.querySelectorAll(".close-modal").forEach(btn => {

        btn.addEventListener("click", () => {

            btn.closest(".modal").classList.add("hidden");

        });

    });

});