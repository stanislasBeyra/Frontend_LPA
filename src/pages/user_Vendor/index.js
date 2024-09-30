// ** MUI Imports
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

// ** Demo Components Imports
import MyButton from 'src/utils/CustomButton';
import VendorsListData from 'src/views/tables/VendorListeTable/VendorListe';
import { teelColor } from 'src/utils/config';


const UserVendor = () => {
  const router = useRouter();

  const addPage = () => {
    router.push('/addemployepage');
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={10}>
          <Grid item>
            <Typography variant="h5" sx={{ color: teelColor }}>
              Vendor Liste
            </Typography>
          </Grid>
          {/* <Grid item>
            <MyButton variant="contained" onClick={addPage}>
              Add Employe
            </MyButton>
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <VendorsListData />
      </Grid>
    </Grid>
  );
};

export default UserVendor;
