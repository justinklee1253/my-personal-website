import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f5f7ff_0%,#f1eeff_50%,#edf5ff_100%)]">
      {children}
    </div>
  );
};

export default Layout;
