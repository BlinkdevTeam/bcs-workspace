import { useState, useMemo} from "react";
import {
  CandidateAvatar, Stars, StatusBadge, INTERVIEW_TYPES, IC, IS
} from "../../../data/compData";

export default function OffersTab({ offers, jobs, applicants }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {[["Total Offers",offers.length,"#fff"],["Accepted",offers.filter(o=>o.status==="Accepted").length,"#5af07a"],["Pending",offers.filter(o=>o.status==="Draft"||o.status==="Sent").length,"#f0c85a"],["Declined",offers.filter(o=>o.status==="Declined").length,"#f05a5a"]].map(([l,v,c])=>(
          <div key={l} className="rounded-lg p-4" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
            <p className="text-xs uppercase tracking-widest mb-2 text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>{l}</p>
            <p className="text-2xl font-light" style={{fontFamily:"monospace",color:c}}>{v}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {offers.map(offer=>{
          const app=applicants.find(a=>a.id===offer.applicantId);
          const job=jobs.find(j=>j.id===offer.jobId);
          return (
            <div key={offer.id} className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:`1px solid ${offer.status==="Accepted"?"#1e3a1e":offer.status==="Declined"?"#3a1515":"#1e1e1e"}`}}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {app&&<CandidateAvatar name={app.name} size={40}/>}
                  <div>
                    <p className="text-white text-base" style={{fontFamily:"system-ui,sans-serif"}}>{app?.name}</p>
                    <p className="text-gray-500 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{job?.title} · {job?.dept}</p>
                  </div>
                </div>
                <StatusBadge status={offer.status}/>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[["Offered Salary",offer.salary,"#5af07a"],["Start Date",offer.startDate,"#fff"],["Sent On",offer.sentOn||"Not sent yet","#aaa"],["Expires",offer.expiresOn,"#f0c85a"]].map(([l,v,c])=>(
                  <div key={l} className="rounded p-3" style={{backgroundColor:"#111",border:"1px solid #1a1a1a"}}>
                    <p className="text-xs text-gray-600 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>{l}</p>
                    <p className="text-sm font-medium" style={{fontFamily:"monospace",color:c}}>{v}</p>
                  </div>
                ))}
              </div>
              {offer.notes&&<p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>📝 {offer.notes}</p>}
              {offer.status==="Draft"&&(
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 rounded text-xs hover:opacity-80" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#0f2a0f",color:"#5af07a",border:"1px solid #2a4a2a"}}>Send Offer Letter</button>
                  <button className="px-4 py-2 rounded text-xs hover:opacity-80" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>Edit Offer</button>
                </div>
              )}
            </div>
          );
        })}
        {offers.length===0&&(
          <div className="text-center py-16">
            <p className="text-gray-600 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>No offers created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}