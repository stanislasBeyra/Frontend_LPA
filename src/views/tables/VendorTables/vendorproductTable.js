import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import CustomTextField from 'src/utils/CustomTextField';
import MyButton from 'src/utils/CustomButton';
import CustomSelect from 'src/utils/CustomSelect';

import { teelColor, redColor, blueColor, lightOrangeColor, grayColor, whiteColor, urlImage } from 'src/utils/config';
import VendorController from 'src/controllers/VendorControllers';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const DeletTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VendorProductTables = () => {
  const [page, setPage] = useState(0);

  // //updateData
  // Champs du produit
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [categorieId, setCategorieId] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false); // État pour le modal des détails
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await VendorController.getProduct();
        console.log(data.data.products);
        setRows(data.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const images = [selectedProduct.product_images1, selectedProduct.product_images2, selectedProduct.product_images3];
      setImagePreviews(images.filter(img => img).map(img => `${urlImage}/${img}`));
    }
  }, [selectedProduct]);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',

    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleOpenDeleteDialog = (product) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProduct(null);
  };

  // const handleOpenEditDialog = (product) => {
  //   setSelectedProduct(product);
  //   setOpenEditDialog(true);
  //   setImageFiles([]);
  //   setImagePreviews([]);
  // };

  const handleOpenEditDialog = (product) => {
    setSelectedProduct(product);
    setProductName(product.product_name);
    setProductDescription(product.product_description);
    setStock(product.stock);
    setPrice(product.price);
    setCategorieId(product.categorie_id);
    setProductImages([product.product_images1, product.product_images2, product.product_images3]);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedProduct(null);
  };



  const handleOpenDetailDialog = (product) => {
    setSelectedProduct(product);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedProduct(null);
  };

  const handleDelete = async () => {
    try {
     const response= await VendorController.deleteProduct(selectedProduct.id);
     if(response.status===200){
      setRows(rows.filter((row) => row.id !== selectedProduct.id));
      handleCloseDeleteDialog();
      toast.success('Product Delete successfully!');
     }

    } catch (error) {
      console.error('Failed to delete productssss:', error);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    // Création d'un objet contenant les données du produit
    const productData = {
      product_name: productName,
      product_description: productDescription,
      stock,
      price,
      categorie_id: categorieId,
    };
    console.log('voila les data recuperer: ',productData)
    try {
      console.log('ID du produit:', selectedProduct.id);

      if (!selectedProduct.id) {
        throw new Error('Product ID is not defined');
      }

      // Appel à la méthode pour mettre à jour le produit
      const response = await VendorController.updateProduct(selectedProduct.id, productData);
      const dataResponse = response.data;
      console.log(response.data.product);

      // Mise à jour de l'état du tableau des produits après modification
      const updatedRows = rows.map((row) =>
        row.id === selectedProduct.id
          ? { ...row, product_name: productName, product_description: productDescription, stock, price, categorie_id: categorieId }
          : row
      );

      if (response.status === 200) {
        setRows(updatedRows);
        handleCloseEditDialog();
        toast.success('Product updated successfully!');
      }
      if(response.status===422){
        const error=response.data.error
        toast.error(error)
      }

      // else {
      //   // Gérer les erreurs basées sur la réponse
      //   const errorMessage = dataResponse.success ? dataResponse.errors : dataResponse.message;
      //   toast.error(errorMessage);
      // }


    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('An error occurred. Please try again.');
    }
};



  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImageFiles(files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };



  const categories = [
    { value: 1, label: 'Category 1' },
    { value: 2, label: 'Category 2' },
    { value: 3, label: 'Category 3' }
  ];
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table>
          <TableHead sx={{ background: teelColor, color: whiteColor }}>
            <TableRow>

              <TableCell sx={{ color: whiteColor }} align="center"><strong>Product Image</strong></TableCell>
              <TableCell sx={{ color: whiteColor }} align="center"><strong>Product Name</strong></TableCell>
              {/* <TableCell sx={{ color: whiteColor }} align="center"><strong>Description</strong></TableCell> */}
              <TableCell sx={{ color: whiteColor }} align="center"><strong>Price</strong></TableCell>
              <TableCell sx={{ color: whiteColor }} align="center"><strong>Stock</strong></TableCell>
              <TableCell sx={{ color: whiteColor, width: 200 }} align='center'><strong>Created At</strong></TableCell>
              <TableCell sx={{ color: whiteColor }} align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>

                <TableCell align="center">
                  <img
                    src={`${urlImage}/${row.product_images1}`}
                    alt="Product"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '20%',
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleOpenDetailDialog(row)}
                  />
                </TableCell>
                <TableCell align="center">{row.product_name}</TableCell>
                {/* <TableCell align="center">{row.product_description}</TableCell> */}
                <TableCell align="center">{row.price}</TableCell>
                <TableCell align="center">{row.stock}</TableCell>
                <TableCell align='center'>{formatDate(row.created_at)}</TableCell>
                <TableCell align="center">
                  <IconButton sx={{ color: teelColor }} aria-label="info" color="primary" onClick={() => handleOpenDetailDialog(row)}>
                    <InfoIcon />
                  </IconButton>
                  <IconButton sx={{ color: lightOrangeColor }} aria-label="edit" onClick={() => handleOpenEditDialog(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton sx={{ color: redColor }} aria-label="delete" color="error" onClick={() => handleOpenDeleteDialog(row)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} TransitionComponent={DeletTransition}>
        <DialogTitle>Confirmation of Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <MyButton sx={{ background: grayColor }} onClick={handleCloseDeleteDialog}>Annuler</MyButton>
          <MyButton sx={{ background: redColor }} onClick={handleDelete} color="error">Supprimer</MyButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} TransitionComponent={Transition}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <form onSubmit={handleEditSubmit}>
              <Grid container spacing={2}>
                {/* Champs du formulaire en grille */}
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    margin="dense"
                    name="product_name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    label="Product Name"
                    fullWidth
                    defaultValue={selectedProduct.product_name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    margin="dense"
                    name="price"
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    fullWidth
                    defaultValue={selectedProduct.price}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    margin="dense"
                    name="stock"
                    label="Stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    fullWidth
                    defaultValue={selectedProduct.stock}
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
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    margin="dense"
                    fullWidth
                    label="Product Description"
                    multiline
                    rows={4}
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    defaultValue={selectedProduct.product_description}
                  />
                </Grid>

                {/* <Grid item xs={12}>
                  <input
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="upload-button"
                  />
                  <label htmlFor="upload-button">
                    <MyButton variant="contained" color="primary" component="span">
                      Upload Images
                    </MyButton>
                  </label>
                </Grid> */}
                <Grid item xs={12}>
                  {/* Affichage des images téléchargées */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={{ marginRight: '10px' }}>
                        <img
                          src={preview}
                          alt={`Product Preview ${index + 1}`}
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                </Grid>
              </Grid>
              <DialogActions>
                <Button sx={{ color: grayColor }} onClick={handleCloseEditDialog} color="primary">Cancel</Button>
                <MyButton sx={{ color: whiteColor }} type="submit">Save</MyButton>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>
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

      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} TransitionComponent={Transition} fullWidth maxWidth="md">
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {/* Image principale */}
                <Grid>
                  <img
                    src={imagePreviews[0]}
                    alt="Product Image"
                    style={{ width: '100%', height: '300px', objectFit: 'cover', marginBottom: '10px' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  {/* Miniatures */}
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    {imagePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          width: '50px',
                          height: '60px',
                          objectFit: 'cover',
                          marginRight: '10px',
                          border: index === 0 ? '2px solid #000' : '1px solid #ccc',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          // Logique pour changer l'image principale
                          const newPreviews = [...imagePreviews];
                          [newPreviews[0], newPreviews[index]] = [newPreviews[index], newPreviews[0]];
                          setImagePreviews(newPreviews);
                        }}
                      />
                    ))}
                  </div>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid sx={{ marginBottom: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(selectedProduct.created_at).toLocaleDateString()} at {new Date(selectedProduct.created_at).toLocaleTimeString()}
                  </Typography>
                </Grid>
                <Typography variant="h6">{selectedProduct.product_name}</Typography>
                <Typography variant="body1">Price: {selectedProduct.price}</Typography>
                <Typography variant="body1">Stock: {selectedProduct.stock}</Typography>
                <Typography variant="body1" paragraph>
                  {/* {selectedProduct.product_description} */}
                  {selectedProduct.product_description.length > 400
                    ? `${selectedProduct.product_description.substring(0, 400)}...`
                    : selectedProduct.product_description}
                </Typography>
                {/* <Typography variant="body1">Description: {selectedProduct.product_description}</Typography> */}
              </Grid>

            </Grid>
          )}
          <Grid>
            <DialogActions>
              <Button sx={{ color: teelColor }} onClick={handleCloseDetailDialog} color="primary">Cancel</Button>
            </DialogActions>
          </Grid>

        </DialogContent>
      </Dialog>



    </Paper>
  );
};

