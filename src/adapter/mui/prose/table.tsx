import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { ProseTable } from '@fastsprout/reacd/adapter-runtime/core/prose.js';
import { MuiProseInline } from './inline.js';

export function MuiProseTable({ node }: { readonly node: ProseTable }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {node.header.map((cell, index) => (
              <TableCell key={index} scope="col">
                <MuiProseInline nodes={cell} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {node.rows.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, position) => (
                <TableCell key={position}>
                  <MuiProseInline nodes={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
