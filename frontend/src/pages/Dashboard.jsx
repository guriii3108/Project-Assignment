import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// Temporary Mock Data for UI Designing
const MOCK_TASKS = [
  {
    id: 1,
    title: "Design Homepage UI",
    description: "Create a pristine, minimalist light theme for the main landing page following the new design system.",
    status: "In Progress",
    priority: "High",
    dueDate: "Oct 24, 2026",
  },
  {
    id: 2,
    title: "Integrate Auth API",
    description: "Connect the frontend login and register pages with the backend Node.js endpoints.",
    status: "Completed",
    priority: "Critical",
    dueDate: "Oct 22, 2026",
  },
  {
    id: 3,
    title: "Refactor State Management",
    description: "Move local state to Redux or Context API for better cross-component data flow.",
    status: "Pending",
    priority: "Medium",
    dueDate: "Nov 01, 2026",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  // Simulate loading data
  useEffect(() => {
    setTasks(MOCK_TASKS);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'High': return 'text-orange-700 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
              Good morning, {user?.name || 'User'}
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Here's what needs your attention today.
            </p>
          </div>

          <button className="bg-[#0A0A0A] hover:bg-black text-white px-5 py-2.5 rounded-xl font-semibold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>

                {/* Action Menu Mock */}
                <button className="text-gray-400 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 mt-auto">
                {task.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                {task.description}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {task.dueDate}
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-2xl">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No tasks found</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Get started by creating a new task to keep track of your work.
            </p>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;