export default VendorProductTables;






// import React, { useState, useEffect } from 'react';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableRow from '@mui/material/TableRow';
// import TableHead from '@mui/material/TableHead';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';
// import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import InfoIcon from '@mui/icons-material/Info';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Slide from '@mui/material/Slide';
// import Typography from '@mui/material/Typography';
// import Rating from '@mui/material/Rating';

// import CustomTextField from 'src/utils/CustomTextField';
// import CustomSelect from 'src/utils/CustomSelect';
// import CustonSelectImageButton from 'src/utils/SetectedButton';

// import { teelColor, redColor, blueColor, orangeColor, lightOrangeColor, grayColor, whiteColor, urlImage } from 'src/utils/config';
// import VendorController from 'src/controllers/VendorControllers';
// import MyButton from 'src/utils/CustomButton';

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="down" ref={ref} {...props} />;
// });

// const DeletTransition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const VendorProductTables = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [rows, setRows] = useState([]);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [openDetailDialog, setOpenDetailDialog] = useState(false); // État pour le modal des détails
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [imageFiles, setImageFiles] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const data = await VendorController.getProduct();
//         console.log(data.data.products);
//         setRows(data.data.products);
//       } catch (error) {
//         console.error('Failed to fetch products:', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (selectedProduct) {
//       const images = [selectedProduct.product_images1, selectedProduct.product_images2, selectedProduct.product_images3];
//       setImagePreviews(images.filter(img => img).map(img => `${urlImage}/${img}`));
//     }
//   }, [selectedProduct]);

