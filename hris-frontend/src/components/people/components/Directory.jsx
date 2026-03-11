import { useState, useMemo } from "react";
import CompensationConfigTab from "./CompensationConfigTab";

const EMPLOYEES = [
  { id: 1,  name: "Sara Okafor",      role: "Senior Engineer",   dept: "Engineering", location: "New York", status: "Active",   joined: "Jan 12, 2021", salary: "$142,000", manager: "Devon Park",   avatar: "SO", email: "sara.okafor@hera.io",  phone: "+1 212 555 0191", schedule: "Mon–Fri, 9am–5pm",  empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Premium",  gender: "Female", dob: "Mar 14, 1990" },
  { id: 2,  name: "Marcus Chen",      role: "Account Executive", dept: "Sales",       location: "Chicago",  status: "Active",   joined: "Mar 5, 2022",  salary: "$98,000",  manager: "Rita Vance",   avatar: "MC", email: "marcus.chen@hera.io",  phone: "+1 312 555 0144", schedule: "Mon–Fri, Flexible", empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Standard", gender: "Male",   dob: "Jul 22, 1993" },
  { id: 3,  name: "Priya Nair",       role: "Product Manager",   dept: "Product",     location: "Remote",   status: "Active",   joined: "Jul 19, 2023", salary: "$126,000", manager: "Devon Park",   avatar: "PN", email: "priya.nair@hera.io",   phone: "+1 415 555 0172", schedule: "Mon–Fri, Flexible", empType: "Full-time", payFreq: "Semi-monthly", benefits: "Premium",  gender: "Female", dob: "Nov 5, 1991" },
  { id: 4,  name: "James Kowalski",   role: "DevOps Engineer",   dept: "Engineering", location: "Austin",   status: "Active",   joined: "Nov 1, 2020",  salary: "$134,000", manager: "Sara Okafor",  avatar: "JK", email: "james.k@hera.io",      phone: "+1 512 555 0103", schedule: "Mon–Fri, 9am–5pm",  empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Standard", gender: "Male",   dob: "Apr 18, 1988" },
  { id: 5,  name: "Leila Farouk",     role: "Senior PM",         dept: "Product",     location: "New York", status: "Active",   joined: "Feb 28, 2019", salary: "$148,000", manager: "Devon Park",   avatar: "LF", email: "leila.f@hera.io",      phone: "+1 212 555 0165", schedule: "4-day week",        empType: "Full-time", payFreq: "Monthly",      benefits: "Premium",  gender: "Female", dob: "Sep 30, 1987" },
  { id: 6,  name: "Devon Park",       role: "VP Engineering",    dept: "Engineering", location: "New York", status: "Active",   joined: "Jun 14, 2018", salary: "$210,000", manager: "CEO",          avatar: "DP", email: "devon.park@hera.io",   phone: "+1 212 555 0188", schedule: "Mon–Fri, Flexible", empType: "Full-time", payFreq: "Monthly",      benefits: "Premium",  gender: "Male",   dob: "Jan 2, 1982" },
  { id: 7,  name: "Rita Vance",       role: "Sales Director",    dept: "Sales",       location: "Chicago",  status: "Active",   joined: "Sep 3, 2020",  salary: "$175,000", manager: "CEO",          avatar: "RV", email: "rita.vance@hera.io",   phone: "+1 312 555 0121", schedule: "Mon–Fri, 9am–5pm",  empType: "Full-time", payFreq: "Monthly",      benefits: "Premium",  gender: "Female", dob: "Jun 15, 1984" },
  { id: 8,  name: "Tomás Rivera",     role: "UX Designer",       dept: "Design",      location: "Remote",   status: "Active",   joined: "Apr 11, 2022", salary: "$112,000", manager: "Leila Farouk", avatar: "TR", email: "tomas.r@hera.io",      phone: "+1 415 555 0199", schedule: "Mon–Fri, Flexible", empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Standard", gender: "Male",   dob: "Feb 27, 1994" },
  { id: 9,  name: "Ananya Bose",      role: "Data Analyst",      dept: "Operations",  location: "Austin",   status: "On Leave", joined: "Oct 22, 2021", salary: "$95,000",  manager: "Rita Vance",   avatar: "AB", email: "ananya.b@hera.io",     phone: "+1 512 555 0177", schedule: "Mon–Fri, 9am–5pm",  empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Standard", gender: "Female", dob: "Aug 8, 1995" },
  { id: 10, name: "Chris Mendez",     role: "HR Specialist",     dept: "HR & Admin",  location: "New York", status: "Active",   joined: "Jan 7, 2023",  salary: "$88,000",  manager: "Devon Park",   avatar: "CM", email: "chris.m@hera.io",      phone: "+1 212 555 0134", schedule: "Mon–Fri, 9am–5pm",  empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Standard", gender: "Male",   dob: "Dec 3, 1997" },
  { id: 11, name: "Fatima Al-Hassan", role: "Frontend Engineer", dept: "Engineering", location: "Remote",   status: "Active",   joined: "Mar 30, 2022", salary: "$128,000", manager: "Sara Okafor",  avatar: "FA", email: "fatima.a@hera.io",     phone: "+1 415 555 0156", schedule: "Mon–Fri, Flexible", empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Premium",  gender: "Female", dob: "May 11, 1992" },
  { id: 12, name: "Noah Kim",         role: "Marketing Manager", dept: "Marketing",   location: "Chicago",  status: "Active",   joined: "Aug 15, 2021", salary: "$104,000", manager: "Rita Vance",   avatar: "NK", email: "noah.kim@hera.io",     phone: "+1 312 555 0143", schedule: "Mon–Fri, Flexible", empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Standard", gender: "Male",   dob: "Oct 19, 1993" },
];

const DEPTS = ["All","Engineering","Sales","Product","Design","Operations","Marketing","HR & Admin"];

const STATUSES = ["All","Active","On Leave","Inactive"];

function Avatar ( {emp,size=36} )
  { 
    const{bg,fg}=gc(emp.id); 
    return (
          <div 
            className="rounded-full flex items-center justify-center font-bold flex-shrink-0" 
            style={
              { width:size,height:size,backgroundColor:bg,color:fg,fontFamily:"system-ui,sans-serif",fontSize:size<32?11:size<56?13:20}
            }>
            {emp.avatar}
          </div>
    )
  }

const SS = { 
  "Active" : {bg:"#0f1f0f",color:"#5af07a"}, 
  "On Leave" : {bg:"#1f1a0f",color:"#f0c85a"}, 
  "Inactive" : {bg:"#1f0f0f",color:"#f05a5a"} 
};

const AV = [
  "#ffffff",
  "#cccccc",
  "#999999",
  "#777777",
  "#555555",
  "#444444",
  "#ffffff",
  "#bbbbbb",
  "#888888",
  "#666666",
  "#aaaaaa",
  "#333333"
];

function gc (id) { 
  const bg=AV[id%AV.length]; 
  
  return { 
    bg, 
    fg : ["#fff","#ddd","#eee","#ccc","#bbb"].some(x=>bg.startsWith(x.slice(0,4))) ? "#000" : "#fff" 
  }; 
}

export default function Directory({ onViewProfile, onEditEmployee, onAddEmployee, peopleView, onSwitchView, basicPaySets, contributionSets, benefitsSets, onUpdateBasicPay, onUpdateContributions, onUpdateBenefits }) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const filtered = useMemo(() => EMPLOYEES.filter(e => {
    const q = search.toLowerCase();
    return (!q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q))
      && (deptFilter === "All" || e.dept === deptFilter)
      && (statusFilter === "All" || e.status === statusFilter);
  }), [search, deptFilter, statusFilter]);

  if (peopleView === "config") {
    return <CompensationConfigTab basicPaySets={basicPaySets} contributionSets={contributionSets} benefitsSets={benefitsSets} onUpdateBasicPay={onUpdateBasicPay} onUpdateContributions={onUpdateContributions} onUpdateBenefits={onUpdateBenefits} onSwitchView={onSwitchView} />;
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-8 pt-8 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div><p className="text-gray-600 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "system-ui,sans-serif" }}>People</p><h1 className="text-3xl font-normal" style={{ letterSpacing: "-0.02em" }}>Employee Directory</h1></div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded text-sm flex items-center gap-2 hover:opacity-70" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>⬇ Export CSV</button>
              <button onClick={onAddEmployee} className="px-4 py-2 rounded text-sm font-medium bg-white text-black flex items-center gap-2 hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif" }}>＋ Add Employee</button>
            </div>
          </div>
          {/* People-level tab bar */}
          <div className="flex gap-1 mb-2" style={{ borderBottom: "1px solid #1a1a1a" }}>
            {[["directory","Directory"],["config","Compensation Config"]].map(([key,label]) => (
              <button key={key} onClick={() => onSwitchView(key)}
                className="px-4 py-2 text-sm transition-all"
                style={{ fontFamily: "system-ui,sans-serif", color: peopleView === key ? "#fff" : "#555", borderBottom: peopleView === key ? "2px solid #fff" : "2px solid transparent" }}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span><input className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", border: "1px solid #2a2a2a" }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} /></div>
            <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none cursor-pointer" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", border: "1px solid #2a2a2a" }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>{DEPTS.map(d => <option key={d}>{d === "All" ? "All Departments" : d}</option>)}</select>
            <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none cursor-pointer" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", border: "1px solid #2a2a2a" }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>{STATUSES.map(s => <option key={s}>{s === "All" ? "All Statuses" : s}</option>)}</select>
            <div className="flex-1" /><span className="text-gray-600 text-sm" style={{ fontFamily: "monospace" }}>{filtered.length} of {EMPLOYEES.length}</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-8 pb-8">
          <table className="w-full text-sm border-collapse">
            <thead><tr style={{ borderBottom: "1px solid #222" }}>{["Employee", "Department", "Role", "Location", "Status", "Joined"].map(h => <th key={h} className="pb-3 pr-6 text-left font-normal text-gray-600" style={{ fontFamily: "system-ui,sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>)}<th /></tr></thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} onClick={() => setSelectedEmp(selectedEmp?.id === emp.id ? null : emp)} className="cursor-pointer group"
                  style={{ borderBottom: "1px solid #181818", backgroundColor: selectedEmp?.id === emp.id ? "#111" : "transparent" }}
                  onMouseEnter={e => { if (selectedEmp?.id !== emp.id) e.currentTarget.style.backgroundColor = "#0a0a0a"; }}
                  onMouseLeave={e => { if (selectedEmp?.id !== emp.id) e.currentTarget.style.backgroundColor = "transparent"; }}>
                  <td className="py-3 pr-6"><div className="flex items-center gap-3"><Avatar emp={emp} size={34} /><div><p className="text-white font-medium">{emp.name}</p><p className="text-gray-500 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>{emp.email}</p></div></div></td>
                  <td className="py-3 pr-6 text-gray-400" style={{ fontFamily: "system-ui,sans-serif" }}>{emp.dept}</td>
                  <td className="py-3 pr-6 text-gray-300" style={{ fontFamily: "system-ui,sans-serif" }}>{emp.role}</td>
                  <td className="py-3 pr-6 text-gray-400" style={{ fontFamily: "system-ui,sans-serif" }}>{emp.location}</td>
                  <td className="py-3 pr-6"><span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "system-ui,sans-serif", ...SS[emp.status] }}>{emp.status}</span></td>
                  <td className="py-3 pr-6 text-gray-500 text-xs" style={{ fontFamily: "monospace" }}>{emp.joined}</td>
                  <td className="py-3"><span className="opacity-0 group-hover:opacity-100 text-gray-500 text-sm">→</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedEmp && (
        <div className="w-72 flex-shrink-0 border-l overflow-y-auto" style={{ backgroundColor: "#080808", borderColor: "#222" }}>
          <div className="p-6">
            <div className="flex justify-end mb-4"><button onClick={() => setSelectedEmp(null)} className="text-gray-600 hover:text-white">✕</button></div>
            <div className="flex flex-col items-center text-center mb-5">
              <Avatar emp={selectedEmp} size={56} />
              <h2 className="text-lg font-normal mt-3 mb-1">{selectedEmp.name}</h2>
              <p className="text-gray-400 text-sm mb-2" style={{ fontFamily: "system-ui,sans-serif" }}>{selectedEmp.role}</p>
              <span className="text-xs px-3 py-1 rounded-full" style={{ fontFamily: "system-ui,sans-serif", ...SS[selectedEmp.status] }}>{selectedEmp.status}</span>
            </div>
            <div className="border-b mb-4" style={{ borderColor: "#222" }} />
            <div className="space-y-3">{[["Department", selectedEmp.dept], ["Location", selectedEmp.location], ["Manager", selectedEmp.manager], ["Joined", selectedEmp.joined], ["Salary", selectedEmp.salary], ["Email", selectedEmp.email]].map(([l, v]) => <div key={l}><p className="text-gray-600 text-xs uppercase tracking-widest" style={{ fontFamily: "system-ui,sans-serif" }}>{l}</p><p className="text-gray-200 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{v}</p></div>)}</div>
            <div className="border-b my-4" style={{ borderColor: "#222" }} />
            <div className="space-y-2">
              <button onClick={() => onViewProfile(selectedEmp)} className="w-full py-2.5 rounded text-sm bg-white text-black hover:opacity-80 font-medium" style={{ fontFamily: "system-ui,sans-serif" }}>View Full Profile</button>
              <button onClick={() => onEditEmployee(selectedEmp)} className="w-full py-2.5 rounded text-sm hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>Edit Employee</button>
              <button className="w-full py-2.5 rounded text-sm hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#1f0f0f", color: "#f05a5a", border: "1px solid #3a1515" }}>Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}