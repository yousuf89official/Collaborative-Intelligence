import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register standard fonts
// Poppins temporarily disabled due to rendering crash. Reverting to Helvetica for stability.
/*
if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    Font.register({
        family: 'Poppins',
        fonts: [
            { src: `${origin}/fonts/Poppins-Regular.ttf`, fontWeight: 400 },
            { src: `${origin}/fonts/Poppins-Bold.ttf`, fontWeight: 700 }, // 'bold'
            { src: `${origin}/fonts/Poppins-Medium.ttf`, fontWeight: 500 },
            { src: `${origin}/fonts/Poppins-Light.ttf`, fontWeight: 300 },
            { src: `${origin}/fonts/Poppins-Black.ttf`, fontWeight: 900 }
        ]
    });
}
*/

// Premium Styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        padding: 0
    },
    headerBar: {
        height: 8,
        backgroundColor: '#2563EB', // Blue-600
        marginBottom: 30
    },
    container: {
        paddingHorizontal: 40,
        paddingBottom: 40,
        flex: 1
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
    },
    sellerSection: {
        width: '55%',
        paddingRight: 20
    },
    companyName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4
    },
    companyDetails: {
        fontSize: 9,
        color: '#6B7280',
        marginBottom: 2
    },
    invoiceMeta: {
        width: '40%',
        alignItems: 'flex-end'
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        textTransform: 'uppercase',
        marginBottom: 10,
        letterSpacing: -1
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 4,
        width: '100%'
    },
    metaLabel: {
        fontSize: 8,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginRight: 10,
        width: 60,
        textAlign: 'right'
    },
    metaValue: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#374151',
        width: 80, // Fixed width for alignment
        textAlign: 'right'
    },
    billToSection: {
        marginBottom: 30
    },
    billToLabel: {
        fontSize: 7,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 6,
        letterSpacing: 1
    },
    buyerName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4
    },
    buyerDetails: {
        fontSize: 9,
        color: '#6B7280',
        marginBottom: 2
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderBottomColor: '#111827',
        paddingBottom: 8,
        marginBottom: 8
    },
    tableHeaderLabel: {
        fontSize: 7,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#111827',
        letterSpacing: 1
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F3F4F6',
        alignItems: 'flex-start'
    },
    colDesc: { width: '45%' },
    colQty: { width: '15%', textAlign: 'right' },
    colPrice: { width: '20%', textAlign: 'right' },
    colTotal: { width: '20%', textAlign: 'right' },
    itemText: { fontSize: 9, color: '#374151' },
    itemBold: { fontSize: 9, fontFamily: 'Helvetica', fontWeight: 'bold', color: '#111827' },

    // Totals
    totalsSection: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    totalsBox: {
        width: '45%' // Slightly wider
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F9FAFB'
    },
    totalLabel: {
        fontSize: 9,
        color: '#6B7280'
    },
    totalValue: {
        fontSize: 9,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        color: '#374151'
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        marginTop: 4
    },
    grandTotalLabel: {
        fontSize: 12,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        color: '#111827'
    },
    grandTotalValue: {
        fontSize: 14,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        color: '#111827'
    },

    // Footer
    footerSection: {
        flexDirection: 'row',
        marginTop: 50,
        paddingTop: 30,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6'
    },
    footerColLeft: {
        width: '55%',
        paddingRight: 20
    },
    footerColRight: {
        width: '45%',
        paddingLeft: 20,
        borderLeftWidth: 1,
        borderLeftColor: '#F3F4F6',
        display: 'flex',
        justifyContent: 'space-between'
    },
    paymentLabel: {
        fontSize: 7,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 0.5
    },
    paymentRow: {
        flexDirection: 'row',
        marginBottom: 4
    },
    paymentKey: {
        fontSize: 8,
        color: '#6B7280',
        width: 70
    },
    paymentVal: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#111827',
        flex: 1
    },
    termsText: {
        fontSize: 8,
        color: '#6B7280',
        lineHeight: 1.4,
        marginTop: 10
    },
    signatureContainer: {
        height: 60,
        marginBottom: 10,
        position: 'relative',
        overflow: 'hidden' // Clip signature if it moves out
    },
    signatureImage: {
        height: 60,
        objectFit: 'contain',
        alignSelf: 'flex-start'
    },
    signatureSpacer: {
        height: 60
    },
    signerName: {
        fontSize: 9,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        color: '#111827',
        textTransform: 'uppercase',
        borderTopWidth: 1,
        borderTopColor: '#111827',
        paddingTop: 4,
        alignSelf: 'flex-start',
        minWidth: 150
    },
    signerRole: {
        fontSize: 7,
        color: '#9CA3AF',
        marginTop: 2
    }
});

const CurrencyFormatter = ({ value }: { value: number }) => {
    // Format to IDR thousands: 1.000.000
    // "Rp" is replaced with IDR or just removed if we put IDR in the column header, 
    // but the request asked for "must be currency in IDR not Rp".
    // We'll format as "IDR 1.000.000"
    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value).replace('Rp', 'IDR');
    return <Text>{formatted}</Text>;
};

