import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { teelColor } from './config';


const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: teelColor, // Couleur du label par défaut
    '&.Mui-focused': {
      color: teelColor, // Couleur du label lorsqu'il est en focus
    },
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: teelColor, // Couleur de la bordure du select par défaut
    },
    '&:hover fieldset': {
      borderColor: teelColor, // Couleur de la bordure du select au survol
    },
    '&.Mui-focused fieldset': {
      borderColor: teelColor, // Couleur de la bordure du select lorsqu'il est focus
    },
  },
  '& .MuiSelect-select': {
    color: teelColor, // Couleur du texte dans le select
  },
}));

const CustomSelect = ({ value, onChange, label, options, ...props }) => {
  return (
    <StyledFormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  );
};

export default CustomSelect;
