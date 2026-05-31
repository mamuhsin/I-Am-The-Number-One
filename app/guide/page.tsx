'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/page-header';
import { HelpCircle, BookOpen, Users, Receipt, DollarSign, CalendarDays, Download, Share2 } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="space-y-8">
      <PageHeader title="User Guide" description="Learn how to use each feature of the Pump Management System" />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>This software helps manage your fuel pump business with 4 main modules:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Track daily attendance</li>
              <li>Record customer bills</li>
              <li>Track lubricant commissions</li>
              <li>Manage employee salaries</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Every page has export buttons:</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>Download PDF</strong> - Save data as PDF file</li>
              <li><strong>Share</strong> - Share via WhatsApp, Email, etc.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="salary">Salary</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Attendance Sheet
              </CardTitle>
              <CardDescription>Track daily attendance for all employees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">How to Use:</h4>
                <ol className="list-inside list-decimal space-y-2 text-sm">
                  <li><strong>Select Month/Year</strong> - Use arrows to navigate to desired month</li>
                  <li><strong>Mark Attendance</strong> - Click on each day cell to cycle through:
                    <ul className="ml-4 list-inside list-disc space-y-1 text-xs">
                      <li>P = Present (green)</li>
                      <li>A = Absent (red)</li>
                      <li>H = Half-day (yellow)</li>
                    </ul>
                  </li>
                  <li><strong>View Summary</strong> - Right side shows P/A/H count for each employee</li>
                  <li><strong>Download/Share</strong> - Use buttons at top to export data</li>
                </ol>
              </div>

              <Card className="bg-secondary/30">
                <CardContent className="pt-4">
                  <h5 className="mb-2 font-semibold text-sm">Example:</h5>
                  <p className="text-xs text-muted-foreground">
                    If an employee worked 20 days (P), was absent 2 days (A), and took 3 half-days (H) in May, you&apos;ll see all three numbers on the attendance sheet.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Bill Entry
              </CardTitle>
              <CardDescription>Record customer fuel purchases with vehicle and amounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">How to Use:</h4>
                <ol className="list-inside list-decimal space-y-2 text-sm">
                  <li><strong>View Today&apos;s Bills</strong> - Bills automatically filter by current date</li>
                  <li><strong>Add New Bill</strong> - Click "Add Bill" button:
                    <ul className="ml-4 list-inside list-disc space-y-1 text-xs">
                      <li>Enter Date (or use today)</li>
                      <li>Select Customer from dropdown OR add new</li>
                      <li>Amount appears automatically with vehicle number</li>
                    </ul>
                  </li>
                  <li><strong>Manage Customers</strong> - Use "Manage Customers" button to:
                    <ul className="ml-4 list-inside list-disc space-y-1 text-xs">
                      <li>View all saved customers</li>
                      <li>Add new customer (Vehicle No + Name)</li>
                      <li>Delete customers you don&apos;t need</li>
                    </ul>
                  </li>
                  <li><strong>View Totals</strong> - Bottom shows daily total amount</li>
                  <li><strong>Download/Share</strong> - Export daily bills as PDF</li>
                </ol>
              </div>

              <Card className="bg-secondary/30">
                <CardContent className="pt-4">
                  <h5 className="mb-2 font-semibold text-sm">Pro Tip:</h5>
                  <p className="text-xs text-muted-foreground">
                    Save regular customers (like KL 10 BJ 7572 - JAMSHEER) so you can quickly select them instead of typing every time.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Lube Commission
              </CardTitle>
              <CardDescription>Track lubricant sales and commission amounts for employees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">How to Use:</h4>
                <ol className="list-inside list-decimal space-y-2 text-sm">
                  <li><strong>Select Month/Year</strong> - Filter commissions by specific month</li>
                  <li><strong>View Commission List</strong> - Shows:
                    <ul className="ml-4 list-inside list-disc space-y-1 text-xs">
                      <li>Employee Name</li>
                      <li>Total Sales (amount in ₹)</li>
                      <li>Commission Amount (amount in ₹)</li>
                    </ul>
                  </li>
                  <li><strong>Add Commission</strong> - Click "Add Commission":
                    <ul className="ml-4 list-inside list-disc space-y-1 text-xs">
                      <li>Select Employee</li>
                      <li>Enter Total Sales amount</li>
                      <li>Enter Commission Amount</li>
                    </ul>
                  </li>
                  <li><strong>Edit/Delete</strong> - Use pencil icon to edit or trash icon to delete</li>
                  <li><strong>View Totals</strong> - Bottom row shows total sales and total commission</li>
                </ol>
              </div>

              <Card className="bg-secondary/30">
                <CardContent className="pt-4">
                  <h5 className="mb-2 font-semibold text-sm">Example:</h5>
                  <p className="text-xs text-muted-foreground">
                    If JAMSHEER sold ₹15,000 worth of lube and gets ₹750 commission, enter both amounts directly.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Salary List
              </CardTitle>
              <CardDescription>Calculate and manage employee salaries with deductions and additions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">How to Use:</h4>
                <ol className="list-inside list-decimal space-y-2 text-sm">
                  <li><strong>Select Month/Year</strong> - View salaries for specific month</li>
                  <li><strong>Add Salary Entry</strong> - Click "Add Salary":
                    <ul className="ml-4 list-inside list-disc space-y-1 text-xs">
                      <li>Select Employee</li>
                      <li>Days Worked (e.g., 25)</li>
                      <li>Per Day Amount (e.g., ₹500)</li>
                      <li>Short Amount (deductions, if any)</li>
                      <li>Excess Amount (bonus/additions, if any)</li>
                    </ul>
                  </li>
                  <li><strong>Auto-Calculation</strong> - System calculates:
                    <ul className="ml-4 list-inside list-disc space-y-1 text-xs">
                      <li>Gross Salary = Days × Per Day Amount</li>
                      <li>Net Salary = Gross - Short + Excess</li>
                    </ul>
                  </li>
                  <li><strong>View Results</strong> - See:
                    <ul className="ml-4 list-inside list-disc space-y-1 text-xs">
                      <li>Red number = Short (deduction)</li>
                      <li>Green number = Excess (bonus)</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <Card className="bg-secondary/30">
                <CardContent className="pt-4">
                  <h5 className="mb-2 font-semibold text-sm">Example:</h5>
                  <p className="text-xs text-muted-foreground">
                    Employee worked 25 days at ₹500/day = ₹12,500 gross. If ₹500 short, net = ₹12,000. If ₹1,000 bonus, net = ₹13,500.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Sharing & Downloading Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="mb-2 font-semibold text-sm">📥 Download PDF Button</h4>
              <p className="text-sm text-muted-foreground">
                Saves data as PDF file on your device. Perfect for keeping records, printing, or storing on computer.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-sm">📤 Share Button</h4>
              <p className="text-sm text-muted-foreground">
                Shares data via WhatsApp, Email, Messages, or copies to clipboard. Great for sending reports to management or employees.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-sm">Steps:</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                <li>Click the Download (↓) or Share (↑) button in header</li>
                <li>For PDF: File automatically downloads</li>
                <li>For Share: Choose app or copy to clipboard</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="text-amber-600">⚠️ Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• All data is saved on your computer/device locally</p>
          <p>• Data won&apos;t be lost when you refresh the page</p>
          <p>• Backup your PDFs regularly</p>
          <p>• Share PDFs with management for records</p>
          <p>• Use Admin Panel to verify all features are working</p>
        </CardContent>
      </Card>

      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="text-green-600">✓ Workflow for Monthly Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-semibold mb-1">Week 1: Record Daily Activities</p>
            <p className="text-muted-foreground">• Enter attendance daily • Enter bills daily • Track commission sales</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Week 4: Calculate & Process</p>
            <p className="text-muted-foreground">• Add salary entries for all employees • Add any deductions/bonuses • Review commission totals</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Month-End: Export & Archive</p>
            <p className="text-muted-foreground">• Download all PDFs (Attendance, Bills, Commission, Salary) • Save files in folder with month name • Share with management/employees</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
