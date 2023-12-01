import { useSession } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { decode } from "base-64";

export default function UserInfo() {
  const [user, setUser] = useState({} as any);
  const { session }: any = useSession();

  useEffect(() => {
    if (session) {
      // Decode the JWT token to get user information
      const tokenArray = session.split(".");
      if (tokenArray.length === 3) {
        const decodedToken = JSON.parse(
          decode(tokenArray[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        setUser(decodedToken);
        console.log(decodedToken);
      }
    }
  }, [session]);

  return user;
}
