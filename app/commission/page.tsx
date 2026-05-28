'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { defaultEmployees, getMonthName, generateId, type LubeCommission } from '@/lib/store';
import { Plus, Pencil, Trash2, Share2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Sample data
const initialCommissions: LubeCommission[] = [
  { id: '1', employeeId: '1', employeeName: 'JAMSHEER', month: 'May', year: 2026, totalSales: 15000, commissionAmount: 750 },
  { id: '2', employeeId: '2', employeeName: 'MIRSHAD', month: 'May', year: 2026, totalSales: 22000, commissionAmount: 1100 },
  { id: '3', employeeId: '3', employeeName: 'DHULFUKAR', month: 'May', year: 2026, totalSales: 8500, commissionAmount: 425 },
  { id: '4', employeeId: '4', employeeName: 'SAKARIYA', month: 'May', year: 2026, totalSales: 31000, commissionAmount: 1550 },
  { id: '5', employeeId: '5', employeeName: 'SINAN', month: 'May', year: 2026, totalSales: 12000, commissionAmount: 600 },
  { id: '6', employeeId: '6', employeeName: 'IRSHAD', month: 'May', year: 2026, totalSales: 18500, commissionAmount: 925 },
  { id: '7', employeeId: '7', employeeName: 'PRABIN', month: 'May', year: 2026, totalSales: 27000, commissionAmount: 1350 },
  { id: '8', employeeId: '8', employeeName: 'MUNEER', month: 'May', year: 2026, totalSales: 14000, commissionAmount: 700 },
  { id: '9', employeeId: '9', employeeName: 'SHAHABAS', month: 'May', year: 2026, totalSales: 9500, commissionAmount: 475 },
];

export default function CommissionPage() {
  const currentDate = new Date();
  const [commissions, setCommissions] = useState<LubeCommission[]>(initialCommissions);
  const [selectedMonth, setSelectedMonth] = useState(getMonthName(currentDate.getMonth()));
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    totalSales: '',
    commissionAmount: '',
  });

  const months = Array.from({ length: 12 }, (_, i) => getMonthName(i));
  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

  const filteredCommissions = commissions.filter(
    (c) => c.month === selectedMonth && c.year === selectedYear
  );

  const totalSales = filteredCommissions.reduce((sum, c) => sum + c.totalSales, 0);
  const totalCommission = filteredCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);

  const handleSubmit = () => {
    if (!formData.employeeId || !formData.totalSales || !formData.commissionAmount) return;

    const employee = defaultEmployees.find((e) => e.id === formData.employeeId);
    if (!employee) return;

    const sales = parseFloat(formData.totalSales);
    const commission = parseFloat(formData.commissionAmount);

    if (editingId) {
      setCommissions(
        commissions.map((c) =>
          c.id === editingId
            ? {
                ...c,
                totalSales: sales,
                commissionAmount: commission,
              }
            : c
        )
      );
    } else {
      const newCommission: LubeCommission = {
        id: generateId(),
        employeeId: formData.employeeId,
        employeeName: employee.name,
        month: selectedMonth,
        year: selectedYear,
        totalSales: sales,
        commissionAmount: commission,
      };
      setCommissions([...commissions, newCommission]);
    }

    setFormData({ employeeId: '', totalSales: '', commissionAmount: '' });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (commission: LubeCommission) => {
    setFormData({
      employeeId: commission.employeeId,
      totalSales: commission.totalSales.toString(),
      commissionAmount: commission.commissionAmount.toString(),
    });
    setEditingId(commission.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCommissions(commissions.filter((c) => c.id !== id));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('LUBE COMMISSION REPORT', 105, 20, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${selectedMonth} ${selectedYear}`, 105, 28, { align: 'center' });

    const tableData = filteredCommissions.map((c, index) => [
      index + 1,
      c.employeeName,
      `${c.totalSales.toLocaleString()}`,
      `${c.commissionAmount.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 38,
      head: [['#', 'Employee', 'Total Sales (₹)', 'Commission (₹)']],
      body: tableData,
      foot: [['', 'TOTAL', `${totalSales.toLocaleString()}`, `${totalCommission.toLocaleString()}`]],
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
        2: { halign: 'right' },
        3: { halign: 'right' },
      },
    });

    doc.save(`commission_${selectedMonth}_${selectedYear}.pdf`);
  };

  const handleShare = async () => {
    const commissionText = filteredCommissions
      .map((c) => `${c.employeeName}: Sales ₹${c.totalSales.toLocaleString()} | Commission ₹${c.commissionAmount.toLocaleString()}`)
      .join('\n');

    const shareData = {
      title: 'Lube Commission Report',
      text: `Lube Commission Report - ${selectedMonth} ${selectedYear}\n\n${commissionText}\n\nTotal Sales: ₹${totalSales.toLocaleString()}\nTotal Commission: ₹${totalCommission.toLocaleString()}`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareData.text);
      alert('Commission data copied to clipboard!');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <PageHeader
          title="Lube Commission"
          description="Track employee commissions on lubricant sales"
        >
          <div className="flex items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedYear.toString()}
              onValueChange={(v) => setSelectedYear(parseInt(v))}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleShare} title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownloadPDF} title="Download PDF">
              <Download className="h-4 w-4" />
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Commission
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    {editingId ? 'Edit Commission' : 'Add Commission'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Employee</Label>
                    <Select
                      value={formData.employeeId}
                      onValueChange={(v) =>
                        setFormData({ ...formData, employeeId: v })
                      }
                      disabled={!!editingId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultEmployees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalSales">Total Sales (₹)</Label>
                    <Input
                      id="totalSales"
                      type="number"
                      value={formData.totalSales}
                      onChange={(e) =>
                        setFormData({ ...formData, totalSales: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commissionAmount">Commission Amount (₹)</Label>
                    <Input
                      id="commissionAmount"
                      type="number"
                      value={formData.commissionAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, commissionAmount: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <Button onClick={handleSubmit} className="w-full">
                    {editingId ? 'Update' : 'Add'} Commission
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </PageHeader>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-3xl font-bold text-foreground">
                ₹{totalSales.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Commission</p>
              <p className="text-3xl font-bold text-primary">
                ₹{totalCommission.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Employees</p>
              <p className="text-3xl font-bold text-foreground">
                {filteredCommissions.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Commission Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      S.No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Employee Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Total Sales (₹)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Commission (₹)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCommissions.map((commission, index) => (
                    <tr key={commission.id} className="hover:bg-secondary/30">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                        {commission.employeeName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-foreground">
                        ₹{commission.totalSales.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-primary">
                        ₹{commission.commissionAmount.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(commission)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(commission.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-primary bg-primary/5">
                    <td colSpan={2} className="px-6 py-4 text-sm font-bold text-foreground">
                      TOTAL
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-foreground">
                      ₹{totalSales.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-lg font-bold text-primary">
                      ₹{totalCommission.toLocaleString()}
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
