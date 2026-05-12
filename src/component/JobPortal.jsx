import { useState, useRef, useEffect } from "react";
import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  Eye,
  Search,
  Plus,
  ChevronDown,
  Upload,
} from "lucide-react";

import {
  DashboardShell,
  Greeting,
  SectionPanel,
} from "../shared/DashboardShell";

import "./JobPortal.css";

/* ─────────────────────────────────────────────
   Clean Circle Card
───────────────────────────────────────────── */
function CircleCard3D({
  icon: Icon,
  label,
  sub,
  badge,
  primary,
}) {
  return (
    <div className="circ-card">
      <div
        className={`circ-outer ${
          primary ? "circ-outer--primary" : ""
        }`}
      >
        <div
          className={`circ-inner ${
            primary ? "circ-inner--primary" : ""
          }`}
        >
          {/* icon */}
          <Icon size={24} className="circ-icon" />

          {/* label */}
          <div className="circ-inner-label">
            {label}
          </div>

          {/* sub */}
          <div className="circ-inner-sub">
            {sub}
          </div>

          {/* badge */}
          <span className="circ-badge">
            {badge}
          </span>
        </div>

        {/* star */}
        {primary && (
          <div className="circ-dot">
            ★
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function JobPortal() {
  const [showJobsMenu, setShowJobsMenu] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState("All categories");

  const [searchQuery, setSearchQuery] =
    useState("");

  const menuRef = useRef(null);

  const jobCategories = [
    "Tech",
    "Design",
    "Marketing",
    "Sales",
    "Finance",
    "Remote",
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowJobsMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setShowJobsMenu(false);
  };

  return (
    <DashboardShell>

      {/* HEADER */}
      <div className="jp-header-row">
        <Greeting
          title="Manage your job applications"
          subtitle="Hi, Rachana!"
          verified
        />

        <div
          className="jp-jobs-menu"
          ref={menuRef}
        >
          {showJobsMenu && (
            <div className="jp-dropdown">

              <button
                className="jp-dropdown-item"
              >
                <Search size={16} />
                Browse All Jobs
              </button>

              <button
                className="jp-dropdown-item"
              >
                <Upload size={16} />
                Import from LinkedIn
              </button>

              <div className="jp-dropdown-divider" />

              <div className="jp-dropdown-label">
                Quick Categories
              </div>

              {jobCategories.map((cat) => (
                <button
                  key={cat}
                  className="jp-dropdown-item"
                  onClick={() =>
                    handleCategorySelect(cat)
                  }
                >
                  <Briefcase size={16} />
                  {cat} Jobs
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CIRCLES */}
      <section className="actions-grid">

        <CircleCard3D
          icon={FileText}
          label="Find Jobs"
          sub="Applications"
          badge="0"
          primary
        />

        <CircleCard3D
          icon={Clock}
          label="Edit Profile"
          sub="Under Review"
          badge="0"
        />

        <CircleCard3D
          icon={CheckCircle}
          label="Edit CV"
          sub="Approved"
          badge="0"
        />

        <CircleCard3D
          icon={Eye}
          label="View CV"
          sub="Preview"
          badge="0"
        />

      </section>

      {/* SEARCH */}
      <div className="jp-search-row">

        <div className="jp-search">
          <Search size={16} />

          <input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>

        <select
          className="jp-filter"
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value
            )
          }
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

      {/* PANEL */}
      <SectionPanel
        title="My Applications"
        description="Latest applications"
        emptyIcon={Briefcase}
        emptyTitle="No applications yet"
        emptyHint="Apply for jobs to see applications here."
      />

      {/* BUTTON */}
      <div className="btn">
        <button
          className="brand-button"
          onClick={() =>
            setShowJobsMenu(!showJobsMenu)
          }
        >
          <Plus size={18} />

          Find Jobs

          <ChevronDown
            size={16}
            className={`jp-chevron ${
              showJobsMenu ? "open" : ""
            }`}
          />
        </button>
      </div>

    </DashboardShell>
  );
}