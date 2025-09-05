import { URL_API } from "../constants";

async function getStatusFromDotNet() {
  const res = await fetch(`${URL_API}/status`);
  return await res.text();
}


export default {
  getStatus: getStatusFromDotNet,
};
