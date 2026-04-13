"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ExportController_1 = require("../controller/ExportController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const Router = express_1.default.Router();
const exportLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { message: "Too many exports, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});
Router.get('/', AuthMiddleware_1.authMiddleware, exportLimiter, ExportController_1.ExportController.exportEntriesToCSV);
exports.default = Router;
