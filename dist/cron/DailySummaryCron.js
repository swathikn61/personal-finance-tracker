"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailySummaryCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const database_1 = require("../utils/database");
const Entries_1 = require("../entity/Entries");
const User_1 = require("../entity/User");
const DailySummary_1 = require("../entity/DailySummary");
const logger_1 = __importDefault(require("../utils/logger"));
const DailySummaryCron = () => {
    node_cron_1.default.schedule("*/10 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info("Running Daily Summary Cron Job...");
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const entriesRepository = database_1.AppDataSource.getRepository(Entries_1.Entries);
            const summaryRepository = database_1.AppDataSource.getRepository(DailySummary_1.DailySummary);
            const users = yield userRepository.find();
            for (const user of users) {
                const totalIncome = (yield entriesRepository.sum("amount", { type: Entries_1.EntryType.INCOME, userId: user.id, })) || 0;
                const totalExpense = (yield entriesRepository.sum("amount", { type: Entries_1.EntryType.EXPENSE, userId: user.id, })) || 0;
                const balance = totalIncome - totalExpense;
                const summary = new DailySummary_1.DailySummary();
                summary.totalIncome = totalIncome;
                summary.totalExpense = totalExpense;
                summary.balance = balance;
                summary.date = new Date().toISOString().split("T")[0];
                summary.user = user;
                yield summaryRepository.save(summary);
            }
            logger_1.default.info("Daily Summary Cron Completed", new Date());
        }
        catch (error) {
            logger_1.default.error("Daily Summary Cron Failed", { error });
        }
    }));
};
exports.DailySummaryCron = DailySummaryCron;
