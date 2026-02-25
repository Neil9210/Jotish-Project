import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const COLUMNS = ["Name", "Position", "Office", "Extn.", "Start Date", "Salary"];

interface Employee {
  name: string;
  position: string;
  office: string;
  extn: string;
  startDate: string;
  salary: string;
  photo: string;
}

function parseEmployees(raw: string[][]): Employee[] {
  return raw.map((row) => ({
    name: row[0] ?? "",
    position: row[1] ?? "",
    office: row[2] ?? "",
    extn: row[3] ?? "",
    startDate: row[4] ?? "",
    salary: row[5] ?? "",
    photo: `https://i.pravatar.cc/80?u=${encodeURIComponent(row[0] ?? "")}`,
  }));
}

const ListPage = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartOpen, setChartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("loggedIn")) {
      navigate("/");
      return;
    }

    fetch("https://backend.jotish.in/backend_dev/gettabledata.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "test", password: "123456" }),
    })
      .then((res) => res.json())
      .then((json) => {
        const rows: string[][] = json?.TABLE_DATA?.data ?? [];
        setData(parseEmployees(rows));
      })
      .catch(() => setError("Failed to fetch data"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const chartData = data.slice(0, 10).map((emp) => ({
    name: emp.name,
    salary: Number(emp.salary.replace(/[^0-9.]/g, "")) || 0,
  }));

  const chartConfig = {
    salary: { label: "Salary", color: "hsl(var(--primary))" },
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Employee List</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setChartOpen(true)}>
              Bar Chart
            </Button>
            <Button variant="ghost" onClick={() => { sessionStorage.removeItem("loggedIn"); navigate("/"); }}>
              Logout
            </Button>
          </div>
        </div>

        {loading && <p className="text-muted-foreground">Loading...</p>}
        {error && <p className="text-destructive">{error}</p>}

        {!loading && !error && data.length > 0 && (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Photo</TableHead>
                  {COLUMNS.map((col) => (
                    <TableHead key={col}>{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((emp, idx) => (
                  <TableRow
                    key={idx}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/details/${idx}`, { state: emp })}
                  >
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={emp.photo} alt={emp.name} />
                        <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>{emp.office}</TableCell>
                    <TableCell>{emp.extn}</TableCell>
                    <TableCell>{emp.startDate}</TableCell>
                    <TableCell>{emp.salary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={chartOpen} onOpenChange={setChartOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Salary Chart (First 10 Employees)</DialogTitle>
            </DialogHeader>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={80} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="salary" fill="var(--color-salary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ListPage;
