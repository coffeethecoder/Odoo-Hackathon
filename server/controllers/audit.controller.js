const pool = require("../config/db");

const startAudit = async (req, res) => {

    try {
        const {
            department,
            location,
            start_date,
            end_date,
            auditors
        } = req.body;
        // =============================
        // Validation
        // =============================
        if (
            !department ||
            !location ||
            !start_date ||
            !end_date ||
            !auditors
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        // =============================
        // Insert Audit Cycle
        // =============================
        const result = await pool.query(
            `INSERT INTO audit_cycles
            (department, location, start_date, end_date, auditors)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                department,
                location,
                start_date,
                end_date,
                auditors
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Audit Cycle Created Successfully",
            audit: result.rows[0]
        });

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }

};

const getAllAudits = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM audit_cycles ORDER BY created_at DESC"
        );
        return res.status(200).json({
            success: true,
            audits: result.rows
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getAuditById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM audit_cycles WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Audit not found"
            });

        }

        return res.status(200).json({
            success: true,
            audit: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const addAssetToAudit = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            asset_code,
            asset_name,
            expected_location
        } = req.body;

        if (
            !asset_code ||
            !asset_name ||
            !expected_location
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }

        const result = await pool.query(

            `INSERT INTO audit_assets
            (audit_id, asset_code, asset_name, expected_location)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,

            [
                id,
                asset_code,
                asset_name,
                expected_location
            ]

        );

        return res.status(201).json({

            success:true,

            message:"Asset Added Successfully",

            asset:result.rows[0]

        });

    }

    catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};
const updateAssetStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status, remarks } = req.body;

        const validStatus = [
            "Pending",
            "Verified",
            "Missing",
            "Damaged"
        ];

        if (!validStatus.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Status"
            });

        }

        const result = await pool.query(

            `UPDATE audit_assets
             SET status = $1,
                 remarks = $2
             WHERE id = $3
             RETURNING *`,

            [
                status,
                remarks,
                id
            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Asset not found"

            });

        }

        return res.status(200).json({

            success: true,
            message: "Asset Updated Successfully",
            asset: result.rows[0]

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

const getAuditAssets = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `SELECT *
             FROM audit_assets
             WHERE audit_id = $1
             ORDER BY id ASC`,

            [id]

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

const generateReport = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `SELECT *
             FROM audit_assets
             WHERE audit_id = $1
             AND status IN ('Missing','Damaged')
             ORDER BY id ASC`,

            [id]

        );

        return res.status(200).json({

            success: true,

            totalFlagged: result.rows.length,

            report: result.rows

        });

    }

    catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};

const closeAuditCycle = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `UPDATE audit_cycles
             SET status = 'Closed'
             WHERE id = $1
             RETURNING *`,

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Audit Cycle Not Found"

            });

        }

        return res.status(200).json({

            success: true,
            message: "Audit Cycle Closed Successfully",
            audit: result.rows[0]

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
    startAudit,
    getAllAudits,
    getAuditById,
    addAssetToAudit,
    updateAssetStatus,
    getAuditAssets,
    generateReport,
    closeAuditCycle
};