require('dotenv').config();
import bodyParser from 'body-parser';
import { container } from './inversify.config';
import { InversifyExpressServer } from 'inversify-express-utils';
import { AppDataSource } from './database/data-source';

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(bodyParser.json());
});

const app = server.build();

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(8090, () => {
      console.log('Server is running on port 8090');
    });
  })
  .catch((error) => console.log('Database connection error:', error));
