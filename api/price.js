export default async function handler(req, res) {
    const symbol = req.query.symbol || 'BTCUSDT';
  
    const url = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&interval=1D&limit=1`;
  
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'curl/7.64.1'
        }
      });
  
      const data = await response.json();
      if (!data?.result?.list?.length) {
        return res.status(500).json({ error: "No data returned." });
      }
  
      const [timestamp, openPrice] = [data.result.list[0][0], data.result.list[0][1]];
  
      return res.status(200).json({
        symbol,
        openTime: new Date(Number(timestamp)).toISOString(),
        openPrice: parseFloat(openPrice)
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  