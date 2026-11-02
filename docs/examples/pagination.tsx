import { atom, useAtom } from 'jotai';
import { Pagination } from '@fastsprout/reacd';

const pageAtom = atom({ pageIndex: 0, pageSize: 10 });

export function PaginationExample() {
  const [page, setPage] = useAtom(pageAtom);

  return (
    <Pagination
      label="Order pages"
      totalItems={23}
      value={page}
      onValueChange={setPage}
    />
  );
}

export function UrlPaginationExample() {
  return (
    <Pagination
      label="Linked order pages"
      totalItems={100}
      value={{ pageIndex: 0, pageSize: 10 }}
      navigation={{ href: '/orders?status=open#results' }}
    />
  );
}
