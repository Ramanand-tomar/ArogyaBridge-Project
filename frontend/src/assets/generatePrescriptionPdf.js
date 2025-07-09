import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

const LOGO_URL = './ArogyaBridge.jpg'; // Add your logo in public folder

export const generatePrescriptionPdf = async ({ doctorProfile, patientNumber, title, description, date }) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Background Header Bar
  page.drawRectangle({
    x: 0,
    y: height - 80,
    width,
    height: 80,
    color: rgb(0.0, 0.6, 0.6),
  });

  // Draw Logo
  try {
    const logoBytes = await fetch(LOGO_URL).then(res => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.15);
    page.drawImage(logoImage, {
      x: width - logoDims.width - 40,
      y: height - logoDims.height - 20,
      width: logoDims.width,
      height: logoDims.height,
    });
  } catch {
    console.log("Logo not found, skipping...");
  }

  // Header Title
  page.drawText("ArogyaBridge e-Prescription", {
    x: 40,
    y: height - 50,
    size: 20,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  let cursorY = height - 110;

  const drawLabel = (label, value, offsetX = 50) => {
    page.drawText(label, { x: offsetX, y: cursorY, size: 12, font: boldFont, color: rgb(0, 0.2, 0.4) });
    page.drawText(value, { x: offsetX + 120, y: cursorY, size: 12, font, color: rgb(0, 0, 0) });
    cursorY -= 18;
  };

  // Doctor Profile Section
  page.drawText("Doctor Information", {
    x: 50,
    y: cursorY,
    size: 14,
    font: boldFont,
    color: rgb(0.2, 0.4, 0.6),
  });
  cursorY -= 20;

  drawLabel("Name:", doctorProfile.name);
  drawLabel("Specialization:", doctorProfile.specialization);
  drawLabel("Email:", doctorProfile.email);
  drawLabel("Hospital:", doctorProfile.hospital);

  cursorY -= 10;
  page.drawLine({
    start: { x: 50, y: cursorY },
    end: { x: width - 50, y: cursorY },
    thickness: 1,
    color: rgb(0.6, 0.8, 0.8),
  });
  cursorY -= 20;

  // Patient Info Section
  page.drawText("Patient Information", {
    x: 50,
    y: cursorY,
    size: 14,
    font: boldFont,
    color: rgb(0.2, 0.4, 0.6),
  });
  cursorY -= 20;

  drawLabel("Patient Number:", patientNumber);
  drawLabel("Date:", date);

  cursorY -= 10;
  page.drawLine({
    start: { x: 50, y: cursorY },
    end: { x: width - 50, y: cursorY },
    thickness: 1,
    color: rgb(0.6, 0.8, 0.8),
  });
  cursorY -= 20;

  // Prescription Section
  page.drawText("Prescription", {
    x: 50,
    y: cursorY,
    size: 14,
    font: boldFont,
    color: rgb(0.2, 0.4, 0.6),
  });
  cursorY -= 20;

  drawLabel("Title:", title);

  page.drawText("Description:", {
    x: 50,
    y: cursorY,
    size: 12,
    font: boldFont,
    color: rgb(0, 0.2, 0.4),
  });
  cursorY -= 18;

  const descriptionLines = description.match(/.{1,80}/g) || [];
  for (const line of descriptionLines) {
    page.drawText(line, { x: 60, y: cursorY, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
    cursorY -= 15;
  }

  // Footer
  page.drawLine({
    start: { x: 50, y: 50 },
    end: { x: width - 50, y: 50 },
    thickness: 1,
    color: rgb(0.6, 0.8, 0.8),
  });

  page.drawText("This prescription is digitally generated via ArogyaBridge.", {
    x: 50,
    y: 30,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, `Prescription_${patientNumber}.pdf`);
};
