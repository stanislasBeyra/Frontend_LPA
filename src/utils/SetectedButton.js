import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { teelColor } from './config';



const CustomButtonStyled = styled(Button)(({ theme, customColor }) => ({
  backgroundColor: customColor || teelColor,
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: customColor || teelColor,
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  },
  '&:active': {
    backgroundColor: customColor || teelColor,
    boxShadow: 'inset 0 4px 6px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(2px)',
    outline: 'none',
  },
}));

const CustonSelectImageButton = ({ children, customColor, ...props }) => {
  return (
    <CustomButtonStyled customColor={customColor} {...props}>
      {children}
    </CustomButtonStyled>
  );
};

export default CustonSelectImageButton;
