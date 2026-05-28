// Store for pump management data
export interface Employee {
  id: string;
  name: string;
  perDayAmount: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: 'present' | 'absent' | 'half-day';
}

export interface BillEntry {
  id: string;
  date: string;
  vehicleNo: string;
  customerName: string;
  amount: number;
}

export interface Customer {
  id: string;
  vehicleNo: string;
  name: string;
}

// Default customers based on the image
export const defaultCustomers: Customer[] = [
  { id: '1', vehicleNo: 'KL 10 BJ 7572', name: 'JAMSHEER' },
  { id: '2', vehicleNo: 'KL 53 D 1019', name: 'MIRSHAD' },
  { id: '3', vehicleNo: 'KL 10 BJ 1048', name: 'DHULFUKAR' },
  { id: '4', vehicleNo: 'KL 10 BJ 7868', name: 'SAKARIYA' },
  { id: '5', vehicleNo: 'KL 10 BJ 1087', name: 'SINAN' },
  { id: '6', vehicleNo: 'KL 02 BF 6083', name: 'IRSHAD' },
  { id: '7', vehicleNo: 'KL 10 BJ 0691', name: 'PRABIN' },
  { id: '8', vehicleNo: 'KL 10 BH 4562', name: 'MUNEER' },
  { id: '9', vehicleNo: 'KL 10 BJ 0995', name: 'SHAHABAS' },
];

export interface LubeCommission {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  totalSales: number;
  commissionAmount: number;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  daysWorked: number;
  perDayAmount: number;
  grossSalary: number;
  shortAmount: number;
  excessAmount: number;
  netSalary: number;
}

// Default employees based on the image
export const defaultEmployees: Employee[] = [
  { id: '1', name: 'JAMSHEER', perDayAmount: 500 },
  { id: '2', name: 'MIRSHAD', perDayAmount: 500 },
  { id: '3', name: 'DHULFUKAR', perDayAmount: 500 },
  { id: '4', name: 'SAKARIYA', perDayAmount: 500 },
  { id: '5', name: 'SINAN', perDayAmount: 500 },
  { id: '6', name: 'IRSHAD', perDayAmount: 500 },
  { id: '7', name: 'PRABIN', perDayAmount: 500 },
  { id: '8', name: 'MUNEER', perDayAmount: 500 },
  { id: '9', name: 'SHAHABAS', perDayAmount: 500 },
];

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Format date
export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}

// Parse date from DD/MM/YY format
export function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  const fullYear = year < 50 ? 2000 + year : 1900 + year;
  return new Date(fullYear, month - 1, day);
}

// Get month name
export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
}

// Get days in month
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
