import { Server } from 'http';

export const commonService = {
  stopWebServer: (server: Server) => {
    try {
      console.log('* Stopping web server...');
      server.close();
      console.log('* Web server stopped');
    } catch (error) {
      console.error(error);
    }
  },
};
