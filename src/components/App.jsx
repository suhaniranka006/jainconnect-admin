import React from "react";
import AdminPanelTabs from "./components/AdminPanelTabs";
import MaharajListWrapper from "./components/MaharajListWrapper";
import EventListWrapper from "./components/EventListWrapper";
import TithiListWrapper from "./components/TithiListWrapper";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        JainConnect Admin Panel
      </h1>

      {/* Tabs for different sections with modals */}
      <AdminPanelTabs
        sections={[
          { name: "Maharaj", component: <MaharajListWrapper /> },
          { name: "Events", component: <EventListWrapper /> },
          { name: "Tithis", component: <TithiListWrapper /> },
        ]}
      />
    </div>
  );
}

export default App;
