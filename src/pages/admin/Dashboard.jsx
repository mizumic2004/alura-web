import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "../../styles/admin/dashboard.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [months, setMonths] = useState([]);

  useEffect(() => {
    document.title = "Dashboard - Alurà System Management";

    const now = new Date();
    const recentMonths = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (4 - i));
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    });
    setMonths(recentMonths);
  }, []);

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Current Week",
        data: [3000, 4000, 3200, 5100, 4500, 4900, 5300],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Previous Week",
        data: [4000, 3800, 4200, 4600, 5000, 5500, 5700],
        borderColor: "#FFC107",
        backgroundColor: "rgba(255, 193, 7, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const pieData = {
    labels: ["Lipstick", "Serum", "Sun Cream", "Perfume"],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="Dashboard">
      <div className="dashboard_container">
        <div className="dashboard_header">
          <h2 className="admin_main_title">Dashboard</h2>
          <FormControl size="small" sx={{ minWidth: 130, height: 35 }}>
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={months[months.length - 1] || ""}
              label="Month"
              onChange={() => { }}
              sx={{
                height: 35,
                fontSize: 14,
                padding: "0 8px",
              }}>
              {months.map((m, i) => (
                <MenuItem key={i} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="dashboard_cards">
          <div className="dashboard_card">
            <h4>Customers</h4>
            <p className="value">45,320</p>
            <p className="positive">▲ 5.25% Since last month</p>
          </div>
          <div className="dashboard_card">
            <h4>Orders</h4>
            <p className="value">45,320</p>
            <p className="negative">▼ 1.23% Since last month</p>
          </div>
          <div className="dashboard_card">
            <h4>Earnings</h4>
            <p className="value">$7,524</p>
            <p className="negative">▼ 7.85% Since last month</p>
          </div>
          <div className="dashboard_card">
            <h4>Growth</h4>
            <p className="value">+ 35.52%</p>
            <p className="positive">▲ 3.72% Since last month</p>
          </div>
        </div>

        <div className="dashboard_charts">
          <div className="revenue_chart">
            <div className="chart_header">
              <h5>Revenue</h5>
              <p>
                Current Week: <strong>45,320</strong> | Previous Week:{" "}
                <strong>58,610</strong>
              </p>
            </div>
            <Line data={lineData} options={lineOptions} />
          </div>
          <div className="total_sales_pie">
            <h5>Total Sales</h5>
            <div className="pie_wrapper">
              <Pie data={pieData} />
            </div>
          </div>
        </div>

        <div className="dashboard_table_section">
          <div className="table_header">
            <h5>Top Selling Products</h5>
            <button className="export_btn">
              Export <i className="fas fa-download"></i>
            </button>
          </div>
          <table className="selling_table">
            <thead>
              <tr>
                <th>Product Name</th>
                {/* <th>Date Time</th> */}
                <th>Price</th>
                <th>Sold</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pocket Drone 2.4G</td>
                {/* <td>07 April 2018</td> */}
                <td>$129.99</td>
                <td>32</td>
                <td>$6089.58</td>
              </tr>
              <tr>
                <td>Marco Lightweight Shirt</td>
                {/* <td>15 March 2018</td> */}
                <td>$55.99</td>
                <td>47</td>
                <td>$3689.73</td>
              </tr>
              <tr>
                <td>Lightweight Jacket</td>
                {/* <td>10 March 2018</td> */}
                <td>$73.99</td>
                <td>53</td>
                <td>$1689.57</td>
              </tr>
              <tr>
                <td>DJI Phantom 4 PRO</td>
                {/* <td>07 March 2018</td> */}
                <td>$499.99</td>
                <td>25</td>
                <td>$8489.05</td>
              </tr>
              <tr>
                <td>ST SwellPro Drone</td>
                {/* <td>02 March 2018</td> */}
                <td>$219.99</td>
                <td>12</td>
                <td>$2689.58</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
