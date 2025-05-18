import React from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { ChevronRight } from 'lucide-react'

interface ActivityItem {
  name: string
  jobTitle: string
  time: string
  status: 'Hired' | 'Promoted' | 'Left' | 'On Leave'
}

const activities: ActivityItem[] = [
  { name: 'John Doe', jobTitle: 'Manager', time: 'Today, 10:45 AM', status: 'Promoted' },
  { name: 'Emily Carter', jobTitle: 'Manager', time: 'Yesterday, 2:30 PM', status: 'On Leave' },
  { name: 'David Kim', jobTitle: 'lvl 1 employee', time: 'May 15, 4:15 PM', status: 'Hired' },
  { name: 'Sophia Lee', jobTitle: 'HR Specialist', time: 'May 14, 11:20 AM', status: 'Left' },
]

const getStatusColor = (status: ActivityItem['status']) => {
  switch (status) {
    case 'Hired':
      return 'bg-green-100 text-green-700'
    case 'Promoted':
      return 'bg-blue-100 text-blue-700'
    case 'Left':
      return 'bg-red-100 text-red-700'
    case 'On Leave':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const RecentActivity: React.FC = () => {
  return (
    <Card className="p-6 border border-gray-200 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
        <a
          href="/activity"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-all group"
        >
          View all
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Job Title</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activities.map((activity, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{activity.name}</td>
                <td className="px-4 py-3 text-gray-600">{activity.jobTitle}</td>
                <td className="px-4 py-3">
                  <Badge className={`${getStatusColor(activity.status)} text-xs px-2 py-1`}>
                    {activity.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">{activity.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default RecentActivity
