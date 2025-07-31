const axios = require('axios');
const Check = require('../model/Check.js'); // Make sure the file is named correctly

// POST /api/check
exports.checkWebsite = async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "URL is required" });

  const start = Date.now();

  try {
    const response = await axios.get(url, { timeout: 10000 });

    const responseTime = Date.now() - start;

    const headers = response.headers;
    const statusText = response.statusText;
    const contentType = headers['content-type'] || null;
    const server = headers['server'] || null;
    const contentLength = headers['content-length'] || null;
    const finalUrl = response.request?.res?.responseUrl || url;
    const redirected = finalUrl !== url;

    // Try to extract <title> from HTML
    let title = null;
    try {
      const titleMatch = response.data.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) title = titleMatch[1];
    } catch (_) {
      // Ignore parsing errors silently
    }

    const check = await Check.create({
      url,
      status: response.status,
      statusText,
      responseTime,
      isUp: true,
      contentType,
      server,
      contentLength: contentLength ? parseInt(contentLength) : null,
      finalUrl,
      redirected,
      title
    });

    res.status(200).json(check);

  } catch (error) {
    const responseTime = Date.now() - start;

    const check = await Check.create({
      url,
      status: error.response?.status || 0,
      statusText: error.response?.statusText || 'Error',
      responseTime,
      isUp: false,
      contentType: null,
      server: null,
      contentLength: null,
      finalUrl: url,
      redirected: false,
      title: null
    });

    res.status(200).json(check);
  }
};

// GET /api/history?url=https://example.com
exports.getHistory = async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: "URL query param is required" });

  try {
    const history = await Check.find({ url }).sort({ checkedAt: -1 }).limit(20);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong while fetching history" });
  }
};
