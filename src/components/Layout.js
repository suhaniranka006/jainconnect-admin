// =================================================================================================
// 📐 MAIN LAYOUT COMPONENT
// =================================================================================================
// This wrapper is used on every logged-in page.
// It provides:
// 1. The Top Bar (AppBar) with Logout button.
// 2. The Side Menu (Drawer) with navigation links.
// 3. The Responsive Design (Mobile menu toggle).
// 4. The Main Content Area where the page goes.

import React from 'react';
import {
    Box,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Button
} from '@mui/material';
import {
    Event as EventIcon,
    Person as PersonIcon,
    Today as TodayIcon,
    Menu as MenuIcon,
    Logout as LogoutIcon,
    Restaurant as RestaurantIcon,
    AccountBalance as TempleIcon,
    DirectionsCar as CarIcon,
    AutoStories as StoryIcon,
    Hiking as HikeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const drawerWidth = 240; // Width of the sidebar

const Layout = ({ children }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = React.useState(false); // For mobile menu toggle

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // 📋 Navigation Menu Items
    const menuItems = [
        { text: 'Maharaj List', icon: <PersonIcon />, path: '/maharajs' },
        { text: 'Events', icon: <EventIcon />, path: '/events' },
        { text: 'Tithis', icon: <TodayIcon />, path: '/tithis' },
        { text: 'Bhojanshalas', icon: <RestaurantIcon />, path: '/bhojanshalas' },
        { text: 'Temples', icon: <TempleIcon />, path: '/temples' },
        { text: 'Carpooling', icon: <CarIcon />, path: '/carpools' },
        { text: 'Jain Legacy', icon: <StoryIcon />, path: '/stories' },
        { text: 'Tirthyatra Templates', icon: <HikeIcon />, path: '/tirthyatra-templates' },
    ];

    // 🖼️ The Drawer Content (Sidebar UI)
    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    JainConnect
                </Typography>
            </Toolbar>
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => navigate(item.path)}
                        selected={location.pathname === item.path} // Highlight active page
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(233, 30, 99, 0.08)',
                                borderRight: '4px solid #e91e63',
                                '&:hover': { backgroundColor: 'rgba(233, 30, 99, 0.12)' },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text}
                            primaryTypographyProps={{
                                fontWeight: location.pathname === item.path ? 'bold' : 'medium',
                                color: location.pathname === item.path ? 'primary.main' : 'textPrimary'
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* 🔝 TOP APP BAR */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar>
                    {/* Hamburger Menu (Mobile Only) */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* 👈 SIDEBAR (DRAWER) */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Mobile Drawer (Temporary) */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }} // Better open performance on mobile
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop Drawer (Permanent) */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* 📄 MAIN CONTENT AREA */}
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', bgcolor: '#f4f6f8' }}
            >
                <Toolbar /> {/* Spacer for keeping content below AppBar */}
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
