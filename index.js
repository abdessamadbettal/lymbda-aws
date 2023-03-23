// const AWS = require('aws-sdk');
// const pdf = require('pdf-poppler');
// const path = require('path'); 

// const s3 = new AWS.S3();
// const asyncHandler = require('express-async-handler');

// const convertFirstPage = asyncHandler(async (source) => {
//   let opts = {
//     format: 'jpeg',
//     out_dir: path.dirname(source),
//     out_prefix: path.basename(source, path.extname(source)),
//     page: 1,
//     scale: 1024
//   };

//   return pdf.convert(source, opts);
// });

// exports.handler = async (event) => {
//   const bucketName = event.Records[0].s3.bucket.name;
//   const objectKey = event.Records[0].s3.object.key;

//   const source = `/tmp/${path.basename(objectKey)}`;
//   const dest = `/tmp/${path.basename(objectKey, path.extname(objectKey))}.jpg`;

//   try {
//     const response = await s3.getObject({ Bucket: bucketName, Key: objectKey }).promise();
//     await require('fs').promises.writeFile(source, response.Body);

//     await convertFirstPage(source);

//     const data = await require('fs').promises.readFile(dest);

//     await s3.putObject({
//       Bucket: bucketName,
//       Key: `${path.basename(objectKey, path.extname(objectKey))}.jpg`,
//       Body: data,
//       ContentType: 'image/jpeg'
//     }).promise();

//     return {
//       statusCode: 200,
//       body: 'PDF converted to image'
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       statusCode: 500,
//       body: 'Error converting PDF to image'
//     };
//   }
// };