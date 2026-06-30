exports.handler = async (event) => {
  const token = process.env.SSOTICA_TOKEN;
  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Token não configurado' }) };
  }

  const { _endpoint, ...params } = event.queryStringParameters || {};

  const endpoints = {
    vendas:     'https://app.ssotica.com.br/api/v1/integracoes/vendas/periodo',
    os:         'https://app.ssotica.com.br/api/v1/integracoes/ordens-servico/periodo',
    financeiro: 'https://app.ssotica.com.br/api/v1/integracoes/financeiro/extrato/periodo',
    produtos:   'https://app.ssotica.com.br/api/v1/produto/estoque/busca',
  };

  const baseUrl = endpoints[_endpoint];
  if (!baseUrl) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Endpoint inválido: ' + _endpoint }) };
  }

  const url = new URL(baseUrl);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const response = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    });
    const text = await response.text();
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: text
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
