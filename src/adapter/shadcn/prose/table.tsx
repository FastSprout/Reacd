import type { ProseTable } from '@fastsprout/reacd/adapter-runtime/core/prose.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../vendor/ui/table.js';
import { ShadcnProseInline } from './inline.js';

export function ShadcnProseTable({ node }: { readonly node: ProseTable }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {node.header.map((cell, index) => (
            <TableHead key={index}>
              <ShadcnProseInline nodes={cell} />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {node.rows.map((row, index) => (
          <TableRow key={index}>
            {row.map((cell, position) => (
              <TableCell key={position}>
                <ShadcnProseInline nodes={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
