import { useState } from 'react'
import { Search, Plus, Mail, Phone } from 'lucide-react'
import PageHeader from '../../../components/admin/common/PageHeader'
import Button from '../../../components/admin/common/Button'
import { customers } from '../../../data/staff'

export default function Customers() {
  const [search, setSearch] = useState('')
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${filtered.length} customers on record`}
        actions={<Button icon={Plus}>Add Customer</Button>}
      />

      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or company…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-indigo-400 focus-ring"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Customer ID</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium text-center">Total</th>
                <th className="px-4 py-3 font-medium text-center">Open</th>
                <th className="px-4 py-3 font-medium text-center">Resolved</th>
                <th className="px-4 py-3 font-medium">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-medium text-indigo-600 whitespace-nowrap">{c.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img src={c.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                      <span className="text-slate-700 font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{c.company}</td>
                  <td className="px-4 py-3 text-slate-500">
                    <div className="flex items-center gap-1.5 text-xs"><Mail size={12} /> {c.email}</div>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5"><Phone size={12} /> {c.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-slate-700">{c.totalQueries}</td>
                  <td className="px-4 py-3 text-center text-amber-600 font-medium">{c.openQueries}</td>
                  <td className="px-4 py-3 text-center text-emerald-600 font-medium">{c.resolvedQueries}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{c.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


// import { useState, useEffect } from 'react'
// import { 
//   Search, Plus, Mail, Phone, Building2, MapPin, 
//   Receipt, UserCheck, X, Loader2, Sparkles, CheckCircle2 
// } from 'lucide-react'
// import PageHeader from '../../components/common/PageHeader'
// import Button from '../../components/common/Button'
// import { fetchCustomers, addCustomer } from '../../services/customerService'

// export default function Customers() {
//   const [search, setSearch] = useState('')
//   const [customersList, setCustomersList] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [saving, setSaving] = useState(false)

//   // Form State
//   const [formData, setFormData] = useState({
//     companyName: '',
//     contactPerson: '',
//     phone: '',
//     email: '',
//     billNo: '',
//     location: '',
//     address: '',
//     softwareType: ''
//   })

//   // Load Customers on Mount
//   const loadData = async () => {
//     try {
//       setLoading(true)
//       const res = await fetchCustomers()
//       if (res?.success) {
//         setCustomersList(res.data || [])
//       }
//     } catch (err) {
//       console.error('Error loading customers:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     loadData()
//   }, [])

//   // Input Change Handler
//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
//   }

//   // Submit New Customer Form
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       setSaving(true)
//       const res = await addCustomer(formData)
//       if (res?.success) {
//         setIsModalOpen(false)
//         setFormData({
//           companyName: '',
//           contactPerson: '',
//           phone: '',
//           email: '',
//           billNo: '',
//           location: '',
//           address: '',
//           softwareType: ''
//         })
//         loadData() // Refresh Customer List
//       }
//     } catch (err) {
//       console.error('Error creating customer:', err)
//     } finally {
//       setSaving(false)
//     }
//   }

//   // Filter Search
//   const filtered = customersList.filter(c =>
//     c.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
//     c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
//     c.billNo?.toLowerCase().includes(search.toLowerCase()) ||
//     c.location?.toLowerCase().includes(search.toLowerCase())
//   )

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Customers"
//         subtitle={`${filtered.length} client accounts registered in system`}
//         actions={
//           <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
//             Add Customer
//           </Button>
//         }
//       />

//       {/* Search Bar */}
//       <div className="relative max-w-md">
//         <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//         <input
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           placeholder="Search by company, person, bill no, or location..."
//           className="w-full rounded-2xl border border-slate-200/80 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none backdrop-blur-md transition-all shadow-sm"
//         />
//       </div>

//       {/* Customers Table Container */}
//       <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-xl overflow-hidden">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
//             <Loader2 className="animate-spin text-indigo-500" size={32} />
//             <p className="text-xs font-semibold uppercase tracking-wider">Fetching Customer Records...</p>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="py-16 text-center text-slate-400 font-medium">No customer accounts match your search.</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-slate-200/60 dark:border-slate-800 text-left text-[11px] uppercase tracking-wider text-slate-400">
//                   <th className="px-4 py-3.5 font-bold">Bill No.</th>
//                   <th className="px-4 py-3.5 font-bold">Company & Location</th>
//                   <th className="px-4 py-3.5 font-bold">Contact Person</th>
//                   <th className="px-4 py-3.5 font-bold">Contact Details</th>
//                   <th className="px-4 py-3.5 font-bold">Address</th>
//                   <th className="px-4 py-3.5 font-bold text-center">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
//                 {filtered.map((c) => (
//                   <tr key={c._id || c.id} className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/40 transition-colors">
                    
//                     {/* Bill No */}
//                     <td className="px-4 py-4 font-mono text-xs font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
//                       <div className="flex items-center gap-1.5">
//                         <Receipt size={14} />
//                         {c.billNo || 'N/A'}
//                       </div>
//                     </td>

//                     {/* Company & City */}
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
//                         <Building2 size={15} className="text-slate-400 shrink-0" />
//                         {c.companyName}
//                       </div>
//                       {c.location && (
//                         <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
//                           <MapPin size={12} /> {c.location}
//                         </div>
//                       )}
//                     </td>

//                     {/* Contact Person Name */}
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
//                         <UserCheck size={14} className="text-slate-400" />
//                         {c.contactPerson}
//                       </div>
//                     </td>

//                     {/* Mobile & Mail */}
//                     <td className="px-4 py-4 text-slate-500">
//                       <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
//                         <Phone size={12} className="text-emerald-500" /> {c.phone}
//                       </div>
//                       {c.email && (
//                         <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
//                           <Mail size={12} /> {c.email}
//                         </div>
//                       )}
//                     </td>

//                     {/* Detailed Address */}
//                     <td className="px-4 py-4 text-slate-500 dark:text-slate-400 text-xs max-w-xs truncate">
//                       {c.address || 'N/A'}
//                     </td>

//                     {/* Active Tag */}
//                     <td className="px-4 py-4 text-center">
//                       <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
//                         <CheckCircle2 size={10} /> Active
//                       </span>
//                     </td>

//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* 🔮 GLASSMORPHIC ADD CUSTOMER MODAL FORM */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
//           <div className="relative w-full max-w-xl rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-white/20 dark:border-slate-800 p-6 shadow-2xl backdrop-blur-2xl">
            
//             {/* Modal Header */}
//             <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
//               <div className="flex items-center gap-2">
//                 <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
//                   <Sparkles size={18} />
//                 </div>
//                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">Register New Customer</h3>
//               </div>
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {/* Modal Form */}
//             <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {/* Company Name */}
//                 <div>
//                   <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Company Name *</label>
//                   <input
//                     required
//                     name="companyName"
//                     value={formData.companyName}
//                     onChange={handleChange}
//                     placeholder="e.g. Acme Enterprises"
//                     className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>

//                 {/* Bill / Invoice Number */}
//                 <div>
//                   <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Bill / GST No. *</label>
//                   <input
//                     required
//                     name="billNo"
//                     value={formData.billNo}
//                     onChange={handleChange}
//                     placeholder="e.g. BILL-2026-89"
//                     className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {/* Contact Person Name */}
//                 <div>
//                   <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Contact Person Name *</label>
//                   <input
//                     required
//                     name="contactPerson"
//                     value={formData.contactPerson}
//                     onChange={handleChange}
//                     placeholder="e.g. Rajesh Sharma"
//                     className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>

//                 {/* Mobile Number */}
//                 <div>
//                   <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Phone Number *</label>
//                   <input
//                     required
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     placeholder="e.g. +91 9876543210"
//                     className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {/* Email Address */}
//                 <div>
//                   <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Email Address</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="client@company.com"
//                     className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>

//                 {/* City / Location */}
//                 <div>
//                   <label className="text-xs font-bold text-slate-600 dark:text-slate-300">City / Location *</label>
//                   <input
//                     required
//                     name="location"
//                     value={formData.location}
//                     onChange={handleChange}
//                     placeholder="e.g. Mumbai, Maharashtra"
//                     className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>
//               </div>

//               {/* Complete Address */}
//               <div>
//                 <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Full Address</label>
//                 <textarea
//                   rows={2}
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   placeholder="Office number, street, landmark details..."
//                   className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-indigo-500 resize-none"
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-end gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50"
//                 >
//                   {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Save Customer
//                 </button>
//               </div>

//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }