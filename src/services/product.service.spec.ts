import { ProductService } from './product.service';
import { mock } from 'jest-mock-extended';
import { ProductRepository } from '../repositories/product-repository';
import { ProductDto } from '../dto/product-dto';

describe('ProductService', () => {
  const productRepository = mock<ProductRepository>();
  const productService = new ProductService(productRepository);
  const exampleProductDto1: ProductDto = {
    id: 1,
    name: 'test',
    price: 150.5,
  };
  const exampleProductDto2: ProductDto = {
    id: 2,
    name: 'test 2',
    price: 22,
  };

  describe('getAllProducts', () => {
    it('should call product repository fetchAll', () => {
      productRepository.fetchAll.mockResolvedValue([]);
      productService.getAllProducts();
      expect(productRepository.fetchAll).toHaveBeenCalled();
    });

    it('should call transform results of fetchAll to ProductResponseList', async () => {
      productRepository.fetchAll.mockResolvedValue([
        exampleProductDto1,
        exampleProductDto2,
      ]);
      const result = await productService.getAllProducts();
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual({
        id: exampleProductDto1.id,
        name: exampleProductDto1.name,
        price: exampleProductDto1.price,
        description: exampleProductDto1.description,
      });
      expect(result.data[1]).toEqual({
        id: exampleProductDto2.id,
        name: exampleProductDto2.name,
        price: exampleProductDto2.price,
        description: exampleProductDto2.description,
      });
    });
  });
});
