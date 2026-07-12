const db = require("../config/db");

exports.registerAsset = async (req, res) => {

    try {

        const {

            asset_name,
            category,
            department,
            serial_number,
            acquisition_date,
            acquisition_cost,
            asset_condition,
            location,
            shared

        } = req.body;

        // Generate Asset Code
        const countResult = await db.query(
            "SELECT COUNT(*) FROM assets"
        );

        const nextId = Number(countResult.rows[0].count) + 1;

        const asset_code =
            "AF-" + String(nextId).padStart(4, "0");

        const result = await db.query(

            `INSERT INTO assets
            (
                asset_code,
                asset_name,
                category,
                department,
                serial_number,
                acquisition_date,
                acquisition_cost,
                asset_condition,
                location,
                shared
            )

            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
            )

            RETURNING *`,

            [

                asset_code,
                asset_name,
                category,
                department,
                serial_number,
                acquisition_date,
                acquisition_cost,
                asset_condition,
                location,
                shared

            ]

        );

        res.status(201).json({

            success: true,

            message: "Asset Registered Successfully",

            asset: result.rows[0]

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ===============================
// Get All Assets
// ===============================

exports.getAssets = async (req, res) => {

    try {

        const result = await db.query(

            `SELECT *
             FROM assets
             ORDER BY id ASC`

        );

        res.json({

            success: true,

            assets: result.rows

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};