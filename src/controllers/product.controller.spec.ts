import { ProductService } from '../services/product.service';
import { mock } from 'jest-mock-extended';
import { ProductController } from './product.controller';
import { validate } from 'class-validator';
import { ConflictException } from '../exceptions/conflict-exception';

jest.mock('class-validator', () => ({
  validate: jest.fn(),
}));

jest.mock('../requests/product.request', () => ({
  ProductRequest: {},
}));

describe('ProductController', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  const productService = mock<ProductService>();
  const productController = new ProductController(productService);

  describe('index', () => {
    it('should call product service getProducts', () => {
      productController.index();
      expect(productService.getAllProducts).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    it('should call product service createProduct', async () => {
      const productRequest = {
        name: 'test',
        price: 100,
        description: 'test',
      };

      (validate as jest.Mock).mockResolvedValue([]);
      await productController.create(
        { body: JSON.stringify(productRequest) } as never,
        res as never,
      );
      expect(productService.createProduct).toHaveBeenCalled();
    });

    it('should return errors when validation fails', async () => {
      const productRequest = {
        name: 'test',
        description: 'test',
      };

      (validate as jest.Mock).mockResolvedValue([{ price: 'error' }]);
      await productController.create(
        { body: JSON.stringify(productRequest) } as never,
        res as never,
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(productService.createProduct).toHaveBeenCalledTimes(0);
    });

    it('should return Conflict status code and handles ConflictException', async () => {
      const productRequest = {
        name: 'test',
        price: 100,
        description: 'test',
      };

      (validate as jest.Mock).mockResolvedValue([]);
      const conflictException = new ConflictException(
        'Product with this name already exists',
      );
      productService.createProduct.mockRejectedValue(conflictException);
      await productController.create(
        { body: JSON.stringify(productRequest) } as never,
        res as never,
      );

      expect(productService.createProduct).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(conflictException.statusCode);
      expect(res.json).toHaveBeenCalledWith({
        message: conflictException.message,
      });
    });
  });
});
