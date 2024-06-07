import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

type Props = {
  pages: number;
  page: number;
  isAdmin?: boolean;
  keyword: string;
  urlPrefix: string; // Add this new prop
};

const Paginate = ({
  pages,
  page,
  isAdmin = false,
  keyword = "",
  urlPrefix,
}: Props) => {
  return (
    <>
      {pages > 1 && (
        <Pagination>
          {[...Array(pages).keys()].map((x) => (
            <LinkContainer
              key={x + 1}
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}`
                  : `${urlPrefix}/${x + 1}` // Use the urlPrefix prop here
              }
            >
              <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
            </LinkContainer>
          ))}
        </Pagination>
      )}
    </>
  );
};

export default Paginate;
