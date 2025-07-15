import Honeycomb from "../components/Honeycomb";
import { AnimatedList } from "../components/magicui/animated-list";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Bell, LogOut } from "lucide-react";

interface Notification {
  id: number;
  name: string;
  description: string;
  time: string;
  icon: string;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    name: "Payment received",
    description: "New finance transaction completed",
    time: "15m ago",
    icon: "💸",
  },
  {
    id: 2,
    name: "New employee onboarded",
    description: "John Doe joined the HR system",
    time: "1h ago",
    icon: "👤",
  },
  {
    id: 3,
    name: "Inventory low",
    description: "Stock for Product X is running low",
    time: "2h ago",
    icon: "⚠️",
  },
  {
    id: 4,
    name: "CRM update",
    description: "New lead added in the sales pipeline",
    time: "3h ago",
    icon: "📈",
  },
  {
    id: 5,
    name: "System alert",
    description: "Scheduled maintenance tonight at 10PM",
    time: "5h ago",
    icon: "🔧",
  },
  {
    id: 6,
    name: "Server Restarted",
    description: "Backend server restarted successfully",
    time: "6h ago",
    icon: "🔄",
  },
  {
    id: 7,
    name: "Bug fixed",
    description: "Issue #234 resolved in dev branch",
    time: "7h ago",
    icon: "🐛",
  },
];

function Modules() {
  const navigate = useNavigate();
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  const [allNotifications, setAllNotifications] = useState<Notification[]>(initialNotifications);
  const [shownNotificationCount, setShownNotificationCount] = useState<number>(0); // NEW

  useEffect(() => {
    const showTimer = setInterval(() => {
      if (allNotifications.length > 0) {
        const nextNotification = allNotifications[0];
        setVisibleNotifications(prev => [nextNotification, ...prev]);
        setAllNotifications(prev => prev.slice(1));
        setShownNotificationCount(prev => prev + 1); // INCREMENT only when shown
      } else {
        clearInterval(showTimer);
      }
    }, 1000);

    return () => clearInterval(showTimer);
  }, [allNotifications]);

  useEffect(() => {
    if (visibleNotifications.length > 0) {
      const removeTimer = setInterval(() => {
        setVisibleNotifications(prev => prev.slice(0, -1));
      }, 20000);

      return () => clearInterval(removeTimer);
    }
  }, [visibleNotifications]);

  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Header */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center w-full max-w-5xl px-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-4xl font-bold text-gray-800 drop-shadow text-center break-words">
            Welcome to the <span className="text-purple-600">BDA Platform</span>
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto h-full flex items-center justify-center">
        {/* Honeycomb */}
        <div className="relative w-full max-w-[90vmin] h-[90vmin] flex items-center justify-center">
          <Honeycomb />
        </div>

        {/* Notifications */}
        <div className="absolute right-8 top-8 hidden lg:flex items-center gap-4">
          {/* Notification Icon with Badge */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="h-6 w-6 text-gray-700" />
            </button>
            {shownNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {shownNotificationCount}
              </span>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-6 py-3 h-14 text-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Notification List */}
        <div className="absolute right-8 top-32 w-80 hidden lg:flex flex-col">
          <div className="bg-transparent rounded-2xl p-6 relative">
            <div className="relative">
              <AnimatedList>
                {visibleNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/70 hover:bg-white transition-all duration-200 cursor-pointer mb-3 animate-in slide-in-from-right-96 fade-in duration-300"
                  >
                    <div className="text-2xl">{notification.icon}</div>
                    <div className="flex flex-col">
                      <h3 className="font-medium text-gray-800">{notification.name}</h3>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </AnimatedList>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modules;
