import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// Données adaptées pour correspondre aux en-têtes
const createData = (created_at, username, firstname, lastname, email) => {
  return { created_at, username, firstname, lastname, email };
};

const rows = [
  createData('2024-09-18', 'jdoe', 'John', 'Doe', 'jdoe@example.com'),
  createData('2024-09-17', 'asmith', 'Anna', 'Smith', 'asmith@example.com'),
  createData('2024-09-16', 'bwilliams', 'Brian', 'Williams', 'bwilliams@example.com'),
  createData('2024-09-15', 'mjohnson', 'Michael', 'Johnson', 'mjohnson@example.com'),
  createData('2024-09-14', 'lclark', 'Linda', 'Clark', 'lclark@example.com'),

];

const EmployeeListData = () => {
  const [page, setPage] = useState(0); // Gère la page actuelle
  const [rowsPerPage, setRowsPerPage] = useState(5); // Nombre de lignes par page

  // Gère le changement de page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Gère le changement de lignes par page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Remet la page à zéro lorsqu'on change le nombre de lignes par page
  };

  // Calcule les lignes à afficher en fonction de la pagination
  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table sx={{ minWidth: 550 }} aria-label="employee data table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Username</TableCell>
              <TableCell align="center">Firstname</TableCell>
              <TableCell align="center">Lastname</TableCell>
              <TableCell align="center">Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow
                key={row.username}
                sx={{
                  '&:last-of-type td, &:last-of-type th': { border: 0 },
                }}
              >
                <TableCell align="center">{row.created_at}</TableCell>
                <TableCell align="center">{row.username}</TableCell>
                <TableCell align="center">{row.firstname}</TableCell>
                <TableCell align="center">{row.lastname}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default EmployeeListData;
