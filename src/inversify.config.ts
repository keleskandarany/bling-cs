import { Container } from 'inversify';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './repositories/product-repository';

const container = new Container();

container.bind<ProductService>(ProductService).toSelf();
container.bind<ProductRepository>(ProductRepository).toSelf();
container.bind<ProductController>(ProductController).toSelf();

export { container };
