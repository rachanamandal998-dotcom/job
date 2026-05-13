import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductListing from "./component/ProductListing";
import ProductListing2 from "./component/ProductListing2";
import ServiceListing from "./component/ServiceListing";
import Servicelisting2 from "./component/Servicelisting2";
import JobPortal from "./component/JobPortal";
import JobPortal2 from "./component/JobPortal2";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/product-listing" replace />} />
        <Route path="/product-listing" element={<ProductListing />} />
         <Route path="/product-listing2" element={<ProductListing2 />} />
  
        <Route path="/service-listing" element={<ServiceListing />} />
        <Route path="/job-portal" element={<JobPortal />} />
        <Route path="/job-portal2" element={<JobPortal2 />} /> 
       
        
        <Route path="/service-listing2" element={<Servicelisting2 />} />
 

      </Routes>
    </BrowserRouter>
  );
}
