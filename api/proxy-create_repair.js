export default async function handler(req, res) {
    // 檢查是否是 POST 請求
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // 從請求中獲取 UserID, Password, 和 Order_No
        const { UserID, Password, Order_No } = req.body;

        // 如果缺少任何必要的參數，回傳錯誤
        if (!UserID || !Password || !Order_No) {
            return res.status(400).json({ message: '缺少必要的參數 (UserID, Password, 或 Order_No)' });
        }

        // 向第三方 API 發送請求，查詢訂單資料
        const orderResponse = await fetch('https://webapi.vastar.com.tw/api/Order/QueryNew', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                UserID: UserID,
                Password: Password,
                Order_No: Order_No
            })
        });

        // 解析第三方 API 回傳的資料
        const result = await orderResponse.json();

        // 檢查是否成功返回結果
        if (!orderResponse.ok) {
            return res.status(500).json({ message: '查詢失敗', detail: result });
        }

        // 如果查詢成功，回傳產品資料
        if (Array.isArray(result) && result.length > 0) {
            const responseData = result.map(item => ({
                Result: 0, // 範例值，根據實際情況修改
                Message: 'Success', // 範例值，成功消息
                ID: item.ID || 0, // 訂單項目ID
                Account_Name: item.Account_Name, // 會員帳戶名稱
                Product_No: item.Product_No, // 產品序號
                Product_Name: item.Product_Name, // 產品名稱
                Product_Voltage: item.Product_Voltage || '', // 產品電壓
                Product_Color: item.Product_Color || '', // 產品顏色
                Product_Price: item.Product_Price || 0, // 產品價格
                Quantity: item.Quantity || 0, // 產品數量
                TotalPrice: item.TotalPrice || 0 // 總價
            }));

            // 回傳成功的資料
            return res.status(200).json(responseData);
        } else {
            // 如果沒有訂單資料，回傳 404
            return res.status(404).json({ message: '未找到訂單資料' });
        }

    } catch (error) {
        // 如果發生錯誤，回傳錯誤訊息
        return res.status(500).json({ message: '查詢訂單錯誤', error: error.message });
    }
}
