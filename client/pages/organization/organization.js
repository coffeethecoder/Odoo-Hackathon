// Organization Setup Page

document.addEventListener("DOMContentLoaded", () => {

    const tabs = document.querySelectorAll(".tab");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {

            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            console.log(tab.textContent + " selected");

        });
    });

    const addBtn = document.querySelector(".add-btn");

    if (addBtn) {
        addBtn.addEventListener("click", () => {
            alert("Add functionality will be implemented later.");
        });
    }

});