//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'numeric',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',

//     };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   };

//   const handleOpenDeleteDialog = (product) => {
//     setSelectedProduct(product);
//     setOpenDeleteDialog(true);
//   };

//   const handleCloseDeleteDialog = () => {
//     setOpenDeleteDialog(false);
//     setSelectedProduct(null);
//   };

//   const handleOpenEditDialog = (product) => {
//     setSelectedProduct(product);
//     setOpenEditDialog(true);
//     setImageFiles([]);
//     setImagePreviews([]);
//   };

//   const handleCloseEditDialog = () => {
//     setOpenEditDialog(false);
//     setSelectedProduct(null);
//   };



//   const handleOpenDetailDialog = (product) => {
//     setSelectedProduct(product);
//     setOpenDetailDialog(true);
//   };

//   const handleCloseDetailDialog = () => {
//     setOpenDetailDialog(false);
//     setSelectedProduct(null);
//   };

//   const handleDelete = async () => {
//     try {
//       await VendorController.deleteProduct(selectedProduct.id);
//       setRows(rows.filter((row) => row.id !== selectedProduct.id));
//       handleCloseDeleteDialog();
//     } catch (error) {
//       console.error('Failed to delete product:', error);
//     }
//   };

//   const handleEditSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append('product_name', event.target.product_name.value);
//       formData.append('product_description', event.target.product_description.value);
//       formData.append('price', event.target.price.value);
//       formData.append('stock', event.target.stock.value);
//       imageFiles.forEach((file, index) => {
//         formData.append(`product_image${index + 1}`, file);
//       });

