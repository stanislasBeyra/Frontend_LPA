import React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { teelColor } from './config';


const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: teelColor, // Couleur de la bordure par défaut
    },
    '&:hover fieldset': {
      borderColor: teelColor, // Couleur de la bordure au survol
    },
    '&.Mui-focused fieldset': {
      borderColor: teelColor, // Couleur de la bordure lorsqu'il est en focus
    },
  },
  '& .MuiInputLabel-root': {
    color: teelColor, // Couleur du label par défaut
    '&.Mui-focused': {
      color: teelColor, // Couleur du label lorsqu'il est en focus
    },
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary, // Couleur du texte dans le champ, en utilisant la couleur principale du texte du thème
  },
}));

const CustomTextField = (props) => {
  return <StyledTextField {...props} />;
};

export default CustomTextField;
