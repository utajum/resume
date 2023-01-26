export async function handler(event, context) {
  console.log(
    `{
      context: ${JSON.stringify(context, null, 2)},
      event: ${JSON.stringify(event, null, 2)}
     }`
  );
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello world ${Math.floor(Math.random() * 10)}`,
    }),
  };
}
