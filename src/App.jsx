import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductListing from "./component/ProductListing";
import ServiceListing from "./component/ServiceListing";
import JobPortal from "./component/JobPortal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/product-listing" replace />} />
        <Route path="/product-listing" element={<ProductListing />} />
        <Route path="/service-listing" element={<ServiceListing />} />
        <Route path="/job-portal" element={<JobPortal />} />
      </Routes>
    </BrowserRouter>
  );
}
