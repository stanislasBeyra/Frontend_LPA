import { useContext } from 'react';
import HomeOutline from 'mdi-material-ui/HomeOutline';
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline';
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline';
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase';
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended';
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline';
import Table from 'mdi-material-ui/Table';
import CubeOutline from 'mdi-material-ui/CubeOutline';
import { UserContext } from 'src/@core/Provider/UserContext';

const useNavigation = () => {
  const { userInfo } = useContext(UserContext);

  // Determine the user's role
  const role = userInfo?.getUserRole();

  // Define common navigation items
  const commonNavigation = [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
  ];

  // Conditionally render navigation items based on user role
  const navigationItems = [


      //Session Admin generale

    ...(role === 'admin'
      ? [
        ...commonNavigation,
        {
          sectionTitle: 'Admin Interface'
        },
        {
          title: 'Add Vendor & Employee',
          icon: AccountCogOutline,
          path: '/addemployepage'
        },
        {
          title: 'User Vendor',
          icon: AccountCogOutline,
          path: '/user_Vendor'
        },
        {
          title: 'User Client',
          icon: AccountCogOutline,
          path: '/user_employe'
        },

          {
            title: 'Vendor product',
            icon: AccountCogOutline,
            path: '/ggg'
          },
          {
            title: 'Vendor order',
            icon: AccountCogOutline,
            path: '/fff'
          },

          {
            title: 'Account Settings',
            icon: AccountCogOutline,
            path: '/account-settings'
          },


        ]
      : []),

      //session Client
    ...(role === 'client'
      ? [
        ...commonNavigation,
        {
          sectionTitle: 'User Interface'
        },
        {
          title: 'User Vendor',
          icon: AccountCogOutline,
          path: '/account-settingss'
        },
      ]
      : []),

      // session Vendor
    ...(role === 'vendor'
      ? [
          // Add vendor-specific navigation items here

          ...commonNavigation,
          {
            sectionTitle: 'Vendor Interface'
          },
          {
            title: 'My products',
            icon: FormatLetterCase,
            path: '/VendorViews/vendorProducts'
          },
          {
            title: 'My orders',
            icon: FormatLetterCase,
            path: '/VendorViews/vendorsOrders'
          },
        ]
      : []),
  ];

  return navigationItems;
};

export default useNavigation;
