import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 500,
  },
})

const PropsTable = ({ componentProps }) => {
  const classes = useStyles()

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} size='small' aria-label='props table for the component'>
        <TableHead>
          <TableRow>
            <TableCell>Prop Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Is Required?</TableCell>
            <TableCell>Default Value</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {componentProps.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>
                {row.parentType &&
                  <React.Fragment>
                    {row.parentType.name}
                    {row.parentType.name === 'union' &&
                      <ul>
                        {row.type.value.map((item, i) => <li key={i}>{item.name}</li>)}
                      </ul>
                    }
                  </React.Fragment>
                }
              </TableCell>
              <TableCell>
                {row.required
                  ? <span style={{ color: 'red' }}>required</span>
                  : 'optional'
                }
              </TableCell>
              <TableCell>
                {row.defaultValue &&
                  row.defaultValue.value
                }
              </TableCell>
              <TableCell>
                {row.docblock}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default PropsTable
