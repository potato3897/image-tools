exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
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

    const appId = '117354';
    const appKey = '1se2nsm2cs6dk65bxr83js8fz0bqz65m';
    const apiUrl = 'https://qyapi.ipaybuy.cn/api/video?appId=' + appId + '&appKey=' + appKey + '&url=' + encodeURIComponent(url);

    const resp = await fetch(apiUrl, { signal: AbortSignal.timeout(15000) });
    const data = await resp.json();

    if (data.code === 200 && data.data) {
      const d = data.data;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          title: d.title || '',
          cover: d.cover_url || '',
          video: d.video_url || '',
        }),
      };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ error: data.msg || '解析失败' }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: '服务器错误: ' + e.message }) };
  }
};