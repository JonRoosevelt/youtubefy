import {ClientService} from "../interfaces/service";
import {OAuth2Client} from "google-auth-library";

async function service(clientService: ClientService) {
  await clientService.authenticateWithOauth(OAuth2Client)
  return await clientService.performAction()
}

export default service