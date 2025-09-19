import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";

// TabPanel component
function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function AdminPanelTabs({ sections }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="Admin Panel Tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        {sections.map((sec, idx) => (
          <Tab key={idx} label={sec.name} id={`tab-${idx}`} aria-controls={`tabpanel-${idx}`} />
        ))}
      </Tabs>

      {sections.map((sec, idx) => (
        <TabPanel key={idx} value={activeTab} index={idx}>
          {sec.component}
        </TabPanel>
      ))}
    </Box>
  );
}

export default AdminPanelTabs;
