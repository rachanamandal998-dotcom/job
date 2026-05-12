import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Eye, Calendar, Store, Wrench, ClipboardList } from "lucide-react";
import { DashboardShell, Greeting, ActionCard, SectionPanel } from "../shared/DashboardShell";
import { ListingFormModal } from "../shared/ListingFormModal";
import "./ServiceListing.css"; 


export default function ServiceListing() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <DashboardShell>
      <Greeting title="Manage your service listings" subtitle="Hi, Rachana!" verified />

      <section className="actions-grid">
        <ActionCard icon={Plus} label="Add Service" sub="Create a new service listing" primary onClick={() => setFormOpen(true)} />
        <ActionCard icon={Eye} label="View Services" sub="Manage your current services" />
        <ActionCard icon={Calendar} label="Track Bookings" sub="Latest booking updates" badge="0" />
        <ActionCard icon={Store} label="Open Service Store" sub="Show your storefront" />
      </section>

      <SectionPanel
        title="My Bookings"
        description="Latest bookings — view more for the full list."
        emptyIcon={ClipboardList}
        emptyTitle="No bookings found"
        emptyHint="You have no service bookings yet. New bookings will appear here."
      />

      <SectionPanel
        title="My Services"
        description="Manage your services on Sindhuli Bazar."
        emptyIcon={Wrench}
        emptyTitle="No services found"
        emptyHint="Start building your listing by adding your first service."
        cta={<button onClick={() => setFormOpen(true)} className="brand-button"><Plus size={16} /> Add Service</button>}
      />

      <AnimatePresence>
        {formOpen && <ListingFormModal kind="service" onClose={() => setFormOpen(false)} />}
      </AnimatePresence>
    </DashboardShell>
  );
}
