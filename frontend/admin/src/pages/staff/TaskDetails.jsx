import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from  'react-router-dom';
import {
  ArrowLeft, Building2, Phone, Mail, MapPin, User, FileText, Receipt,
  Calendar, Package, CheckCircle2,
  Upload, Image as ImageIcon, FileUp, Loader2,
  FileCode2, Eye, Clock, CheckCircle, PlayCircle, X, Download, ExternalLink
} from 'lucide-react';
import Layout from '../../components/staff/Layout';
import { StatusBadge, PriorityBadge } from '../../components/staff/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { fetchTaskById, updateTaskStatus, addTaskRemark, uploadTaskFile } from '../../services/staff/taskService';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 transition-all duration-200 hover:translate-x-1">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-400">{label}</p>
        <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{value || '—'}</p>
      </div>
    </div>
  );
}

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getStatusDetails = (status) => {
  switch (status) {
    case 'Completed':
      return { pct: 100, color: 'from-emerald-500 to-teal-400', stroke: '#10b981', icon: CheckCircle };
    case 'In Progress':
      return { pct: 10, color: 'from-amber-500 to-orange-400', stroke: '#f59e0b', icon: PlayCircle };
    case 'Pending':
    default:
      return { pct: 0, color: 'from-slate-400 to-slate-500', stroke: '#94a3b8', icon: Clock };
  }
};

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { staff: loggedInStaff } = useAuth();
  const { showToast } = useToast();

  const [task, setTask] = useState(null);
  const [remark, setRemark] = useState('');
  const [completionNote, setCompletionNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState('overview');
  const [previewFile, setPreviewFile] = useState(null);

  const screenshotInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const extractTaskData = (response) => response?.data || response;

  const load = async () => {
    try {
      const res = await fetchTaskById(id);
      const taskData = extractTaskData(res);
      if (taskData) setTask(taskData);
    } catch (err) {
      showToast('Failed to load task details', 'error');
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await updateTaskStatus(id, newStatus);
      const updated = extractTaskData(res);
      setTask(updated);
      showToast(`Status updated to "${newStatus}"`, 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleRemarkSubmit = async () => {
    if (!remark.trim()) return;
    try {
      const res = await addTaskRemark(id, { 
        text: remark.trim(), 
        author: loggedInStaff?.name || 'Staff' 
      });
      const updated = extractTaskData(res);
      setTask(updated);
      setRemark('');
      showToast('Remark added successfully.', 'success');
    } catch (err) {
      showToast('Failed to add remark', 'error');
    }
  };

  const handleFileChange = async (e, label) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('label', label);
    formData.append('file', file); 

    setUploading(true);
    try {
      const res = await uploadTaskFile(id, formData);
      const updated = extractTaskData(res);
      setTask(updated);
      showToast(`${label} uploaded successfully!`, 'success');
    } catch (err) {
      showToast('File upload failed', 'error');
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handleCompletionSave = async () => {
    if (!completionNote.trim()) return;
    try {
      const res = await addTaskRemark(id, {
        text: `[Completion Note]: ${completionNote.trim()}`,
        author: loggedInStaff?.name || 'Staff',
      });
      const updated = extractTaskData(res);
      setTask(updated);
      setCompletionNote('');
      showToast('Completion notes saved successfully.', 'success');
    } catch (err) {
      showToast('Failed to save completion note', 'error');
    }
  };



const openDocument = (url, isImage) => {
  if (!url) return;

  if (isImage) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  let cleanUrl = url.replace('/fl_attachment:false', '');
  
  if (cleanUrl.includes('cloudinary.com') && cleanUrl.includes('/image/upload/')) {
    cleanUrl = cleanUrl.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
  }

  const win = window.open(cleanUrl, '_blank', 'noopener,noreferrer');

  if (!win) {
    window.location.href = cleanUrl;
  }
};
  if (!task) {
    return (
      <Layout title="Task Details">
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={32} />
          <p className="text-sm font-semibold text-slate-500">Loading details...</p>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'progress', label: 'Progress & Timeline' },
    { id: 'update', label: 'Update Task' },
  ];

  const client = task.partyDetails || {};
  const statusHistory = task.statusHistory || [];
  const remarks = task.remarks || [];
  const files = task.files || [];
  const statusMeta = getStatusDetails(task.status);

  return (
    <Layout title={task.taskId || task._id} subtitle={task.title}>
      {/* Back Button */}
      <div className="mb-5 flex items-center justify-between">
        <button 
          onClick={() => navigate('/tasks')} 
          className="group inline-flex items-center gap-2 rounded-xl bg-white/60 backdrop-blur-md px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-white hover:text-blue-600 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Tasks
        </button>

        {/* Quick Upload Buttons everywhere */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => screenshotInputRef.current?.click()} 
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400"
          >
            <ImageIcon size={14} /> + Add Image
          </button>
          <button 
            onClick={() => documentInputRef.current?.click()} 
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-600 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:text-cyan-400"
          >
            <FileUp size={14} /> + Add Doc
          </button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={screenshotInputRef}
        onChange={(e) => handleFileChange(e, 'Screenshot')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={documentInputRef}
        onChange={(e) => handleFileChange(e, 'Document')}
        accept=".pdf,.doc,.docx,image/*"
        className="hidden"
      />

      {/* Header Banner */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-6 shadow-xl shadow-blue-500/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="inline-block rounded-lg bg-white/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white backdrop-blur-md">
              {task.softwareType || 'Task'} &bull; {task.taskId}
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl drop-shadow-sm">
              {task.title || 'Untitled Task'}
            </h2>
            <p className="mt-1 text-sm font-medium text-blue-100">
              {client.partyName || 'N/A'} &middot; Created on {formatDate(task.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PriorityBadge priority={task.priority || 'Medium'} />
            <StatusBadge status={task.status || 'Pending'} />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-1.5 backdrop-blur-lg dark:border-slate-800/60 dark:bg-slate-900/80 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
              tab === t.id 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20' 
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/80">
            <h3 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:border-slate-800 dark:text-blue-400">
              <Building2 size={16} /> Client Details
            </h3>
            <InfoRow icon={Building2} label="Company Name" value={client.partyName} />
            <InfoRow icon={User} label="Contact Person" value={client.contactPerson} />
            <InfoRow icon={Phone} label="Mobile Number" value={client.mobileNo} />
            <InfoRow icon={Phone} label="Alternate Number" value={client.alternateNo} />
            <InfoRow icon={Mail} label="Email Address" value={client.email} />
            <InfoRow icon={MapPin} label="Address" value={client.address} />
            <InfoRow icon={MapPin} label="Location" value={client.location} />
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/80">
            <h3 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:border-slate-800 dark:text-blue-400">
              <Package size={16} /> Installation & Software
            </h3>
            <InfoRow icon={FileText} label="PO Number" value={client.poNumber} />
            <InfoRow icon={Receipt} label="Bill Number" value={client.billNumber} />
            <InfoRow icon={Calendar} label="Bill Date" value={formatDate(client.billDate)} />
            <InfoRow icon={Calendar} label="Due Date" value={formatDate(task.dueDate)} />
            <InfoRow icon={Package} label="Software Details" value={task.softwareDetails} />
            <InfoRow icon={Package} label="Software Type" value={task.softwareType} />
            <InfoRow icon={User} label="Sales Representative" value={client.salesPersonName} />
          </div>
        </div>
      )}

      {/* TAB 2: PROGRESS & TIMELINE */}
      {tab === 'progress' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/80">
            <h3 className="mb-6 text-base font-bold text-slate-800 dark:text-white">Task Completion Progress</h3>
            
            <div className="flex items-center gap-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-200 dark:text-slate-700" />
                  <circle
                    cx="50" cy="50" r="40" fill="none" stroke={statusMeta.stroke} strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - statusMeta.pct / 100)}`}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute text-xl font-black text-slate-800 dark:text-white">{statusMeta.pct}%</span>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                  <statusMeta.icon size={14} className="text-blue-600" />
                  {task.status}
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  {task.status === 'Completed' && 'Task has been marked as fully complete.'}
                  {task.status === 'In Progress' && 'Work is currently ongoing.'}
                  {task.status === 'Pending' && 'Awaiting start.'}
                </p>
                <p className="mt-1 text-xs font-bold text-blue-600 dark:text-blue-400">Due: {formatDate(task.dueDate)}</p>
              </div>
            </div>

            <h4 className="mb-4 mt-6 text-sm font-bold text-slate-800 dark:text-slate-200">Status History</h4>
            <div className="space-y-4 border-l-2 border-blue-100 pl-4 dark:border-blue-950">
              {statusHistory.length === 0 ? (
                <p className="text-xs text-slate-400">No status changes recorded.</p>
              ) : (
                statusHistory.map((h, idx) => (
                  <div key={h._id || idx} className="relative">
                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900" />
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{h.status}</p>
                    <p className="text-xs text-slate-400">{formatDate(h.createdAt || h.date)} &middot; {h.note || 'Status updated'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Remarks Card */}
          {/* ⚠️ Yeh poora "Remarks Card" block hai — apni TaskDetails.jsx mein
    "PROGRESS & TIMELINE" tab ke andar wale purane "Remarks Card" div ko
    ISSE poora replace kar dein (start se end tak, dono <div> tags samet). */}

{/* Remarks Card - Chat Style UI */}
<div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/80 flex flex-col">
  <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-white">Remarks & Daily Logs</h3>

  {/* Chat Messages Container */}
  <div className="flex-1 max-h-80 min-h-[200px] space-y-3 overflow-y-auto pr-1 rounded-xl bg-slate-50/60 p-3 dark:bg-slate-800/30">
    {remarks.length === 0 ? (
      <p className="py-8 text-center text-xs text-slate-400">No remarks added yet.</p>
    ) : (
      remarks.map((r, idx) => {
        // 🆕 Apne remarks pehchanne ka logic: agar author naam logged-in staff se match karta hai
        // toh woh "own message" hai (right side), warna "other" (Admin/others - left side)
        const isOwnMessage = r.author && loggedInStaff?.name && 
          r.author.trim().toLowerCase() === loggedInStaff.name.trim().toLowerCase();

        return (
          <div
            key={r._id || idx}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[75%] flex-col gap-1 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
              {/* Author name - sirf dusre logon ke messages pe dikhayein */}
              {!isOwnMessage && (
                <p className="px-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  {r.author || 'Admin'}
                </p>
              )}

              <div
                className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                  isOwnMessage
                    ? 'rounded-br-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                    : 'rounded-bl-sm bg-white border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                }`}
              >
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words">
                  {r.text}
                </p>
              </div>

              <p className={`px-1 text-[10px] font-medium ${isOwnMessage ? 'text-slate-400' : 'text-slate-400'}`}>
                {formatDate(r.createdAt)}
              </p>
            </div>
          </div>
        );
      })
    )}
  </div>

  {/* Input Box */}
  <div className="mt-4 flex gap-2">
    <input
      value={remark}
      onChange={(e) => setRemark(e.target.value)}
      placeholder="Type daily work remark..."
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      onKeyDown={(e) => e.key === 'Enter' && handleRemarkSubmit()}
    />
    <button
      onClick={handleRemarkSubmit}
      className="shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:opacity-95"
    >
      Add
    </button>
  </div>
</div>
          {/* <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/80">
            <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-white">Remarks & Daily Logs</h3>
            <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
              {remarks.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">No remarks added yet.</p>
              ) : (
                remarks.map((r, idx) => (
                  <div key={r._id || idx} className="rounded-xl border border-slate-100 bg-white/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{r.author || 'Staff'}</p>
                      <p className="text-[11px] font-medium text-slate-400">{formatDate(r.createdAt)}</p>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">{r.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <input 
                value={remark} 
                onChange={(e) => setRemark(e.target.value)} 
                placeholder="Type daily work remark..." 
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" 
                onKeyDown={(e) => e.key === 'Enter' && handleRemarkSubmit()} 
              />
              <button 
                onClick={handleRemarkSubmit} 
                className="shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:opacity-95"
              >
                Add
              </button>
            </div>
          </div> */}
        </div>
      )}

      {/* TAB 3: UPDATE TASK */}
      {tab === 'update' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Change Status */}
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/80">
            <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-white">Update Status</h3>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { status: 'Pending', pct: '0%', color: 'from-slate-500 to-slate-600' },
                { status: 'In Progress', pct: '10%', color: 'from-amber-500 to-orange-500' },
                { status: 'Completed', pct: '100%', color: 'from-emerald-500 to-teal-500' }
              ].map((item) => {
                const isActive = task.status === item.status;
                return (
                  <button
                    key={item.status}
                    onClick={() => handleStatusChange(item.status)}
                    className={`flex flex-col items-center justify-center rounded-xl p-3.5 border transition-all ${
                      isActive 
                        ? `bg-gradient-to-r ${item.color} text-white border-transparent shadow-md` 
                        : 'border-slate-200 bg-white/50 text-slate-700 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold">{item.status}</span>
                    <span className={`text-[11px] mt-0.5 font-medium ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{item.pct}</span>
                  </button>
                );
              })}
            </div>

            <h3 className="mb-3 mt-8 text-base font-bold text-slate-800 dark:text-white">
              Add Completion Remarks
            </h3>
            <textarea 
              value={completionNote} 
              onChange={(e) => setCompletionNote(e.target.value)} 
              rows={4} 
              placeholder="Add final resolution summary or closing remarks..." 
              className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" 
            />
            <button 
              onClick={handleCompletionSave} 
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:opacity-95"
            >
              <CheckCircle2 size={16} /> Save Notes
            </button>
          </div>

          {/* Upload File / Image Card */}
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/80">
            <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-white">Upload File / Image</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => screenshotInputRef.current?.click()} 
                disabled={uploading} 
                className="flex flex-col items-center justify-center rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-all hover:bg-blue-100/60 dark:border-blue-900/50 dark:bg-blue-950/20"
              >
                <ImageIcon size={24} className="mb-2 text-blue-600 dark:text-blue-400" /> 
                <span className="text-xs font-bold text-blue-900 dark:text-blue-300">Upload Image</span>
              </button>

              <button 
                onClick={() => documentInputRef.current?.click()} 
                disabled={uploading} 
                className="flex flex-col items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50/60 p-5 transition-all hover:bg-cyan-100/60 dark:border-cyan-900/50 dark:bg-cyan-950/20"
              >
                <FileUp size={24} className="mb-2 text-cyan-600 dark:text-cyan-400" /> 
                <span className="text-xs font-bold text-cyan-900 dark:text-cyan-300">Upload PDF / Doc</span>
              </button>
            </div>

            {uploading && (
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600">
                <Loader2 size={16} className="animate-spin" /> Uploading file...
              </div>
            )}
          </div>
        </div>
      )}

      {/* UPLOADED FILES SECTION */}
      <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/80">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Upload size={18} className="text-blue-600" /> Uploaded Files & Documents ({files.length})
          </h4>

          {/* Direct Upload Buttons right above list */}
          <div className="flex gap-2">
            <button 
              onClick={() => screenshotInputRef.current?.click()}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <ImageIcon size={14} /> + Image
            </button>
            <span className="text-slate-300">|</span>
            <button 
              onClick={() => documentInputRef.current?.click()}
              className="text-xs font-bold text-cyan-600 hover:underline flex items-center gap-1"
            >
              <FileUp size={14} /> + Document
            </button>
          </div>
        </div>
        
        {files.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
            No attachments uploaded yet. Click on "+ Image" or "+ Document" above to upload.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, i) => {
              const rawUrl = file.fileUrl || file.url || file.path || '';

              const isImage = rawUrl && (
                rawUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) || 
                file.fileType?.includes('image')
              );

              return (
                <div key={file._id || i} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
                  {isImage ? (
                    <img 
                      src={rawUrl} 
                      alt={file.label} 
                      className="h-12 w-12 shrink-0 rounded-lg object-cover border border-slate-200 dark:border-slate-700" 
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      <FileCode2 size={22} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                      {file.label || (isImage ? 'Image File' : 'Document File')}
                    </p>
                    <p className="text-xs text-slate-400">{formatDate(file.uploadedAt)}</p>
                  </div>

                  {rawUrl && (
                    <button
                      onClick={() => openDocument(rawUrl, isImage)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-blue-600 hover:text-white dark:bg-slate-700 dark:text-slate-300"
                      title="Open Document"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
