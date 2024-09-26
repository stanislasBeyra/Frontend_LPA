import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import CustomTextField from 'src/utils/CustomTextField';
import CustomSelect from 'src/utils/CustomSelect';
import MyButton from 'src/utils/CustomButton';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Paper } from '@mui/material';
import { teelColor } from 'src/utils/config';
import LoginController from 'src/controllers/LoginController';

const ButtonStyled = styled(MyButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const AddEmployeeForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // État de chargement
  const [roleId, setRoleId] = useState('');
  const [roleregister, setRoleregister] = useState(''); // Ajouter cet état
  const [RolesDatas, setRolesDatas] = useState([]);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [salary, setSalary] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await LoginController.getrole();
        console.log('Rôles récupérés:', response.data);
        setRolesDatas(response.data);
      } catch (error) {
        console.error(error);
        setError("Impossible de récupérer les rôles");
        setShowError(true);
        toast.error("Impossible de récupérer les rôles");
        setTimeout(() => setShowError(false), 3000);
      }
    };
    fetchRoles();
  }, []);

  const handleEmployeeRegister = async (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !username || !email || !mobile || !salary || !roleId) {
      setError("Tous les champs sont requis.");
      setShowError(true);
      toast.error("Tous les champs sont requis.");
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const data = {
      firstname,
      lastname,
      username,
      email,
      mobile,
      salary,
      role: roleId,
      roleregister: roleregister,
    };

    console.log('Données à soumettre:', data);

    setLoading(true); // Début du chargement

    try {
      const response = await LoginController.submitRegister(data);
      setLoading(false); // Fin du chargement

      if (response.status === 201) {
        setSuccess(response.data.message);
        setShowSuccess(true);
        toast.success(response.data.message);
        setTimeout(() => setShowSuccess(false), 3000);
      } else if (response.status === 422) {
        setError(response.data.error);
        setShowError(true);
        toast.error(response.data.error[0]);
        setTimeout(() => setShowError(false), 3000);
      } else {
        setError(response.data.message || "Erreur lors de l'ajout de l'utilisateur");
        setShowError(true);
        toast.error(response.data.message || "Erreur lors de l'ajout de l'utilisateur");
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      setLoading(false); // Fin du chargement en cas d'erreur
      const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de l'ajout de l'utilisateur";
      setError(errorMessage);
      setShowError(true);
      toast.error(errorMessage);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const RolesData = RolesDatas.map((role) => ({
    value: role.id,
    label: role.role_name,
  }));

  const handleRoleChange = (e) => {
    setRoleId(e.target.value);
    const selectedRole = RolesDatas.find(role => role.id === e.target.value);
    if (selectedRole) {
      setRoleregister(selectedRole.role_name); // Stocker la valeur role_name
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', }}>
      <Typography variant="h4" sx={{ marginBottom: 3, margin: 5, color: teelColor }}>
        Ajouter des employés
      </Typography>

      {showError && <Alert severity="error">{error}</Alert>}
      {showSuccess && <Alert severity="success">{success}</Alert>}

      <Grid sx={{ margin: 10 }}>
        <form onSubmit={handleEmployeeRegister}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Prénom"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Nom de famille"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Salaire"
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelect
                value={roleId}
                onChange={handleRoleChange}
                label="Rôle"
                options={RolesData}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <ButtonStyled type="submit" variant="contained" sx={{ background: teelColor }} disabled={loading}>
                {loading ? <CircularProgress sx={{ color:teelColor }} size={24} /> : 'Ajouter un employé'}
              </ButtonStyled>
            </Grid>
          </Grid>
        </form>
      </Grid>

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
    </Paper>
  );
};

export default AddEmployeeForm;





// import React, { useState, useEffect } from 'react';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
// import Alert from '@mui/material/Alert';
// import { styled } from '@mui/material/styles';
// import CustomTextField from 'src/utils/CustomTextField';
// import CustomSelect from 'src/utils/CustomSelect';
// import MyButton from 'src/utils/CustomButton';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Paper } from '@mui/material';
// import { teelColor } from 'src/utils/config';
// import LoginController from 'src/controllers/LoginController';

// const ButtonStyled = styled(MyButton)(({ theme }) => ({
//   marginRight: theme.spacing(2),
// }));

// const AddEmployeeForm = () => {
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showError, setShowError] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [roleId, setRoleId] = useState('');
//   const [roleregister, setRoleregister] = useState(''); // Ajouter cet état
//   const [RolesDatas, setRolesDatas] = useState([]);
//   const [firstname, setFirstname] = useState('');
//   const [lastname, setLastname] = useState('');
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [salary, setSalary] = useState('');

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await LoginController.getrole();
//         console.log('Rôles récupérés:', response.data);
//         setRolesDatas(response.data);
//       } catch (error) {
//         console.error(error);
//         setError("Impossible de récupérer les rôles");
//         setShowError(true);
//         toast.error("Impossible de récupérer les rôles");
//         setTimeout(() => setShowError(false), 3000); // Masquer après 1 seconde
//       }
//     };
//     fetchRoles();
//   }, []);

//   const handleEmployeeRegister = async (e) => {
//     e.preventDefault();

//     if (!firstname || !lastname || !username || !email || !mobile || !salary || !roleId) {
//       setError("Tous les champs sont requis.");
//       setShowError(true);
//       toast.error("Tous les champs sont requis.");
//       setTimeout(() => setShowError(false), 3000); // Masquer après 1 seconde
//       return;
//     }

//     const data = {
//       firstname,
//       lastname,
//       username,
//       email,
//       mobile,
//       salary,
//       role: roleId,
//       roleregister:roleregister,
//     };

//     console.log('Données à soumettre:', data);

//     try {
//       const response = await LoginController.submitRegister(data);
//       console.log(response);
//       if (response.status === 201) {
//         setSuccess(response.data.message); // Afficher le message de succès venant du backend
//         setShowSuccess(true);
//         toast.success(response.data.message); // Afficher la notification
//         setTimeout(() => setShowSuccess(false), 3000); // Masquer après 1 seconde
//       } else if (response.status === 422) {
//         console.log(response.data.error); // Vérifier si c'est une erreur de validation
//         setError(response.data.error); // Afficher les erreurs dans l'interface
//         setShowError(true);
//         toast.error(response.data.error[0]); // Afficher une erreur toast
//         setTimeout(() => setShowError(false), 3000); // Masquer après 1 seconde
//       } else {
//         setError(response.data.message || "Erreur lors de l'ajout de l'utilisateur");
//         setShowError(true);
//         toast.error(response.data.message || "Erreur lors de l'ajout de l'utilisateur");
//         setTimeout(() => setShowError(false), 3000); // Masquer après 1 seconde
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de l'ajout de l'utilisateur";
//       setError(errorMessage);
//       setShowError(true);
//       toast.error(errorMessage);
//       setTimeout(() => setShowError(false), 3000); // Masquer après 1 seconde
//       console.error(error);
//     }
//   };

//   const RolesData = RolesDatas.map((role) => ({
//     value: role.id,
//     label: role.role_name,
//   }));

//   const handleRoleChange = (e) => {
//     setRoleId(e.target.value);
//     const selectedRole = RolesDatas.find(role => role.id === e.target.value);
//     if (selectedRole) {
//       setRoleregister(selectedRole.role_name); // Stocker la valeur role_name
//     }
//   };

//   return (
//     <Paper sx={{ width: '100%', overflow: 'hidden', }}>
//       <Typography variant="h4" sx={{ marginBottom: 3, margin: 5, color: teelColor }}>
//         Ajouter des employés
//       </Typography>

//       {showError && <Alert severity="error">{error}</Alert>}
//       {showSuccess && <Alert severity="success">{success}</Alert>}

//       <Grid sx={{ margin: 10 }}>
//         <form onSubmit={handleEmployeeRegister}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label="Prénom"
//                 value={firstname}
//                 onChange={(e) => setFirstname(e.target.value)}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label="Nom de famille"
//                 value={lastname}
//                 onChange={(e) => setLastname(e.target.value)}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label="Nom d'utilisateur"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label="Mobile"
//                 value={mobile}
//                 onChange={(e) => setMobile(e.target.value)}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label="Salaire"
//                 type="number"
//                 value={salary}
//                 onChange={(e) => setSalary(e.target.value)}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomSelect
//                 value={roleId}
//                 onChange={handleRoleChange} // Utiliser la fonction modifiée
//                 label="Rôle"
//                 options={RolesData}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <ButtonStyled type="submit" variant="contained" sx={{ background: teelColor }}>
//                 Ajouter un employé
//               </ButtonStyled>
//             </Grid>
//           </Grid>
//         </form>
//       </Grid>

//       <ToastContainer
//         position="top-center"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </Paper>
//   );
// };

// export default AddEmployeeForm;


