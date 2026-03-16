
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Printer, RefreshCcw, FileText, Upload, X, Save, FileDown } from 'lucide-react';
import dynamic from 'next/dynamic';
// PDF imports removed to separate bundle
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import { InvoicePDF } from './InvoicePDF';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const InvoiceDownloadButton = dynamic(() => import('./InvoiceDownloadButton'), {
    ssr: false,
    loading: () => (
        <Button variant="outline" disabled className="gap-2 border-gray-200 text-gray-400">
            <FileDown size={16} /> Export PDF
        </Button>
    )
});

export default function InvoiceForm({ initialData = null, onSave, onCancel }: { initialData?: any, onSave: (data: any) => Promise<void>, onCancel: () => void }) {
    // Default Initial State
    const defaultState = {
        invoiceNumber: 'INV-001',
        date: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        seller: {
            name: 'Your Company Name',
            email: 'you@example.com',
            address: '123 Business Rd\nCity, Country',
            phone: '+1 (555) 000-0000',
        },
        buyer: {
            name: 'Client Company',
            email: 'client@example.com',
            address: '456 Client Street\nCity, Country',
            phone: '+1 (555) 999-9999',
        },
        items: [
            { id: 1, description: 'Web Development Services', quantity: 1, price: 15000000 },
        ],
        taxRate: 11,
        currencySymbol: 'IDR',
        paymentDetails: {
            bankName: '',
            accountName: '',
            accountNumber: ''
        },
        terms: 'Please make checks payable to Your Company Name.',
        signature: {
            image: null as string | null,
            signerName: '',
            title: 'Director',
            position: { x: 0, y: 0 }
        }
    };

    const [invoice, setInvoice] = useState(initialData || defaultState);
    const [subtotal, setSubtotal] = useState(0);

    const [taxAmount, setTaxAmount] = useState(0);
    const [total, setTotal] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragRef = useRef<{ isDragging: boolean, startX: number, startY: number, initialX: number, initialY: number }>({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 });

    // Calculate totals
    useEffect(() => {
        const newSubtotal = invoice.items.reduce((acc: number, item: any) => {
            return acc + (Number(item.quantity) * Number(item.price));
        }, 0);

        const newTaxAmount = newSubtotal * (invoice.taxRate / 100);
        const newTotal = newSubtotal + newTaxAmount;

        setSubtotal(newSubtotal);
        setTaxAmount(newTaxAmount);
        setTotal(newTotal);
    }, [invoice.items, invoice.taxRate]);

    // Format Number with Thousands Separator (e.g. 1.000.000)
    const formatNumberInput = (value: number | string) => {
        if (!value) return '';
        return new Intl.NumberFormat('id-ID').format(Number(value));
    };

    const parseNumberInput = (value: string) => {
        return Number(value.replace(/\./g, '').replace(/,/g, '.'));
    };

    // Handlers
    const handleSellerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInvoice((prev: any) => ({ ...prev, seller: { ...prev.seller, [name]: value } }));
    };

    const handleBuyerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInvoice((prev: any) => ({ ...prev, buyer: { ...prev.buyer, [name]: value } }));
    };

    const handleItemChange = (id: number, field: string, value: any) => {
        setInvoice((prev: any) => ({
            ...prev,
            items: prev.items.map((item: any) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const addItem = () => {
        const newId = invoice.items.length > 0 ? Math.max(...invoice.items.map((i: any) => i.id)) + 1 : 1;
        setInvoice((prev: any) => ({
            ...prev,
            items: [...prev.items, { id: newId, description: 'New Item', quantity: 1, price: 0 }]
        }));
    };

    const deleteItem = (id: number) => {
        setInvoice((prev: any) => ({
            ...prev,
            items: prev.items.filter((item: any) => item.id !== id)
        }));
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInvoice((prev: any) => ({
            ...prev,
            paymentDetails: { ...prev.paymentDetails, [name]: value }
        }));
    };

    const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setInvoice((prev: any) => ({
                    ...prev,
                    signature: { ...prev.signature, image: reader.result as string }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeSignature = () => {
        setInvoice((prev: any) => ({
            ...prev,
            signature: { ...prev.signature, image: null, position: { x: 0, y: 0 } }
        }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Drag Logic
    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        dragRef.current = {
            isDragging: true,
            startX: e.clientX,
            startY: e.clientY,
            initialX: invoice.signature.position?.x || 0,
            initialY: invoice.signature.position?.y || 0
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!dragRef.current.isDragging) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;

        // Simple bounds checking could be added here if needed
        setInvoice((prev: any) => ({
            ...prev,
            signature: {
                ...prev.signature,
                position: {
                    x: dragRef.current.initialX + dx,
                    y: dragRef.current.initialY + dy
                }
            }
        }));
    };

    const onMouseUp = () => {
        dragRef.current.isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await onSave(invoice);
            toast.success("Invoice saved successfully!");
        } catch (error) {
            toast.error("Failed to save invoice");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount).replace('Rp', 'IDR');
    };

    // Client-side PDF generation needs to wait for mount
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true) }, []);

    return (
        <div className="bg-gray-50 min-h-screen py-8 font-sans text-gray-900">
            {/* Control Bar */}
            <div className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                        <FileText className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{invoice.id ? 'Edit Invoice' : 'New Invoice'}</h2>
                        <p className="text-xs text-gray-500">Drafting...</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={onCancel} disabled={isSaving} className="text-gray-600 hover:text-gray-900">Cancel</Button>

                    <InvoiceDownloadButton
                        invoice={invoice}
                        subtotal={subtotal}
                        taxAmount={taxAmount}
                        total={total}
                    />

                    <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-gray-900 hover:bg-gray-800 text-white shadow-xl shadow-gray-900/10">
                        <Save size={16} /> {isSaving ? 'Saving...' : 'Save Invoice'}
                    </Button>
                </div>
            </div>

            <div className="max-w-[210mm] mx-auto pt-20 pb-12">
                {/* Invoice Paper (A4 Dimensions) */}
                <div className="bg-white shadow-2xl rounded-sm overflow-hidden w-full min-h-[297mm] flex flex-col relative ring-1 ring-black/5">

                    {/* Accent Bar */}
                    <div className="h-2 bg-gradient-to-r from-[#0D9488] to-[#0F766E] w-full shrink-0"></div>

                    <div className="p-12 flex-1 flex flex-col font-sans">

                        {/* Top Header Section - More Compact */}
                        <div className="flex justify-between items-start mb-12 border-b border-gray-100 pb-8">
                            <div className="w-1/2 pr-8">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 block">From</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={invoice.seller.name}
                                    onChange={handleSellerChange}
                                    className="text-2xl font-bold text-gray-900 w-full mb-1 bg-transparent border-none p-0 focus:ring-0 placeholder-gray-300"
                                    placeholder="Your Company Name"
                                />
                                <div className="space-y-0.5">
                                    <input
                                        type="email"
                                        name="email"
                                        value={invoice.seller.email}
                                        onChange={handleSellerChange}
                                        className="block w-full text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 placeholder-gray-300"
                                        placeholder="Email Address"
                                    />
                                    <textarea
                                        name="address"
                                        value={invoice.seller.address}
                                        onChange={handleSellerChange}
                                        rows={2}
                                        className="block w-full text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 resize-none placeholder-gray-300"
                                        placeholder="Address"
                                    />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={invoice.seller.phone}
                                        onChange={handleSellerChange}
                                        className="block w-full text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 placeholder-gray-300"
                                        placeholder="Phone"
                                    />
                                </div>
                            </div>

                            <div className="w-1/3 text-right">
                                <h1 className="text-5xl font-black text-gray-100 uppercase tracking-tighter leading-none mb-4 select-none">Invoice</h1>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-end gap-3">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Number</span>
                                        <input
                                            type="text"
                                            value={invoice.invoiceNumber}
                                            onChange={(e) => setInvoice((prev: any) => ({ ...prev, invoiceNumber: e.target.value }))}
                                            className="text-right text-sm font-bold text-gray-900 bg-transparent border-none p-0 focus:ring-0 w-32"
                                        />
                                    </div>
                                    <div className="flex items-center justify-end gap-3">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</span>
                                        <input
                                            type="date"
                                            value={invoice.date}
                                            onChange={(e) => setInvoice((prev: any) => ({ ...prev, date: e.target.value }))}
                                            className="text-right text-sm text-gray-600 bg-transparent border-none p-0 focus:ring-0 w-32"
                                        />
                                    </div>
                                    <div className="flex items-center justify-end gap-3">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Due</span>
                                        <input
                                            type="date"
                                            value={invoice.dueDate}
                                            onChange={(e) => setInvoice((prev: any) => ({ ...prev, dueDate: e.target.value }))}
                                            className="text-right text-sm text-gray-600 bg-transparent border-none p-0 focus:ring-0 w-32"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bill To - Clean & Compact */}
                        <div className="mb-12">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 block">Bill To</label>
                            <input
                                type="text"
                                name="name"
                                value={invoice.buyer.name}
                                onChange={handleBuyerChange}
                                className="text-xl font-bold text-gray-900 w-full mb-1 bg-transparent border-none p-0 focus:ring-0 placeholder-gray-300"
                                placeholder="Client Company Name"
                            />
                            <div className="w-1/2 space-y-0.5">
                                <input
                                    type="email"
                                    name="email"
                                    value={invoice.buyer.email}
                                    onChange={handleBuyerChange}
                                    className="block w-full text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 placeholder-gray-300"
                                    placeholder="client@email.com"
                                />
                                <textarea
                                    name="address"
                                    value={invoice.buyer.address}
                                    onChange={handleBuyerChange}
                                    rows={2}
                                    className="block w-full text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 resize-none placeholder-gray-300"
                                    placeholder="Client Address"
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    value={invoice.buyer.phone}
                                    onChange={handleBuyerChange}
                                    className="block w-full text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 placeholder-gray-300"
                                    placeholder="Client Phone"
                                />
                            </div>
                        </div>

                        {/* Items Table - Premium Style */}
                        <div className="mb-8">
                            <div className="grid grid-cols-12 gap-4 border-b border-gray-900 pb-3 mb-4 text-[11px] font-bold text-gray-900 uppercase tracking-widest">
                                <div className="col-span-5">Description</div>
                                <div className="col-span-2 text-right">Qty</div>
                                <div className="col-span-2 text-right">Price</div>
                                <div className="col-span-2 text-right">Amount</div>
                                <div className="col-span-1"></div>
                            </div>

                            <div className="space-y-2">
                                {invoice.items.map((item: any) => (
                                    <div key={item.id} className="group grid grid-cols-12 gap-4 items-start text-sm text-gray-700 hover:bg-gray-50/50 p-2 -mx-2 rounded transition-colors">
                                        <div className="col-span-5">
                                            <textarea
                                                value={item.description}
                                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                rows={1}
                                                className="w-full bg-transparent border-none p-0 focus:ring-0 resize-none overflow-hidden font-medium text-gray-900 placeholder-gray-300 leading-snug"
                                                placeholder="Item description"
                                                style={{ minHeight: '1.5em' }}
                                                onInput={(e) => {
                                                    const target = e.target as HTMLTextAreaElement;
                                                    target.style.height = 'auto';
                                                    target.style.height = target.scrollHeight + 'px';
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                className="w-full text-right bg-transparent border-none p-0 focus:ring-0 text-gray-600"
                                            />
                                        </div>
                                        <div className="col-span-2 text-right flex justify-end items-center gap-1 group/input">
                                            <span className="text-gray-400 text-xs">IDR</span>
                                            <input
                                                type="text"
                                                value={formatNumberInput(item.price)}
                                                onChange={(e) => handleItemChange(item.id, 'price', parseNumberInput(e.target.value))}
                                                className="w-24 text-right bg-transparent border-none p-0 focus:ring-0 text-gray-600"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="col-span-2 text-right font-bold text-gray-900">
                                            {formatCurrency(item.quantity * item.price)}
                                        </div>
                                        <div className="col-span-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => deleteItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addItem}
                                className="mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <Plus className="w-3 h-3" /> Add Item
                            </button>
                        </div>

                        {/* Totals Section - Distinct Colors */}
                        <div className="flex flex-col md:flex-row justify-end mt-4">
                            <div className="w-full md:w-5/12 space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-500">Subtotal</span>
                                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-blue-600 font-medium">VAT</span>
                                        <div className="relative w-12 group">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={invoice.taxRate}
                                                onChange={(e) => setInvoice((prev: any) => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                                                className="w-full bg-blue-50 text-blue-700 text-right text-xs font-bold rounded py-0.5 px-1 border-none focus:ring-1 focus:ring-blue-200"
                                            />
                                            <span className="absolute -right-3 top-0.5 text-blue-400 text-xs font-bold">%</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-blue-600">{formatCurrency(taxAmount)}</span>
                                </div>

                                <div className="flex justify-between items-center pt-4 pb-2">
                                    <span className="text-lg font-black text-gray-900 tracking-tight">Total</span>
                                    <span className="text-xl font-black text-gray-900">{formatCurrency(total)}</span>
                                </div>
                                <div className="h-1 w-full bg-gray-900 rounded-full opacity-10"></div>
                            </div>
                        </div>

                        <div className="mt-auto pt-12 grid grid-cols-2 gap-16 border-t border-gray-100">
                            {/* Payment & Terms - Compact */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-3">Payment Information</h3>
                                    <div className="grid grid-cols-[80px_1fr] gap-y-1 text-sm">
                                        <span className="text-gray-400 font-medium">Bank</span>
                                        <input
                                            type="text"
                                            name="bankName"
                                            value={invoice.paymentDetails.bankName}
                                            onChange={handlePaymentChange}
                                            className="bg-transparent border-none p-0 focus:ring-0 text-gray-800 font-medium placeholder-gray-300"
                                            placeholder="Bank Name"
                                        />

                                        <span className="text-gray-400 font-medium">Account</span>
                                        <input
                                            type="text"
                                            name="accountNumber"
                                            value={invoice.paymentDetails.accountNumber}
                                            onChange={handlePaymentChange}
                                            className="bg-transparent border-none p-0 focus:ring-0 text-gray-800 font-medium font-mono placeholder-gray-300"
                                            placeholder="000 000 000"
                                        />

                                        <span className="text-gray-400 font-medium">Holder</span>
                                        <input
                                            type="text"
                                            name="accountName"
                                            value={invoice.paymentDetails.accountName}
                                            onChange={handlePaymentChange}
                                            className="bg-transparent border-none p-0 focus:ring-0 text-gray-800 font-medium placeholder-gray-300"
                                            placeholder="Account Name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-2">Terms</h3>
                                    <textarea
                                        value={invoice.terms}
                                        onChange={(e) => setInvoice((prev: any) => ({ ...prev, terms: e.target.value }))}
                                        rows={2}
                                        className="w-full text-xs text-gray-500 bg-transparent border-none p-0 focus:ring-0 resize-none leading-relaxed placeholder-gray-300"
                                        placeholder="Add terms and conditions..."
                                    />
                                </div>
                            </div>

                            {/* Digital Signature with Dragging */}
                            <div className="relative pl-8 border-l border-gray-100">
                                <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-4">Authorised Signatory</h3>

                                <div className="relative h-32 w-full border border-dashed border-gray-200 rounded-lg bg-gray-50/50 hover:border-blue-300/50 transition-colors overflow-hidden group/sig">
                                    {/* Upload Trigger if Empty */}
                                    {!invoice.signature.image && (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-blue-500 transition-colors"
                                        >
                                            <Upload className="w-5 h-5 mb-2 opacity-50" />
                                            <span className="text-[10px] font-semibold uppercase tracking-wide">Upload Signature</span>
                                        </div>
                                    )}

                                    {/* Draggable Image */}
                                    {invoice.signature.image && (
                                        <>
                                            <div
                                                className="absolute cursor-move select-none p-2"
                                                style={{
                                                    transform: `translate(${invoice.signature.position?.x || 0}px, ${invoice.signature.position?.y || 0}px)`,
                                                    touchAction: 'none'
                                                }}
                                                onMouseDown={onMouseDown}
                                            >
                                                <img
                                                    src={invoice.signature.image}
                                                    alt="Signature"
                                                    className="h-16 object-contain pointer-events-none"
                                                />
                                            </div>
                                            <button
                                                onClick={removeSignature}
                                                className="absolute top-2 right-2 bg-white/80 p-1 rounded hover:text-red-500 opacity-0 group-hover/sig:opacity-100 transition-opacity z-10"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleSignatureUpload}
                                    accept="image/*"
                                    className="hidden"
                                />

                                <div className="mt-3 border-t border-gray-900/10 pt-2">
                                    <input
                                        type="text"
                                        value={invoice.signature.signerName || ''}
                                        onChange={(e) => setInvoice((prev: any) => ({ ...prev, signature: { ...prev.signature, signerName: e.target.value } }))}
                                        className="w-full text-sm font-bold text-gray-900 bg-transparent border-none p-0 focus:ring-0 placeholder-gray-300 uppercase tracking-wide"
                                        placeholder="Signer Name"
                                    />
                                    <input
                                        type="text"
                                        value={invoice.signature.title || ''}
                                        onChange={(e) => setInvoice((prev: any) => ({ ...prev, signature: { ...prev.signature, title: e.target.value } }))}
                                        className="w-full text-[10px] text-gray-400 font-medium bg-transparent border-none p-0 focus:ring-0 placeholder-gray-300 mt-0.5"
                                        placeholder="Title (e.g. Director)"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
