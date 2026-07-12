const form = document.getElementById("loginForm");
console.log("login.js loaded");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("Login button clicked");

    const employee_id = document.getElementById("employee_id").value.trim();
    const password = document.getElementById("password").value;

    console.log(employee_id, password);

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

        console.log("Status:", response.status);

        const data = await response.json();

        console.log(data);

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