export const InvoicePDF = ({ invoice, subtotal, taxAmount, total }: { invoice: any, subtotal: number, taxAmount: number, total: number }) => {
    // Defensive copy
    const safeInvoice = {
        ...invoice,
        seller: invoice.seller || {},
        buyer: invoice.buyer || {},
        paymentDetails: invoice.paymentDetails || {},
        items: invoice.items || [],
        signature: invoice.signature || {},
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header Bar */}
                <View style={styles.headerBar} />

                <View style={styles.container}>
                    {/* Top Section */}
                    <View style={styles.topSection}>
                        <View style={styles.sellerSection}>
                            <Text style={styles.companyName}>{safeInvoice.seller.name || 'Your Company Name'}</Text>
                            <Text style={styles.companyDetails}>{safeInvoice.seller.email}</Text>
                            <Text style={styles.companyDetails}>{safeInvoice.seller.address}</Text>
                            <Text style={styles.companyDetails}>{safeInvoice.seller.phone}</Text>
                        </View>
                        <View style={styles.invoiceMeta}>
                            <Text style={styles.title}>INVOICE</Text>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Number</Text>
                                <Text style={styles.metaValue}>{safeInvoice.invoiceNumber}</Text>
                            </View>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Date</Text>
                                <Text style={styles.metaValue}>{safeInvoice.date}</Text>
                            </View>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Due Date</Text>
                                <Text style={styles.metaValue}>{safeInvoice.dueDate}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Bill To */}
                    <View style={styles.billToSection}>
                        <Text style={styles.billToLabel}>Bill To</Text>
                        <Text style={styles.buyerName}>{safeInvoice.buyer.name || 'Client Company Name'}</Text>
                        <Text style={styles.buyerDetails}>{safeInvoice.buyer.email}</Text>
                        <Text style={styles.buyerDetails}>{safeInvoice.buyer.address}</Text>
                        <Text style={styles.buyerDetails}>{safeInvoice.buyer.phone}</Text>
                    </View>

                    {/* Table */}
                    <View>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderLabel, styles.colDesc]}>DESCRIPTION</Text>
                            <Text style={[styles.tableHeaderLabel, styles.colQty]}>QTY</Text>
                            <Text style={[styles.tableHeaderLabel, styles.colPrice]}>PRICE</Text>
                            <Text style={[styles.tableHeaderLabel, styles.colTotal]}>AMOUNT</Text>
                        </View>
                        {safeInvoice.items.map((item: any) => (
                            <View key={item.id} style={styles.tableRow}>
                                <Text style={[styles.itemText, styles.colDesc]}>{item.description}</Text>
                                <Text style={[styles.itemText, styles.colQty]}>{item.quantity}</Text>
                                <View style={[styles.itemText, styles.colPrice]}>
                                    <CurrencyFormatter value={Number(item.price)} />
                                </View>
                                <View style={[styles.itemBold, styles.colTotal]}>
                                    <CurrencyFormatter value={Number(item.price) * Number(item.quantity)} />
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Totals */}
                    <View style={styles.totalsSection}>
                        <View style={styles.totalsBox}>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Subtotal</Text>
                                <View style={styles.totalValue}>
                                    <CurrencyFormatter value={subtotal} />
                                </View>
                            </View>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>VAT ({safeInvoice.taxRate}%)</Text>
                                <Text style={[styles.totalValue, { color: '#2563EB' }]}>
                                    <CurrencyFormatter value={taxAmount} />
                                </Text>
                            </View>
                            <View style={styles.grandTotalRow}>
                                <Text style={styles.grandTotalLabel}>Total</Text>
                                <View style={styles.grandTotalValue}>
                                    <CurrencyFormatter value={total} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Footer: Payment & Signature */}
                    <View style={styles.footerSection}>
                        <View style={styles.footerColLeft}>
                            <Text style={styles.paymentLabel}>Payment Details</Text>
                            <View style={styles.paymentRow}>
                                <Text style={styles.paymentKey}>Bank</Text>
                                <Text style={styles.paymentVal}>{safeInvoice.paymentDetails.bankName || '-'}</Text>
                            </View>
                            <View style={styles.paymentRow}>
                                <Text style={styles.paymentKey}>Account</Text>
                                <Text style={styles.paymentVal}>{safeInvoice.paymentDetails.accountNumber || '-'}</Text>
                            </View>
                            <View style={styles.paymentRow}>
                                <Text style={styles.paymentKey}>Holder</Text>
                                <Text style={styles.paymentVal}>{safeInvoice.paymentDetails.accountName || '-'}</Text>
                            </View>

                            <View style={{ marginTop: 15 }}>
                                <Text style={styles.paymentLabel}>Terms & Conditions</Text>
                                <Text style={styles.termsText}>{safeInvoice.terms}</Text>
                            </View>
                        </View>

                        <View style={styles.footerColRight}>
                            <View style={{ width: '100%' }}>
                                <Text style={styles.paymentLabel}>Authorised Signatory</Text>
                                <View style={styles.signatureContainer}>
                                    {safeInvoice.signature.image ? (
                                        <Image
                                            src={safeInvoice.signature.image}
                                            style={[
                                                styles.signatureImage,
                                                safeInvoice.signature.position ? {
                                                    transform: `translate(${safeInvoice.signature.position.x}, ${safeInvoice.signature.position.y})`,
                                                } : {}
                                            ]}
                                        />
                                    ) : (
                                        <View style={styles.signatureSpacer} />
                                    )}
                                </View>
                                <Text style={styles.signerName}>{safeInvoice.signature.signerName}</Text>
                                <Text style={styles.signerRole}>{safeInvoice.signature.title || 'Director'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
