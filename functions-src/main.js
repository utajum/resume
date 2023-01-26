export async function handler(event, context) {
  console.log(
    `{\ncontext: ${JSON.stringify(context, null, 2)},\nevent: ${JSON.stringify(
      event,
      null,
      2
    )}\n}`
  );
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello world ${Math.floor(Math.random() * 10)}`,
    }),
  };
}
