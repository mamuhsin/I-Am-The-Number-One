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
import { defaultEmployees, getMonthName, getDaysInMonth } from '@/lib/store';
import { ChevronLeft, ChevronRight, Check, X, Clock, Share2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn } from '@/lib/utils';

type AttendanceStatus = 'present' | 'absent' | 'half-day' | null;

interface AttendanceData {
  [key: string]: AttendanceStatus;
}

export default function AttendancePage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [attendance, setAttendance] = useState<AttendanceData>({});

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: getMonthName(i),
  }));

  const years = Array.from({ length: 10 }, (_, i) => ({
    value: (currentDate.getFullYear() - 5 + i).toString(),
    label: (currentDate.getFullYear() - 5 + i).toString(),
  }));

  const getAttendanceKey = (employeeId: string, day: number) => {
    return `${employeeId}-${selectedYear}-${selectedMonth}-${day}`;
  };

  const cycleStatus = (employeeId: string, day: number) => {
    const key = getAttendanceKey(employeeId, day);
    const currentStatus = attendance[key];
    let newStatus: AttendanceStatus;

    if (currentStatus === null || currentStatus === undefined) {
      newStatus = 'present';
    } else if (currentStatus === 'present') {
      newStatus = 'absent';
    } else if (currentStatus === 'absent') {
      newStatus = 'half-day';
    } else {
      newStatus = null;
    }

    setAttendance((prev) => ({
      ...prev,
      [key]: newStatus,
    }));
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <Check className="h-3 w-3 text-green-500" />;
      case 'absent':
        return <X className="h-3 w-3 text-red-500" />;
      case 'half-day':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'bg-green-500/20 border-green-500/50';
      case 'absent':
        return 'bg-red-500/20 border-red-500/50';
      case 'half-day':
        return 'bg-yellow-500/20 border-yellow-500/50';
      default:
        return 'bg-secondary border-border hover:border-primary/30';
    }
  };

  const countStatus = (employeeId: string, status: AttendanceStatus) => {
    if (status === 'present') {
      // Count all unmarked cells as present
      let count = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const key = getAttendanceKey(employeeId, day);
        const cellStatus = attendance[key];
        // If cell is empty/null/undefined OR explicitly marked as present
        if (!cellStatus || cellStatus === 'present') {
          count++;
        }
      }
      return count;
    }
    
    // For absent and half-day, count only explicitly marked ones
    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const key = getAttendanceKey(employeeId, day);
      if (attendance[key] === status) {
        count++;
      }
    }
    return count;
  };

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ATTENDANCE SHEET', 148, 15, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${getMonthName(selectedMonth)} ${selectedYear}`, 148, 23, { align: 'center' });

    const tableData = defaultEmployees.map((employee) => {
      const row: (string | number)[] = [employee.name];
      for (let day = 1; day <= daysInMonth; day++) {
        const key = getAttendanceKey(employee.id, day);
        const status = attendance[key];
        // Empty/unmarked cells show as P (Present by default)
        row.push(!status ? 'P' : status === 'present' ? 'P' : status === 'absent' ? 'A' : status === 'half-day' ? 'H' : '-');
      }
      row.push(countStatus(employee.id, 'present'));
      row.push(countStatus(employee.id, 'absent'));
      row.push(countStatus(employee.id, 'half-day'));
      return row;
    });

    const headers = ['Name', ...days.map(d => d.toString()), 'P', 'A', 'H'];

    autoTable(doc, {
      startY: 30,
      head: [headers],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 7,
        cellPadding: 1,
      },
      styles: {
        fontSize: 7,
        cellPadding: 1,
        halign: 'center',
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 25 },
      },
    });

    doc.save(`attendance_${getMonthName(selectedMonth)}_${selectedYear}.pdf`);
  };

  const handleShare = async () => {
    const attendanceText = defaultEmployees.map((employee) => {
      const p = countStatus(employee.id, 'present');
      const a = countStatus(employee.id, 'absent');
      const h = countStatus(employee.id, 'half-day');
      return `${employee.name}: P=${p}, A=${a}, H=${h}`;
    }).join('\n');

    const shareData = {
      title: 'Attendance Sheet',
      text: `Attendance Sheet - ${getMonthName(selectedMonth)} ${selectedYear}\n\n${attendanceText}`,
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
          title="Attendance Sheet"
          description="Track daily employee attendance for your fuel station"
        >
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select
              value={selectedMonth.toString()}
              onValueChange={(v) => setSelectedMonth(parseInt(v))}
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
              value={selectedYear.toString()}
              onValueChange={(v) => setSelectedYear(parseInt(v))}
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
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare} title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownloadPDF} title="Download PDF">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </PageHeader>

        {/* Legend */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded border bg-green-500/20 border-green-500/50">
                <Check className="h-3 w-3 text-green-500" />
              </div>
              <span className="text-sm text-muted-foreground">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded border bg-red-500/20 border-red-500/50">
                <X className="h-3 w-3 text-red-500" />
              </div>
              <span className="text-sm text-muted-foreground">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded border bg-yellow-500/20 border-yellow-500/50">
                <Clock className="h-3 w-3 text-yellow-500" />
              </div>
              <span className="text-sm text-muted-foreground">Half Day</span>
            </div>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground min-w-[140px]">
                      Employee
                    </th>
                    {days.map((day) => (
                      <th
                        key={day}
                        className="px-1 py-3 text-center text-xs font-medium text-muted-foreground min-w-[32px]"
                      >
                        {day}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-green-500 min-w-[40px]">
                      P
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-red-500 min-w-[40px]">
                      A
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-yellow-500 min-w-[40px]">
                      H
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {defaultEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-secondary/30">
                      <td className="sticky left-0 z-10 bg-card whitespace-nowrap px-4 py-2 text-sm font-medium text-foreground">
                        {employee.name}
                      </td>
                      {days.map((day) => {
                        const key = getAttendanceKey(employee.id, day);
                        const status = attendance[key];
                        return (
                          <td key={day} className="px-1 py-2 text-center">
                            <button
                              onClick={() => cycleStatus(employee.id, day)}
                              className={cn(
                                'flex h-6 w-6 mx-auto items-center justify-center rounded border transition-colors',
                                getStatusColor(status)
                              )}
                            >
                              {getStatusIcon(status)}
                            </button>
                          </td>
                        );
                      })}
                      <td className="px-4 py-2 text-center text-sm font-medium text-green-500">
                        {countStatus(employee.id, 'present')}
                      </td>
                      <td className="px-4 py-2 text-center text-sm font-medium text-red-500">
                        {countStatus(employee.id, 'absent')}
                      </td>
                      <td className="px-4 py-2 text-center text-sm font-medium text-yellow-500">
                        {countStatus(employee.id, 'half-day')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
