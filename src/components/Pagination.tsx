import { Pagination } from "@mui/material";
import React from "react";

type Props = {
  pages: number;
  page: number;
  setPage: (page: number) => void;
};

const PaginationContainer = ({ pages, page, setPage }: Props) => {
  return (
    <section className="flex justify-center absolute bottom-0 left-0 right-0 mb-8">
      <Pagination
        count={pages}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
        variant="outlined"
      />
    </section>
  );
};

export default PaginationContainer;
