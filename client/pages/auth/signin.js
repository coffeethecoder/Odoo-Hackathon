const form = document.getElementById("signupForm");

console.log("signin.js loaded");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const full_name = document.getElementById("full_name").value.trim();
    const employee_id = document.getElementById("employee_id").value.trim();
    const department = document.getElementById("department").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm_password").value;

    if (
        !full_name ||
        !employee_id ||
        !department ||
        !email ||
        !password ||
        !confirm_password
    ) {
        alert("Please fill all fields");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:3001/api/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    full_name,
                    employee_id,
                    department,
                    email,
                    password,
                    confirm_password
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            sessionStorage.setItem(

            "signupSuccess",

            "Account created successfully! Please sign in using your credentials."

        );

        window.location.href = "login.html";

            window.location.href = "login.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Server Error");

    }

});