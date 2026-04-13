"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const Entries_1 = require("../entity/Entries");
const User_1 = require("../entity/User");
const DailySummary_1 = require("../entity/DailySummary");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.
        env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [Entries_1.Entries, User_1.User, DailySummary_1.DailySummary],
});
