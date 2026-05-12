import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Eye,
  Truck,
  Store,
  Clock,
  CheckCircle,
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

/* ───────── Page ───────── */
export default function ProductListing() {
  const [formOpen, setFormOpen] = useState(false);
  const [orders, setOrders] = useState([]); // Replace with real data
  const [products, setProducts] = useState([]); // Replace with real data

  return (
    <DashboardShell>
      <Greeting
        title="Manage your product listings"
        subtitle="Hi, Rachana!"
        verified
      />

      {/* CIRCLES */}
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
          badge={products.length}
        />

        <CircleCard3D
          icon={Truck}
          label="Track Orders"
          sub="Order status"
          badge={orders.length}
        />

        <CircleCard3D icon={Store} label="Store" sub="Open shop" />
      </section>

      {/* MY ORDERS SECTION */}
      <SectionPanel
        title="My Orders"
        description="Your three most recent orders — manage and confirm them here."
        emptyIcon={Package}
        emptyTitle="No recent orders right now"
        emptyHint="Orders will appear here once customers purchase your products."
      >
        {orders.length > 0 && (
          <div className="pl-order-list">
            {orders.slice(0, 3).map((order, i) => (
              <div key={i} className="pl-order-item">
                <div className="pl-order-left">
                  <div className="pl-order-id">#{order.id}</div>
                  <div className="pl-order-meta">
                    {order.product} • {order.date}
                  </div>
                </div>
                <div className={`pl-order-status pl-status-${order.status}`}>
                  {order.status === "pending" && <Clock size={14} />}
                  {order.status === "shipped" && <Truck size={14} />}
                  {order.status === "delivered" && <CheckCircle size={14} />}
                  {order.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionPanel>

      {/* PRODUCTS SECTION */}
      <SectionPanel
        title="Products"
        description="Manage your listings with a polished product view."
        emptyIcon={Package}
        emptyTitle="No products yet"
        emptyHint="Add your first product to start selling."
        cta={
          <button
            className="brand-button"
            onClick={() => setFormOpen(true)}
          >
            <Plus size={16} /> Add Product
          </button>
        }
      >
        {products.length > 0 && (
          <div className="pl-product-grid">
            {products.map((p, i) => (
              <div key={i} className="pl-product-card">
                <div className="pl-product-img">
                  <img src={p.image || "/placeholder.png"} alt={p.name} />
                </div>
                <div className="pl-product-info">
                  <div className="pl-product-name">{p.name}</div>
                  <div className="pl-product-price">${p.price}</div>
                  <div className="pl-product-stock">
                    {p.stock} in stock
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionPanel>

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