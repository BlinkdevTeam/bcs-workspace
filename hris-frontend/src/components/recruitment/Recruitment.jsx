import { useState, useMemo } from "react";
import RecruitmentOverview from "./components/OverviewTab";
import JobOpeningsTab from "./components/JobOpeningTab";
import PipelineTab from "./components/PipelineTab";
import PipelineSettingsModal from "./components/PipelineModal";
import ApplicantsTab from "./components/ApplicantsTab";
import InterviewsTab from "./components/InterviewsTab";
import OffersTab from "./components/OffersTab";
import OnboardingTab from "./components/OnboardingTab";
import {
  JOB_OPENINGS_SEED, APPLICANTS_SEED, INTERVIEWS_SEED, OFFERS_SEED, ONBOARDING_SEED, DEFAULT_STAGES_SEED
} from "../../data/compData";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────


// ── HELPERS ───────────────────────────────────────────────────────────────────


// ── PIPELINE SETTINGS MODAL ───────────────────────────────────────────────────


// ── JOB OPENING DRAWER ────────────────────────────────────────────────────────


// ── APPLICANT DRAWER ──────────────────────────────────────────────────────────


// ── OVERVIEW TAB ──────────────────────────────────────────────────────────────


// ── JOB OPENINGS TAB ──────────────────────────────────────────────────────────


// ── PIPELINE / KANBAN TAB ─────────────────────────────────────────────────────


// ── APPLICANTS TAB ────────────────────────────────────────────────────────────


// ── INTERVIEWS TAB ────────────────────────────────────────────────────────────


// ── OFFERS TAB ────────────────────────────────────────────────────────────────


// ── ONBOARDING TAB ────────────────────────────────────────────────────────────


