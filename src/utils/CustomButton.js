import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import colors from './config'; // Assurez-vous que les couleurs sont importées correctement

// Crée un composant Button personnalisé en utilisant `styled`
const CustomButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'customColor', // Ignore la prop customColor pour l'élément DOM
})(({ theme, customColor }) => ({
  backgroundColor: customColor || colors.teelColor,
  color: '#fff',
  border: 'none',
  borderRadius: '4px', // Moins arrondi, ajustez la valeur selon vos besoins
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.2s ease', // Transition pour les effets de hover et active
  '&:hover': {
    backgroundColor: customColor || colors.teelColor,
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  },
  '&:active': {
    backgroundColor: customColor || colors.teelColor,
    boxShadow: 'inset 0 4px 6px rgba(0, 0, 0, 0.2)', // Ombre intérieure pour simuler l'enfoncement
    transform: 'translateY(2px)', // Simule l'enfoncement du bouton
    outline: 'none',
  },
}));

// Composant bouton personnalisé
function MyButton({ children, customColor, sx, ...props }) {
  return (
    <CustomButton customColor={customColor} sx={sx} {...props}>
      {children}
    </CustomButton>
  );
}

export default MyButton;
