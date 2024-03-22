const express = require('express');
const app = express();
const fs = require('fs');
const csv = require('csv-parser');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const path = require('path');

let users = [];

// Leer archivo CSV y almacenar los datos
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (row) => {
    users.push(row);
  })
  .on('end', () => {
    console.log('CSV cargado exitosamente.');
  });

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('src/public'));

// Endpoint para generar y descargar PDF
app.get('/generate-pdf', async (req, res) => {
  try {
    const pdfBytes = await generatePDF(users);
    const pdfPath = path.join(__dirname, 'pdfs', 'users.pdf');

    fs.writeFileSync(pdfPath, pdfBytes);

    res.download(pdfPath, 'users.pdf', (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
        res.status(500).send('Error al descargar el archivo');
      }
      
      // Eliminar el archivo PDF temporal después de la descarga
      fs.unlinkSync(pdfPath);
    });
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).send('Error al generar PDF');
  }
});

// Generar PDF con los datos
async function generatePDF(users) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const fontSize = 12;
  const lineHeight = 20;
  const textWidth = 200;

  const title = 'Información de usuarios';
  const yStart = height - 50;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText(title, {
    x: 50,
    y: yStart,
    size: 18,
    font: font,
    color: rgb(0, 0, 0),
  });

  let y = yStart - 30;
  users.forEach((person) => {
    page.drawText(`Nombre: ${person.nombre}`, {
      x: 50,
      y: y -= lineHeight,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Apellidos: ${person.apellidos}`, {
      x: 50,
      y: y -= lineHeight,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Telefono: ${person.telefono}`, {
      x: 50,
      y: y -= lineHeight,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Correo: ${person.correo}`, {
      x: 50,
      y: y -= lineHeight,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Dirección: ${person.direccion}`, {
      x: 50,
      y: y -= lineHeight,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Ciudad: ${person.ciudad}`, {
      x: 50,
      y: y -= lineHeight,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawLine({
      start: { x: 50, y: y - 10 },
      end: { x: 50 + textWidth, y: y - 10 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  });


  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

module.exports = app;
