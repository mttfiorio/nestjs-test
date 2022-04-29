import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
// Models
import { Model } from "mongoose";
import { Product } from "./product.model";

@Injectable()
export class ProductsService {
    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

    private readonly products: Product[] = [];
    private index: number = 0;

    private getProduct(id: string) {
        const index = this.products.findIndex(prod => prod.id === id);
        const product = this.products[index];
        if(index === -1){
            throw new NotFoundException('Could not find product'); //nestJS sends a 404 automagically
        }

        return {product, index};
    }

    async insertProduct(title: string, description: string, price: number) {
        const newProduct = new this.productModel({title, description, price})
        return await newProduct.save(); // Could specify :string in function, but Typescript can infer that automagically
    }
    
    getProducts() {
        // return this.products; It works, but this basically creates a getter that open access to the array from outside
    
        // return [...this.products]; // Safer. Products are also passed by reference and can still be modified from outside

        return [...this.products.map(product => ({...product}))]; //Safest. Returns a copy of the array AND a copy of all products. Normally an overkill :) 
    }

    getProductById(id: string) {
        const product = this.getProduct(id).product;

        return {...product};
    }

    updateProductById(id: string, title: string, description: string, price: number){
        const product = this.getProduct(id).product;
        if(title){ product.title = title; }
        if(description){ product.description = description; }
        if(price){ product.price = price; }
    }

    deleteProductById(id: string){
        const index = this.getProduct(id).index;
        this.products.splice(index, 1);
    }
}