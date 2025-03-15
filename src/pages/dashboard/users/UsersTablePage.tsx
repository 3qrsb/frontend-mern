import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../redux";
import {
  getUsersList,
  deleteUser,
  promoteAdmin,
  promoteSeller,
  demoteSeller,
} from "../../../redux/users/user-list";
import Loader from "../../../components/UI/loader";
import DataTable, { Column } from "../../../components/UI/DataTable";
import ConfirmationDialog from "../../../components/UI/ConfirmationDialog";
import UserRow from "./UserRow";
import { User } from "../../../types/user";
import Paginate from "../../../components/UI/paginate";

const userColumns: Column[] = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Role", key: "role" },
  { label: "Actions", key: "actions" },
];

const UserTablePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, page, pages } = useAppSelector(
    (state) => state.userList
  );
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedAction, setSelectedAction] = useState<
    "delete" | "promoteAdmin" | "promoteSeller" | "demoteSeller" | null
  >(null);

  const handleActionClick = (
    action: "delete" | "promoteAdmin" | "promoteSeller" | "demoteSeller",
    user: User
  ) => {
    setSelectedUser(user);
    setSelectedAction(action);
    setConfirmationOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedUser && selectedAction) {
      try {
        if (selectedAction === "delete") {
          await dispatch(deleteUser(selectedUser._id)).unwrap();
          toast.success(`${selectedUser.name} has been deleted`);
        } else if (selectedAction === "promoteAdmin") {
          await dispatch(promoteAdmin(selectedUser._id)).unwrap();
          toast.success(`${selectedUser.name} has been promoted to admin`);
        } else if (selectedAction === "promoteSeller") {
          await dispatch(promoteSeller(selectedUser._id)).unwrap();
          toast.success(`${selectedUser.name} has been promoted to seller`);
        } else if (selectedAction === "demoteSeller") {
          await dispatch(demoteSeller(selectedUser._id)).unwrap();
          toast.success(`${selectedUser.name} has been demoted from seller`);
        }
      } catch (error) {}
    }
    setConfirmationOpen(false);
    setSelectedUser(null);
    setSelectedAction(null);
  };

  const handleCancel = () => {
    setConfirmationOpen(false);
    setSelectedUser(null);
    setSelectedAction(null);
  };

  useEffect(() => {
    dispatch(getUsersList({ page, query: "" }));
  }, [dispatch, page]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <DataTable columns={userColumns}>
          {users?.map((user: User) => (
            <UserRow
              key={user._id}
              user={user}
              onPromote={(id, name, action) => handleActionClick(action, user)}
              onDelete={() => handleActionClick("delete", user)}
            />
          ))}
        </DataTable>
      )}
      <Box>
        <Paginate
          pages={pages}
          page={page}
          isAdmin={true}
          keyword={""}
          urlPrefix="/dashboard/user-list"
        />
      </Box>
      <ConfirmationDialog
        open={confirmationOpen}
        title={
          selectedAction === "delete"
            ? "Confirm Delete"
            : selectedAction === "promoteAdmin"
            ? "Confirm Admin Promotion"
            : selectedAction === "promoteSeller"
            ? "Confirm Seller Promotion"
            : "Confirm Seller Demotion"
        }
        content={
          selectedAction === "delete"
            ? `Are you sure you want to delete ${selectedUser?.name}?`
            : selectedAction === "promoteAdmin"
            ? `Are you sure you want to promote ${selectedUser?.name} to admin?`
            : selectedAction === "promoteSeller"
            ? `Are you sure you want to promote ${selectedUser?.name} to seller?`
            : `Are you sure you want to demote ${selectedUser?.name} from seller?`
        }
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default UserTablePage;
