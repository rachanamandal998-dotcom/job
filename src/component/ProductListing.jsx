import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Package, Plus, Eye, Truck, Store, ShoppingBag } from "lucide-react";
import { DashboardShell, Greeting, ActionCard, SectionPanel } from "../shared/DashboardShell";
import { ListingFormModal } from "../shared/ListingFormModal";
import "./ProductListing.css"; //


export default function ProductListing() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <DashboardShell>
      <Greeting title="Manage your product listings" subtitle="Hi, Rachana!" verified />

      <section className="actions-grid">
        <ActionCard icon={Plus} label="Add Products" sub="Create a new listing" primary onClick={() => setFormOpen(true)} />
        <ActionCard icon={Eye} label="View Products" sub="See your current items" />
        <ActionCard icon={Truck} label="Track Order" sub="Latest order updates" badge="0" />
        <ActionCard icon={Store} label="Open Product Store" sub="Show your storefront" />
      </section>

      <SectionPanel
        title="My Orders"
        description="Your three most recent orders — manage and confirm them here."
        emptyIcon={ShoppingBag}
        emptyTitle="No recent orders right now."
        emptyHint="Orders will appear here as soon as customers buy from your store."
      />

      <SectionPanel
        title="Products"
        description="Manage your listings with a polished product view."
        emptyIcon={Package}
        emptyTitle="No products found"
        emptyHint="Start building your catalog by adding your first product listing."
        cta={<button onClick={() => setFormOpen(true)} className="brand-button"><Plus size={16} /> Add Product</button>}
      />

      <AnimatePresence>
        {formOpen && <ListingFormModal kind="product" onClose={() => setFormOpen(false)} />}
      </AnimatePresence>
    </DashboardShell>
  );
}
