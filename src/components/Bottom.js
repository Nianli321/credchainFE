import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DraftsIcon from '@mui/icons-material/Drafts';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';

export default function SimpleBottomNavigation( props) {
  const [value, setValue] = React.useState(0);
  const setPage = props.setPage
  return (
    <Box sx={{  
      width: 350,
      position: 'fixed',
      bottom: 0
      }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setPage(newValue);
        }}
      >
        <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
        <BottomNavigationAction label="Credentials" icon={<DraftsIcon />} />
        <BottomNavigationAction label="Contacts" icon={<PermContactCalendarIcon />} />
      </BottomNavigation>
    </Box>
  );
}