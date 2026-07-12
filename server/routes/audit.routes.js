const express = require("express");

const router = express.Router();

const {
    startAudit,
    getAllAudits,
    getAuditById,
    addAssetToAudit,
    updateAssetStatus,
    getAuditAssets,
    generateReport,
    closeAuditCycle
} = require("../controllers/audit.controller");

router.post("/start", startAudit);
router.post("/:id/assets", addAssetToAudit);

router.get("/", getAllAudits);
router.get("/:id", getAuditById);
router.get("/:id/assets", getAuditAssets);
router.get("/:id/report", generateReport);

router.patch("/assets/:id", updateAssetStatus);
router.patch("/:id/close", closeAuditCycle);

module.exports = router;