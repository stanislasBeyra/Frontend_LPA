import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { styled } from '@mui/material/styles';
import CustomTextField from 'src/utils/CustomTextField';
import CustomSelect from 'src/utils/CustomSelect';
import CustonSelectImageButton from 'src/utils/SetectedButton';
import VendorController from 'src/controllers/VendorControllers';
import MyButton from 'src/utils/CustomButton';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { teelColor } from 'src/utils/config';


const ButtonStyled = styled(MyButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const ProductAdd = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [categorieId, setCategorieId] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const defaultImages = [
    'https://via.placeholder.com/306x408.png?text=Default+Image+1',
    'https://via.placeholder.com/306x408.png?text=Default+Image+2',
    'https://via.placeholder.com/306x408.png?text=Default+Image+3',
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      setError('Please select up to 3 images.');
      return;
    }

    setError('');
    setLoading(true);

    const previews = files.map(file => URL.createObjectURL(file));

    const readers = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then(encodedImages => {
        setProductImages(encodedImages);
        setImagePreviews(previews);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to read files.');
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (productImages.length < 1 || productImages.length > 3) {
      setError('You must upload between 1 and 3 images.');
      return;
    }

    // Construct productData with image fields
    const productData = {
      product_name: productName,
      product_description: productDescription,
      stock,
      price,
      categorie_id: categorieId,
      product_images1: productImages[0] || null, // First image
      product_images2: productImages[1] || null, // Second image
      product_images3: productImages[2] || null, // Third image
    };

    console.log('Sending product data: ', productData);
    try {
      const response = await VendorController.addProduct(productData);

      // Check the response status
      console.log('status de la reponse ',response.status);
      if (response.status === 201) {
        console.log(' la reponse ',response.data.success);
        const dataresponse=response.data
        toast.success(dataresponse.success || 'added successfully')
        setSuccess(dataresponse.success || 'Product added successfully'); // Use the success message from the response
        setError('');

        // Clear form fields

        setProductName('');
        setProductDescription('');
        setStock('');
        setPrice('');
        setCategorieId('');
        setProductImages([]);
        setImagePreviews([]);
      } else {
        const errorMessage =dataresponse.success ? result.errors : result.message
        toast.error(errorMessage)

        //setError(dataresponse.success ? result.errors : result.message);
        setSuccess('');
      }
    } catch (err) {
      const errorMessage =dataresponse.success ? result.errors : result.message

        //toast.error(errorMessage)
      console.error('Unexpected Error:', err); // Log unexpected error
      //setError('An unexpected error occurred. Please try again later.');
      toast.error('An unexpected error occurred. Please try again later.')
    }
  };


  const categories = [
    { value: 1, label: 'Category 1' },
    { value: 2, label: 'Category 2' },
    { value: 3, label: 'Category 3' }
  ];

  return (
    <Box>
      <Typography variant='h4' sx={{ marginBottom: 3 }}>Add Product</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              label="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label="Product Description"
              multiline
              rows={4}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ color: teelColor }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              value={categorieId}
              onChange={(e) => setCategorieId(e.target.value)}
              label="Category"
              options={categories}
            />
          </Grid>

          <Grid item xs={12}>
            <CustonSelectImageButton component='label' variant='contained' sx={{ background: teelColor }}>
              Upload Images ({productImages.length})
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                required
              />
            </CustonSelectImageButton>
          </Grid>

          {loading && (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
              <CircularProgress sx={{ color: teelColor }} />
            </Grid>
          )}

          <Grid item xs={12}>
            {!loading && (
              <Grid container spacing={2}>
                {imagePreviews.length > 0
                  ? imagePreviews.map((src, index) => (
                    <Grid item key={index} xs={4}>
                      <img src={src} alt={`Preview ${index}`} style={{ width: '100%' }} />
                    </Grid>
                  ))
                  : defaultImages.map((src, index) => (
                    <Grid item key={index} xs={4}>
                      <Card>
                        <CardMedia
                          component="img"
                          alt={`Default image ${index + 1}`}
                          image={src}
                          title={`Default image ${index + 1}`}
                        />
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            )}
          </Grid>

          <Grid item xs={12}>
            <ButtonStyled type="submit" variant="contained" sx={{ background: teelColor }}>
              Add Product
            </ButtonStyled>
           <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ProductAdd;




