import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportDataProps {
  sortedLabels: string[];
  currentPeriodSales: { [key: string]: number };
  cumulativeSales: number[];
}

const useExportData = ({
  sortedLabels,
  currentPeriodSales,
  cumulativeSales,
}: ExportDataProps) => {
  const exportCSV = () => {
    const headers = ["Date", "Current Period Sales", "Cumulative Sales"];
    const csvRows = [headers.join(",")];
    sortedLabels.forEach((label, index) => {
      const row = [
        label,
        currentPeriodSales[label].toString(),
        cumulativeSales[index].toString(),
      ];
      csvRows.push(row.join(","));
    });
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Trends", 20, 10);
    const tableData = sortedLabels.map((label, index) => [
      label,
      currentPeriodSales[label].toFixed(2),
      cumulativeSales[index].toFixed(2),
    ]);
    autoTable(doc, {
      head: [["Date", "Current Period Sales", "Cumulative Sales"]],
      body: tableData,
    });
    doc.save("sales_data.pdf");
  };

  return { exportCSV, exportPDF };
};

export default useExportData;
