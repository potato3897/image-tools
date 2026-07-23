exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { url } = JSON.parse(event.body);
    if (!url) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing URL' }) };

    const apis = [
      `https://tenapi.cn/v2/video?url=${encodeURIComponent(url)}`,
      `https://api.oioweb.cn/api/video/VideoInfo?url=${encodeURIComponent(url)}`,
    ];

    let result = null;
    for (const api of apis) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const resp = await fetch(api, { signal: controller.signal });
        clearTimeout(timeout);
        if (!resp.ok) continue;
        const data = await resp.json();
        if (data.code === 200 || data.code === 0) {
          const d = data.data || data;
          if (d.url || d.video || d.play) {
            result = {
              title: d.title || d.desc || d.name || '',
              cover: d.cover || d.poster || d.img || '',
              video: d.url || d.video || d.play || d.download || '',
            };
            if (result.video) break;
          }
        }
      } catch (e) { continue; }
    }

    if (result && result.video) {
      return { statusCode: 200, headers, body: JSON.stringify(result) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ error: '无法解析该视频链接' }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: '服务器错误: ' + e.message }) };
  }
};
