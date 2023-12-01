// import { DeleteButtonProps } from "../types";
import { useSession } from "../contexts/AuthContext";
import axios from "axios";
import { useState } from "react";
import { Button, ActivityIndicator } from "react-native-paper";

export interface DeleteButtonProps {
  resource: string;
  _id: string;
  deleteCallback: (id: string) => void;
}

export default function DeleteBtn({
  resource,
  _id,
  deleteCallback,
}: DeleteButtonProps) {
  const [deleting, setDeleting] = useState(false);
  const { session } = useSession();

  const handleClick = () => {
    setDeleting(true);
    axios
      .delete(`https://gym-api-omega.vercel.app/api/${resource}/${_id}`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (deleteCallback) deleteCallback(_id);
      })
      .catch((e) => {
        //console.error(e);
        //setError(e.response.data.message);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  return (
    <>
      {/* <Button
        title={deleting ? "deleting" : "Delete"}
        color="red"
        onPress={handleClick}
      /> */}
      {deleting ? (
        <ActivityIndicator animating={true} color="red" />
      ) : (
        <Button mode="outlined" textColor="red" onPress={handleClick}>
          Delete
        </Button>
      )}
    </>
  );
}
