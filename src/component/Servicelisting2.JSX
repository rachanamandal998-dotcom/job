import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Chart from "chart.js/auto";

import {
  Plus,
  Eye,
  Calendar,
  Store,
  Wrench,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
} from "lucide-react";

import {
  DashboardShell,
  Greeting,
  SectionPanel,
} from "../shared/DashboardShell";

import { ListingFormModal } from "../shared/ListingFormModal";

import "./ServiceListing2.css";

/* ─────────────────────────────
   Circle Card
───────────────────────────── */
function CircleCard3D({
  icon: Icon,
  label,
  sub,
  badge,
  primary,
  onClick,
}) {
  return (
    <div className="circ-card" onClick={onClick}>
      <div className={`circ-outer ${primary ? "circ-outer--primary" : ""}`}>
        <div className={`circ-inner ${primary ? "circ-inner--primary" : ""}`}>
          <Icon size={24} className="circ-icon" />

          <div className="circ-inner-label">{label}</div>

          <div className="circ-inner-sub">{sub}</div>

          {badge !== undefined && (
            <span className="circ-badge">{badge}</span>
          )}
        </div>

        {primary && <div className="circ-dot">★</div>}
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Booking Stats
───────────────────────────── */
function BookingStats({ stats }) {
  const total =
    Object.values(stats).reduce((a, b) => a + b, 0) || 1;

  const colors = {
    Pending: "#fbbf24",
    Confirmed: "#3b82f6",
    Completed: "#22c55e",
    Cancelled: "#ef4444",
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
    <div className="sl-stats-wrap">
      <div className="sl-stats-header">
        <h3 className="sl-stats-title">
          Booking Overview
        </h3>

        <span className="sl-stats-total">
          {Object.values(stats).reduce((a, b) => a + b, 0)} Total
        </span>
      </div>

      <div className="sl-stats-body">
        <div className="sl-donut">
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
                className="sl-donut-segment"
                transform="rotate(-90 60 60)"
              />
            ))}
          </svg>

          <div className="sl-donut-center">
            <div className="sl-donut-number">
              {Object.values(stats).reduce((a, b) => a + b, 0)}
            </div>

            <div className="sl-donut-label">
              Bookings
            </div>
          </div>
        </div>

        <div className="sl-stats-bars">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="sl-stat-row">
              <div className="sl-stat-row-top">
                <div
                  className="sl-stat-dot"
                  style={{ background: colors[key] }}
                />

                <span className="sl-stat-name">
                  {key}
                </span>

                <span className="sl-stat-value">
                  {value}
                </span>
              </div>

              <div className="sl-stat-bar-bg">
                <div
                  className="sl-stat-bar"
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

/* ─────────────────────────────
   Quick Stats
───────────────────────────── */
function QuickStats({ services, bookings }) {
  const completed = bookings.filter(
    (b) => b.status === "completed"
  ).length;

  const completionRate =
    bookings.length > 0
      ? Math.round((completed / bookings.length) * 100)
      : 0;

  const ratings = services
    .filter((s) => s.rating)
    .map((s) => s.rating);

  const avgRating =
    ratings.length > 0
      ? (
          ratings.reduce((a, b) => a + b, 0) /
          ratings.length
        ).toFixed(1)
      : "—";

  const cards = [
    {
      icon: Calendar,
      label: "Total bookings",
      value: bookings.length,
    },
    {
      icon: Wrench,
      label: "Active services",
      value: services.length,
    },
    {
      icon: Star,
      label: "Avg. rating",
      value: avgRating,
    },
    {
      icon: TrendingUp,
      label: "Completion rate",
      value: `${completionRate}%`,
    },
  ];

  return (
    <div className="quick-stats">
      {cards.map((c) => (
        <div key={c.label} className="qs-card">
          <div className="qs-icon">
            <c.icon size={18} />
          </div>

          <div className="qs-val">
            {c.value}
          </div>

          <div className="qs-label">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────
   Charts Section
───────────────────────────── */
function ChartsSection({ bookings, services }) {
  const lineRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);

  const lineInstance = useRef(null);
  const pieInstance = useRef(null);
  const barInstance = useRef(null);

  useEffect(() => {
    buildCharts();

    return () => {
      if (lineInstance.current)
        lineInstance.current.destroy();

      if (pieInstance.current)
        pieInstance.current.destroy();

      if (barInstance.current)
        barInstance.current.destroy();
    };
  }, [bookings, services]);

  function buildCharts() {
    const orange = "rgb(249,115,22)";
    const orangeAlpha = "rgba(249,115,22,0.12)";
    const grid = "#fff7ed";
    const tick = "#94a3b8";

    /* LINE CHART */

    const days = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];

    const lineData =
      bookings.length > 0
        ? [1, 3, 2, 5, 4, 6, 7]
        : [0, 0, 0, 0, 0, 0, 0];

    if (lineInstance.current) {
      lineInstance.current.destroy();
    }

    lineInstance.current = new Chart(lineRef.current, {
      type: "line",

      data: {
        labels: days,

        datasets: [
          {
            label: "Bookings",

            data: lineData,

            borderColor: orange,

            backgroundColor: orangeAlpha,

            borderWidth: 2,

            fill: true,

            tension: 0.4,

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

    const statCounts = [
      bookings.filter((b) => b.status === "pending")
        .length,

      bookings.filter((b) => b.status === "confirmed")
        .length,

      bookings.filter((b) => b.status === "completed")
        .length,

      bookings.filter((b) => b.status === "cancelled")
        .length,
    ];

    if (pieInstance.current) {
      pieInstance.current.destroy();
    }

    pieInstance.current = new Chart(pieRef.current, {
      type: "doughnut",

      data: {
        labels: [
          "Pending",
          "Confirmed",
          "Completed",
          "Cancelled",
        ],

        datasets: [
          {
            data: statCounts,

            backgroundColor: [
              "#fbbf24",
              "#3b82f6",
              "#22c55e",
              "#ef4444",
            ],

            borderWidth: 2,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,
      },
    });

    /* BAR CHART */

    const svcLabels =
      services.length > 0
        ? services.map((s) => s.name)
        : [
            "Service A",
            "Service B",
            "Service C",
          ];

    const svcData =
      services.length > 0
        ? services.map((s) => s.revenue || 0)
        : [10, 20, 30];

    if (barInstance.current) {
      barInstance.current.destroy();
    }

    barInstance.current = new Chart(barRef.current, {
      type: "bar",

      data: {
        labels: svcLabels,

        datasets: [
          {
            label: "Revenue",

            data: svcData,

            backgroundColor: [
              "rgba(249,115,22,0.75)",
              "rgba(249,115,22,0.55)",
              "rgba(249,115,22,0.35)",
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
            ticks: {
              color: tick,
            },
          },

          y: {
            beginAtZero: true,

            ticks: {
              color: tick,
            },
          },
        },
      },
    });
  }

  return (
    <div className="sl-charts-grid">
      <div className="sl-chart-card">
        <h3>Weekly Booking Trend</h3>

        <div
          style={{
            height: "300px",
            position: "relative",
          }}
        >
          <canvas ref={lineRef}></canvas>
        </div>
      </div>

      <div className="sl-chart-card">
        <h3>Status Breakdown</h3>

        <div
          style={{
            height: "300px",
            position: "relative",
          }}
        >
          <canvas ref={pieRef}></canvas>
        </div>
      </div>

      <div className="sl-chart-card">
        <h3>Revenue By Service</h3>

        <div
          style={{
            height: "300px",
            position: "relative",
          }}
        >
          <canvas ref={barRef}></canvas>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────
   MAIN PAGE
───────────────────────────── */
function ServiceListing2() {
  const [formOpen, setFormOpen] = useState(false);

  const [bookingStats] = useState({
    Pending: 4,
    Confirmed: 3,
    Completed: 6,
    Cancelled: 1,
  });

  const [services] = useState([
    {
      name: "House Cleaning",
      price: 120,
      description: "Professional home cleaning service",
      bookings: 12,
      rating: 4.8,
      revenue: 400,
    },

    {
      name: "Plumbing",
      price: 90,
      description: "Expert plumbing repairs",
      bookings: 8,
      rating: 4.6,
      revenue: 250,
    },

    {
      name: "Electrical Repair",
      price: 150,
      description: "Electrical maintenance and repair",
      bookings: 10,
      rating: 4.9,
      revenue: 500,
    },
  ]);

  const [bookings] = useState([
    {
      serviceName: "House Cleaning",
      customer: "John",
      date: "May 10",
      status: "pending",
    },

    {
      serviceName: "Plumbing",
      customer: "Sarah",
      date: "May 11",
      status: "confirmed",
    },

    {
      serviceName: "Electrical Repair",
      customer: "Mike",
      date: "May 12",
      status: "completed",
    },
  ]);

  return (
    <DashboardShell>
      <Greeting
        title="Manage your service listings"
        subtitle="Hi, Rachana!"
        verified
      />

      <section className="actions-grid">
        <CircleCard3D
          icon={Plus}
          label="Add Service"
          sub="Create listing"
          primary
          onClick={() => setFormOpen(true)}
        />

        <CircleCard3D
          icon={Eye}
          label="View Services"
          sub="Manage all"
          badge={services.length}
        />

        <CircleCard3D
          icon={Calendar}
          label="Track Bookings"
          sub="Updates"
          badge={bookings.length}
        />

        <CircleCard3D
          icon={Store}
          label="Open Store"
          sub="Showcase"
        />
      </section>

      <BookingStats stats={bookingStats} />

      <QuickStats
        services={services}
        bookings={bookings}
      />

      <ChartsSection
        bookings={bookings}
        services={services}
      />

      <SectionPanel
        title="My Bookings"
        description="Latest bookings — manage and confirm them here."
        emptyIcon={ClipboardList}
        emptyTitle="No bookings found"
        emptyHint="New bookings will appear here."
      >
        <div className="sl-booking-list">
          {bookings.map((b, i) => (
            <div
              key={i}
              className="sl-booking-item"
            >
              <div className="sl-booking-left">
                <div className="sl-booking-service">
                  {b.serviceName}
                </div>

                <div className="sl-booking-meta">
                  {b.customer} • {b.date}
                </div>
              </div>

              <div
                className={`sl-booking-status sl-status-${b.status}`}
              >
                {b.status === "pending" && (
                  <Clock size={14} />
                )}

                {b.status === "confirmed" && (
                  <CheckCircle size={14} />
                )}

                {b.status === "completed" && (
                  <CheckCircle size={14} />
                )}

                {b.status === "cancelled" && (
                  <XCircle size={14} />
                )}

                {b.status}
              </div>
            </div>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel
        title="My Services"
        description="Manage your services with a polished view."
        emptyIcon={Wrench}
        emptyTitle="No services found"
        emptyHint="Start by adding your first service."
        cta={
          <button
            onClick={() => setFormOpen(true)}
            className="brand-button"
          >
            <Plus size={16} />
            Add Service
          </button>
        }
      >
        <div className="sl-service-grid">
          {services.map((s, i) => (
            <div
              key={i}
              className="sl-service-card"
            >
              <div className="sl-service-top">
                <div className="sl-service-name">
                  {s.name}
                </div>

                <div className="sl-service-price">
                  ${s.price}
                </div>
              </div>

              <div className="sl-service-desc">
                {s.description}
              </div>

              <div className="sl-service-meta">
                {s.bookings} bookings • {s.rating}★
              </div>
            </div>
          ))}
        </div>
      </SectionPanel>

      <AnimatePresence>
        {formOpen && (
          <ListingFormModal
            kind="service"
            onClose={() => setFormOpen(false)}
          />
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}

export default ServiceListing2;