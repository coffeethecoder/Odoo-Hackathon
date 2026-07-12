const pool = require("../config/db");

// ======================================
// Get Bookable Assets
// ======================================

const getBookableAssets = async (req, res) => {

    try {

        const result = await pool.query(

            `SELECT
                id,
                asset_code,
                asset_name,
                category,
                location,
                asset_condition,
                status
             FROM assets
             WHERE shared = true
             ORDER BY asset_name`

        );

        return res.status(200).json({

            success: true,

            assets: result.rows

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// ======================================
// Create Booking
// ======================================

const createBooking = async (req, res) => {

    try {

        const {

            asset_id,
            employee_name,
            employee_id,
            purpose,
            borrow_date,
            return_date,
            booking_time

        } = req.body;

        if (

            !asset_id ||
            !employee_name ||
            !employee_id ||
            !borrow_date ||
            !return_date ||
            !booking_time

        ) {

            return res.status(400).json({

                success: false,

                message: "All fields are required"

            });

        }

        // Check for conflicting booking

        const conflict = await pool.query(

            `SELECT *
             FROM bookings
             WHERE asset_id = $1
             AND borrow_date = $2
             AND booking_time = $3
             AND status != 'Cancelled'`,

            [

                asset_id,
                borrow_date,
                booking_time

            ]

        );

        if (conflict.rows.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Asset already booked for this time."

            });

        }

        const result = await pool.query(

            `INSERT INTO bookings
            (
                asset_id,
                employee_name,
                employee_id,
                purpose,
                borrow_date,
                return_date,
                booking_time
            )

            VALUES
            ($1,$2,$3,$4,$5,$6,$7)

            RETURNING *`,

            [

                asset_id,
                employee_name,
                employee_id,
                purpose,
                borrow_date,
                return_date,
                booking_time

            ]

        );

        return res.status(201).json({

            success: true,

            message: "Booking Created Successfully",

            booking: result.rows[0]

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// ======================================
// Get All Bookings
// ======================================

const getBookings = async (req, res) => {

    try {

        const result = await pool.query(

            `SELECT

                bookings.*,

                assets.asset_name,

                assets.asset_code

            FROM bookings

            JOIN assets

            ON bookings.asset_id = assets.id

            ORDER BY bookings.created_at DESC`

        );

        return res.status(200).json({

            success: true,

            bookings: result.rows

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// ======================================
// Update Booking Status
// ======================================

const updateBookingStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;

        const result = await pool.query(

            `UPDATE bookings
             SET status = $1
             WHERE id = $2
             RETURNING *`,

            [

                status,
                id

            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Booking Not Found"

            });

        }

        return res.status(200).json({

            success: true,

            booking: result.rows[0]

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

module.exports = {

    getBookableAssets,

    createBooking,

    getBookings,

    updateBookingStatus

};