// ── RECRUITMENT PAGE ROOT ─────────────────────────────────────────────────────
export default function RecruitmentPage() {
  const [activeTab,      setActiveTab]      = useState("overview");
  const [jobs,           setJobs]           = useState(JOB_OPENINGS_SEED);
  const [applicants,     setApplicants]     = useState(APPLICANTS_SEED);
  const [interviews,     setInterviews]     = useState(INTERVIEWS_SEED);
  const [offers,         setOffers]         = useState(OFFERS_SEED);
  const [onboarding,     setOnboarding]     = useState(ONBOARDING_SEED);
  const [defaultStages,  setDefaultStages]  = useState(DEFAULT_STAGES_SEED);
  const [showPipeline,   setShowPipeline]   = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Job actions
  function addJob(form)        { setJobs(p=>[...p,{ id:"j"+Date.now(), ...form, filled:0, postedOn:"Mar 2, 2026", status:"Open" }]); }
  function editJob(id,form)    { setJobs(p=>p.map(j=>j.id===id?{...j,...form}:j)); }
  function toggleStatus(id)    { setJobs(p=>p.map(j=>j.id===id?{...j,status:j.status==="Open"?"Closed":"Open"}:j)); }

  // Applicant actions
  function updateApplicant(id,updates) { setApplicants(p=>p.map(a=>a.id===id?{...a,...updates}:a)); }
  function moveStage(id,stageId)       { setApplicants(p=>p.map(a=>a.id===id?{...a,stageId}:a)); }
  function moveApplicant(id,stageId)   { moveStage(id,stageId); }

  // Interview actions
  function addInterview(iv) { setInterviews(p=>[...p,{ id:"i"+Date.now(), ...iv }]); }

  const TABS = [
    { key:"overview",    label:"Overview"    },
    { key:"openings",    label:"Job Openings" },
    { key:"pipeline",    label:"Pipeline"    },
    { key:"applicants",  label:"Applicants"  },
    { key:"interviews",  label:"Interviews"  },
    { key:"offers",      label:"Offers"      },
    { key:"onboarding",  label:"Onboarding"  },
  ];

  const pendingInterviews = interviews.filter(i=>i.status==="Scheduled").length;
  const openRoles         = jobs.filter(j=>j.status==="Open").length;

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{backgroundColor:"#000"}}>
      {/* Page header */}
      <div className="px-8 pt-8 pb-0 flex-shrink-0">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-1" style={{fontFamily:"system-ui,sans-serif"}}>HR Management</p>
            <h1 className="text-3xl font-normal text-white" style={{letterSpacing:"-0.02em"}}>Recruitment</h1>
          </div>
          <div className="flex items-center gap-3">
            {openRoles>0&&(
              <div className="rounded-lg px-4 py-2 flex items-center gap-2" style={{backgroundColor:"#0a1a0a",border:"1px solid #1e3a1e"}}>
                <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:"#5af07a"}}/>
                <span className="text-xs text-gray-400" style={{fontFamily:"system-ui,sans-serif"}}>{openRoles} open role{openRoles!==1?"s":""}</span>
              </div>
            )}
            {pendingInterviews>0&&(
              <div className="rounded-lg px-4 py-2" style={{backgroundColor:"#0a1a2a",border:"1px solid #1e3a5a"}}>
                <span className="text-xs" style={{fontFamily:"system-ui,sans-serif",color:"#5a9af0"}}>📅 {pendingInterviews} interview{pendingInterviews!==1?"s":""} scheduled</span>
              </div>
            )}
            <button onClick={()=>setShowPipeline(true)}
              className="px-4 py-2 rounded text-xs hover:opacity-80"
              style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>
              ⚙ Pipeline Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1" style={{borderBottom:"1px solid #1a1a1a"}}>
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setActiveTab(t.key)}
              className="px-4 py-2.5 text-sm transition-all"
              style={{fontFamily:"system-ui,sans-serif",color:activeTab===t.key?"#fff":"#555",borderBottom:activeTab===t.key?"2px solid #fff":"2px solid transparent"}}>
              {t.label}
              {t.key==="interviews"&&pendingInterviews>0&&<span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{fontFamily:"monospace",backgroundColor:"#0a1a2a",color:"#5a9af0"}}>{pendingInterviews}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {activeTab==="overview"   && <RecruitmentOverview jobs={jobs} applicants={applicants} interviews={interviews}/>}
        {activeTab==="openings"   && <JobOpeningsTab jobs={jobs} applicants={applicants} defaultStages={defaultStages} onAddJob={addJob} onEditJob={editJob} onToggleStatus={toggleStatus}/>}
        {activeTab==="pipeline"   && <PipelineTab jobs={jobs} applicants={applicants} onMoveApplicant={moveApplicant} onSelectApplicant={setSelectedApplicant}/>}
        {activeTab==="applicants" && <ApplicantsTab jobs={jobs} applicants={applicants} interviews={interviews} offers={offers} onUpdateApplicant={updateApplicant} onMoveStage={moveStage} onAddInterview={addInterview}/>}
        {activeTab==="interviews" && <InterviewsTab interviews={interviews} jobs={jobs} applicants={applicants}/>}
        {activeTab==="offers"     && <OffersTab offers={offers} jobs={jobs} applicants={applicants}/>}
        {activeTab==="onboarding" && <OnboardingTab onboarding={onboarding} setOnboarding={setOnboarding} applicants={applicants} jobs={jobs}/>}
      </div>

      {/* Pipeline Settings Modal */}
      {showPipeline&&(
        <PipelineSettingsModal
          stages={defaultStages}
          onClose={()=>setShowPipeline(false)}
          onSave={stages=>{ setDefaultStages(stages); setShowPipeline(false); }}
        />
      )}

      {/* Applicant drawer from Pipeline tab */}
      {selectedApplicant&&(
        <ApplicantDrawer
          applicant={selectedApplicant}
          job={jobs.find(j=>j.id===selectedApplicant.jobId)}
          interviews={interviews}
          offers={offers}
          onClose={()=>setSelectedApplicant(null)}
          onUpdateApplicant={(id,updates)=>{ updateApplicant(id,updates); setSelectedApplicant(a=>({...a,...updates})); }}
          onAddInterview={addInterview}
          onMoveStage={(id,stageId)=>{ moveStage(id,stageId); setSelectedApplicant(a=>({...a,stageId})); }}
        />
      )}
    </div>
  );
}
