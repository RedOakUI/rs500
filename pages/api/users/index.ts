import { NextApiRequest, NextApiResponse } from "next";
import { GoogleSpreadsheet } from "google-spreadsheet";
import creds from "../../../creds.json";

async function addData() {
  const doc = new GoogleSpreadsheet(
    "1rGkhRNC0iTJGStYLGhoSzmz8feMBhCx7mfH9ELX6OkA"
  );
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const currentSheet = doc.sheetsByIndex[0];
  const allRows = await currentSheet.getRows();
  console.log(allRows.length);
}

function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    addData();
    // if (!Array.isArray(sampleUserData)) {
    //   throw new Error("Cannot find user data");
    // }

    // const doc = new GoogleSpreadsheet(
    //   "1rGkhRNC0iTJGStYLGhoSzmz8feMBhCx7mfH9ELX6OkA"
    // );
    // await doc.useServiceAccountAuth(creds);
    // // console.log(creds);
    // await doc.loadInfo();
    // const currentSheet = doc.sheetsByIndex[0];
    // const allRows = await currentSheet.getRows();
    // console.log(allRows.length);

    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}

// const handler = (_req: NextApiRequest, res: NextApiResponse) => {
// try {
//   if (!Array.isArray(sampleUserData)) {
//     throw new Error("Cannot find user data");
//   }

// async function addData() {
//   const doc = new GoogleSpreadsheet(
//     "1rGkhRNC0iTJGStYLGhoSzmz8feMBhCx7mfH9ELX6OkA"
//   );
//   await doc.useServiceAccountAuth(creds);
//   // console.log(creds);
//   await doc.loadInfo();
//   const currentSheet = doc.sheetsByIndex[0];
//   const allRows = await currentSheet.getRows();
//   console.log(allRows.length);
// }

//   res.status(200).json(sampleUserData);
// } catch (err) {
//   res.status(500).json({ statusCode: 500, message: err.message });
// }
// };

export default handler;
