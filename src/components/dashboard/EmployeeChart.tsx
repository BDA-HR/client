"use client"

import React from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import { Card } from "../ui/card"

ChartJS.register(ArcElement, Tooltip, Legend)

interface EmployeeStatusData {
  active: number
  inactive: number
}

interface DoughnutChartProps {
  data: EmployeeStatusData
}

const EmployeeStatusChart: React.FC<DoughnutChartProps> = ({ data }) => {
  const chartData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        label: "Employee Status",
        data: [data.active, data.inactive],
        backgroundColor: ["#2563eb", "#F59E0B"],
        borderWidth: 0,
      },
    ],
  }

  const options = {
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return (
    <Card className="h-full p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800">Employee Status</h2>
        <p className="text-sm font-medium text-gray-700 my-2">
          Current distribution of active and inactive employees
        </p>
        <hr />
      </div>
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>
    </Card>
  )
}

export default EmployeeStatusChart
