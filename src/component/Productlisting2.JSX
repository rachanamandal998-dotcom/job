import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Eye,
  Truck,
  Store,
  Clock,
  CheckCircle,
  TrendingUp,
  ShoppingBag,
  BarChart2,
} from "lucide-react";

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  DashboardShell,
  Greeting,
  SectionPanel,
} from "../shared/DashboardShell";

import { ListingFormModal } from "../shared/ListingFormModal";
import "./ProductListing2.css";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

/* ============================================================
   Circle Card
============================================================ */

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

/* ============================================================
   Product Overview
============================================================ */

function ProductListOverview({ products, orders }) {
  const total = products.length || 1;

  const inStock = products.filter(
    (p) => (p.stock || 0) > 5
  ).length;

  const lowStock = products.filter(
    (p) =>
      (p.stock || 0) > 0 &&
      (p.stock || 0) <= 5
  ).length;

  const outStock = products.filter(
    (p) => (p.stock || 0) === 0
  ).length;

  const delivered = orders.filter(
    (o) => o.status === "delivered"
  ).length;

  const stockColors = {
    "In Stock": "#22c55e",
    "Low Stock": "#fbbf24",
    "Out of Stock": "#ef4444",
  };

  const stockStats = {
    "In Stock": inStock,
    "Low Stock": lowStock,
    "Out of Stock": outStock,
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  const segments = Object.entries(stockStats).map(
    ([key, value]) => {
      const dash = (value / total) * circumference;

      const segment = {
        key,
        value,
        color: stockColors[key],
        dasharray: `${dash} ${
          circumference - dash
        }`,
        offset: -offset,
      };

      offset += dash;

      return segment;
    }
  );

  const totalOrders = orders.length;

  const totalStock = products.reduce(
    (a, p) => a + (p.stock || 0),
    0
  );

  const avgPrice =
    products.length > 0
      ? (
          products.reduce(
            (a, p) =>
              a + (Number(p.price) || 0),
            0
          ) / products.length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="pl-overview-wrap">
      <div className="pl-overview-header">
        <h3 className="pl-overview-title">
          Product List Overview
        </h3>

        <span className="pl-overview-total">
          {products.length} Products
        </span>
      </div>

      <div className="pl-overview-body">
        <div className="pl-ov-donut">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
          >
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
                className="pl-donut-segment"
                transform="rotate(-90 60 60)"
              />
            ))}
          </svg>

          <div className="pl-ov-donut-center">
            <div className="pl-ov-donut-number">
              {products.length}
            </div>

            <div className="pl-ov-donut-label">
              Products
            </div>
          </div>
        </div>

        <div className="pl-ov-bars">
          {Object.entries(stockStats).map(
            ([key, value]) => (
              <div
                key={key}
                className="pl-ov-stat-row"
              >
                <div className="pl-ov-stat-row-top">
                  <div
                    className="pl-ov-stat-dot"
                    style={{
                      background:
                        stockColors[key],
                    }}
                  />

                  <span className="pl-ov-stat-name">
                    {key}
                  </span>

                  <span className="pl-ov-stat-value">
                    {value}
                  </span>
                </div>

                <div className="pl-ov-stat-bar-bg">
                  <div
                    className="pl-ov-stat-bar"
                    style={{
                      width: `${
                        (value / total) * 100
                      }%`,
                      background:
                        stockColors[key],
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>

        <div className="pl-ov-metrics">
          <div className="pl-ov-metric">
            <div className="pl-ov-metric-val">
              {totalOrders}
            </div>

            <div className="pl-ov-metric-label">
              Total orders
            </div>
          </div>

          <div className="pl-ov-metric">
            <div className="pl-ov-metric-val">
              {totalStock}
            </div>

            <div className="pl-ov-metric-label">
              Units in stock
            </div>
          </div>

          <div className="pl-ov-metric">
            <div className="pl-ov-metric-val">
              ${avgPrice}
            </div>

            <div className="pl-ov-metric-label">
              Avg. price
            </div>
          </div>

          <div className="pl-ov-metric">
            <div className="pl-ov-metric-val">
              {delivered}
            </div>

            <div className="pl-ov-metric-label">
              Delivered
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Quick Stats
============================================================ */

function QuickStats({ products, orders }) {
  const delivered = orders.filter(
    (o) => o.status === "delivered"
  ).length;

  const deliveryRate =
    orders.length > 0
      ? Math.round(
          (delivered / orders.length) * 100
        )
      : 0;

  const totalStock = products.reduce(
    (a, p) => a + (p.stock || 0),
    0
  );

  const cards = [
    {
      icon: ShoppingBag,
      label: "Total orders",
      value: orders.length,
    },
    {
      icon: Package,
      label: "Total products",
      value: products.length,
    },
    {
      icon: BarChart2,
      label: "Total stock",
      value: totalStock,
    },
    {
      icon: TrendingUp,
      label: "Delivery rate",
      value: `${deliveryRate}%`,
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

/* ============================================================
   Charts
============================================================ */

function ChartsSection({ orders, products }) {
  const lineRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);

  const lineInst = useRef(null);
  const pieInst = useRef(null);
  const barInst = useRef(null);

  useEffect(() => {
    if (
      !lineRef.current ||
      !pieRef.current ||
      !barRef.current
    )
      return;

    const orange = "rgb(249,115,22)";
    const orangeAlpha =
      "rgba(249,115,22,0.12)";
    const grid = "#fff7ed";
    const tick = "#94a3b8";

    lineInst.current?.destroy();
    pieInst.current?.destroy();
    barInst.current?.destroy();

    /* LINE */

    const last7Days = [...Array(7)].map(
      (_, i) => {
        const d = new Date();

        d.setDate(
          d.getDate() - (6 - i)
        );

        return d
          .toISOString()
          .slice(0, 10);
      }
    );

    const ordersByDay = last7Days.map(
      (dateStr) =>
        orders.filter((o) =>
          o.date?.startsWith(dateStr)
        ).length
    );

    lineInst.current = new Chart(
      lineRef.current,
      {
        type: "line",

        data: {
          labels: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ],

          datasets: [
            {
              label: "Orders",
              data: ordersByDay,
              borderColor: orange,
              backgroundColor:
                orangeAlpha,
              borderWidth: 2,
              pointBackgroundColor:
                orange,
              fill: true,
              tension: 0.4,
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
      }
    );

    /* PIE */

    const pending = orders.filter(
      (o) => o.status === "pending"
    ).length;

    const shipped = orders.filter(
      (o) => o.status === "shipped"
    ).length;

    const delivered = orders.filter(
      (o) => o.status === "delivered"
    ).length;

    pieInst.current = new Chart(
      pieRef.current,
      {
        type: "doughnut",

        data: {
          labels: [
            "Pending",
            "Shipped",
            "Delivered",
          ],

          datasets: [
            {
              data: [
                pending,
                shipped,
                delivered,
              ],

              backgroundColor: [
                "#fbbf24",
                "#3b82f6",
                "#22c55e",
              ],

              borderWidth: 2,
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
        },
      }
    );

    /* BAR */

    const pLabels =
      products.length > 0
        ? products.map(
            (p) => p.name
          )
        : ["No Products"];

    const pData =
      products.length > 0
        ? products.map(
            (p) => p.stock || 0
          )
        : [0];

    barInst.current = new Chart(
      barRef.current,
      {
        type: "bar",

        data: {
          labels: pLabels,

          datasets: [
            {
              label: "Stock",
              data: pData,
              backgroundColor:
                "rgba(249,115,22,0.7)",
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
        },
      }
    );

    return () => {
      lineInst.current?.destroy();
      pieInst.current?.destroy();
      barInst.current?.destroy();
    };
  }, [orders, products]);

  return (
    <div className="pl-charts-grid">
      <div className="pl-chart-card">
        <div className="pl-chart-card-title">
          Weekly order trend
        </div>

        <div className="pl-chart-wrap">
          <canvas ref={lineRef} />
        </div>
      </div>

      <div className="pl-chart-card">
        <div className="pl-chart-card-title">
          Order status
        </div>

        <div className="pl-chart-wrap">
          <canvas ref={pieRef} />
        </div>
      </div>

      <div className="pl-chart-card">
        <div className="pl-chart-card-title">
          Product stock
        </div>

        <div className="pl-chart-wrap">
          <canvas ref={barRef} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function ProductListing2() {
  const [formOpen, setFormOpen] =
    useState(false);

  const [orders] = useState([
    {
      id: 1001,
      product: "Handmade Bag",
      status: "pending",
      date: "2026-05-10",
    },

    {
      id: 1002,
      product: "Wooden Toy",
      status: "shipped",
      date: "2026-05-11",
    },

    {
      id: 1003,
      product: "Silk Scarf",
      status: "delivered",
      date: "2026-05-12",
    },
  ]);

  const [products] = useState([
    {
      name: "Handmade Bag",
      price: "29.99",
      stock: 12,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    },

    {
      name: "Wooden Toy",
      price: "14.50",
      stock: 3,
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    },

    {
      name: "Silk Scarf",
      price: "19.00",
      stock: 0,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    },
  ]);

  return (
    <DashboardShell>
      <Greeting
        title="Manage your product listings"
        subtitle="Hi, Rachana!"
        verified
      />

      <section className="actions-grid">
        <CircleCard3D
          icon={Plus}
          label="Add Products"
          sub="Create listing"
          primary
          onClick={() =>
            setFormOpen(true)
          }
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

        <CircleCard3D
          icon={Store}
          label="Store"
          sub="Open shop"
        />
      </section>

      <ProductListOverview
        products={products}
        orders={orders}
      />

      <QuickStats
        products={products}
        orders={orders}
      />

      <ChartsSection
        orders={orders}
        products={products}
      />

      <AnimatePresence>
        {formOpen && (
          <ListingFormModal
            kind="product"
            onClose={() =>
              setFormOpen(false)
            }
          />
        )}
      </AnimatePresence>
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