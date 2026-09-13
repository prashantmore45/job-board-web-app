import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core";
import {
  arrayMove,
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
      className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing mb-3 group"
    >
      <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
        {application.applicant ? application.applicant.name : "Unknown"}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-1">
        {application.applicant ? application.applicant.email : "N/A"}
      </p>
      
      <a 
        href={`${(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "")}/${application.resume.replace(/\\/g, "/")}`} 
        target="_blank" 
        rel="noopener noreferrer"
        onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking link
        className="block w-full py-1.5 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 text-primary-700 dark:text-primary-400 text-xs font-semibold text-center rounded transition-colors"
      >
        📄 View Resume
      </a>
    </div>
  );
}

function KanbanColumn({ id, title, applications }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl min-w-[280px] w-[280px] flex-shrink-0 flex flex-col max-h-[75vh]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase text-sm tracking-wider">{title}</h3>
        <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-full">
          {applications.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-1 pb-2 scrollbar-thin">
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
          <div className="h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
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
        // Map old 'accepted' status to 'offered' so the board doesn't break for old data
        const mappedData = res.data.map(app => 
          app.status === 'accepted' ? { ...app, status: 'offered' } : app
        );
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
      const activeItems = prev.filter(app => app.status === activeStatus);
      const overItems = prev.filter(app => app.status === overStatus);
      
      const activeIndex = prev.findIndex(app => app._id === activeId);
      const overIndex = prev.findIndex(app => app._id === overId);

      let newIndex;
      if (overId in COLUMNS.map(c => c.id)) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

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
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border-2 border-primary-500 opacity-90 rotate-2 w-[248px]">
                <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                  {activeApplication.applicant ? activeApplication.applicant.name : "Unknown"}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Dragging...
                </p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default ApplicationsList;