//       await VendorController.updateProduct(selectedProduct.id, formData);
//       setRows(rows.map((row) => (row.id === selectedProduct.id ? { ...selectedProduct, ...formData } : row)));
//       handleCloseEditDialog();
//     } catch (error) {
//       console.error('Failed to update product:', error);
//     }
//   };

//   const handleImageChange = (event) => {
//     const files = Array.from(event.target.files);
//     setImageFiles(files);
//     setImagePreviews(files.map(file => URL.createObjectURL(file)));
//   };

//   return (
//     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//       <TableContainer sx={{ maxHeight: 500 }}>
//         <Table>
//           <TableHead sx={{ background: teelColor, color: whiteColor }}>
//             <TableRow>

//               <TableCell sx={{ color: whiteColor }} align="center"><strong>Product Image</strong></TableCell>
//               <TableCell sx={{ color: whiteColor }} align="center"><strong>Product Name</strong></TableCell>
//               {/* <TableCell sx={{ color: whiteColor }} align="center"><strong>Description</strong></TableCell> */}
//               <TableCell sx={{ color: whiteColor }} align="center"><strong>Price</strong></TableCell>
//               <TableCell sx={{ color: whiteColor}} align="center"><strong>Stock</strong></TableCell>
//               <TableCell sx={{ color: whiteColor,  width:200   }} align='center'><strong>Created At</strong></TableCell>
//               <TableCell sx={{ color: whiteColor }} align="center"><strong>Action</strong></TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
//               <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>

//                 <TableCell align="center">
//                   <img
//                     src={`${urlImage}/${row.product_images1}`}
//                     alt="Product"
//                     style={{
//                       width: '50px',
//                       height: '50px',
//                       borderRadius: '20%',
//                       objectFit: 'cover',
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell align="center">{row.product_name}</TableCell>
//                 {/* <TableCell align="center">{row.product_description}</TableCell> */}
//                 <TableCell align="center">{row.price}</TableCell>
//                 <TableCell align="center">{row.stock}</TableCell>
//                 <TableCell align='center'>{formatDate(row.created_at)}</TableCell>
//                 <TableCell align="center">
//                   <IconButton sx={{ color: teelColor }} aria-label="info" color="primary" onClick={() => handleOpenDetailDialog(row)}>
//                     <InfoIcon />
//                   </IconButton>
//                   <IconButton sx={{ color: lightOrangeColor }} aria-label="edit" onClick={() => handleOpenEditDialog(row)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton sx={{ color: redColor }} aria-label="delete" color="error" onClick={() => handleOpenDeleteDialog(row)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component="div"
//         count={rows.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} TransitionComponent={DeletTransition}>
//         <DialogTitle>Confirmation of Deletion</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete this item?
//         </DialogContent>
//         <DialogActions>
//           <MyButton sx={{ background: grayColor }} onClick={handleCloseDeleteDialog}>Annuler</MyButton>
//           <MyButton sx={{ background: redColor }} onClick={handleDelete} color="error">Supprimer</MyButton>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openEditDialog} onClose={handleCloseEditDialog} TransitionComponent={Transition}>
//         <DialogTitle>Edit Product</DialogTitle>
//         <DialogContent>
//           {selectedProduct && (
//             <form onSubmit={handleEditSubmit}>
//               <CustomTextField
//                 margin="dense"
//                 name="product_name"
//                 label="Product Name"
//                 fullWidth
//                 defaultValue={selectedProduct.product_name}
//               />
//               <CustomTextField
//                 margin="dense"
//                 name="product_description"
//                 label="Description"
//                 fullWidth
//                 defaultValue={selectedProduct.product_description}
//               />
//               <CustomTextField
//                 margin="dense"
//                 name="price"
//                 label="Price"
//                 fullWidth
//                 defaultValue={selectedProduct.price}
//               />
//               <CustomTextField
//                 margin="dense"
//                 name="stock"
//                 label="Stock"
//                 fullWidth
//                 defaultValue={selectedProduct.stock}
//               />
//               <input
//                 accept="image/*"
//                 multiple
//                 type="file"
//                 onChange={handleImageChange}
//                 style={{ display: 'none' }}
//                 id="upload-button"
//               />
//               <label htmlFor="upload-button">
//                 <MyButton variant="contained" color="primary" component="span">
//                   Upload Images
//                 </MyButton>
//               </label>
//               <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
//                 {imagePreviews.map((preview, index) => (
//                   <div key={index} style={{ marginRight: '10px' }}>
//                     <img src={preview} alt={`Product Preview ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
//                   </div>
//                 ))}
//               </div>
//               <DialogActions>
//                 <Button sx={{ color: blueColor }} onClick={handleCloseEditDialog} color="primary">Cancel</Button>
//                 <Button sx={{ color:teelColor }}  type="submit" >Save</Button>
//               </DialogActions>
//             </form>
//           )}
//         </DialogContent>
//       </Dialog>

