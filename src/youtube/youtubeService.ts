import {YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REDIRECT_URI} from "./consts";
import service from "../lib/service/service";
import {ClientService, Credentials} from "../lib/interfaces/service";
import {Express} from "express";


export function youtubeClientService() {
  const clientService = {
    credentials: {
      web: {
        clientId: YOUTUBE_CLIENT_ID,
        clientSecret: YOUTUBE_CLIENT_SECRET,
        redirectUri: YOUTUBE_REDIRECT_URI
      }
    },
    authenticateWithOauth,

}

function authenticateWithOauth(app: Express, credentials: Credentials) {
  
}
