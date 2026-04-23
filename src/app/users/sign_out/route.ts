import { ReptrackApi } from "../../../../service/api";
import { cookies } from "next/headers";

export async function DELETE() {
  const cookieStore = await cookies();
  const api = new ReptrackApi();

  const response = await api.request("/users/sign_out", {
    method: "DELETE",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response;
}
