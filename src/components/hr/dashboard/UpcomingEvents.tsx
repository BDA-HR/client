import React from 'react'
import { Card } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { CalendarDays, MapPin, ChevronRight } from 'lucide-react'

export interface EventItem {
  title: string
  date: string
  time: string
  location: string
  type?: 'Meeting' | 'Holiday' | 'Training'
}

interface UpcomingEventsProps {
  events: EventItem[]
}

const getBadgeColor = (type?: string) => {
  switch (type) {
    case 'Meeting':
      return 'bg-blue-100 text-blue-700'
    case 'Holiday':
      return 'bg-green-100 text-green-700'
    case 'Training':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  return (
    <Card className="p-6 border border-gray-200 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
        <a
          href="/events"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-all group"
        >
          View all
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-md font-medium text-gray-900">{event.title}</h3>
              {event.type && (
                <Badge className={`${getBadgeColor(event.type)} text-xs px-2 py-1`}>
                  {event.type}
                </Badge>
              )}
            </div>

            <div className="mt-2 flex items-center text-sm text-gray-600 space-x-4">
              <div className="flex items-center space-x-1">
                <CalendarDays className="w-4 h-4" />
                <span>{event.date}, {event.time}</span>
              </div>
              <div className="hidden sm:flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default UpcomingEvents
