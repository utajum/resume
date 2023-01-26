export async function handler(event, context) {
  // console.log(JSON.stringify({ context, event }));

  const host =
    event?.headers?.["host"] ||
    (event?.multiValueHeaders?.["host"] || "").toString();

  const platform = event?.headers?.["sec-ch-ua-platform"] || "";

  const userAgent =
    event?.headers?.["user-agent"] ||
    (event?.multiValueHeaders?.["User-Agent"] || "").toString();

  const country =
    event?.headers?.["x-country"] ||
    (event?.multiValueHeaders?.["X-Country"] || "").toString();

  const language =
    event?.headers?.["x-language"] ||
    (event?.multiValueHeaders?.["X-Language"] || "").toString();

  const clientIP =
    event?.headers?.["x-nf-client-connection-ip"] ||
    (event?.multiValueHeaders?.["X-Nf-Client-Connection-Ip"] || "").toString();

  const clientInfo = {
    host,
    clientIP,
    platform,
    userAgent,
    country,
    language,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(clientInfo),
  };
}
