import { useState } from "react";
import { AnimatePresence } from "framer-motion";
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
} from "lucide-react";

import {
  DashboardShell,
  Greeting,
  SectionPanel,
} from "../shared/DashboardShell";

import { ListingFormModal } from "../shared/ListingFormModal";
import "./ServiceListing.css";

/* ─────────────────────────────
   Circle Card
───────────────────────────── */
function CircleCard3D({ icon: Icon, label, sub, badge, primary, onClick }) {
  return (
    <div className="circ-card" onClick={onClick}>
      <div className={`circ-outer ${primary? "circ-outer--primary" : ""}`}>
        <div className={`circ-inner ${primary? "circ-inner--primary" : ""}`}>
          <Icon size={24} className="circ-icon" />
          <div className="circ-inner-label">{label}</div>
          <div className="circ-inner-sub">{sub}</div>
          {badge!== undefined && <span className="circ-badge">{badge}</span>}
        </div>
        {primary && <div className="circ-dot">★</div>}
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Booking Stats Graph
───────────────────────────── */
function BookingStats({ stats }) {
  const total = Object.values(stats).reduce((a, b) => a + b, 0) || 1;
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
        <h3 className="sl-stats-title">Booking Overview</h3>
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
            <div className="sl-donut-label">Bookings</div>
          </div>
        </div>

        <div className="sl-stats-bars">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="sl-stat-row">
              <div className="sl-stat-row-top">
                <div className="sl-stat-dot" style={{ background: colors[key] }} />
                <span className="sl-stat-name">{key}</span>
                <span className="sl-stat-value">{value}</span>
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
   Page
───────────────────────────── */
export default function ServiceListing() {
  const [formOpen, setFormOpen] = useState(false);
  const [bookingStats, setBookingStats] = useState({
    Pending: 0,
    Confirmed: 0,
    Completed: 0,
    Cancelled: 0,
  });
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);

  return (
    <DashboardShell>
      <Greeting
        title="Manage your service listings"
        subtitle="Hi, Rachana!"
        verified
      />

      {/* CIRCLES */}
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

        <CircleCard3D icon={Store} label="Open Store" sub="Showcase" />
      </section>

      {/* GRAPH SECTION */}
      <BookingStats stats={bookingStats} />

      {/* PANEL */}
      <SectionPanel
        title="My Bookings"
        description="Latest bookings — manage and confirm them here."
        emptyIcon={ClipboardList}
        emptyTitle="No bookings found"
        emptyHint="New bookings will appear here."
      >
        {bookings.length > 0 && (
          <div className="sl-booking-list">
            {bookings.slice(0, 3).map((b, i) => (
              <div key={i} className="sl-booking-item">
                <div className="sl-booking-left">
                  <div className="sl-booking-service">{b.serviceName}</div>
                  <div className="sl-booking-meta">
                    {b.customer} • {b.date}
                  </div>
                </div>
                <div className={`sl-booking-status sl-status-${b.status}`}>
                  {b.status === "pending" && <Clock size={14} />}
                  {b.status === "confirmed" && <CheckCircle size={14} />}
                  {b.status === "completed" && <CheckCircle size={14} />}
                  {b.status === "cancelled" && <XCircle size={14} />}
                  {b.status}
                </div>
              </div>
            ))}
          </div>
        )}
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
            <Plus size={16} /> Add Service
          </button>
        }
      >
        {services.length > 0 && (
          <div className="sl-service-grid">
            {services.map((s, i) => (
              <div key={i} className="sl-service-card">
                <div className="sl-service-top">
                  <div className="sl-service-name">{s.name}</div>
                  <div className="sl-service-price">${s.price}</div>
                </div>
                <div className="sl-service-desc">{s.description}</div>
                <div className="sl-service-meta">
                  {s.bookings} bookings • {s.rating}★
                </div>
              </div>
            ))}
          </div>
        )}
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