import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_right,#EEF2FF,#EDE9FE,#EFF6FF)]">
      {children}
    </div>
  );
};

export default Layout;