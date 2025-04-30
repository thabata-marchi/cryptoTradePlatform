import express, { Request, Response } from "express";
import cors from "cors";
import { deposit, getOrder, placeOrder, withdraw } from "./application";
import Signup from "./Signup";
import { AccountDAODatabase } from "./AccountDAO";
import GetAccount from "./GetAccount";

// Driver

const app = express();
app.use(express.json());
app.use(cors());

const accountDAO = new AccountDAODatabase();
const signup = new Signup(accountDAO);
const getAccount = new GetAccount(accountDAO);

app.post("/signup", async (req: Request, res: Response) => {
    try {
        const input = req.body;
        const output = await signup.execute(input);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({
            error: e.message
        });
    }
});

app.post("/deposit", async (req: Request, res: Response) => {
    const input = req.body;
    await deposit(input);
    res.end();
});

app.post("/withdraw", async (req: Request, res: Response) => {
    try {
        const input = req.body;
        await withdraw(input);
        res.end();
    } catch (e: any) {
        res.status(422).json({
            error: e.message
        });
    }
});

app.post("/place_order", async (req: Request, res: Response) => {
    const input = req.body;
    const output = await placeOrder(input);
    res.json(output);
});

app.get("/orders/:orderId", async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const output = await getOrder(orderId);
    res.json(output);
});

app.get("/accounts/:accountId", async (req: Request, res: Response) => {
    const accountId = req.params.accountId;
    const output = await getAccount.execute(accountId);
    res.json(output);
});

app.listen(3000);
