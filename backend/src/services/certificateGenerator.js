const PDFDocument = require('pdfkit');

/**
 * Generate Official Department Certificate PDF
 * @param {Object} homestay Homestay object populated with owner & ratings
 * @param {Object} res Express Response stream
 */
const generateCertificatePDF = (homestay, res) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });

    // Stream directly to HTTP response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${homestay.registrationNumber || homestay._id}.pdf`);
    doc.pipe(res);

    // Border Frame
    doc
        .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(3)
        .stroke('#0284c7');

    doc
        .rect(26, 26, doc.page.width - 52, doc.page.height - 52)
        .lineWidth(1)
        .stroke('#059669');

    // Department Header
    doc
        .fillColor('#0f172a')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('STATE TOURISM DEPARTMENT', { align: 'center' });

    doc
        .fillColor('#0284c7')
        .fontSize(14)
        .font('Helvetica')
        .text('GOVERNMENT HOMESTAY CERTIFICATION BOARD', { align: 'center' });

    doc.moveDown(1.5);

    // Title Banner
    doc
        .fillColor('#059669')
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('CERTIFICATE OF REGISTRATION & QUALITY RATING', { align: 'center' });

    doc.moveDown(1);

    // Certificate Statement
    doc
        .fillColor('#334155')
        .fontSize(12)
        .font('Helvetica')
        .text('This is to officially certify that the Homestay establishment described below has been inspected, approved, and registered under the State Tourism Homestay Quality Management Framework.', { align: 'center', lineGap: 4 });

    doc.moveDown(1.5);

    // Property Details Table Box
    const startX = 60;
    let startY = doc.y;

    doc
        .rect(startX, startY, 475, 230)
        .fillAndStroke('#f8fafc', '#cbd5e1');

    doc.fillColor('#0f172a').fontSize(11).font('Helvetica');

    let textY = startY + 15;
    const lineSpacing = 22;

    const addField = (label, value, isBoldValue = false) => {
        doc.font('Helvetica-Bold').text(`${label}:`, startX + 15, textY);
        doc.font(isBoldValue ? 'Helvetica-Bold' : 'Helvetica').text(value, startX + 180, textY);
        textY += lineSpacing;
    };

    addField('Official Registration No', homestay.registrationNumber || 'STATE-DIST-2026-CERT', true);
    addField('Property Name', homestay.propertyName, true);
    addField('Registered Owner', homestay.owner?.name || 'Registered Owner');
    addField('District & Location', `${homestay.district}, ${homestay.taluk}`);
    addField('Quality Star Rating', `${homestay.currentRating || 5} STAR CERTIFIED (★★★★★)`.substring(0, 16 + (homestay.currentRating || 5)), true);
    addField('Date of Certification', homestay.certificateIssuedAt ? new Date(homestay.certificateIssuedAt).toLocaleDateString() : new Date().toLocaleDateString());
    addField('Valid Till', homestay.certificateValidTill ? new Date(homestay.certificateValidTill).toLocaleDateString() : new Date(Date.now() + 2 * 365 * 86400000).toLocaleDateString(), true);
    addField('Status', 'ACTIVE & VERIFIED');

    doc.moveDown(2);

    // Signatures Section
    const sigY = doc.y + 40;
    doc
        .moveTo(80, sigY)
        .lineTo(240, sigY)
        .stroke('#94a3b8');

    doc
        .moveTo(350, sigY)
        .lineTo(510, sigY)
        .stroke('#94a3b8');

    doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('District Tourism Officer', 80, sigY + 8, { width: 160, align: 'center' });

    doc
        .text('Director of Tourism HQ', 350, sigY + 8, { width: 160, align: 'center' });

    // Verification Footer Note
    doc
        .fontSize(9)
        .font('Helvetica-Oblique')
        .fillColor('#64748b')
        .text(`Verify online at portal: http://localhost:3000/verify-certificate?regNo=${homestay.registrationNumber || ''}`, 40, doc.page.height - 70, { align: 'center' });

    doc.end();
};

module.exports = { generateCertificatePDF };
