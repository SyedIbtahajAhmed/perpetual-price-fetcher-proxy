export default async function handler(req, res) {
  const symbol = req.query.symbol || 'BTCUSDT_UMCBL';

  const url = `https://api.bitget.com/api/mix/v1/market/candles?symbol=${symbol}&granularity=86400&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'curl/7.64.1'
      }
    });

    const data = await response.json();

    if (!data?.data?.length) {
      return res.status(500).json({ error: "No data returned" });
    }

    const kline = data.data[0]; // [time, open, high, low, close, volume, quoteVolume]

    return res.status(200).json({
      symbol: symbol,
      openTime: new Date(Number(kline[0])).toISOString(),
      openPrice: parseFloat(kline[1])
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
