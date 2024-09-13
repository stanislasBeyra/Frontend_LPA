import React, { useState, Fragment, useContext } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { UserContext } from 'src/@core/Provider/UserContext';
import { urlImage } from 'src/utils/config';

// ** Icons Imports
import CogOutline from 'mdi-material-ui/CogOutline';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import EmailOutline from 'mdi-material-ui/EmailOutline';
import LogoutVariant from 'mdi-material-ui/LogoutVariant';
import AccountOutline from 'mdi-material-ui/AccountOutline';
import MessageOutline from 'mdi-material-ui/MessageOutline';
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline';

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const UserDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState(null);

  // ** Context
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('UserDropdown must be used within a UserProvider');
  }
  const { userInfo, setUserInfo } = context;

  // ** Hooks
  const router = useRouter();

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  const logout = () => {
    console.log('Token before logout:', localStorage.getItem('token'));
    localStorage.removeItem('token'); // Supprimer le token
    setUserInfo(null); // Réinitialiser les infos utilisateur
    router.push('/pages/login'); // Redirection
    console.log('Token after logout:', localStorage.getItem('token'));
  };

  // ** Combine urlImage with userInfo.avatar

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary',
    },
  };

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt={userInfo?.firstname || 'User'}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={userInfo?.getUserAvatar()}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar
                alt={userInfo?.firstname || 'profile'}
                src={userInfo?.getUserAvatar()}
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>
                {userInfo?.username}
              </Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {userInfo?.getUserRole()}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/account-settings')}>
          <Box sx={styles}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Profile
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/inbox')}>
          <Box sx={styles}>
            <EmailOutline sx={{ marginRight: 2 }} />
            Inbox
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/chat')}>
          <Box sx={styles}>
            <MessageOutline sx={{ marginRight: 2 }} />
            Chat
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/settings')}>
          <Box sx={styles}>
            <CogOutline sx={{ marginRight: 2 }} />
            Settings
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pricing')}>
          <Box sx={styles}>
            <CurrencyUsd sx={{ marginRight: 2 }} />
            Pricing
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/faq')}>
          <Box sx={styles}>
            <HelpCircleOutline sx={{ marginRight: 2 }} />
            FAQ
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 2 }} onClick={logout}>
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;



// import { useState, Fragment, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Box from '@mui/material/Box';
// import Menu from '@mui/material/Menu';
// import Badge from '@mui/material/Badge';
// import Avatar from '@mui/material/Avatar';
// import Divider from '@mui/material/Divider';
// import MenuItem from '@mui/material/MenuItem';
// import { styled } from '@mui/material/styles';
// import Typography from '@mui/material/Typography';

// // ** Icons Imports
// import CogOutline from 'mdi-material-ui/CogOutline';
// import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
// import EmailOutline from 'mdi-material-ui/EmailOutline';
// import LogoutVariant from 'mdi-material-ui/LogoutVariant';
// import AccountOutline from 'mdi-material-ui/AccountOutline';
// import MessageOutline from 'mdi-material-ui/MessageOutline';
// import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline';

// // ** Controllers Import
// import LoginController from 'src/controllers/LoginController';
// import { urlImage } from 'src/utils/config';

// // ** Styled Components
// const BadgeContentSpan = styled('span')(({ theme }) => ({
//   width: 8,
//   height: 8,
//   borderRadius: '50%',
//   backgroundColor: theme.palette.success.main,
//   boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
// }));

// const UserDropdown = () => {
//   // ** States
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [userInfo, setUserInfo] = useState(null);

//   // ** Hooks
//   const router = useRouter();

//   const handleDropdownOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleDropdownClose = (url) => {
//     if (url) {
//       router.push(url);
//     }
//     setAnchorEl(null);
//   };

//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const profile = await LoginController.getProfile();
//         console.log('User profile:', profile.data.user);
//         setUserInfo(profile.data.user);
//       } catch (error) {
//         console.error('Failed to fetch user profile:', error);
//       }
//     };

//     fetchUserInfo();
//   }, []);

//   const styles = {
//     py: 2,
//     px: 4,
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     color: 'text.primary',
//     textDecoration: 'none',
//     '& svg': {
//       fontSize: '1.375rem',
//       color: 'text.secondary',
//     },
//   };

//   const logout = () => {
//     const tokens = localStorage.getItem('token');
//     console.log('Token before logout:', tokens);
//     localStorage.removeItem('token'); // Supprimer le token
//     router.push('/pages/login');
//     console.log('Token after logout:', localStorage.getItem('token'));
//   };

//   // Combine urlImage with userInfo.avatar
//   const avatarUrl = userInfo?.avatar ? `${urlImage}${userInfo.avatar}` : '/images/avatars/1.png';

//   return (
//     <Fragment>
//       <Badge
//         overlap='circular'
//         onClick={handleDropdownOpen}
//         sx={{ ml: 2, cursor: 'pointer' }}
//         badgeContent={<BadgeContentSpan />}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Avatar
//           alt={userInfo?.firstname || 'User'}
//           onClick={handleDropdownOpen}
//           sx={{ width: 40, height: 40 }}
//           src={avatarUrl}
//         />
//       </Badge>
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={() => handleDropdownClose()}
//         sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Box sx={{ pt: 2, pb: 3, px: 4 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Badge
//               overlap='circular'
//               badgeContent={<BadgeContentSpan />}
//               anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//             >
//               <Avatar
//                 alt={userInfo?.firstname || 'profile'}
//                 src={avatarUrl}
//                 sx={{ width: '2.5rem', height: '2.5rem' }}
//               />
//             </Badge>
//             <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
//               <Typography sx={{ fontWeight: 600 }}>
//                 {userInfo?.firstname} {userInfo?.lastname}
//               </Typography>
//               <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
//                 {userInfo?.email}
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//         <Divider sx={{ mt: 0, mb: 1 }} />
//         <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
//           <Box sx={styles}>
//             <AccountOutline sx={{ marginRight: 2 }} />
//             Profile
//           </Box>
//         </MenuItem>
//         <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
//           <Box sx={styles}>
//             <EmailOutline sx={{ marginRight: 2 }} />
//             Inbox
//           </Box>
//         </MenuItem>
//         <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
//           <Box sx={styles}>
//             <MessageOutline sx={{ marginRight: 2 }} />
//             Chat
//           </Box>
//         </MenuItem>
//         <Divider />
//         <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
//           <Box sx={styles}>
//             <CogOutline sx={{ marginRight: 2 }} />
//             Settings
//           </Box>
//         </MenuItem>
//         <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
//           <Box sx={styles}>
//             <CurrencyUsd sx={{ marginRight: 2 }} />
//             Pricing
//           </Box>
//         </MenuItem>
//         <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
//           <Box sx={styles}>
//             <HelpCircleOutline sx={{ marginRight: 2 }} />
//             FAQ
//           </Box>
//         </MenuItem>
//         <Divider />
//         <MenuItem sx={{ py: 2 }} onClick={logout}>
//           <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
//           Logout
//         </MenuItem>
//       </Menu>
//     </Fragment>
//   );
// };

// export default UserDropdown;