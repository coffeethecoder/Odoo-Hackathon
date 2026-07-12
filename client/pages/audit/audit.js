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