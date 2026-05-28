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
import { defaultEmployees, getMonthName, generateId, type SalaryRecord } from '@/lib/store';
import { Pencil, Calculator, Share2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Sample salary data
const initialSalaries: SalaryRecord[] = [
  { id: '1', employeeId: '1', employeeName: 'JAMSHEER', month: 'May', year: 2026, daysWorked: 26, perDayAmount: 500, grossSalary: 13000, shortAmount: 0, excessAmount: 200, netSalary: 13200 },
  { id: '2', employeeId: '2', employeeName: 'MIRSHAD', month: 'May', year: 2026, daysWorked: 24, perDayAmount: 500, grossSalary: 12000, shortAmount: 150, excessAmount: 0, netSalary: 11850 },
  { id: '3', employeeId: '3', employeeName: 'DHULFUKAR', month: 'May', year: 2026, daysWorked: 28, perDayAmount: 500, grossSalary: 14000, shortAmount: 0, excessAmount: 0, netSalary: 14000 },
  { id: '4', employeeId: '4', employeeName: 'SAKARIYA', month: 'May', year: 2026, daysWorked: 25, perDayAmount: 550, grossSalary: 13750, shortAmount: 300, excessAmount: 0, netSalary: 13450 },
  { id: '5', employeeId: '5', employeeName: 'SINAN', month: 'May', year: 2026, daysWorked: 27, perDayAmount: 500, grossSalary: 13500, shortAmount: 0, excessAmount: 150, netSalary: 13650 },
  { id: '6', employeeId: '6', employeeName: 'IRSHAD', month: 'May', year: 2026, daysWorked: 26, perDayAmount: 500, grossSalary: 13000, shortAmount: 200, excessAmount: 0, netSalary: 12800 },
  { id: '7', employeeId: '7', employeeName: 'PRABIN', month: 'May', year: 2026, daysWorked: 29, perDayAmount: 550, grossSalary: 15950, shortAmount: 0, excessAmount: 500, netSalary: 16450 },
  { id: '8', employeeId: '8', employeeName: 'MUNEER', month: 'May', year: 2026, daysWorked: 22, perDayAmount: 500, grossSalary: 11000, shortAmount: 450, excessAmount: 0, netSalary: 10550 },
  { id: '9', employeeId: '9', employeeName: 'SHAHABAS', month: 'May', year: 2026, daysWorked: 25, perDayAmount: 480, grossSalary: 12000, shortAmount: 100, excessAmount: 0, netSalary: 11900 },
];

export default function SalaryPage() {
  const currentDate = new Date();
  const [salaries, setSalaries] = useState<SalaryRecord[]>(initialSalaries);
  const [selectedMonth, setSelectedMonth] = useState(getMonthName(currentDate.getMonth()));
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    daysWorked: '',
    perDayAmount: '500',
    shortAmount: '0',
    excessAmount: '0',
  });

  const months = Array.from({ length: 12 }, (_, i) => getMonthName(i));
  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

  const filteredSalaries = salaries.filter(
    (s) => s.month === selectedMonth && s.year === selectedYear
  );

  const totalGross = filteredSalaries.reduce((sum, s) => sum + s.grossSalary, 0);
  const totalShort = filteredSalaries.reduce((sum, s) => sum + s.shortAmount, 0);
  const totalExcess = filteredSalaries.reduce((sum, s) => sum + s.excessAmount, 0);
  const totalNet = filteredSalaries.reduce((sum, s) => sum + s.netSalary, 0);

  const calculateSalary = () => {
    const days = parseFloat(formData.daysWorked) || 0;
    const perDay = parseFloat(formData.perDayAmount) || 0;
    const short = parseFloat(formData.shortAmount) || 0;
    const excess = parseFloat(formData.excessAmount) || 0;

    const gross = days * perDay;
    const net = gross - short + excess;

    return { gross, net };
  };

  const handleSubmit = () => {
    if (!formData.employeeId || !formData.daysWorked || !formData.perDayAmount) return;

    const employee = defaultEmployees.find((e) => e.id === formData.employeeId);
    if (!employee) return;

    const { gross, net } = calculateSalary();

    if (editingId) {
      setSalaries(
        salaries.map((s) =>
          s.id === editingId
            ? {
                ...s,
                daysWorked: parseFloat(formData.daysWorked),
                perDayAmount: parseFloat(formData.perDayAmount),
                grossSalary: gross,
                shortAmount: parseFloat(formData.shortAmount) || 0,
                excessAmount: parseFloat(formData.excessAmount) || 0,
                netSalary: net,
              }
            : s
        )
      );
    } else {
      const newSalary: SalaryRecord = {
        id: generateId(),
        employeeId: formData.employeeId,
        employeeName: employee.name,
        month: selectedMonth,
        year: selectedYear,
        daysWorked: parseFloat(formData.daysWorked),
        perDayAmount: parseFloat(formData.perDayAmount),
        grossSalary: gross,
        shortAmount: parseFloat(formData.shortAmount) || 0,
        excessAmount: parseFloat(formData.excessAmount) || 0,
        netSalary: net,
      };
      setSalaries([...salaries, newSalary]);
    }

    setFormData({
      employeeId: '',
      daysWorked: '',
      perDayAmount: '500',
      shortAmount: '0',
      excessAmount: '0',
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (salary: SalaryRecord) => {
    setFormData({
      employeeId: salary.employeeId,
      daysWorked: salary.daysWorked.toString(),
      perDayAmount: salary.perDayAmount.toString(),
      shortAmount: salary.shortAmount.toString(),
      excessAmount: salary.excessAmount.toString(),
    });
    setEditingId(salary.id);
    setIsDialogOpen(true);
  };

  const { gross: previewGross, net: previewNet } = calculateSalary();

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SALARY LIST', 148, 15, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${selectedMonth} ${selectedYear}`, 148, 23, { align: 'center' });

    const tableData = filteredSalaries.map((s, index) => [
      index + 1,
      s.employeeName,
      s.daysWorked,
      `${s.perDayAmount}`,
      `${s.grossSalary.toLocaleString()}`,
      s.shortAmount > 0 ? `-${s.shortAmount.toLocaleString()}` : '-',
      s.excessAmount > 0 ? `+${s.excessAmount.toLocaleString()}` : '-',
      `${s.netSalary.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['#', 'Name', 'Days', 'Per Day', 'Gross', 'Short (-)', 'Excess (+)', 'Net Salary']],
      body: tableData,
      foot: [['', 'TOTAL', '', '', `${totalGross.toLocaleString()}`, `-${totalShort.toLocaleString()}`, `+${totalExcess.toLocaleString()}`, `${totalNet.toLocaleString()}`]],
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
        0: { halign: 'center', cellWidth: 12 },
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' },
      },
    });

    doc.save(`salary_${selectedMonth}_${selectedYear}.pdf`);
  };

  const handleShare = async () => {
    const salaryText = filteredSalaries
      .map((s) => `${s.employeeName}: Days=${s.daysWorked} | Net=₹${s.netSalary.toLocaleString()}`)
      .join('\n');

    const shareData = {
      title: 'Salary List',
      text: `Salary List - ${selectedMonth} ${selectedYear}\n\n${salaryText}\n\nTotal Gross: ₹${totalGross.toLocaleString()}\nTotal Short: -₹${totalShort.toLocaleString()}\nTotal Excess: +₹${totalExcess.toLocaleString()}\nNet Payable: ₹${totalNet.toLocaleString()}`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareData.text);
      alert('Salary data copied to clipboard!');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <PageHeader
          title="Salary List"
          description="Manage employee salaries with deductions and adjustments"
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
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Salary
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    {editingId ? 'Edit Salary' : 'Calculate Salary'}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="daysWorked">Days Worked</Label>
                      <Input
                        id="daysWorked"
                        type="number"
                        value={formData.daysWorked}
                        onChange={(e) =>
                          setFormData({ ...formData, daysWorked: e.target.value })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perDayAmount">Per Day (₹)</Label>
                      <Input
                        id="perDayAmount"
                        type="number"
                        value={formData.perDayAmount}
                        onChange={(e) =>
                          setFormData({ ...formData, perDayAmount: e.target.value })
                        }
                        placeholder="500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shortAmount" className="text-red-400">
                        Short (-)
                      </Label>
                      <Input
                        id="shortAmount"
                        type="number"
                        value={formData.shortAmount}
                        onChange={(e) =>
                          setFormData({ ...formData, shortAmount: e.target.value })
                        }
                        placeholder="0"
                        className="border-red-500/30 focus:border-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excessAmount" className="text-green-400">
                        Excess (+)
                      </Label>
                      <Input
                        id="excessAmount"
                        type="number"
                        value={formData.excessAmount}
                        onChange={(e) =>
                          setFormData({ ...formData, excessAmount: e.target.value })
                        }
                        placeholder="0"
                        className="border-green-500/30 focus:border-green-500"
                      />
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gross Salary</span>
                      <span className="text-foreground">₹{previewGross.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-400">Short</span>
                      <span className="text-red-400">
                        -₹{(parseFloat(formData.shortAmount) || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Excess</span>
                      <span className="text-green-400">
                        +₹{(parseFloat(formData.excessAmount) || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2 flex justify-between">
                      <span className="font-medium text-foreground">Net Salary</span>
                      <span className="text-xl font-bold text-primary">
                        ₹{previewNet.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Button onClick={handleSubmit} className="w-full">
                    {editingId ? 'Update' : 'Save'} Salary
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </PageHeader>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Gross Total</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{totalGross.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-6">
              <p className="text-sm text-red-400">Total Short</p>
              <p className="text-2xl font-bold text-red-500">
                -₹{totalShort.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-6">
              <p className="text-sm text-green-400">Total Excess</p>
              <p className="text-2xl font-bold text-green-500">
                +₹{totalExcess.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Net Payable</p>
              <p className="text-2xl font-bold text-primary">
                ₹{totalNet.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Salary Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      S.No
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Name
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Days
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Per Day
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Gross
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-red-400">
                      Short (-)
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-green-400">
                      Excess (+)
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-primary">
                      Net Salary
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSalaries.map((salary, index) => (
                    <tr key={salary.id} className="hover:bg-secondary/30">
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-foreground">
                        {salary.employeeName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-foreground">
                        {salary.daysWorked}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-muted-foreground">
                        ₹{salary.perDayAmount}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-foreground">
                        ₹{salary.grossSalary.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-red-500">
                        {salary.shortAmount > 0 ? `-₹${salary.shortAmount.toLocaleString()}` : '-'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-green-500">
                        {salary.excessAmount > 0 ? `+₹${salary.excessAmount.toLocaleString()}` : '-'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-bold text-primary">
                        ₹{salary.netSalary.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(salary)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-primary bg-primary/5">
                    <td colSpan={4} className="px-4 py-4 text-sm font-bold text-foreground">
                      TOTAL ({filteredSalaries.length} Employees)
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-bold text-foreground">
                      ₹{totalGross.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-bold text-red-500">
                      -₹{totalShort.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-bold text-green-500">
                      +₹{totalExcess.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right text-lg font-bold text-primary">
                      ₹{totalNet.toLocaleString()}
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
