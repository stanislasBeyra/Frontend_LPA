import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableRow, TableHead, TableBody, TableCell, TableContainer,
  TablePagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, Alert, CircularProgress, Card, CardMedia, CardContent, Typography
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MyButton from 'src/utils/CustomButton';
import { teelColor, whiteColor } from 'src/utils/config';
import VendorController from 'src/controllers/VendorControllers';
import { urlImage } from 'src/utils/config';

const VendorOrdersDataListe = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [productPage, setProductPage] = useState(0);
  const productsPerPage = 3;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = (order) => {
    setSelectedOrder(order);
    setProductPage(0);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleProductNextPage = () => {
    setProductPage((prevPage) => prevPage + 1);
  };

  const handleProductPreviousPage = () => {
    setProductPage((prevPage) => prevPage - 1);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderResponse = await VendorController.getTheVendororders();
        setOrders(orderResponse.data.orders);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes :', error);
      }
    };
    fetchOrders();
  }, []);

  const validatedorder = async (orderId) => {
    try {
      setLoading(true);
      const dataid = { orderId };
      const response = await VendorController.validetedorder(dataid);
      const responsedata = response.data;

      setSuccess(responsedata.message || 'Validation effectuée');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setLoading(false);
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la validation de la commande :', error);
      setError(error.response?.data?.message || "Impossible de récupérer les rôles");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const paginatedRows = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusOrders = (status) => {
    switch (status) {
      case '1': return 'Pending';
      case '2': return 'Processing';
      case '3': return 'Validated';
      case '4': return 'Delivered';
      case '5': return 'Cancelled';
      default: return 'Unknown status';
    }
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {showError && <Alert severity="error">{error}</Alert>}
        {showSuccess && <Alert severity="success">{success}</Alert>}

        <TableContainer sx={{ maxHeight: 500 }}>
          <Table sx={{ minWidth: 550 }} aria-label="orders data table">
            <TableHead sx={{ background: teelColor, color: whiteColor }}>
              <TableRow>
                <TableCell sx={{ color: whiteColor }} align="center">Date de Création</TableCell>
                <TableCell sx={{ color: whiteColor }} align="center">Nom d'utilisateur</TableCell>
                <TableCell sx={{ color: whiteColor }} align="center">Email</TableCell>
                <TableCell sx={{ color: whiteColor }} align="center">Total</TableCell>
                <TableCell sx={{ color: whiteColor }} align="center">Status</TableCell>
                <TableCell sx={{ color: whiteColor }} align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Aucune commande trouvée.</TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((order) => (
                  <TableRow key={order.order_id}>
                    <TableCell align="center">
                      {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                    </TableCell>
                    <TableCell align="center">{order.username}</TableCell>
                    <TableCell align="center">{order.useremail}</TableCell>

                    <TableCell align="center">{order.total_price} FCFA</TableCell>
                    <TableCell align="center">
                      {order.products && order.products.length > 0
                        ? getStatusOrders(order.products[0].status)
                        : 'Statut not found'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton sx={{ color: teelColor }} aria-label="info" onClick={() => handleOpen(order)}>
                        <InfoIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="order-details-dialog"
      >
        <DialogTitle id="order-details-dialog" sx={{ textAlign: 'center' }}>
          Détails de la commande
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <strong>Date de création : </strong>{' '}
                      {new Date(selectedOrder.created_at).toLocaleDateString()}
                    </Grid>
                    <Grid item xs={12}>
                      <strong>Nom d'utilisateur : </strong> {selectedOrder.username}
                    </Grid>
                    <Grid item xs={12}>
                      <strong>Email : </strong> {selectedOrder.useremail}
                    </Grid>
                    <Grid item xs={12}>
                      <strong>Total : </strong> {selectedOrder.total_price} FCFA
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid container spacing={2} alignItems="stretch">
                    {selectedOrder.products && selectedOrder.products.length > 0 ? (
                      <>
                        {selectedOrder.products
                          .slice(productPage * productsPerPage, productPage * productsPerPage + productsPerPage)
                          .map((product, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Card
                                sx={{
                                  height: '210px',
                                  width: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  marginBottom: 2
                                }}
                              >
                                <CardMedia
                                  component="img"
                                  height="100"
                                  image={product.product_images1 ? `${urlImage}${product.product_images1}` : '/images/default-product.png'}
                                  alt={product.product_name}
                                />
                                <CardContent>
                                  <Typography variant="h7" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                                    {product.product_name}
                                  </Typography>
                                  <Typography variant="body2">
                                    {product.quantity} unités - {product.price} FCFA
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        {selectedOrder.products.length > 3 && (
                          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                              onClick={handleProductPreviousPage}
                              disabled={productPage === 0}
                            >
                              Précédent
                            </Button>
                            <Button
                              onClick={handleProductNextPage}
                              disabled={productPage >= Math.ceil(selectedOrder.products.length / productsPerPage) - 1}
                            >
                              Suivant
                            </Button>
                          </Grid>
                        )}
                      </>
                    ) : (
                      <Typography>Aucun produit dans cette commande.</Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <MyButton bgColor={teelColor} color={whiteColor} onClick={() => validatedorder(selectedOrder.order_id)} >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Valider la commande'}
          </MyButton>

          <Button onClick={handleClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ textAlign: 'center' }}>Détails de la commande</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <strong>Date de création :</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}
                </Grid>
                <Grid item xs={12} md={6}>
                  <strong>Nom d'utilisateur :</strong> {selectedOrder.username}
                </Grid>
                <Grid item xs={12}>
                  <strong>Email :</strong> {selectedOrder.useremail}
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <MyButton bgColor={teelColor} color={whiteColor} onClick={() => validatedorder(selectedOrder.order_id)}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Valider la commande'}
          </MyButton>
          <Button onClick={handleClose} color="primary">Fermer</Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default VendorOrdersDataListe;


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
// import InfoIcon from '@mui/icons-material/Info';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Grid';
// import Alert from '@mui/material/Alert';
// import CircularProgress from '@mui/material/CircularProgress';


// import { Card, CardMedia, CardContent, Typography } from '@mui/material';
// import MyButton from 'src/utils/CustomButton';

// import { teelColor, whiteColor } from 'src/utils/config';
// import VendorController from 'src/controllers/VendorControllers';
// import { urlImage } from 'src/utils/config';

// const VendorOrdersDataListe = () => {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [productPage, setProductPage] = useState(0);
//   const productsPerPage = 3; // Limite d'affichage des produits par page
//   const [open, setOpen] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showError, setShowError] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleOpen = (order) => {
//     setSelectedOrder(order);
//     setProductPage(0); // Réinitialiser à la première page des produits
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedOrder(null);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleProductNextPage = () => {
//     setProductPage((prevPage) => prevPage + 1);
//   };

//   const handleProductPreviousPage = () => {
//     setProductPage((prevPage) => prevPage - 1);
//   };

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const orderResponse = await VendorController.getTheVendororders();
//         console.log('commande :::', orderResponse.data.orders);
//         setOrders(orderResponse.data.orders);
//       } catch (error) {
//         console.error('Erreur lors du chargement des commandes :', error);
//       }
//     };
//     fetchOrders();
//   }, []);

//   // Fonction pour valider une commande
//   const validatedorder = async (orderId) => {
//     try {

//       setLoading(true)

//       const dataid = {
//         orderId: orderId
//       }
//       console.log('ID de la commande à valider :', dataid);
//       const response = await VendorController.validetedorder(dataid);
//       console.log('Réponse de la validation :', response);
//       console.log('dfcghj', response.data.message || 'validation effectuer')
//       const responsedata = response.data
//       setSuccess(responsedata.message || 'validation effectuer')
//       setSuccess(true)
//       setTimeout(() => setSuccess(false), 3000);
//       setLoading(false)
//       handleClose()

//       // Logique de validation réussie à ajouter ici, ex : mettre à jour les commandes après validation
//     } catch (error) {
//       console.error('Erreur lors de la validation de la commande :', error);
//       setError(error.response.data.message || "Impossible de récupérer les rôles");
//       setShowError(true);
//       setTimeout(() => setShowError(false), 3000);
//     }
//   };

//   const paginatedRows = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   const getStatusOrders = (status) => {
//     switch (status) {
//       case '1':
//         return 'Pending'; // En attente
//       case '2':
//         return 'Processing'; // En traitement
//       case '3':
//         return 'Validated'; // Validé
//       case '4':
//         return 'Delivered'; // Livré
//       case '5':
//         return 'Cancelled'; // Annulé
//       default:
//         return 'Unknown status'; // Statut inconnu
//     }
//   };

//   // Exemple d'utilisation dans un tableau
//   console.log(getStatusOrders(1));


//   return (
//     <>
//       <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//         {error && <Alert severity="error">{error}</Alert>}
//         {success && <Alert severity="success">{success}</Alert>}

//         <TableContainer sx={{ maxHeight: 500 }}>
//           <Table sx={{ minWidth: 550 }} aria-label="orders data table">
//             <TableHead sx={{ background: teelColor, color: whiteColor }}>
//               <TableRow>
//                 <TableCell sx={{ color: whiteColor }} align="center">Date de Création</TableCell>
//                 <TableCell sx={{ color: whiteColor }} align="center">Nom d'utilisateur</TableCell>
//                 <TableCell sx={{ color: whiteColor }} align="center">Email</TableCell>
//                 <TableCell sx={{ color: whiteColor }} align="center">Total</TableCell>
//                 <TableCell sx={{ color: whiteColor }} align="center">status</TableCell>
//                 <TableCell sx={{ color: whiteColor }} align="center"><strong>Action</strong></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {orders.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center">Aucune commande trouvée.</TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedRows.map((order) => (

//                   <TableRow
//                     key={order.order_id}
//                     sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
//                   >
//                     <TableCell align="center">
//                       {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
//                     </TableCell>

//                     <TableCell align="center">{order.username}</TableCell>
//                     <TableCell align="center">{order.useremail}</TableCell>
//                     {/* <TableCell align="center">{order.status}</TableCell> */}
//                     {/* <TableCell align="center">
//                       {order.products.length > 0 ?getStatusOrders(order.products[0].status)  : 'Statut indisponible'}
//                     </TableCell> */}
//                     <TableCell align="center">
//                       {order.products && order.products.length > 0
//                         ? getStatusOrders(order.products[0].status)
//                         : 'Statut not found'}
//                     </TableCell>
//                     <TableCell align="center">{order.total_price} FCFA</TableCell>
//                     <TableCell align="center">
//                       <IconButton sx={{ color: teelColor }} aria-label="info" onClick={() => handleOpen(order)}>
//                         <InfoIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={orders.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>

//       {/* Modal for order details */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         fullWidth
//         maxWidth="md"
//         aria-labelledby="order-details-dialog"
//       >
//         <DialogTitle id="order-details-dialog" sx={{ textAlign: 'center' }}>
//           Détails de la commande
//         </DialogTitle>
//         <DialogContent dividers>
//           {selectedOrder && (
//             <>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={6}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12}>
//                       <strong>Date de création : </strong>{' '}
//                       {new Date(selectedOrder.created_at).toLocaleDateString()}
//                     </Grid>
//                     <Grid item xs={12}>
//                       <strong>Nom d'utilisateur : </strong> {selectedOrder.username}
//                     </Grid>
//                     <Grid item xs={12}>
//                       <strong>Email : </strong> {selectedOrder.useremail}
//                     </Grid>
//                     <Grid item xs={12}>
//                       <strong>Total : </strong> {selectedOrder.total_price} FCFA
//                     </Grid>
//                   </Grid>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Grid container spacing={2} alignItems="stretch">
//                     {selectedOrder.products && selectedOrder.products.length > 0 ? (
//                       <>
//                         {selectedOrder.products
//                           .slice(productPage * productsPerPage, productPage * productsPerPage + productsPerPage)
//                           .map((product, index) => (
//                             <Grid item xs={12} sm={6} md={4} key={index}>
//                               <Card
//                                 sx={{
//                                   height: '210px',
//                                   width: '100%',
//                                   display: 'flex',
//                                   flexDirection: 'column',
//                                   justifyContent: 'space-between',
//                                   marginBottom: 2
//                                 }}
//                               >
//                                 <CardMedia
//                                   component="img"
//                                   height="100"
//                                   image={product.product_images1 ? `${urlImage}${product.product_images1}` : '/images/default-product.png'}
//                                   alt={product.product_name}
//                                 />
//                                 <CardContent>
//                                   <Typography variant="h7" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
//                                     {product.product_name}
//                                   </Typography>
//                                   <Typography variant="body2">
//                                     {product.quantity} unités - {product.price} FCFA
//                                   </Typography>
//                                 </CardContent>
//                               </Card>
//                             </Grid>
//                           ))}
//                         {selectedOrder.products.length > 3 && (
//                           <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                             <Button
//                               onClick={handleProductPreviousPage}
//                               disabled={productPage === 0}
//                             >
//                               Précédent
//                             </Button>
//                             <Button
//                               onClick={handleProductNextPage}
//                               disabled={productPage >= Math.ceil(selectedOrder.products.length / productsPerPage) - 1}
//                             >
//                               Suivant
//                             </Button>
//                           </Grid>
//                         )}
//                       </>
//                     ) : (
//                       <Typography>Aucun produit dans cette commande.</Typography>
//                     )}
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <MyButton bgColor={teelColor} color={whiteColor} onClick={() => validatedorder(selectedOrder.order_id)} >
//             {loading ? <CircularProgress size={24} color="inherit" /> : 'Valider la commande'}
//           </MyButton>

//           <Button onClick={handleClose} color="primary">
//             Fermer
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default VendorOrdersDataListe;



