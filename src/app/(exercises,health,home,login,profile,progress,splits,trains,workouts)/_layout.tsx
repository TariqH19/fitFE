import { Slot, Redirect } from "expo-router";

import { useSession } from "../../contexts/AuthContext";

export default function AuthLayout() {
  const { session } = useSession();

  if (!session) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <Slot />
    </>
  );
}
