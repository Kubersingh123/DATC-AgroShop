import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Sale } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

interface BillProps {
  sale: Sale;
  onClose?: () => void;
}

const Bill: React.FC<BillProps> = ({ sale, onClose }) => {
  const billRef = useRef<HTMLDivElement>(null);

  const exportToPDF = async () => {
    if (!billRef.current) return;

    try {
      const canvas = await html2canvas(billRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit the page
      const imgWidth = pdfWidth - 20; // Leave 10mm margin on each side
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Invoice-${sale.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    if (!billRef.current) return;
    window.print();
  };

  return (
    <div className="bill-container">
      <div className="bill-actions">
        <button onClick={handlePrint} className="btn-primary">
          🖨️ Print Bill
        </button>
        <button onClick={exportToPDF} className="btn-primary">
          📄 Download PDF
        </button>
        {onClose && (
          <button onClick={onClose} className="btn-ghost">
            Close
          </button>
        )}
      </div>

      <div ref={billRef} className="bill-paper">
        {/* Header */}
        <div className="bill-header">
          <div className="bill-store-info">
            <h1 className="bill-store-name">Deepak Agriculture and Trading Company</h1>
            <p className="bill-store-address">Rampur Baghelan Satna M.P</p>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bill-contact">
          <div className="bill-contact-item">
            <div><strong>Phone:</strong> 7974664046</div>
            <div><strong>Email:</strong> DATC@AgroShop.com</div>
          </div>
          <div className="bill-contact-item">
            <strong>GST Number:</strong> 23H0JPS294IGIZ0
          </div>
        </div>

        <hr className="bill-divider" />

        {/* Invoice Details */}
        <div className="bill-invoice-info">
          <div className="bill-invoice-row">
            <div>
              <strong>Invoice Number:</strong> {sale.invoiceNumber}
            </div>
            <div>
              <strong>Date:</strong> {formatDate(sale.saleDate)}
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bill-section">
          <h3 className="bill-section-title">Customer Details</h3>
          <div className="bill-customer-info">
            <div className="bill-customer-row">
              <div><strong>Name:</strong> {sale.customer?.name || 'Walk-in Customer'}</div>
              {sale.customer?.phone && (
                <div><strong>Phone:</strong> {sale.customer.phone}</div>
              )}
            </div>
            {sale.customer?.address && (
              <div className="bill-customer-row">
                <div><strong>Address:</strong> {sale.customer.address}</div>
              </div>
            )}
            {sale.customer?.gstNumber && (
              <div className="bill-customer-row">
                <div><strong>GST Number:</strong> {sale.customer.gstNumber}</div>
              </div>
            )}
          </div>
        </div>

        {/* Products Details */}
        <div className="bill-section">
          <h3 className="bill-section-title">Product Details</h3>
          <table className="bill-table">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>GST %</th>
                <th>GST Amount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.product?.name || 'N/A'}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.rate)}</td>
                  <td>{item.gstRate}%</td>
                  <td>{formatCurrency(item.gstAmount)}</td>
                  <td>{formatCurrency(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Calculation */}
        <div className="bill-totals">
          <div className="bill-total-row">
            <div><strong>Subtotal:</strong></div>
            <div>{formatCurrency(sale.subtotal)}</div>
          </div>
          <div className="bill-total-row">
            <div><strong>GST Total:</strong></div>
            <div>{formatCurrency(sale.gstTotal)}</div>
          </div>
          <div className="bill-total-row bill-total-final">
            <div><strong>Grand Total:</strong></div>
            <div>{formatCurrency(sale.total)}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="bill-footer">
          <div className="bill-signature">
            <div className="bill-signature-line"></div>
            <p>Signature of Store Owner</p>
          </div>
          <div className="bill-thanks">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;

