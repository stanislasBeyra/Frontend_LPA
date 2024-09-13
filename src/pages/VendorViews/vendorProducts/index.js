// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { useRouter } from 'next/router'

// ** Demo Components Imports
import VendorProductTables from 'src/views/tables/VendorTables/vendorproductTable'
import { teelColor } from 'src/utils/config'
import MyButton from 'src/utils/CustomButton'

const VendorProduct = () => {
  const router = useRouter()

  const addPage = () => {
    router.push('/productadd/productadd') // Remplacez '/add-product' par le chemin de votre page d'ajout de produit
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={10}>
          <Grid item>
            <Typography variant='h5' sx={{ color: teelColor }}>
              Vendor Products
            </Typography>
          </Grid>
          <Grid item>
            <MyButton variant="contained" onClick={addPage}>
              Add product
            </MyButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
      <VendorProductTables />
      </Grid>
    </Grid>
  )
}

export default VendorProduct
