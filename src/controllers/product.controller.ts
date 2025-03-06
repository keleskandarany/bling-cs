import { ProductService } from '../services/product.service';
import { ProductRequest } from '../requests/product.request';
import { validate } from 'class-validator';
import { ConflictException } from '../exceptions/conflict-exception';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  requestBody,
  response,
} from 'inversify-express-utils';
import express from 'express';

@controller('/api/products')
export class ProductController {
  constructor(
    @inject(ProductService) private readonly productService: ProductService,
  ) {}

  @httpGet('/')
  async index() {
    return await this.productService.getAllProducts();
  }

  @httpPost('/')
  async create(
    @requestBody() productRequest: ProductRequest,
    @response() res: express.Response,
  ) {
    const errors = await validate(productRequest);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      const createdProduct =
        await this.productService.createProduct(productRequest);
      return res.status(201).json({ data: createdProduct });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
