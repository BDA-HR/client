import React from 'react'
import { Button } from '../components/ui/button'
import StatsCards from '../components/dashboard/StatsCards'
import UpcomingEvents from '../components/dashboard/UpcomingEvents'
import RecentActivity from '../components/dashboard/RecentActivity'
import PendingActivity from '../components/dashboard/PendingActivity'

function Dashboard() {
  return (
    <main>
      <section>
        <div>
          <h1>Welcome back, <span>John</span></h1>
          <p>Here is the overview of the key metrics ans activities.</p>
        </div>
        <div>
          <Button>Refresh</Button>
          <Button>export</Button>
          <Button>+ New employee</Button>
        </div>
      </section>
      <StatsCards />
      <RecentActivity />
      <PendingActivity/>
      <UpcomingEvents />
    </main>
  )
}

export default Dashboard