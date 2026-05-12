import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Plus,
  Eye,
  Calendar,
  Store,
  Wrench,
  ClipboardList,
} from "lucide-react";

import {
  DashboardShell,
  Greeting,
  SectionPanel,
} from "../shared/DashboardShell";

import { ListingFormModal } from "../shared/ListingFormModal";
import "./ServiceListing.css";

/* ─────────────────────────────
   Circle Card (same system)
───────────────────────────── */
function CircleCard3D({ icon: Icon, label, sub, badge, primary }) {
  return (
    <div className="circ-card">
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
   Page
───────────────────────────── */
export default function ServiceListing() {
  const [formOpen, setFormOpen] = useState(false);

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
        />

        <CircleCard3D
          icon={Eye}
          label="View Services"
          sub="Manage all"
        />

        <CircleCard3D
          icon={Calendar}
          label="Track Bookings"
          sub="Updates"
          badge="0"
        />

        <CircleCard3D
          icon={Store}
          label="Open Store"
          sub="Showcase"
        />
      </section>

      {/* PANEL */}
      <SectionPanel
        title="My Bookings"
        description="Latest bookings"
        emptyIcon={ClipboardList}
        emptyTitle="No bookings found"
        emptyHint="New bookings will appear here."
      />

      <SectionPanel
        title="My Services"
        description="Manage your services"
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
      />

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