import { GoogleSpreadsheet } from 'google-spreadsheet';

const doc = new GoogleSpreadsheet(process.env.SHEET_ID_ELEVATECH);

const platformFromClientEventBody = (event) => {
  if (!event.body) return '';
  try {
    return JSON.parse(event.body)?.platform || '';
  } catch (err) {
    return '';
  }
};

export async function handler(event, context) {
  console.log(JSON.stringify({ context, event }));

  const PRIVATE_KEY = Buffer.from(process.env.PRIVATE_KEY, 'base64').toString(
    'ascii'
  );

  await doc.useServiceAccountAuth({
    client_email: process.env.CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  });

  await doc.loadInfo(); // loads document properties and worksheets

  const firstSheet = doc.sheetsByIndex[0]; // in the order they appear on the sheets UI

  await firstSheet.setHeaderRow(
    [
      'HOST',
      'CLIENT_IP',
      'PLATFORM',
      'USER_AGENT',
      'COUNTRY',
      'LANGUAGE',
      'DATE',
      'OTHER',
    ],
    0
  );

  const host =
    event?.headers?.['host'] ||
    (event?.multiValueHeaders?.['host'] || '').toString();

  const platform =
    platformFromClientEventBody(event)?.os?.family ||
    event?.headers?.['sec-ch-ua-platform'] ||
    '';

  const userAgent =
    event?.headers?.['user-agent'] ||
    (event?.multiValueHeaders?.['User-Agent'] || '').toString();

  const country =
    event?.headers?.['x-country'] ||
    (event?.multiValueHeaders?.['X-Country'] || '').toString();

  const language =
    event?.headers?.['x-language'] ||
    (event?.multiValueHeaders?.['X-Language'] || '').toString();

  const clientIP =
    event?.headers?.['x-nf-client-connection-ip'] ||
    (event?.multiValueHeaders?.['X-Nf-Client-Connection-Ip'] || '').toString();

  const clientInfo = {
    HOST: host,
    CLIENT_IP: clientIP,
    PLATFORM: platform,
    USER_AGENT: userAgent,
    COUNTRY: country,
    LANGUAGE: language,
    DATE: new Date().toString(),
    OTHER: JSON.stringify(platformFromClientEventBody(event)),
  };

  await firstSheet.addRow({ ...clientInfo });

  const TOTAL_SITE_VISITS = (await firstSheet.getRows())?.length || 0;

  const { HOST, ...other } = clientInfo;

  const retPayload = {
    statusCode: 200,
    headers: {
      'access-control-allow-methods': 'POST,GET',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Max-Age': '2592000',
      'Access-Control-Allow-Credentials': 'true',
    },
    body: JSON.stringify({ ...other, TOTAL_SITE_VISITS }),
  };

  if (event?.multiValueHeaders?.Origin?.[0]?.includes('elevatech.xyz')) {
    retPayload['Access-Control-Allow-Origin'] =
      event.multiValueHeaders.Origin[0];
  }

  return retPayload;
}
