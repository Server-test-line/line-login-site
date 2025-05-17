export default async function handler(req, res) {
    // 檢查是否是 POST 請求
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // 從請求中獲取 Account_Name
        const { Account_Name } = req.body;

        // 如果缺少 Account_Name，回傳錯誤
        if (!Account_Name) {
            return res.status(400).json({ message: '無會員電話號碼' });
        }

        // 查詢該會員的訂單資料
        const orderResponse = await fetch('https://webapi.vastar.com.tw/api/Order/QueryNew', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                UserID: process.env.USER_ID,  // 從環境變數中讀取
                Password: process.env.PASSWORD,  // 從環境變數中讀取
                Account_Name: Account_Name  // 會員電話號碼
            })
        });

        // 解析查詢結果
        const orderResult = await orderResponse.json();

        // 檢查是否成功查詢到訂單
        if (!orderResponse.ok) {
            return res.status(500).json({ message: '查詢訂單失敗', detail: orderResult });
        }

        // 如果查詢成功，並且有訂單資料
        if (Array.isArray(orderResult) && orderResult.length > 0) {
            // 儲存所有訂單編號
            const orderNos = orderResult.map(item => item.Order_No);

            // 創建一個空陣列來儲存產品資料
            const allProductDetails = [];

            // 查詢每一個訂單編號對應的產品資料
            for (const orderNo of orderNos) {
                const productResponse = await fetch('https://webapi.vastar.com.tw/api/OrderDetail/Query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        UserID: process.env.USER_ID,  // 從環境變數中讀取
                        Password: process.env.PASSWORD,  // 從環境變數中讀取
                        Order_No: orderNo  // 當前訂單編號
                    })
                });

                const productResult = await productResponse.json();

                // 檢查產品查詢是否成功
                if (!productResponse.ok) {
                    continue;  // 如果該訂單查詢失敗，繼續處理下一個訂單
                }

                // 如果有產品資料，將它加入結果中
                if (Array.isArray(productResult) && productResult.length > 0) {
                    productResult.forEach(product => {
                        allProductDetails.push({
                            Product_No: product.Product_No,  // 產品序號
                            Product_Name: product.Product_Name  // 產品名稱
                        });
                    });
                } else {
                    console.warn(`訂單 ${orderNo} 沒有產品資料`);
                }
            }

            // 檢查是否查詢到任何產品資料
            if (allProductDetails.length === 0) {
                return res.status(404).json({ message: '該會員沒有訂單資料或產品資料' });
            }

            // 回傳所有查詢到的產品序號與名稱
            return res.status(200).json(allProductDetails);
        } else {
            // 如果該會員沒有訂單資料，回傳 404
            return res.status(404).json({ message: '未找到訂單資料' });
        }

    } catch (error) {
        // 如果發生錯誤，回傳錯誤訊息
        return res.status(500).json({ message: '查詢訂單錯誤', error: error.message });
    }
}
