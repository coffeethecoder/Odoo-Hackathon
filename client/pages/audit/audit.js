const API_URL = "http://localhost:3001/api/audit";

const startAuditBtn = document.getElementById("startAuditBtn");

startAuditBtn.addEventListener("click", startAudit);

async function startAudit() {

    const department = document.getElementById("department").value;
    const location = document.getElementById("location").value;
    const start_date = document.getElementById("startDate").value;
    const end_date = document.getElementById("endDate").value;
    const auditors = document.getElementById("auditors").value.trim();

    if (
        !department ||
        !location ||
        !start_date ||
        !end_date ||
        !auditors
    ) {

        alert("Please fill all fields.");
        return;

    }

    try {

        const response = await fetch(`${API_URL}/start`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                department,
                location,
                start_date,
                end_date,
                auditors

            })

        });

        const data = await response.json();

        if (data.success) {

            alert("Audit Cycle Created Successfully!");

            console.log(data.audit);

            // Store current audit ID for future API calls
            localStorage.setItem("currentAuditId", data.audit.id);

            // Clear form
            document.getElementById("auditors").value = "";
            document.getElementById("startDate").value = "";
            document.getElementById("endDate").value = "";

        }

        else {

            alert(data.message);

        }

    }

    catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

    }

}

const assetTableBody = document.getElementById("assetTableBody");

window.addEventListener("load", loadAssets);

async function loadAssets() {

    const auditId = localStorage.getItem("currentAuditId");

    if (!auditId) {

        console.log("No active audit found.");

        return;

    }

    try {

        const response = await fetch(`${API_URL}/${auditId}/assets`);

        const data = await response.json();

        if (!data.success) {

            alert("Unable to load assets.");

            return;

        }

        renderAssets(data.assets);

    }

    catch (err) {

        console.error(err);

    }

}

function renderAssets(assets) {

    assetTableBody.innerHTML = "";

    assets.forEach(asset => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${asset.asset_code} ${asset.asset_name}</td>

            <td>${asset.expected_location}</td>

            <td>

                <select
                    class="assetStatus"
                    data-id="${asset.id}">

                    <option value="Verified" ${asset.status==="Verified"?"selected":""}>
                        Verified
                    </option>

                    <option value="Missing" ${asset.status==="Missing"?"selected":""}>
                        Missing
                    </option>

                    <option value="Damaged" ${asset.status==="Damaged"?"selected":""}>
                        Damaged
                    </option>

                    <option value="Pending" ${asset.status==="Pending"?"selected":""}>
                        Pending
                    </option>

                </select>

            </td>


        `;

        assetTableBody.appendChild(row);
        const select = row.querySelector(".assetStatus");

        select.addEventListener("change", updateAssetStatus);

    });

}

async function updateAssetStatus(event) {

    const assetId = event.target.dataset.id;

    const status = event.target.value;

    try {

        const response = await fetch(

            `${API_URL}/assets/${assetId}`,

            {

                method: "PATCH",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    status,

                    remarks: ""

                })

            }

        );

        const data = await response.json();

        if(data.success){

            console.log("Asset Updated");

        }

        else{

            alert(data.message);

        }

    }

    catch(error){

        console.error(error);

        alert("Unable to update asset.");

    }

}