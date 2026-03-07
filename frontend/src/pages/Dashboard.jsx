import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import { showSuccess, showError } from "../utils/toast";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Slide-out panel state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.data || []);
    } catch (err) {
      showError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openPanel = (task = null) => {
    setSelectedTask(task);
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: "",
      });
    }
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedTask(null);
    reset();
  };

  const onSaveTask = async (data) => {
    try {
      if (selectedTask) {
        // Update existing task
        await api.put(`/tasks/${selectedTask._id}`, data);
        showSuccess("Task updated");
      } else {
        // Create new task
        await api.post("/tasks/create", data);
        showSuccess("Task created");
      }
      closePanel();
      fetchTasks();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save task");
    }
  };

  const onDeleteTask = async (taskId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      showSuccess("Task deleted");
      fetchTasks();
    } catch (err) {
      showError("Failed to delete task");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'in-progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-white text-gray-600 border-gray-200 shadow-sm';
    }
  };

  const getStatusIndicator = (status) => {
    switch (status) {
      case 'completed': return 'bg-gray-400';
      case 'in-progress': return 'bg-blue-500 animate-[pulse_2s_ease-in-out_infinite]';
      default: return 'bg-gray-300 border border-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'low': return 'text-gray-500 bg-gray-50 border-gray-200';
      default: return 'text-blue-700 bg-blue-50 border-blue-200'; // medium
    }
  };

  // Filter and search logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "All") return true;
      if (activeFilter === "Todo" && task.status === "pending") return true;
      if (activeFilter === "In Progress" && task.status === "in-progress") return true;
      if (activeFilter === "Done" && task.status === "completed") return true;

      return false;
    });
  }, [tasks, searchQuery, activeFilter]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-20 relative overflow-hidden">
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-1">
              Good morning, {user?.name || 'User'}
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Here's what needs your attention today.
            </p>
          </div>

          <button
            onClick={() => openPanel()}
            className="bg-black hover:bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>

        {/* 1. High-Level Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Tasks", value: stats.total },
            { label: "Done", value: stats.completed },
            { label: "In Progress", value: stats.inProgress },
            { label: "Overdue", value: stats.overdue, color: "text-red-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] transition-all duration-300">
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold tracking-tight ${stat.color || 'text-gray-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 2. Sleek Filtering & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Filters Pill Menu */}
          <div className="flex items-center gap-1 p-1 bg-gray-100/80 rounded-xl overflow-x-auto no-scrollbar border border-gray-200/60">
            {["All", "Todo", "In Progress", "Done"].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeFilter === filter
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Command Center Search */}
          <div className="relative group w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-10 pr-12 py-2.5 text-sm font-medium focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all placeholder:text-gray-400 shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-[10px] font-bold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 shadow-sm">⌘K</span>
            </div>
          </div>
        </div>

        {/* 3. Linear-Style List View */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden relative min-h-[300px]">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="py-3.5 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-1/2">Task</th>
                  <th className="py-3.5 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="py-3.5 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Priority</th>
                  <th className="py-3.5 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Due Date</th>
                  <th className="py-3.5 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTasks.map((task) => (
                  <tr
                    key={task._id}
                    onClick={() => openPanel(task)}
                    className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-gray-900 mb-0.5 group-hover:text-black transition-colors">{task.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[250px] sm:max-w-sm font-medium">{task.description || "No description provided."}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${getStatusColor(task.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusIndicator(task.status)}`}></span>
                        {task.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                        {task.priority || "MEDIUM"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 font-semibold">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => onDeleteTask(task._id, e)}
                        className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Empty State graphic */}
                {!isLoading && filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-1">No tasks found</p>
                      <p className="text-xs text-gray-500 font-medium">Get started by creating a new task.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 4. Slide-Out Details Panel (Overlay and Drawer) */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={closePanel}
        ></div>
      )}

      {/* Slide-out Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col pt-4">

          {/* Panel Header */}
          <div className="px-6 pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm cursor-pointer hover:text-black transition-colors" onClick={closePanel}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <span>Close panel</span>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSaveTask)} className="flex flex-col flex-1 overflow-hidden">
            <div className="px-6 py-6 overflow-y-auto flex-1">
              <input
                {...register("title", { required: "Task title is required" })}
                type="text"
                placeholder="Task Title"
                className="w-full text-2xl font-bold text-gray-900 mb-2 focus:outline-none placeholder:text-gray-300"
              />
              {errors.title && <p className="text-red-500 text-xs mb-4 font-medium">{errors.title.message}</p>}

              <div className="space-y-6 mt-6">
                {/* Properties Grid */}
                <div className="grid grid-cols-[100px_1fr] gap-y-4 items-center text-sm">
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Status
                  </span>
                  <div>
                    <select
                      {...register("status")}
                      className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 min-w-[140px] cursor-pointer"
                    >
                      <option value="pending">Todo</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Done</option>
                    </select>
                  </div>

                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    Priority
                  </span>
                  <div>
                    <select
                      {...register("priority")}
                      className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 min-w-[140px] cursor-pointer"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Due Date
                  </span>
                  <div>
                    <input
                      {...register("dueDate")}
                      type="date"
                      className="bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 min-w-[140px]"
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Description Field */}
                <div>
                  <textarea
                    {...register("description")}
                    placeholder="Add a description..."
                    rows={8}
                    className="w-full text-sm text-gray-700 focus:outline-none resize-none placeholder:text-gray-400 leading-relaxed bg-transparent"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Panel Footer / Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-black hover:bg-gray-200/50 rounded-lg transition-colors"
                onClick={closePanel}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-semibold bg-black hover:bg-gray-900 text-white rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : (selectedTask ? 'Save Changes' : 'Create Task')}
              </button>
            </div>
          </form>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;