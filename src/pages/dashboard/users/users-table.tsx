import {
  Button,
  Card,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import Loader from "../../../components/UI/loader";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { getUsersList } from "../../../redux/users/user-list";
import authAxios from "../../../utils/auth-axios";
import { setError } from "../../../utils/error";
import { getDate } from "../../../utils/helper";
import toast from "react-hot-toast";
import React from "react";
import { Pagination } from "react-bootstrap";

const UserTable = () => {
  const dispatch = useAppDispatch();
  const {
    users,
    loading,
    page: curPage,
    pages,
  } = useAppSelector((state) => state.userList);

  const cols = ["Name", "Email", "Created At", "Admin", "Promote", "Delete"];
  const [refresh, setRefresh] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(curPage);

  const onDelete = (id: string | number, userName: string) => {
    if (
      window.confirm(`Are you sure you want to delete the user ${userName}?`)
    ) {
      authAxios
        .delete(`/users/${id}`)
        .then((res) => {
          toast.success(`${userName} has been deleted`);
          setRefresh((prev) => (prev = !prev));
        })
        .catch((e) => toast.error(setError(e)));
    }
  };

  const onPromote = (id: string | number, userName: string) => {
    if (window.confirm(`Are you sure you want to promote ${userName}?`)) {
      authAxios
        .post(`/users/promote/${id}`)
        .then((res) => {
          toast.success(`${userName} has been promoted`);
          setRefresh((prev) => (prev = !prev));
        })
        .catch((e) => toast.error(setError(e)));
    }
  };

  useEffect(() => {
    dispatch(getUsersList({ page, query: search }));
  }, [dispatch, refresh, page, search]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Card className="mt-5">
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#c62828" }}>
                <TableRow>
                  {cols.map((col: any) => (
                    <TableCell
                      key={col}
                      sx={{
                        color: "white",
                        textTransform: "uppercase",
                        fontWeight: "normal",
                        fontSize: "0.875rem",
                        py: 1,
                        px: 2,
                      }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell sx={{ color: "gray" }}>{user.name}</TableCell>
                    <TableCell sx={{ color: "gray" }}>{user.email}</TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {getDate(user.createdAt)}
                    </TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {user.isAdmin ? (
                        <FaCheck color="green" />
                      ) : (
                        <FaTimes color="red" />
                      )}
                    </TableCell>
                    <TableCell>
                      {!user?.isAdmin && (
                        <Button
                          onClick={() => onPromote(user._id, user.name)}
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{
                            borderRadius: 2,
                            backgroundColor: "#81c784",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#4caf50",
                            },
                          }}
                        >
                          Promote
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => onDelete(user._id, user.name)}
                        variant="contained"
                        size="large"
                        sx={{
                          backgroundColor: "#ef5350",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#c62828",
                          },
                          borderRadius: 2,
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </>
  );
};

export default UserTable;
