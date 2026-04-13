"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controller/AuthController");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
const registerLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: { message: "Too many registration attempts, please try again later" }
});
const loginlimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: { message: "Too many login attempts, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
router.post("/register", registerLimiter, AuthController_1.AuthContoller.register);
router.post("/login", loginlimiter, AuthController_1.AuthContoller.login);
router.post("/refresh", AuthController_1.AuthContoller.refreshToken);
exports.default = router;
