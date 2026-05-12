import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Eye,
  Truck,
  Store,
} from "lucide-react";

import {
  DashboardShell,
  Greeting,
  SectionPanel,
} from "../shared/DashboardShell";

import { ListingFormModal } from "../shared/ListingFormModal";
import "./ProductListing.css";

/* ───────── Circle Card ───────── */
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
          <Icon size={24} className="circ-icon" />

          <div className="circ-inner-label">
            {label}
          </div>

          <div className="circ-inner-sub">
            {sub}
          </div>

          {badge && (
            <span className="circ-badge">
              {badge}
            </span>
          )}
        </div>

        {primary && (
          <div className="circ-dot">★</div>
        )}
      </div>
    </div>
  );
}

/* ───────── Page ───────── */
export default function ProductListing() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <DashboardShell>
      <Greeting
        title="Manage your product listings"
        subtitle="Hi, Rachana!"
        verified
      />

      {/* ✅ ONLY CIRCLES */}
      <section className="actions-grid">
        <CircleCard3D
          icon={Plus}
          label="Add Products"
          sub="Create listing"
          primary
          onClick={() => setFormOpen(true)}
        />

        <CircleCard3D
          icon={Eye}
          label="View Products"
          sub="Your items"
        />

        <CircleCard3D
          icon={Truck}
          label="Track Orders"
          sub="Order status"
          badge="0"
        />

        <CircleCard3D
          icon={Store}
          label="Store"
          sub="Open shop"
        />
      </section>

      <SectionPanel
        title="My Orders"
        description="Your recent orders"
        emptyIcon={Package}
        emptyTitle="No orders"
        emptyHint="Orders will appear here."
      />

      <SectionPanel
        title="Products"
        description="Manage listings"
        emptyIcon={Package}
        emptyTitle="No products"
        emptyHint="Add your first product."
        cta={
          <button
            className="brand-button"
            onClick={() => setFormOpen(true)}
          >
            <Plus size={16} /> Add Product
          </button>
        }
      />

      <AnimatePresence>
        {formOpen && (
          <ListingFormModal
            kind="product"
            onClose={() => setFormOpen(false)}
          />
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}