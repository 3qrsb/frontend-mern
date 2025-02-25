import React from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { Link } from "react-router-dom";

type Props = {
  pages: number;
  page: number;
  isAdmin?: boolean;
  keyword: string;
  urlPrefix: string;
};

const Paginate: React.FC<Props> = ({
  pages,
  page,
  isAdmin = false,
  keyword = "",
  urlPrefix,
}) => {
  const generateLink = (pageNumber: number) => {
    if (!isAdmin) {
      return keyword
        ? `/search/${keyword}/page/${pageNumber}`
        : `/page/${pageNumber}`;
    }
    return `${urlPrefix}/${pageNumber}`;
  };

  return (
    <>
      {pages > 1 && (
        <Pagination
          count={pages}
          page={page}
          color="primary"
          shape="rounded"
          renderItem={(item) =>
            item.page !== null ? (
              <PaginationItem
                component={Link}
                to={generateLink(item.page)}
                {...item}
              />
            ) : (
              <PaginationItem {...item} />
            )
          }
        />
      )}
    </>
  );
};

export default Paginate;
