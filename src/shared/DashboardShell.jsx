import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Menu, LogOut, Briefcase, Package, Wrench, BadgeCheck } from "lucide-react";
import "./DashboardShell.css";

export function DashboardShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const active = pathname.includes("job") ? "job" : pathname.includes("service") ? "service" : "product";
  const titleMap = { product: "Product Listing", job: "Job Portal", service: "Service Listing" };

  return (
    <div className="ds-root">
      <div className="ds-blobs">
        <div className="ds-blob ds-blob-1" />
        <div className="ds-blob ds-blob-2" />
      </div>

      <header className="ds-header">
        <div className="ds-header-inner">
          <Link to="/product-listing" className="ds-logo">
            <motion.div whileHover={{ rotateY: 180 }} transition={{ duration: 0.6 }} className="ds-logo-icon">
              <Store size={20} />
            </motion.div>
            <div>
              <p className="ds-brand">Sindhuli Bazar</p>
              <h1 className="ds-title">{titleMap[active]}</h1>
            </div>
          </Link>

          <nav className="ds-nav-desktop">
            <NavItem to="/job-portal" icon={Briefcase} label="Job Portal" active={active === "job"} />
            <NavItem to="/product-listing" icon={Package} label="Product Listing" active={active === "product"} />
            <NavItem to="/service-listing" icon={Wrench} label="Service Listing" active={active === "service"} />
            <button className="ds-logout"><LogOut size={16} /> Logout</button>
          </nav>

          <button className="ds-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={16} /> Menu
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="ds-mobile-menu"
            >
              <NavItem to="/job-portal" icon={Briefcase} label="Job Portal" active={active === "job"} block onClick={() => setMenuOpen(false)} />
              <NavItem to="/product-listing" icon={Package} label="Product Listing" active={active === "product"} block onClick={() => setMenuOpen(false)} />
              <NavItem to="/service-listing" icon={Wrench} label="Service Listing" active={active === "service"} block onClick={() => setMenuOpen(false)} />
              <button className="ds-logout-mobile"><LogOut size={16} /> Logout</button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="ds-main">{children}</main>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, active, block, onClick }) {
  return (
    <Link to={to} onClick={onClick} className={`ds-navitem ${active ? "active" : ""} ${block ? "block" : ""}`}>
      <Icon size={16} /> {label}
    </Link>
  );
}

export function Greeting({ title, subtitle, verified }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="greeting">
      <div className="greeting-row">
        <div>
          <h2 className="greeting-name">{subtitle}</h2>
          <p className="greeting-sub">{title}</p>
        </div>
        {verified && <span className="greeting-badge"><BadgeCheck size={16} /> CV Verified</span>}
      </div>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="greeting-orb" />
    </motion.div>
  );
}

export function ActionCard({ icon: Icon, label, sub, badge, primary, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -6, rotateX: 4, rotateY: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="action-card"
    >
      <div className="action-row">
        <motion.div whileHover={{ rotateY: 360 }} transition={{ duration: 0.7 }} className={`action-icon ${primary ? "primary" : ""}`}>
          <Icon size={20} />
        </motion.div>
        {badge && <span className="action-badge">{badge}</span>}
      </div>
      <p className="action-label">{label}</p>
      <p className="action-sub">{sub}</p>
      <div className="action-glow" />
    </motion.button>
  );
}

export function SectionPanel({ title, description, emptyIcon: Icon, emptyTitle, emptyHint, cta }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="panel"
    >
      <div className="panel-head">
        <div>
          <h3 className="panel-title">{title}</h3>
          <p className="panel-desc">{description}</p>
        </div>
      </div>
      <div className="panel-empty">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="panel-empty-icon">
          <Icon size={32} />
        </motion.div>
        <p className="panel-empty-title">{emptyTitle}</p>
        <p className="panel-empty-hint">{emptyHint}</p>
        {cta && <div className="panel-empty-cta">{cta}</div>}
      </div>
    </motion.section>
  );
}
