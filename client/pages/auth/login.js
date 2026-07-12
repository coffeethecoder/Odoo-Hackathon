const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const employee_id = document.getElementById("employee_id").value.trim();
    const password = document.getElementById("password").value;

    if (!employee_id || !password) {
        alert("Please fill all fields");
        return;
    }

    try {

        const response = await fetch("http://localhost:3001/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                employee_id,
                password
            })

        });

        const data = await response.json();

        if (data.success) {

            alert("Login Successful");

            window.location.href = "../dashboard/dashboard.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Server Error");

    }

});