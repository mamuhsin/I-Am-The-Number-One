'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateId, formatDate, type BillEntry, type Customer, defaultCustomers } from '@/lib/store';
import { Plus, Trash2, Calendar, Users, UserPlus, X, Share2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Sample data based on the image provided
const initialBills: BillEntry[] = [
  { id: '1', date: '24/05/26', vehicleNo: 'KL 10 BJ 7572', customerName: 'JAMSHEER', amount: 300 },
  { id: '2', date: '24/05/26', vehicleNo: 'KL 53 D 1019', customerName: 'MIRSHAD', amount: 400 },
  { id: '3', date: '24/05/26', vehicleNo: 'KL 10 BJ 1048', customerName: 'DHULFUKAR', amount: 250 },
  { id: '4', date: '24/05/26', vehicleNo: 'KL 10 BJ 7868', customerName: 'SAKARIYA', amount: 2800 },
  { id: '5', date: '24/05/26', vehicleNo: 'KL 10 BJ 1087', customerName: 'SINAN', amount: 250 },
  { id: '6', date: '24/05/26', vehicleNo: 'KL 02 BF 6083', customerName: 'IRSHAD', amount: 300 },
  { id: '7', date: '24/05/26', vehicleNo: 'KL 10 BJ 0691', customerName: 'PRABIN', amount: 2300 },
  { id: '8', date: '24/05/26', vehicleNo: 'KL 10 BH 4562', customerName: 'MUNEER', amount: 1000 },
  { id: '9', date: '24/05/26', vehicleNo: 'KL 10 BJ 0995', customerName: 'SHAHABAS', amount: 200 },
];

export default function BillsPage() {
  const [bills, setBills] = useState<BillEntry[]>(initialBills);
  const [customers, setCustomers] = useState<Customer[]>(defaultCustomers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [filterDate, setFilterDate] = useState('');

  const [newBill, setNewBill] = useState({
    vehicleNo: '',
    customerName: '',
    amount: '',
  });

  const [newCustomer, setNewCustomer] = useState({
    vehicleNo: '',
    name: '',
  });

  const handleSelectCustomer = (vehicleNo: string) => {
    const customer = customers.find((c) => c.vehicleNo === vehicleNo);
    if (customer) {
      setNewBill({
        ...newBill,
        vehicleNo: customer.vehicleNo,
        customerName: customer.name,
      });
    }
  };

  const handleAddBill = () => {
    if (!newBill.vehicleNo || !newBill.customerName || !newBill.amount) return;

    const bill: BillEntry = {
      id: generateId(),
      date: selectedDate,
      vehicleNo: newBill.vehicleNo.toUpperCase(),
      customerName: newBill.customerName.toUpperCase(),
      amount: parseFloat(newBill.amount),
    };

    setBills([...bills, bill]);
    setNewBill({ vehicleNo: '', customerName: '', amount: '' });
    setIsDialogOpen(false);
  };

  const handleAddCustomer = () => {
    if (!newCustomer.vehicleNo || !newCustomer.name) return;

    const customer: Customer = {
      id: generateId(),
      vehicleNo: newCustomer.vehicleNo.toUpperCase(),
      name: newCustomer.name.toUpperCase(),
    };

    setCustomers([...customers, customer]);
    setNewCustomer({ vehicleNo: '', name: '' });
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  const handleDeleteBill = (id: string) => {
    setBills(bills.filter((bill) => bill.id !== id));
  };

  const filteredBills = filterDate
    ? bills.filter((bill) => bill.date === filterDate)
    : bills;

  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Group bills by date
  const groupedBills = filteredBills.reduce((groups, bill) => {
    if (!groups[bill.date]) {
      groups[bill.date] = [];
    }
    groups[bill.date].push(bill);
    return groups;
  }, {} as Record<string, BillEntry[]>);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL ENTRY REPORT', 105, 20, { align: 'center' });
    
    // Date info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(filterDate ? `Date: ${filterDate}` : `All Bills - Generated: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

    // Table
    const tableData = filteredBills.map((bill, index) => [
      index + 1,
      bill.date,
      bill.vehicleNo,
      bill.customerName,
      bill.amount.toLocaleString(),
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['#', 'Date', 'Vehicle No', 'Name', 'Amount']],
      body: tableData,
      foot: [['', '', '', 'TOTAL', totalAmount.toLocaleString()]],
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        4: { halign: 'right' },
      },
    });

    doc.save(`bills_${filterDate || 'all'}_${Date.now()}.pdf`);
  };

  const handleShare = async () => {
    const shareText = filteredBills
      .map((bill) => `${bill.vehicleNo} - ${bill.customerName}: ${bill.amount}`)
      .join('\n');

    const shareData = {
      title: 'Bill Entry Report',
      text: `Bill Entry Report${filterDate ? ` for ${filterDate}` : ''}\n\n${shareText}\n\nTotal: ${totalAmount.toLocaleString()}`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareData.text);
      alert('Bill data copied to clipboard!');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <PageHeader
          title="Bill Entry"
          description="Record and manage daily vehicle bills"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter by date (DD/MM/YY)"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-48"
              />
            </div>

            {/* Share Button */}
            <Button variant="outline" size="icon" onClick={handleShare} title="Share">
              <Share2 className="h-4 w-4" />
            </Button>

            {/* Download PDF Button */}
            <Button variant="outline" size="icon" onClick={handleDownloadPDF} title="Download PDF">
              <Download className="h-4 w-4" />
            </Button>
            
            {/* Customer Ledger Dialog */}
            <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Customer Ledger
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Customer Ledger</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4 flex-1 overflow-hidden flex flex-col">
                  {/* Add New Customer Form */}
                  <Card className="bg-secondary/30 border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Add New Customer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Input
                            value={newCustomer.vehicleNo}
                            onChange={(e) =>
                              setNewCustomer({ ...newCustomer, vehicleNo: e.target.value })
                            }
                            placeholder="Vehicle No (KL 10 BJ 1234)"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            value={newCustomer.name}
                            onChange={(e) =>
                              setNewCustomer({ ...newCustomer, name: e.target.value })
                            }
                            placeholder="Customer Name"
                          />
                        </div>
                        <Button onClick={handleAddCustomer}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Customer List */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-2">
                      {customers.map((customer) => (
                        <div
                          key={customer.id}
                          className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-sm text-primary font-medium">
                              {customer.vehicleNo}
                            </span>
                            <span className="text-foreground">{customer.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {customers.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          No customers added yet. Add your first customer above.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Total Customers: <span className="text-primary font-medium">{customers.length}</span>
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Add Bill Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Bill
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Add New Bill</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      placeholder="DD/MM/YY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Select from Saved Customers</Label>
                    <Select onValueChange={handleSelectCustomer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a saved customer..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.vehicleNo}>
                            {customer.vehicleNo} - {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or enter manually</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleNo">Vehicle No</Label>
                    <Input
                      id="vehicleNo"
                      value={newBill.vehicleNo}
                      onChange={(e) =>
                        setNewBill({ ...newBill, vehicleNo: e.target.value })
                      }
                      placeholder="KL 10 BJ 7572"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      value={newBill.customerName}
                      onChange={(e) =>
                        setNewBill({ ...newBill, customerName: e.target.value })
                      }
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newBill.amount}
                      onChange={(e) =>
                        setNewBill({ ...newBill, amount: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <Button onClick={handleAddBill} className="w-full">
                    Add Bill
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </PageHeader>

        {/* Summary Card */}
        <Card className="mb-6 bg-primary/10 border-primary/20">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {filterDate ? `Bills for ${filterDate}` : 'All Bills'}
              </p>
              <p className="text-3xl font-bold text-foreground">
                {totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Entries</p>
              <p className="text-3xl font-bold text-primary">{filteredBills.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Bills Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Vehicle No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Object.entries(groupedBills).map(([date, dateBills]) => (
                    <>
                      {dateBills.map((bill, index) => (
                        <tr key={bill.id} className="hover:bg-secondary/30">
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                            {index === 0 ? (
                              <span className="font-medium text-primary">DATE: {date}</span>
                            ) : null}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                            {bill.vehicleNo}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                            {bill.customerName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-foreground">
                            {bill.amount.toLocaleString()}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteBill(bill.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-secondary/20">
                        <td colSpan={3} className="px-6 py-3 text-sm font-medium text-muted-foreground">
                          Subtotal for {date}
                        </td>
                        <td className="px-6 py-3 text-right text-sm font-bold text-primary">
                          {dateBills.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-primary bg-primary/5">
                    <td colSpan={3} className="px-6 py-4 text-sm font-bold text-foreground">
                      GRAND TOTAL
                    </td>
                    <td className="px-6 py-4 text-right text-lg font-bold text-primary">
                      {totalAmount.toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
