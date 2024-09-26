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
import Slide from '@mui/material/Slide';
import EmployeController from 'src/controllers/EmployeeController';
import { teelColor, lightOrangeColor, redColor, whiteColor } from 'src/utils/config';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const DeletTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EmployeeListData = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    const fetchAllEmployee = async () => {
      try {
        const data = await EmployeController.getAllEmployee();
        setEmployees(data.data.employees);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };
    fetchAllEmployee();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleOpenDetailDialog = (employee) => {
    setSelectedEmployee(employee);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  const handleOpenEditDialog = (employee) => {
    setSelectedEmployee(employee);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (employee) => {
    setSelectedEmployee(employee);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteEmployee = async () => {
    try {
      await EmployeController.deleteEmployee(selectedEmployee.id); // Remplacez par la méthode de suppression appropriée
      setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id)); // Met à jour la liste des employés
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table sx={{ minWidth: 550 }} aria-label="employee data table">
          <TableHead sx={{ background: teelColor, color: whiteColor }}>
            <TableRow>
              <TableCell sx={{ color: whiteColor }} align="center">Created At</TableCell>
              <TableCell sx={{ color: whiteColor }} align="center">Username</TableCell>
              <TableCell sx={{ color: whiteColor }} align="center">Firstname</TableCell>
              <TableCell sx={{ color: whiteColor }} align="center">Lastname</TableCell>
              <TableCell sx={{ color: whiteColor }} align="center">Email</TableCell>
              <TableCell sx={{ color: whiteColor }} align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((employee) => (
              <TableRow
                key={employee.id}
                sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
              >
                <TableCell align="center">{formatDate(employee.created_at)}</TableCell>
                <TableCell align="center">{employee.username}</TableCell>
                <TableCell align="center">{employee.firstname}</TableCell>
                <TableCell align="center">{employee.lastname}</TableCell>
                <TableCell align="center">{employee.email}</TableCell>
                <TableCell align="center">
                  <IconButton sx={{ color: teelColor }} aria-label="info" onClick={() => handleOpenDetailDialog(employee)}>
                    <InfoIcon />
                  </IconButton>
                  <IconButton sx={{ color: lightOrangeColor }} aria-label="edit" onClick={() => handleOpenEditDialog(employee)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton sx={{ color: redColor }} aria-label="delete" onClick={() => handleOpenDeleteDialog(employee)}>
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
        count={employees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog pour les détails */}
      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} TransitionComponent={Transition}>
        <DialogTitle>Détails de l'employé</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <div>
              <p><strong>Nom:</strong> {selectedEmployee.firstname} {selectedEmployee.lastname}</p>
              <p><strong>Username:</strong> {selectedEmployee.username}</p>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Mobile:</strong> {selectedEmployee.mobile}</p>
              <p><strong>Salaire net:</strong> {selectedEmployee.net_salary}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} color="primary">Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour la suppression */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} TransitionComponent={DeletTransition}>
        <DialogTitle>Supprimer l'employé</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cet employé ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Annuler</Button>
          <Button onClick={handleDeleteEmployee} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour la modification (à implémenter selon votre besoin) */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} TransitionComponent={Transition}>
        <DialogTitle>Modifier l'employé</DialogTitle>
        <DialogContent>
          {/* Formulaire de modification à ajouter ici */}
          {selectedEmployee && <p>Formulaire de modification pour {selectedEmployee.firstname}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">Annuler</Button>
          <Button onClick={handleCloseEditDialog} color="primary">Sauvegarder</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EmployeeListData;





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
// import EmployeController from 'src/controllers/EmployeeController';
// import { teelColor,lightOrangeColor,redColor, whiteColor } from 'src/utils/config';


// const EmployeeListData = () => {
//   const [employees, setEmployees] = useState([]); // État pour stocker les données des employés
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // Gère le changement de page
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   // Gère le changement de lignes par page
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Calcule les lignes à afficher en fonction de la pagination
//   const paginatedRows = employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   useEffect(() => {
//     const fetchAllEmployee = async () => {
//       try {
//         const data = await EmployeController.getAllEmployee();
//         setEmployees(data.data.employees); // Met à jour l'état avec les données récupérées
//       } catch (error) {
//         console.error('Failed to fetch employees:', error);
//       }
//     };

//     fetchAllEmployee();
//   }, []);

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

//   return (
//     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//       <TableContainer sx={{ maxHeight: 500 }}>
//         <Table sx={{ minWidth: 550 }} aria-label="employee data table">
//           <TableHead sx={{ background: teelColor, color: whiteColor }}>
//             <TableRow>
//               <TableCell sx={{ color:whiteColor }} align="center">Created At</TableCell>
//               <TableCell sx={{ color:whiteColor }} align="center">Username</TableCell>
//               <TableCell sx={{ color:whiteColor }} align="center">Firstname</TableCell>
//               <TableCell sx={{ color:whiteColor }} align="center">Lastname</TableCell>
//               <TableCell sx={{ color:whiteColor }} align="center">Email</TableCell>
//               <TableCell sx={{ color:whiteColor }} align="center"><strong>Action</strong></TableCell>

//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedRows.map((employee) => (
//               <TableRow
//                 key={employee.id} // Utilisez l'id comme clé unique
//                 sx={{
//                   '&:last-of-type td, &:last-of-type th': { border: 0 },
//                 }}
//               >
//                 <TableCell align="center"> {formatDate(employee.created_at)}</TableCell>
//                 <TableCell align="center">{employee.username}</TableCell>
//                 <TableCell align="center">{employee.firstname}</TableCell>
//                 <TableCell align="center">{employee.lastname}</TableCell>
//                 <TableCell align="center">{employee.email}</TableCell>
//                 <TableCell align="center">
//                   <IconButton sx={{ color: teelColor }} aria-label="info" color="primary" onClick={() => handleOpenDetailDialog(employee)}>
//                     <InfoIcon />
//                   </IconButton>
//                   <IconButton sx={{ color: lightOrangeColor }} aria-label="edit" onClick={() => handleOpenEditDialog(employee)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton sx={{ color: redColor }} aria-label="delete" color="error" onClick={() => handleOpenDeleteDialog(employee)}>
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
//         count={employees.length} // Utilisez la longueur de l'état des employés
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//   );
// };

// export default EmployeeListData;


