import { ProductDto } from '../dto/product-dto';
import { ProductRepository } from '../repositories/product-repository';
import { ProductResponseList } from '../responses/product-response-list';
import { ProductRequest } from '../requests/product.request';
import { ProductResponse } from '../responses/product-response';
import { inject, injectable } from 'inversify';

@injectable()
export class ProductService {
  constructor(
    @inject(ProductRepository)
    private readonly productsRepository: ProductRepository,
  ) {}

  async getAllProducts(): Promise<ProductResponseList> {
    const productDtos: ProductDto[] = await this.productsRepository.fetchAll();

    return {
      data: productDtos.map((dto) => ({
        id: dto.id,
        name: dto.name,
        price: dto.price,
        description: dto.description,
      })),
    } as ProductResponseList;
  }

  async createProduct(productData: ProductRequest): Promise<ProductResponse> {
    const productDto = await this.productsRepository.create(productData);
    return {
      id: productDto.id,
      name: productDto.name,
      price: productDto.price,
      description: productDto.description,
    } as ProductResponse;
  }
}
