const modal = document.getElementById("bookingModal");

const newBookingBtn = document.getElementById("newBooking");

const cancelBtn = document.querySelector(
'.modal-buttons button[type="button"]'
);

const bookingForm = document.querySelector("#bookingModal form");

const resourceCards = document.querySelectorAll(".resource-card");

const searchInput = document.querySelector(".search-bar input");

const categoryButtons = document.querySelectorAll(".category");

const bookingTable = document.querySelector(".booking-table tbody");

let bookings = JSON.parse(
localStorage.getItem("assetBookings")
) || [];

let selectedAsset = "";

function openModal(){

    modal.classList.add("active");

}

function closeModal(){

    modal.classList.remove("active");

    bookingForm.reset();

}

newBookingBtn.addEventListener("click",openModal);

cancelBtn.addEventListener("click",closeModal);

window.addEventListener("click",(e)=>{

    if(e.target===modal){

        closeModal();

    }

});

document.querySelectorAll(".primary").forEach((btn)=>{

    btn.addEventListener("click",()=>{

        selectedAsset = btn
        .closest(".resource-card")
        .querySelector("h3")
        .textContent
        .trim();

        openModal();

    });

});

searchInput.addEventListener("keyup",()=>{

    const value = searchInput.value.toLowerCase();

    resourceCards.forEach((card)=>{

        const text = card.textContent.toLowerCase();

        card.style.display = text.includes(value)
            ? "block"
            : "none";

    });

});

categoryButtons.forEach((button)=>{

    button.addEventListener("click",()=>{

        categoryButtons.forEach((b)=>{

            b.classList.remove("active");

        });

        button.classList.add("active");

        const category = button.innerText
        .replace(/[^\w\s]/gi,"")
        .trim()
        .toLowerCase();

        resourceCards.forEach((card)=>{

            const text = card.textContent.toLowerCase();

            if(category==="laptops"){

                card.style.display="block";

            }

            else{

                card.style.display = text.includes(category)
                    ? "block"
                    : "none";

            }

        });

    });

});

function saveBookings(){

    localStorage.setItem(
        "assetBookings",
        JSON.stringify(bookings)
    );

}

function createBookingObject(
employee,
purpose,
borrow,
returnDate,
time,
asset
){

    return{

        id:Date.now(),

        asset,

        employee,

        purpose,

        borrow,

        returnDate,

        time,

        status:"Upcoming"

    };

}
bookingForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    const employee = bookingForm.querySelector(
        'input[type="text"]'
    ).value.trim();

    const purpose = bookingForm.querySelector(
        "textarea"
    ).value.trim();

    const borrow = bookingForm.querySelector(
        'input[type="date"]'
    ).value;

    const returnDate = bookingForm.querySelectorAll(
        'input[type="date"]'
    )[1].value;

    const time = bookingForm.querySelector(
        'input[type="time"]'
    ).value;

    if(employee===""){

        alert("Enter Employee ID");

        return;

    }

    if(borrow==="" || returnDate===""){

        alert("Select booking dates");

        return;

    }

    if(time===""){

        alert("Select booking time");

        return;

    }

    const overlap = bookings.find((booking)=>{

        return(

            booking.asset===selectedAsset &&

            booking.borrow===borrow &&

            booking.time===time &&

            booking.status!=="Cancelled"

        );

    });

    if(overlap){

        alert(

            "This resource is already booked for the selected date and time."

        );

        return;

    }

    const booking = createBookingObject(

        employee,

        purpose,

        borrow,

        returnDate,

        time,

        selectedAsset

    );

    bookings.push(booking);

    saveBookings();

    renderBookings();

    updateResourceStatus(selectedAsset,true);

    closeModal();

    alert("Booking confirmed!");

});

