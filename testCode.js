const pdf = require('pdf-poppler');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const { PDFDocument , PDFString , PDFName , rgb, StandardFonts , degrees , rotate } = require('pdf-lib');


const handler = async (event) => {
    const target = path.join(__dirname, 'test.pdf');
    convertFirstPage(target);
    AddWatermark( 5 , 'biologie');

};


const convertFirstPage = asyncHandler(async (source) => {
    let opts = {
        format: 'jpeg',
        out_dir: path.dirname(source),
        out_prefix: path.basename(source, path.extname(source)),
        page: 1,
        scale: 1024

    };
    pdf.convert(source, opts).then((resolve) => {
        console.log('pdf converted to image');
    }).catch((error) => {
        console.log('pdf not converted to image');
    });
})

const AddWatermark = asyncHandler( async  ( pagesNumbers , specialite) => {
    const createPageLinkAnnotation = (page, uri, h , w) =>
  page.doc.context.register(
    page.doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [w * 0.2, 0 , w * 0.8, 50],
      Border: [0, 0, 2],
      C: [0, 0, 1],
      A: {
        Type: 'Action',
        S: 'URI',
        URI: PDFString.of(uri),
      },
    }),
  );


    const pdf = fs.readFileSync(path.join(__dirname, 'test.pdf'));
    const logo = fs.readFileSync(path.join(__dirname, 'watemark.png'));
    const pdfDoc = await PDFDocument.load(pdf);
    const png = await pdfDoc.embedPng(logo);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pagesNumbers; i++) {
    
  const page = pages[i];
    const { width, height } = page.getSize();
    if(i !== pagesNumbers - 1){
    page.drawImage(png, {
        x: (width / 2 ) -65,
        y: height - (height-8),
        width: 100,
        height: 25,
        opacity: 0.75, 

    });
    } else {
    
        page.drawText(`pour plus des pdf de ${specialite} visite jami3a.com`, {
            x: 25,
            y: height - (height-8),
            size: 15,
            font: timesRomanFont,
            color: rgb(0, 0, 0) ,
            opacity: 0.5,
            // rotate: degrees(90),
          });
    }
    
        const link = createPageLinkAnnotation(page, 'http://www.google.com' , height , width);
        page.node.set(PDFName.of('Annots'), pdfDoc.context.obj([link]));
    }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(__dirname, 'pdfwatarked.pdf'), pdfBytes);
    console.log('add watmark to image seccsufully');

})



handler();