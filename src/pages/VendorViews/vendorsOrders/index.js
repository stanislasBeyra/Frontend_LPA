// ** MUI Imports
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { Box } from 'mdi-material-ui';
import Grid from '@mui/material/Grid';

// ** Demo Components Imports
import { teelColor } from 'src/utils/config';
import VendorOrdersDataListe from 'src/views/tables/VendorListeTable/vendorsorderTable';


const VendorOrders = () => {
  const router = useRouter();


  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={10}>
          <Grid item>
            <Typography variant="h5" sx={{ color: teelColor }}>
              My Orders Liste
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <VendorOrdersDataListe />
      </Grid>
    </Grid>
  );
};

export default VendorOrders;
