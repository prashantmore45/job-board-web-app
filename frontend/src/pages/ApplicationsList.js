import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const COLUMNS = [
  { id: "applied", title: "Applied" },
  { id: "screening", title: "Screening" },
  { id: "interviewing", title: "Interviewing" },
  { id: "offered", title: "Offered" },
  { id: "rejected", title: "Rejected" },
];

function SortableItem({ id, application }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="glass-card p-4 rounded-xl cursor-grab active:cursor-grabbing mb-3 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
      
      <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 relative z-10 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {application.applicant ? application.applicant.name : "Unknown"}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-1 font-medium relative z-10">
        {application.applicant ? application.applicant.email : "N/A"}
      </p>
      
      <div className="flex gap-2 relative z-10">
        <button 
          onPointerDown={(e) => { e.stopPropagation(); document.dispatchEvent(new CustomEvent('openProfile', { detail: application.applicant })); }}
          className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold text-center rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
        >
          👤 Profile
        </button>
        {application.resume && (
          <a 
            href={`${(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "")}/${application.resume.replace(/\\/g, "/")}`} 
            target="_blank" 
            rel="noopener noreferrer"
            onPointerDown={(e) => e.stopPropagation()} 
            className="flex-1 py-1.5 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-400 text-xs font-bold text-center rounded-lg transition-colors border border-primary-200 dark:border-primary-800"
          >
            📄 Resume
          </a>
        )}
      </div>
    </div>
  );
}

function KanbanColumn({ id, title, applications }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef}
      className="glass-panel p-4 rounded-2xl min-w-[300px] w-[300px] flex-shrink-0 flex flex-col max-h-[75vh]"
    >
      <div className="flex justify-between items-center mb-5 border-b border-slate-200/50 dark:border-slate-700/50 pb-3">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-widest">{title}</h3>
        <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full shadow-inner">
          {applications.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 pb-2 custom-scrollbar">
        <SortableContext 
          id={id}
          items={applications.map(app => app._id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => (
            <SortableItem key={app._id} id={app._id} application={app} />
          ))}
        </SortableContext>
        {applications.length === 0 && (
          <div className="h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm font-medium bg-slate-50/50 dark:bg-slate-800/30">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationsList() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const handleOpenProfile = (e) => setSelectedCandidate(e.detail);
    document.addEventListener('openProfile', handleOpenProfile);
    return () => document.removeEventListener('openProfile', handleOpenProfile);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag distance before firing
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get(`/application/${jobId}`);
        // Map old 'accepted' status to 'offered' and 'pending' to 'applied' so the board doesn't break for old data
        const mappedData = res.data.map(app => {
          let newStatus = app.status;
          if (newStatus === 'accepted') newStatus = 'offered';
          if (newStatus === 'pending') newStatus = 'applied';
          return { ...app, status: newStatus };
        });
        console.log("Fetched applications:", res.data);
        console.log("Mapped applications:", mappedData);
        setApplications(mappedData);
      } catch (error) {
        alert("Failed to fetch applications.");
      }
    };
    fetchApplications();
  }, [jobId]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find the containers
    const activeApp = applications.find(app => app._id === activeId);
    const overApp = applications.find(app => app._id === overId);
    
    const activeStatus = activeApp?.status;
    const overStatus = overApp ? overApp.status : over.id; // over.id is the column id if empty

    if (!activeStatus || !overStatus || activeStatus === overStatus) return;

    setApplications((prev) => {
      const activeIndex = prev.findIndex(app => app._id === activeId);

      const newItems = [...prev];
      newItems[activeIndex] = { ...newItems[activeIndex], status: overStatus };
      
      // We don't reorder within columns strictly since order isn't saved to DB, 
      // but we update the status optimistically.
      return newItems;
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const activeApp = applications.find(app => app._id === activeId);
    if (!activeApp) return;

    // Find what status we dropped into
    const overApp = applications.find(app => app._id === over.id);
    const newStatus = overApp ? overApp.status : over.id;
    
    // Save to DB
    try {
      await API.put(`/application/${activeId}/status`, { status: newStatus });
    } catch (error) {
      alert("Failed to update status");
      // Could revert optimistic update here
    }
  };

  const getApplicationsByStatus = (status) => {
    return applications.filter((app) => app.status === status);
  };

  const activeApplication = activeId ? applications.find(app => app._id === activeId) : null;

  return (
    <div className="max-w-[1400px] mx-auto py-8 overflow-hidden h-[90vh] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button 
            onClick={() => navigate("/employer-dashboard")} 
            className="mb-2 flex items-center text-slate-600 dark:text-slate-400 hover:text-primary-600 transition text-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Applicant Tracking</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Drag and drop candidates to update their status.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full items-start w-max px-2 py-4">
            {COLUMNS.map((col) => (
              <KanbanColumn 
                key={col.id} 
                id={col.id} 
                title={col.title} 
                applications={getApplicationsByStatus(col.id)} 
              />
            ))}
          </div>

          <DragOverlay>
            {activeApplication ? (
              <div className="glass-card p-4 rounded-xl shadow-2xl border border-primary-400 dark:border-primary-500 opacity-95 rotate-3 w-[268px] scale-105">
                <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                  {activeApplication.applicant ? activeApplication.applicant.name : "Unknown"}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Dragging...
                </p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      
      {/* Candidate Profile Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedCandidate(null)}>
          <div className="glass-panel shadow-2xl max-w-lg w-full p-8 rounded-3xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/20 dark:bg-primary-600/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
            
            <button 
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors z-20"
            >
              ✖
            </button>
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{selectedCandidate.name}</h2>
              <a href={`mailto:${selectedCandidate.email}`} className="text-primary-600 dark:text-primary-400 hover:underline font-medium">{selectedCandidate.email}</a>
              
              <div className="mt-8 space-y-6 text-sm text-slate-700 dark:text-slate-300">
                <div>
                  <span className="font-extrabold block mb-2 uppercase text-xs tracking-wider text-slate-500 dark:text-slate-400">Skills</span>
                  {selectedCandidate.skills && selectedCandidate.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-bold rounded-lg border border-primary-100 dark:border-primary-800/50">{skill}</span>
                      ))}
                    </div>
                  ) : <span className="text-slate-400 italic font-medium">Not provided</span>}
                </div>
                
                <div>
                  <span className="font-extrabold block mb-2 uppercase text-xs tracking-wider text-slate-500 dark:text-slate-400">Experience</span>
                  <p className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">{selectedCandidate.experience || <span className="text-slate-400 italic">Not provided</span>}</p>
                </div>

                <div>
                  <span className="font-extrabold block mb-2 uppercase text-xs tracking-wider text-slate-500 dark:text-slate-400">Bio</span>
                  <p className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">{selectedCandidate.bio || <span className="text-slate-400 italic">Not provided</span>}</p>
                </div>

                {selectedCandidate.portfolioUrl && (
                  <div>
                    <span className="font-extrabold block mb-2 uppercase text-xs tracking-wider text-slate-500 dark:text-slate-400">Portfolio</span>
                    <a href={selectedCandidate.portfolioUrl} target="_blank" rel="noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline font-medium break-all">
                      {selectedCandidate.portfolioUrl}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50 flex justify-end">
                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationsList;