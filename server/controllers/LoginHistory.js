import { LoginRecord } from "../models/UserLoginSchema.js";

const LoginHistoryStore = async (req, res) => {
    try {
        const { hhNumber, name, type } = req.body;
        console.log("Received login record:", req.body);
        const newRecord = new LoginRecord({ hhNumber, name, type });
        await newRecord.save();
        res.status(201).json({ message: 'Login record saved', record: newRecord });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save login record' });
    }
};

const LoginHisoryGet = async (req, res) => {
    try {
        const records = await LoginRecord.find({});
        if(!records ) {
            return res.status(404).json({ error: 'No login history found' });
        }
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch login history' });
    }
};

export { LoginHistoryStore, LoginHisoryGet };