function updateResourceStatus(asset,isBooked){

    resourceCards.forEach((card)=>{

        const title = card.querySelector("h3").textContent.trim();

        if(title===asset){

            const badge = card.querySelector(".status");

            if(isBooked){

                badge.textContent="Booked";

                badge.classList.remove("available");

                badge.classList.add("booked");

                const bookBtn = card.querySelector(".primary");

                if(bookBtn){

                    bookBtn.disabled=true;

                    bookBtn.innerText="Booked";

                    bookBtn.style.opacity=".6";

                    bookBtn.style.cursor="not-allowed";

                }

            }

        }

    });

}

function renderBookings(){

    bookingTable.innerHTML="";

    bookings.forEach((booking)=>{

        const row=document.createElement("tr");

        row.innerHTML=`

            <td>${booking.asset}</td>

            <td>${booking.employee}</td>

            <td>${booking.borrow}</td>

            <td>${booking.returnDate}</td>

            <td>

                <span class="badge upcoming">

                    ${booking.status}

                </span>

            </td>

        `;

        bookingTable.appendChild(row);

    });

}

renderBookings();
function updateBookingStatus(){

    const today = new Date();

    bookings.forEach((booking)=>{

        const borrowDate = new Date(booking.borrow);

        const returnDate = new Date(booking.returnDate);

        if(booking.status==="Cancelled") return;

        if(today < borrowDate){

            booking.status="Upcoming";

        }

        else if(today >= borrowDate && today <= returnDate){

            booking.status="Ongoing";

        }

        else if(today > returnDate){

            booking.status="Completed";

        }

    });

    saveBookings();

    renderBookings();

}

function cancelBooking(id){

    const booking = bookings.find((b)=>b.id===id);

    if(!booking) return;

    booking.status="Cancelled";

    saveBookings();

    renderBookings();

    updateResourceStatus(booking.asset,false);

}

function rescheduleBooking(id,newBorrow,newReturn,newTime){

    const booking = bookings.find((b)=>b.id===id);

    if(!booking) return;

    const overlap = bookings.some((b)=>{

        return(

            b.id!==id &&

            b.asset===booking.asset &&

            b.borrow===newBorrow &&

            b.time===newTime &&

            b.status!=="Cancelled"

        );

    });

    if(overlap){

        alert("Selected time slot is already booked.");

        return false;

    }

    booking.borrow=newBorrow;

    booking.returnDate=newReturn;

    booking.time=newTime;

    booking.status="Upcoming";

    saveBookings();

    renderBookings();

    return true;

}

function checkReminder(){

    const now = new Date();

    bookings.forEach((booking)=>{

        if(booking.status!=="Upcoming") return;

        const bookingTime = new Date(`${booking.borrow}T${booking.time}`);

        const diff = bookingTime - now;

        const minutes = Math.floor(diff/60000);

        if(minutes>0 && minutes<=30){

            alert(

                `Reminder: ${booking.asset} booking starts in ${minutes} minutes.`

            );

        }

    });

}

function updateResourceStatus(asset,isBooked){

    resourceCards.forEach((card)=>{

        const title = card.querySelector("h3").textContent.trim();

        if(title!==asset) return;

        const badge = card.querySelector(".status");

        const button = card.querySelector(".primary");

        if(isBooked){

            badge.textContent="Booked";

            badge.classList.remove("available");

            badge.classList.add("booked");

            if(button){

                button.disabled=true;

                button.textContent="Booked";

            }

        }

        else{

            badge.textContent="Available";

            badge.classList.remove("booked");

            badge.classList.add("available");

            if(button){

                button.disabled=false;

                button.textContent="Book Now";

            }

        }

    });

}

function refreshResourceStatus(){

    resourceCards.forEach((card)=>{

        const asset = card.querySelector("h3").textContent.trim();

        const activeBooking = bookings.some((booking)=>{

            return(

                booking.asset===asset &&

                booking.status!=="Completed" &&

                booking.status!=="Cancelled"

            );

        });

        updateResourceStatus(asset,activeBooking);

    });

}

updateBookingStatus();

refreshResourceStatus();

checkReminder();

setInterval(()=>{

    updateBookingStatus();

    refreshResourceStatus();

    checkReminder();

},60000);