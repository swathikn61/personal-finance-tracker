"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EntriesController_1 = require("../controller/EntriesController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
const createEntryLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { message: "Too many entries created,please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});
const getEntriesLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});
const putEntryLimiter = (0, express_rate_limit_1.default)({
    windowMs: 30 * 60 * 1000,
    max: 40,
    message: { message: "Too many updates,please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});
const deleteEntryLimiter = (0, express_rate_limit_1.default)({
    windowMs: 30 * 60 * 1000,
    max: 20,
    message: { message: "Too many deletions,please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});
router.use(AuthMiddleware_1.authMiddleware);
router.post("/", createEntryLimiter, EntriesController_1.EntriesController.createEntries);
router.get("/", getEntriesLimiter, EntriesController_1.EntriesController.getEntries);
router.get("/:id", getEntriesLimiter, EntriesController_1.EntriesController.getEntryById);
router.put("/:id", putEntryLimiter, EntriesController_1.EntriesController.updateEntry);
router.delete("/:id", deleteEntryLimiter, EntriesController_1.EntriesController.deleteEntry);
exports.default = router;
