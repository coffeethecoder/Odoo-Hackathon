const express = require("express");

const router = express.Router();

const bookingController = require("../controllers/booking.controller");

router.get("/assets", bookingController.getBookableAssets);
router.post("/", bookingController.createBooking);
router.get("/", bookingController.getBookings);


router.patch("/:id", bookingController.updateBookingStatus);

module.exports = router;