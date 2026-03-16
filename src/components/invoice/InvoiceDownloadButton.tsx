'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { InvoicePDF } from './InvoicePDF';

interface InvoiceDownloadButtonProps {
    invoice: any;
    subtotal: number;
    taxAmount: number;
    total: number;
}

const InvoiceDownloadButton: React.FC<InvoiceDownloadButtonProps> = ({ invoice, subtotal, taxAmount, total }) => {
    return (
        <PDFDownloadLink
            document={<InvoicePDF invoice={invoice} subtotal={subtotal} taxAmount={taxAmount} total={total} />}
            fileName={`Invoice-${invoice.invoiceNumber}.pdf`}
        >
            {({ loading }) => (
                <Button variant="outline" disabled={loading} className="gap-2 border-gray-200 hover:bg-gray-50 text-gray-700">
                    <FileDown size={16} />
                    {loading ? 'Preparing...' : 'Export PDF'}
                </Button>
            )}
        </PDFDownloadLink>
    );
};

export default InvoiceDownloadButton;
