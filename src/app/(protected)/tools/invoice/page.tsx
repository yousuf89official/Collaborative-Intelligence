
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, FileText, Search, Edit2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getInvoices, saveInvoice, deleteInvoice } from '@/app/actions/invoice-actions';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import { toast } from 'sonner';

export default function InvoicePage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const data = await getInvoices();
            // Parse JSON fields
            const parsedData = data.map((inv: any) => ({
                ...inv,
                items: JSON.parse(inv.items),
                seller: {
                    name: inv.sellerName,
                    email: inv.sellerEmail,
                    address: inv.sellerAddress,
                    phone: inv.sellerPhone
                },
                buyer: {
                    name: inv.buyerName,
                    email: inv.buyerEmail,
                    address: inv.buyerAddress,
                    phone: inv.buyerPhone
                },
                paymentDetails: JSON.parse(inv.paymentDetails),
                signature: {
                    image: inv.signatureImage,
                    signerName: inv.signerName,
                    ...(inv.signatureMeta ? JSON.parse(inv.signatureMeta) : { position: { x: 0, y: 0 }, title: 'Director' })
                },
                // map date strings back to strings for inputs if needed, or date objects
                date: new Date(inv.date).toISOString().slice(0, 10),
                dueDate: new Date(inv.dueDate).toISOString().slice(0, 10),
            }));
            setInvoices(parsedData);
        } catch (error) {
            console.error("Failed to fetch invoices", error);
            toast.error("Failed to load invoice history");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleCreateNew = () => {
        setSelectedInvoice(null);
        setIsOpen(true);
    };

    const handleEdit = (invoice: any) => {
        setSelectedInvoice(invoice);
        setIsOpen(true);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this invoice?')) {
            try {
                await deleteInvoice(id);
                setInvoices(prev => prev.filter(inv => inv.id !== id));
                toast.success("Invoice deleted");
            } catch (error) {
                toast.error("Failed to delete invoice");
            }
        }
    };

    const handleSaveInvoice = async (data: any) => {
        try {
            await saveInvoice(data);
            setIsOpen(false);
            fetchInvoices(); // Refresh list
        } catch (error) {
            throw error; // Let form handle error display
        }
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.buyer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="text-blue-600 w-8 h-8" />
                        Invoices
                    </h1>
                    <p className="text-gray-500 mt-1">Manage and track your invoices</p>
                </div>
                <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <Plus size={18} /> Create Invoice
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search invoices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Invoice #</th>
                                <th className="px-6 py-3">Client</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Due Date</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading invoices...</td>
                                </tr>
                            ) : filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No invoices found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((inv) => {
                                    // Calculate total for display
                                    const subtotal = inv.items.reduce((acc: number, item: any) => acc + (Number(item.quantity) * Number(item.price)), 0);
                                    const total = subtotal + (subtotal * (inv.taxRate / 100));

                                    return (
                                        <tr key={inv.id} onClick={() => handleEdit(inv)} className="hover:bg-gray-50 cursor-pointer transition-colors group">
                                            <td className="px-6 py-4 font-medium text-gray-900">{inv.invoiceNumber}</td>
                                            <td className="px-6 py-4 text-gray-600">{inv.buyer.name}</td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(inv.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(inv.dueDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(total)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={(e) => { e.stopPropagation(); handleEdit(inv); }}>
                                                        <Edit2 size={14} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={(e) => handleDelete(e, inv.id)}>
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Full Screen Modal for Invoice Editor */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-[95vw] h-[95vh] p-0 overflow-y-auto bg-gray-100 rounded-lg">
                    <DialogTitle className="sr-only">Invoice Editor</DialogTitle>
                    {/* Invoice Form Component */}
                    {isOpen && (
                        <InvoiceForm
                            initialData={selectedInvoice}
                            onSave={handleSaveInvoice}
                            onCancel={() => setIsOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
