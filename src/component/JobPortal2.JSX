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
  TrendingUp,
  BarChart3,
  Activity,
} from "lucide-react";

import Chart from "chart.js/auto";

import {
  DashboardShell,
  Greeting,
  SectionPanel,
} from "../shared/DashboardShell";

import "./JobPortal2.css";

/* ─────────────────────────────────────────────
   Clean Circle Card
───────────────────────────────────────────── */
function CircleCard3D({ icon: Icon, label, sub, badge, primary }) {
  return (
    <div className="circ-card">
      <div className={`circ-outer ${primary ? "circ-outer--primary" : ""}`}>
        <div className={`circ-inner ${primary ? "circ-inner--primary" : ""}`}>
          <Icon size={24} className="circ-icon" />
          <div className="circ-inner-label">{label}</div>
          <div className="circ-inner-sub">{sub}</div>
          <span className="circ-badge">{badge}</span>
        </div>
        {primary && <div className="circ-dot">★</div>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stats Graph Section
───────────────────────────────────────────── */
function ApplicationStats({ stats }) {
  const total = Object.values(stats).reduce((a, b) => a + b, 0) || 1;

  const colors = {
    Applied: "#f97316",
    Pending: "#fbbf24",
    Shortlisted: "#22c55e",
    Rejected: "#ef4444",
  };

  let offset = 0;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  const segments = Object.entries(stats).map(([key, value]) => {
    const percent = value / total;
    const dash = percent * circumference;

    const segment = {
      key,
      value,
      color: colors[key],
      dasharray: `${dash} ${circumference - dash}`,
      offset: -offset,
    };

    offset += dash;
    return segment;
  });

  return (
    <div className="jp-stats-wrap">
      <div className="jp-stats-header">
        <h3 className="jp-stats-title">Application Overview</h3>

        <span className="jp-stats-total">
          {Object.values(stats).reduce((a, b) => a + b, 0)} Total
        </span>
      </div>

      <div className="jp-stats-body">
        <div className="jp-donut">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#fff7ed"
              strokeWidth="12"
            />

            {segments.map((s) => (
              <circle
                key={s.key}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth="12"
                strokeDasharray={s.dasharray}
                strokeDashoffset={s.offset}
                strokeLinecap="round"
                className="jp-donut-segment"
                transform="rotate(-90 60 60)"
              />
            ))}
          </svg>

          <div className="jp-donut-center">
            <div className="jp-donut-number">
              {Object.values(stats).reduce((a, b) => a + b, 0)}
            </div>

            <div className="jp-donut-label">Apps</div>
          </div>
        </div>

        <div className="jp-stats-bars">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="jp-stat-row">
              <div className="jp-stat-row-top">
                <div
                  className="jp-stat-dot"
                  style={{ background: colors[key] }}
                />

                <span className="jp-stat-name">{key}</span>

                <span className="jp-stat-value">{value}</span>
              </div>

              <div className="jp-stat-bar-bg">
                <div
                  className="jp-stat-bar"
                  style={{
                    width: `${(value / total) * 100}%`,
                    background: colors[key],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NEW QUICK STATS
───────────────────────────────────────────── */
function QuickStats({ stats }) {
  const cards = [
    {
      icon: Briefcase,
      label: "Applications",
      value: stats.Applied,
    },
    {
      icon: Clock,
      label: "Pending",
      value: stats.Pending,
    },
    {
      icon: CheckCircle,
      label: "Shortlisted",
      value: stats.Shortlisted,
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value:
        stats.Applied > 0
          ? `${Math.round(
            (stats.Shortlisted / stats.Applied) * 100
          )}%`
          : "0%",
    },
  ];

  return (
    <div className="quick-stats">
      {cards.map((c) => (
        <div key={c.label} className="qs-card">
          <div className="qs-icon">
            <c.icon size={18} />
          </div>

          <div className="qs-val">{c.value}</div>

          <div className="qs-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   NEW CHART SECTION
───────────────────────────────────────────── */
function ChartsSection({ stats }) {
  const lineRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);

  const lineChart = useRef(null);
  const pieChart = useRef(null);
  const barChart = useRef(null);

  useEffect(() => {
    buildCharts();

    return () => {
      if (lineChart.current) lineChart.current.destroy();
      if (pieChart.current) pieChart.current.destroy();
      if (barChart.current) barChart.current.destroy();
    };
  }, [stats]);

  function buildCharts() {
    const orange = "rgb(249,115,22)";
    const orangeLight = "rgba(249,115,22,0.12)";
    const grid = "#fff7ed";
    const tick = "#94a3b8";

    /* LINE CHART */
    if (lineChart.current) lineChart.current.destroy();

    lineChart.current = new Chart(lineRef.current, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Applications",
            data: [1, 3, 2, 5, 4, 6, 3],
            borderColor: orange,
            backgroundColor: orangeLight,
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },

        scales: {
          x: {
            grid: {
              color: grid,
            },

            ticks: {
              color: tick,
            },
          },

          y: {
            beginAtZero: true,

            grid: {
              color: grid,
            },

            ticks: {
              color: tick,
            },
          },
        },
      },
    });

    /* PIE CHART */
    if (pieChart.current) pieChart.current.destroy();

    pieChart.current = new Chart(pieRef.current, {
      type: "doughnut",
      data: {
        labels: ["Applied", "Pending", "Shortlisted", "Rejected"],

        datasets: [
          {
            data: [
              stats.Applied || 1,
              stats.Pending || 1,
              stats.Shortlisted || 1,
              stats.Rejected || 1,
            ],

            backgroundColor: [
              "#f97316",
              "#fbbf24",
              "#22c55e",
              "#ef4444",
            ],

            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },

        cutout: "60%",
      },
    });

    /* BAR CHART */
    if (barChart.current) barChart.current.destroy();

    barChart.current = new Chart(barRef.current, {
      type: "bar",

      data: {
        labels: ["Tech", "Design", "Marketing", "Finance"],

        datasets: [
          {
            label: "Jobs",
            data: [12, 8, 5, 7],

            backgroundColor: [
              "rgba(249,115,22,0.8)",
              "rgba(249,115,22,0.6)",
              "rgba(249,115,22,0.4)",
              "rgba(249,115,22,0.2)",
            ],

            borderRadius: 6,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },

        scales: {
          x: {
            grid: {
              display: false,
            },

            ticks: {
              color: tick,
            },
          },

          y: {
            beginAtZero: true,

            grid: {
              color: grid,
            },

            ticks: {
              color: tick,
            },
          },
        },
      },
    });
  }

  return (
    <div className="jp-charts-grid">
      {/* LINE */}
      <div className="jp-chart-card">
        <div className="jp-chart-card-title">
          Weekly Application Trend
        </div>

        <div className="jp-chart-card-sub">
          Applications over the last 7 days
        </div>

        <div className="jp-chart-wrap">
          <canvas ref={lineRef}></canvas>
        </div>
      </div>

      {/* PIE */}
      <div className="jp-chart-card">
        <div className="jp-chart-card-title">
          Application Status
        </div>

        <div className="jp-chart-card-sub">
          Current application breakdown
        </div>

        <div className="jp-chart-wrap">
          <canvas ref={pieRef}></canvas>
        </div>
      </div>

      {/* BAR */}
      <div className="jp-chart-card">
        <div className="jp-chart-card-title">
          Popular Categories
        </div>

        <div className="jp-chart-card-sub">
          Most applied job categories
        </div>

        <div className="jp-chart-wrap">
          <canvas ref={barRef}></canvas>
        </div>
      </div>

      {/* ACTIVITY */}
      <div className="jp-chart-card">
        <div className="jp-chart-card-title">
          Activity Feed
        </div>

        <div className="jp-chart-card-sub">
          Latest updates
        </div>

        <div className="jp-activity-feed">
          <div className="jp-af-item">
            <div className="jp-af-dot orange"></div>

            <div>
              <div className="jp-af-text">
                Dashboard opened
              </div>

              <div className="jp-af-time">
                Just now
              </div>
            </div>
          </div>

          <div className="jp-af-item">
            <div className="jp-af-dot blue"></div>

            <div>
              <div className="jp-af-text">
                Resume updated successfully
              </div>

              <div className="jp-af-time">
                Today
              </div>
            </div>
          </div>

          <div className="jp-af-item">
            <div className="jp-af-dot green"></div>

            <div>
              <div className="jp-af-text">
                New jobs available in Tech
              </div>

              <div className="jp-af-time">
                2 hours ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function JobPortal2() {
  const [showJobsMenu, setShowJobsMenu] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState("All categories");

  const [searchQuery, setSearchQuery] = useState("");

  const [stats, setStats] = useState({
    Applied: 12,
    Pending: 4,
    Shortlisted: 5,
    Rejected: 3,
  });

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

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
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

        <div className="jp-jobs-menu" ref={menuRef}>
          {showJobsMenu && (
            <div className="jp-dropdown">
              <button className="jp-dropdown-item">
                <Search size={16} />
                Browse All Jobs
              </button>

              <button className="jp-dropdown-item">
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

      {/* CIRCLES */}
      <section className="actions-grid">
        <CircleCard3D
          icon={FileText}
          label="Find Jobs"
          sub="Applications"
          badge="12"
          primary
        />

        <CircleCard3D
          icon={Clock}
          label="Pending"
          sub="Under Review"
          badge="4"
        />

        <CircleCard3D
          icon={CheckCircle}
          label="Shortlisted"
          sub="Approved"
          badge="5"
        />

        <CircleCard3D
          icon={Eye}
          label="View CV"
          sub="Preview"
          badge="1"
        />
      </section>

      {/* DONUT GRAPH */}
      <ApplicationStats stats={stats} />

      {/* QUICK STATS */}
      <QuickStats stats={stats} />

      {/* CHARTS */}
      <ChartsSection stats={stats} />

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
            setSelectedCategory(e.target.value)
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
      <div className="jp-jobs-menu" ref={menuRef}>

        <button
          className="brand-button"
          onClick={() => setShowJobsMenu(!showJobsMenu)}
        >
          <Plus size={18} />
          Find Jobs
          <ChevronDown size={16} className={`jp-chevron ${showJobsMenu ? "open" : ""}`} />
        </button>

        {showJobsMenu && (
          <div className="jp-dropdown">
            ...
          </div>
        )}

      </div>
    </DashboardShell>
  );
}