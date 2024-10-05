// import React, { useState, useEffect } from 'react';
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
import InfoIcon from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { teelColor, whiteColor } from 'src/utils/config';
import VendorController from 'src/controllers/VendorControllers';

const VendorOrdersDataListe = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);

  const handleOpen = (order) => {
    setSelectedOrder(order);
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

  const paginatedRows = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table sx={{ minWidth: 550 }} aria-label="orders data table">
            <TableHead sx={{ background: teelColor, color: whiteColor }}>
              <TableRow>
                <TableCell sx={{ color: whiteColor }} align="center">Date de Création</TableCell>
                <TableCell sx={{ color: whiteColor }} align="center">Nom d'utilisateur</TableCell>
                <TableCell sx={{ color: whiteColor }} align="center">Email</TableCell>
                <TableCell sx={{ color: whiteColor }} align="center">Total</TableCell>
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
                  <TableRow
                    key={order.order_id}
                    sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                  >
                    <TableCell align="center">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell align="center">{order.username}</TableCell>
                    <TableCell align="center">{order.useremail}</TableCell>
                    <TableCell align="center">{order.total_price} FCFA</TableCell>
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

      {/* Modal for order details */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="order-details-dialog"
      >
        <DialogTitle id="order-details-dialog">Détails de la commande</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <strong>Date de création : </strong> {new Date(selectedOrder.created_at).toLocaleDateString()}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <strong>Nom d'utilisateur : </strong> {selectedOrder.username}
                </Grid>
                <Grid item xs={12}>
                  <strong>Email : </strong> {selectedOrder.useremail}
                </Grid>
                <Grid item xs={12}>
                  <strong>Total : </strong> {selectedOrder.total_price} FCFA
                </Grid>
                <Grid item xs={12}>
                  <strong>Produits : </strong>
                  <ul>
                    {selectedOrder.products.map((product, index) => (
                      <li key={index}>
                        <strong>{product.product_name}</strong> - {product.quantity} unités - {product.price} FCFA
                      </li>
                    ))}
                  </ul>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VendorOrdersDataListe;


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
// import VendorController from 'src/controllers/VendorControllers';
// import { teelColor, whiteColor } from 'src/utils/config';

// const VendorOrdersDataListe = () => {
//   const [orders, setOrders] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const orderResponse = await VendorController.getTheVendororders();
//         console.log('Commandes du vendeur :', orderResponse);
//         setOrders(orderResponse.data.orders);
//       } catch (error) {
//         console.error('Erreur lors du chargement des commandes :', error);
//       }
//     };
//     fetchOrders();
//   }, []);

//   const paginatedRows = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//       <TableContainer sx={{ maxHeight: 500 }}>
//         <Table sx={{ minWidth: 550 }} aria-label="orders data table">
//           <TableHead sx={{ background: teelColor, color: whiteColor }}>
//             <TableRow>
//               <TableCell sx={{ color: whiteColor }} align="center">Date de Création</TableCell>
//               <TableCell sx={{ color: whiteColor }} align="center">Nom d'utilisateur</TableCell>
//               <TableCell sx={{ color: whiteColor }} align="center">Email</TableCell>
//               <TableCell sx={{ color: whiteColor }} align="center">Total</TableCell>
//               <TableCell sx={{ color: whiteColor }} align="center"><strong>Action</strong></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {orders.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">Aucune commande trouvée.</TableCell>
//               </TableRow>
//             ) : (
//               paginatedRows.map((order) => (
//                 <TableRow
//                   key={order.order_id}
//                   sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
//                 >
//                   <TableCell align="center">{new Date(order.created_at).toLocaleDateString()}</TableCell>
//                   <TableCell align="center">{order.username}</TableCell>
//                   <TableCell align="center">{order.useremail}</TableCell>
//                   <TableCell align="center">{order.total_price} FCFA</TableCell>
//                   <TableCell align="center">
//                     <IconButton sx={{ color: teelColor }} aria-label="info" onClick={() => console.log('Détails commande', order)}>
//                       <InfoIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={orders.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//   );
// };

// export default VendorOrdersDataListe;
