import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FileText,Send,Phone,Mail,MessageCircle} from 'lucide-react';
import {useQueries} from '../context/QueryContext';
import {useAuth} from '../context/AuthContext';

const SOFTWARE_TYPES=["Standard Software",
        "Photo Capturing",
        "Master Slave",
        "Unmaned Software",];
const SOFTWARE_FEATURES=['Email','SMS','Cloud','Whatsapp'];
const MATERIAL_OPTIONS=[      "IP Camera",
  "Traffic Light",
  "ANPR Camera",
  "Vehicle Position Sensor (VPS)",
  "VHF Reader",
  "VHF Tag",
   "Boom Barrier",
    "I/O Controller",
  "Pole",
  "Computer",
  "Printer",];

const empty={
  subject:'',category:'Technical Support',product:'Electronic Weighbridge',
  softwareType:'Standard Software',softwareFeature:[],material:[],priority:'Medium',description:'',
  preferredContact:'Call',poNumber:'',billNumber:'',billDate:'',partyName:'',
  address:'',location:'',contactPerson:'',mobileNo:'',email:''
};

export default function NewQuery(){
  const nav=useNavigate();
  const{addQuery}=useQueries();
  const{customer}=useAuth();
  const[f,setF]=useState({...empty,partyName:customer?.companyName||customer?.name||'',address:customer?.address||'',location:customer?.location||'',contactPerson:customer?.name||'',mobileNo:customer?.mobile||'',email:customer?.email||''});
  const[error,setError]=useState('');
  const[loading,setLoading]=useState(false);
  const change=e=>setF({...f,[e.target.name]:e.target.value});
  const toggleMaterial=material=>setF(prev=>{
  const current=prev.material||[];
  const exists=current.some(x=>(typeof x==='string'?x:x?.name)===material);
  return {...prev,material:exists
    ? current.filter(x=>(typeof x==='string'?x:x?.name)!==material)
    : [...current.map(x=>typeof x==='string'?{name:x,quantity:1}:x),{name:material,quantity:1}]};
});
const setMaterialQuantity=(material,quantity)=>setF(prev=>({...prev,material:(prev.material||[]).map(x=>{
  const item=typeof x==='string'?{name:x,quantity:1}:x;
  return item.name===material?{...item,quantity:Math.max(1,Number(quantity)||1)}:item;
})}));
const toggleSoftwareFeature=feature=>setF(prev=>({...prev,softwareFeature:(prev.softwareFeature||[]).includes(feature)?prev.softwareFeature.filter(x=>x!==feature):[...(prev.softwareFeature||[]),feature]}));

  const submit=async e=>{
    e.preventDefault();setLoading(true);setError('');
    try{
      const q=await addQuery({
        subject:f.subject,category:f.category,product:f.product,softwareType:f.softwareType,
        softwareFeature:f.softwareFeature,material:f.material,priority:f.priority,description:f.description,
        preferredContact:f.preferredContact,
        partyDetails:{poNumber:f.poNumber,billNumber:f.billNumber,billDate:f.billDate||null,partyName:f.partyName,address:f.address,location:f.location,contactPerson:f.contactPerson,mobileNo:f.mobileNo,email:f.email}
      });
      nav(`/queries/${q.id}`);
    }catch(x){setError(x.message)}finally{setLoading(false)}
  };

  return <div className="mx-auto max-w-5xl space-y-5">
    <div><h1 className="text-2xl font-bold text-slate-900">Raise a New Query</h1><p className="mt-1 text-sm text-slate-500">Enter query, software, material, billing and site contact details for faster resolution.</p></div>
    <form onSubmit={submit} className="card overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 p-5 text-white"><div className="flex items-center gap-3"><div className="rounded-xl bg-white/15 p-2.5"><FileText/></div><div><h2 className="font-bold">Customer Query Information</h2><p className="text-xs text-blue-100">Required fields are marked *</p></div></div></div>
      <div className="space-y-7 p-5 sm:p-7">
        <section className="space-y-5"><h3 className="font-bold text-slate-800">Query Details</h3>
          <div><label className="label">Subject *</label><input required name="subject" value={f.subject} onChange={change} className="field" placeholder="Briefly describe your issue"/></div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div><label className="label">Category *</label><select name="category" value={f.category} onChange={change} className="field"><option>Technical Support</option><option>Installation</option><option>Calibration</option><option>Documentation</option><option>Billing</option><option>General Enquiry</option></select></div>
            <div><label className="label">Product / System</label><select name="product" value={f.product} onChange={change} className="field"><option>Electronic Weighbridge</option><option>Platform Scale</option><option>Industrial Scale</option><option>Weighbridge Printer</option><option>Software / Indicator</option><option>Other</option></select></div>
            <div><label className="label">Software Type</label><select name="softwareType" value={f.softwareType} onChange={change} className="field">{SOFTWARE_TYPES.map(x=><option key={x}>{x}</option>)}</select></div>
            <div><label className="label">Priority *</label><select name="priority" value={f.priority} onChange={change} className="field"><option>Low</option><option>Medium</option><option>High</option></select></div>
          </div>
          <div>
            <label className="label">Software Features</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SOFTWARE_FEATURES.map(x=><label key={x} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-700 hover:border-blue-300">
                <input type="checkbox" checked={(f.softwareFeature||[]).includes(x)} onChange={()=>toggleSoftwareFeature(x)} className="accent-blue-600"/><span>{x}</span>
              </label>)}
            </div>
          </div>
          <div>
            <label className="label">Material & Quantity</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {MATERIAL_OPTIONS.map(x=>{
                const selected=(f.material||[]).find(m=>(typeof m==='string'?m:m?.name)===x);
                return <div key={x} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-700">
                  <input type="checkbox" checked={!!selected} onChange={()=>toggleMaterial(x)} className="accent-blue-600"/>
                  <span className="flex-1">{x}</span>
                  {selected&&<input type="number" min="1" value={selected.quantity||1} onChange={e=>setMaterialQuantity(x,e.target.value)} className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-center text-xs font-bold"/>}
                </div>
              })}
            </div>
          </div>
          <div><label className="label">Detailed Description *</label><textarea required name="description" value={f.description} onChange={change} rows="5" className="field resize-none"/></div>
        </section>
        <section className="border-t border-slate-100 pt-6"><h3 className="font-bold text-slate-800">Preferred Contact *</h3><div className="mt-3 grid gap-3 sm:grid-cols-3">{[['Call',Phone],['Email',Mail],['Chat',MessageCircle]].map(([x,I])=><label key={x} className={`cursor-pointer rounded-xl border p-4 ${f.preferredContact===x?'border-blue-500 bg-blue-50 text-blue-700':'border-slate-200 text-slate-600'}`}><input type="radio" name="preferredContact" value={x} checked={f.preferredContact===x} onChange={change} className="hidden"/><div className="flex items-center gap-2 font-bold"><I size={18}/>{x}</div></label>)}</div></section>
        <section className="border-t border-slate-100 pt-6"><h3 className="font-bold text-slate-800">PO / Billing Details</h3><div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><div><label className="label">PO Number</label><input name="poNumber" value={f.poNumber} onChange={change} className="field"/></div><div><label className="label">Bill Number</label><input name="billNumber" value={f.billNumber} onChange={change} className="field"/></div><div><label className="label">Bill Date</label><input type="date" name="billDate" value={f.billDate} onChange={change} className="field"/></div></div></section>
        <section className="border-t border-slate-100 pt-6"><h3 className="font-bold text-slate-800">Party & Site Contact</h3><div className="mt-4 grid gap-5 sm:grid-cols-2"><div><label className="label">Party Name *</label><input required name="partyName" value={f.partyName} onChange={change} className="field"/></div><div><label className="label">Contact Person *</label><input required name="contactPerson" value={f.contactPerson} onChange={change} className="field"/></div><div><label className="label">Address</label><input name="address" value={f.address} onChange={change} className="field"/></div><div><label className="label">Location</label><input name="location" value={f.location} onChange={change} className="field"/></div><div><label className="label">Mobile No. *</label><input required name="mobileNo" value={f.mobileNo} onChange={change} className="field"/></div><div><label className="label">Email *</label><input type="email" required name="email" value={f.email} onChange={change} className="field"/></div></div></section>
        {error&&<p className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-600">{error}</p>}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={()=>nav('/queries')} className="secondary">Cancel</button><button disabled={loading} className="primary" type="submit"><Send size={17}/>{loading?'Submitting...':'Submit Query'}</button></div>
      </div>
    </form>
  </div>
}