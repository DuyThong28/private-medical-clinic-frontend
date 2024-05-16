import { loginWithGoogle } from "../../services/auth";
import { useQuery } from "@tanstack/react-query";

function LoginSuccess() {
  useQuery({
    queryKey: ["loginWithGoogle"],
    queryFn: async () => {
      await loginWithGoogle();
      window.open("http://localhost:3000/home", "_self");
    },
  });
  return <></>;
}

export default LoginSuccess;
