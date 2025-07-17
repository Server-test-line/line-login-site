export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const {
      Account_Name,
      Name,
      Telphone,
      Adress,
      Contact_Details,
      Fault_Description,
      Repair_Method,
      Repair_Type,
      Order_No,
      Product_No,
      Product_SN
    } = req.body;

    // 檢查必要欄位
    if (!Account_Name || !Name || !Telphone) {
      return res.status(400).json({ message: '缺少必要欄位' });
    }

    const response = await fetch('https://webapi.vastar.com.tw/api/RepairOrder/Insert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        UserID: 'vastar',
        Password: 'vastar@2673',
        Account_Name,
        Name,
        Telphone,
        Adress,
        Contact_Details,
        Fault_Description,
        Repair_Date: new Date().toISOString(),
        Repair_Method,
        Repair_Type,
        Order_No,
        Product_No,
        Product_SN
      })
    });

    const result = await response.json();

    if (!response.ok || result.Result < 0) {
      return res.status(500).json({ message: '新增報修失敗', detail: result });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: '報修 API 錯誤', error: error.message });
  }
}
