"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SummariesController_1 = require("../controller/SummariesController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const Router = express_1.default.Router();
const getSummaryLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: { message: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});
Router.get('/', AuthMiddleware_1.authMiddleware, getSummaryLimiter, SummariesController_1.SummariesController.getSummary);
exports.default = Router;
