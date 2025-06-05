export default async function handler(req, res) {
  const symbol = req.query.symbol || 'BTCUSDT_UMCBL'; // Default to BTC
  const granularity = req.query.granularity || '86400'; // 1-day

  const url = `https://api.bitget.com/api/mix/v1/market/candles?symbol=${encodeURIComponent(symbol)}&granularity=${granularity}&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = await response.json();

    if (!data?.data || data.data.length === 0) {
      return res.status(500).json({ error: "No data returned from Bitget", symbol: symbol, apiUrl: url });
    }

    const kline = data.data[0]; // [timestamp, open, high, low, close, volume, quoteVolume]
    const openTime = new Date(Number(kline[0])).toISOString();
    const openPrice = parseFloat(kline[1]);

    return res.status(200).json({
      symbol,
      openTime,
      openPrice
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
