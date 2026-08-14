import { useEffect, useState } from 'react';
import Layout from '../../components/staff/Layout';
import TaskTable from '../../components/staff/TaskCard';
import Modal from '../../components/staff/Modal';
import { fetchTasks, updateTaskStatus, addTaskRemark } from '../../services/staff/taskService';
import { useToast } from '../../context/ToastContext';

export default function MyTasks() {
  const [tasks, setTasks] = useState(null);
  const [remarkTask, setRemarkTask] = useState(null);
  const [remarkText, setRemarkText] = useState('');

  const { showToast } = useToast();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const staffId = currentUser._id || currentUser.id || currentUser.staffId;

  const load = async () => {
    if (!staffId) {
      showToast('No staffID found', 'error');
      setTasks([]);
      return;
    }

    try {
      const response = await fetchTasks(staffId, 'All');
      const tasksList = Array.isArray(response)
        ? response
        : response?.data || response?.tasks || [];

      setTasks(tasksList);
    } catch (err) {
      console.error("Error loading tasks:", err);
      showToast('Backend se task load nahi ho paye.', 'error');
      setTasks([]);
    }
  };

  useEffect(() => {
    load();
  }, [staffId]);

  const handleQuickStatus = async (id, newStatus) => {
    let newProgress = undefined;

    if (newStatus === 'In Progress') {
      newProgress = 10;
    } else if (newStatus === 'Completed') {
      newProgress = 100;
    }

    try {
      const updated = await updateTaskStatus(id, newStatus, newProgress);

      setTasks((prev) =>
        prev.map((t) =>
          ((t._id || t.id) === id)
            ? {
                ...t,
                status: newStatus,
                progress: newProgress !== undefined ? newProgress : t.progress,
                ...(updated?.data || updated)
              }
            : t
        )
      );
      showToast(`Task status updated to ${newStatus}.`, 'success');
    } catch (error) {
      showToast('Status update nahi ho paya.', 'error');
    }
  };

  const handleAddRemarkSubmit = async () => {
    if (!remarkText.trim() || !remarkTask) return;
    const targetId = remarkTask._id || remarkTask.id;
    try {
      const updated = await addTaskRemark(targetId, remarkText.trim());
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === targetId ? { ...t, ...(updated?.data || updated) } : t))
      );
      showToast('Remark added successfully.', 'success');
      setRemarkTask(null);
      setRemarkText('');
    } catch (error) {
      showToast('Remark save nahi hua.', 'error');
    }
  };

  return (
    <Layout title="My Tasks" subtitle="Manage installations and client queries assigned to you.">
      {!tasks ? (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-slate-400 font-medium">
          Loading tasks...
        </div>
      ) : (
        <TaskTable
          tasks={tasks}
          onQuickStatus={handleQuickStatus}
          onAddRemark={(id) => setRemarkTask(tasks.find((x) => (x._id || x.id) === id))}
        />
      )}

      <Modal
        open={!!remarkTask}
        onClose={() => setRemarkTask(null)}
        title={`Add Remark - ${remarkTask?.title || remarkTask?._id || remarkTask?.id}`}
      >
        <textarea
          value={remarkText}
          onChange={(e) => setRemarkText(e.target.value)}
          rows={4}
          placeholder="Write your daily work remark..."
          className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => setRemarkTask(null)} className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
            Cancel
          </button>
          <button onClick={handleAddRemarkSubmit} className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700">
            Save Remark
          </button>
        </div>
      </Modal>
    </Layout>
  );
}