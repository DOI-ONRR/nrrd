import React from 'react';
import TableCell from '@material-ui/core/TableCell';

const GomesaTableCell = ({ children, recipientColumn = false, ...props }) => {
  return (
    <TableCell
      style={recipientColumn ? { width: '350px' } : undefined}
      {...props}
    >
      {children}
    </TableCell>
  );
};

export default GomesaTableCell;