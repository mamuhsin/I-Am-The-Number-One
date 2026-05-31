'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { defaultEmployees, getMonthName } from '@/lib/store';
import { Download, Share2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AttendanceEntry {
  employeeId: string;
  employeeName: string;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  totalWorkingDays: number;
  workPercentage: number;
}

export default function AttendanceHistoryPage() {
  const currentDate = new Date();
  const [selectedMonthStart, setSelectedMonthStart] = useState(currentDate.getMonth() - 1 >= 0 ? currentDate.getMonth() - 1 : 11);
  const [selectedYearStart, setSelectedYearStart] = useState(currentDate.getMonth() - 1 >= 0 ? currentDate.getFullYear() : currentDate.getFullYear() - 1);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: getMonthName(i),
  }));

  const years = Array.from({ length: 10 }, (_, i) => ({
    value: (currentDate.getFullYear() - 5 + i).toString(),
    label: (currentDate.getFullYear() - 5 + i).toString(),
  }));

  // Calculate end month (start month + 1, max 2 months)
  const selectedMonthEnd = selectedMonthStart === 11 ? 0 : selectedMonthStart + 1;
  const selectedYearEnd = selectedMonthStart === 11 ? selectedYearStart + 1 : selectedYearStart;

  // Generate sample attendance data for the past 2 months
  const generateAttendanceData = (): AttendanceEntry[] => {
    return defaultEmployees.map((employee) => {
      // Simulate attendance data
      const presentDays = Math.floor(Math.random() * 15) + 10;
      const absentDays = Math.floor(Math.random() * 8);
      const halfDays = Math.floor(Math.random() * 5);
      const totalWorkingDays = presentDays + absentDays + halfDays;
      const workPercentage = totalWorkingDays > 0 ? (presentDays / totalWorkingDays) * 100 : 0;

      return {
        employeeId: employee.id,
        employeeName: employee.name,
        presentDays,
        absentDays,
        halfDays,
        totalWorkingDays,
        workPercentage: Math.round(workPercentage),
      };
    });
  };

  const attendanceData = generateAttendanceData();
  const totalPresent = attendanceData.reduce((sum, a) => sum + a.presentDays, 0);
  const totalAbsent = attendanceData.reduce((sum, a) => sum + a.absentDays, 0);
  const totalHalfDays = attendanceData.reduce((sum, a) => sum + a.halfDays, 0);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ATTENDANCE REPORT - 2 MONTHS', 105, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${getMonthName(selectedMonthStart)} ${selectedYearStart} to ${getMonthName(selectedMonthEnd)} ${selectedYearEnd}`, 105, 22, { align: 'center' });

    const tableData = attendanceData.map((a, index) => [
      index + 1,
      a.employeeName,
      a.presentDays.toString(),
      a.absentDays.toString(),
      a.halfDays.toString(),
      a.totalWorkingDays.toString(),
      `${a.workPercentage}%`,
    ]);

    const footerRow = [
      '',
      'TOTAL',
      totalPresent.toString(),
      totalAbsent.toString(),
      totalHalfDays.toString(),
      (totalPresent + totalAbsent + totalHalfDays).toString(),
      '',
    ];

    autoTable(doc, {
      startY: 30,
      head: [['S.No', 'Employee Name', 'Present', 'Absent', 'Half Days', 'Total Days', 'Work %']],
      body: tableData,
      foot: [footerRow],
      theme: 'grid',
      headStyles: {
        fillColor: [52, 211, 153],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 9,
        cellPadding: 3,
      },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 9,
        cellPadding: 3,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 12 },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center' },
        6: { halign: 'center' },
      },
    });

    doc.save(`attendance_${getMonthName(selectedMonthStart)}_${selectedYearStart}_to_${getMonthName(selectedMonthEnd)}_${selectedYearEnd}.pdf`);
  };

  const handleShare = async () => {
    const attendanceText = attendanceData
      .map((a) => `${a.employeeName}: P=${a.presentDays}, A=${a.absentDays}, H=${a.halfDays}, Work=${a.workPercentage}%`)
      .join('\n');

    const shareData = {
      title: 'Attendance Report',
      text: `Attendance Report - ${getMonthName(selectedMonthStart)} ${selectedYearStart} to ${getMonthName(selectedMonthEnd)} ${selectedYearEnd}\n\n${attendanceText}\n\nTotal Present: ${totalPresent}\nTotal Absent: ${totalAbsent}\nTotal Half Days: ${totalHalfDays}`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareData.text);
      alert('Attendance data copied to clipboard!');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <PageHeader
          title="Attendance History"
          description="View attendance records from the past 2 months"
        >
          <div className="flex items-center gap-3">
            <Select
              value={selectedMonthStart.toString()}
              onValueChange={(v) => setSelectedMonthStart(parseInt(v))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedYearStart.toString()}
              onValueChange={(v) => setSelectedYearStart(parseInt(v))}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">to</span>
            <span className="text-sm font-medium">
              {getMonthName(selectedMonthEnd)} {selectedYearEnd}
            </span>
            <Button variant="outline" size="icon" onClick={handleShare} title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownloadPDF} title="Download PDF">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </PageHeader>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Present</p>
              <p className="text-3xl font-bold text-green-500">
                {totalPresent}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Absent</p>
              <p className="text-3xl font-bold text-red-500">
                {totalAbsent}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Half Days</p>
              <p className="text-3xl font-bold text-yellow-500">
                {totalHalfDays}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Employees</p>
              <p className="text-3xl font-bold text-foreground">
                {attendanceData.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      S.No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Employee Name
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-green-500">
                      Present
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-red-500">
                      Absent
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-yellow-500">
                      Half Days
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Total Days
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Work %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {attendanceData.map((attendance, index) => (
                    <tr key={attendance.employeeId} className="hover:bg-secondary/30">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                        {attendance.employeeName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-green-500">
                        {attendance.presentDays}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-red-500">
                        {attendance.absentDays}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-yellow-500">
                        {attendance.halfDays}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-foreground">
                        {attendance.totalWorkingDays}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-foreground">
                        {attendance.workPercentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-primary bg-primary/5">
                    <td colSpan={1} className="px-6 py-4 text-sm font-bold text-foreground"></td>
                    <td className="px-6 py-4 text-sm font-bold text-foreground">
                      TOTAL
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-green-500">
                      {totalPresent}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-red-500">
                      {totalAbsent}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-yellow-500">
                      {totalHalfDays}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-foreground">
                      {totalPresent + totalAbsent + totalHalfDays}
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
