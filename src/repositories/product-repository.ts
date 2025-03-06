import { ProductDto } from '../dto/product-dto';
import { ProductRequest } from '../requests/product.request';
import { Product } from '../models/product';
import { ConflictException } from '../exceptions/conflict-exception';
import { injectable } from 'inversify';
import { AppDataSource } from '../database/data-source';

@injectable()
export class ProductRepository {
  private productRepository = AppDataSource.getRepository(Product);

  async fetchAll(): Promise<ProductDto[]> {
    const products = await this.productRepository.find();
    return products.map((product) => this.mapToDto(product));
  }

  async create(productData: ProductRequest): Promise<ProductDto> {
    const newProduct = this.productRepository.create(productData);
    const product = await this.productRepository
      .save(newProduct)
      .catch((error: any) => {
        if (error.code === 'ER_DUP_ENTRY') {
          throw new ConflictException('Product with this name already exists');
        }
        throw error;
      });
    return this.mapToDto(product);
  }

  private mapToDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
    };
  }
}
