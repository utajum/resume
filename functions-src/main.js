export async function handler(event, context) {
  console.log(
    `{
      context: ${JSON.stringify(context, null, 2)},
      event: ${JSON.stringify(event, null, 2)}
     }`
  );
  console.log(event?.headers?.["host"]);
  console.log(event?.headers?.["sec-ch-ua-platform"]);
  console.log(event?.headers?.["user-agent"]);
  console.log(event?.headers?.["x-country"]);
  console.log(event?.headers?.["x-language"]);
  console.log(event?.headers?.["x-nf-client-connection-ip"]);
  console.log(event?.multiValueHeaders?.["X-Nf-Client-Connection-Ip"]);
  console.log(event?.multiValueHeaders?.["host"]);
  console.log(event?.multiValueHeaders?.["X-Language"]);
  console.log(event?.multiValueHeaders?.["X-Country"]);
  console.log(event?.multiValueHeaders?.["User-Agent"]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello world ${Math.floor(Math.random() * 10)}`,
    }),
  };
}
