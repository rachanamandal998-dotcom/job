import { useState, useRef, useEffect } from "react";
import { Briefcase, FileText, Clock, CheckCircle, XCircle, Search, Plus, ChevronDown, Upload } from "lucide-react";
import { DashboardShell, Greeting, ActionCard, SectionPanel } from "../shared/DashboardShell";
import "./JobPortal.css";

export default function JobPortal() {
  const [showJobsMenu, setShowJobsMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);

  const jobCategories = ["Tech", "Design", "Marketing", "Sales", "Finance", "Remote"];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowJobsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowJobsMenu(false);
  };

  const handleBrowseAll = () => {
    setShowJobsMenu(false);
  };

  const handleImportLinkedIn = () => {
    setShowJobsMenu(false);
  };

  return (
    <DashboardShell>
      {/* Greeting Section - same pattern as ServiceListing */}
      <div className="jp-header-row">
        <Greeting 
          title="Manage your job applications" 
          subtitle="Hi, Rachana!" 
          verified 
        />
        
        <div className="jp-jobs-menu" ref={menuRef}>
      

          {showJobsMenu && (
            <div className="jp-dropdown">
              <button className="jp-dropdown-item" onClick={handleBrowseAll}>
                <Search size={16} />
                Browse All Jobs
              </button>
              <button className="jp-dropdown-item" onClick={handleImportLinkedIn}>
                <Upload size={16} />
                Import from LinkedIn
              </button>
              <div className="jp-dropdown-divider" />
              <div className="jp-dropdown-label">Quick Categories</div>
              {jobCategories.map(cat => (
                <button
                  key={cat}
                  className="jp-dropdown-item"
                  onClick={() => handleCategorySelect(cat)}
                >
                  <Briefcase size={16} />
                  {cat} Jobs
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="actions-grid">
        <ActionCard
          icon={FileText}
          label="Applied"
          sub="Total applications"
          badge="0"
          primary
        />
        <ActionCard
          icon={Clock}
          label="Pending"
          sub="Under review"
          badge="0"
        />
        <ActionCard
          icon={CheckCircle}
          label="Shortlisted"
          sub="Moving forward"
          badge="0"
        />
        <ActionCard
          icon={XCircle}
          label="Rejected"
          sub="Better luck next time"
          badge="0"
        />
      </section>

      <div className="jp-search-row">
        <div className="jp-search">
          <Search size={16} />
          <input
            placeholder="Search jobs by title, company, location…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="jp-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option>All categories</option>
          <option>Tech</option>
          <option>Design</option>
          <option>Marketing</option>
          <option>Sales</option>
          <option>Finance</option>
          <option>Remote</option>
        </select>
      </div>

      <SectionPanel
        title="My Applications"
        description="Latest job applications and their status."
        emptyIcon={Briefcase}
        emptyTitle="No applications yet"
        emptyHint="Click 'Find Jobs' above to browse jobs and apply — your applications will appear here."
      />
      <div className="btn">
          <button
            className="brand-button"
            onClick={() => setShowJobsMenu(!showJobsMenu)}
          >
            <Plus size={18} />
            Find Jobs
            <ChevronDown
              size={16}
              className={`jp-chevron ${showJobsMenu ? 'open' : ''}`}
            />
          </button>
          </div>
    </DashboardShell>
  );
}