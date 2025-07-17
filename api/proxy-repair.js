export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { Account_Name } = req.body;

        if (!Account_Name) {
            return res.status(400).json({ message: '無會員電話號碼' });
        }

        const repairResponse = await fetch('https://webapi.vastar.com.tw/api/RepairOrder/QueryERP', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                UserID: 'vastar',
                Password: 'vastar@2673',
                Account_Name: Account_Name
            })
        });

        const result = await repairResponse.json();

        if (!repairResponse.ok) {
            return res.status(500).json({ message: '查詢失敗', detail: result });
        }

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ message: 'Repair Query Proxy Error', error: error.message });
    }
}