//       <Dialog
//         open={openDetailDialog}
//         onClose={handleCloseDetailDialog}
//         TransitionComponent={Transition}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogContent>
//           {selectedProduct && (
//             <div style={{ display: 'flex', padding: '20px' }}>
//               {/* Colonne de gauche pour les images */}
//               <div style={{ flex: '1', marginRight: '20px' }}>
//                 {/* Image principale */}
//                 <img
//                   src={imagePreviews[0]}
//                   alt="Product Image"
//                   style={{ width: '100%', height: '300px', objectFit: 'cover', marginBottom: '10px' }}
//                 />
//                 {/* Miniatures */}
//                 <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//                   {imagePreviews.map((preview, index) => (
//                     <img
//                       key={index}
//                       src={preview}
//                       alt={`Thumbnail ${index + 1}`}
//                       style={{
//                         width: '50px',
//                         height: '60px',
//                         objectFit: 'cover',
//                         marginRight: '10px',
//                         border: index === 0 ? '2px solid #000' : '1px solid #ccc',
//                         cursor: 'pointer'
//                       }}
//                       onClick={() => {
//                         // Logique pour changer l'image principale
//                         const newPreviews = [...imagePreviews];
//                         [newPreviews[0], newPreviews[index]] = [newPreviews[index], newPreviews[0]];
//                         setImagePreviews(newPreviews);
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Colonne de droite pour les détails */}
//               <div style={{ flex: '1' }}>

//               <div style={{ marginBottom: '20px' }}>
//             <Typography variant="body2" color="textSecondary">
//             {new Date(selectedProduct.created_at).toLocaleDateString()} at {new Date(selectedProduct.created_at).toLocaleTimeString()}
//             </Typography>
//           </div>

//                 {/* Titre du produit */}
//                 <Typography variant="h4" gutterBottom>
//                   {selectedProduct.product_name} ({selectedProduct.stock})
//                 </Typography>



//                 {/* Prix */}
//                 <Typography variant="h5" gutterBottom>
//                   ${selectedProduct.price}
//                 </Typography>

//                 {/* Description */}
//                 <Typography variant="body1" paragraph>
//                   {/* {selectedProduct.product_description} */}
//                   {selectedProduct.product_description.length > 400
//                     ? `${selectedProduct.product_description.substring(0, 400)}...`
//                     : selectedProduct.product_description}
//                 </Typography>


//               </div>
//             </div>
//           )}
//           <DialogActions>
//             <Button sx={{ color: teelColor }} onClick={handleCloseDetailDialog} color="primary">Cancel</Button>
//           </DialogActions>
//         </DialogContent>
//       </Dialog>


//     </Paper>
//   );
// };

// export default VendorProductTables;




