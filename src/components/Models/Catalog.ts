import { IProduct } from "../../types/index.ts";
import { eventsList } from "../../utils/constants.ts";
import { IEvents } from "../base/Events.ts";

export class Catalog {
  protected products: IProduct[]
  protected pickedProduct: null | IProduct

  constructor() {
    this.products = []
    this.pickedProduct = null
  }

  public getProducts(): IProduct[] {
    return this.products;
  }

  public setProducts(products: IProduct[]): void {
    this.products = products;
  }

  public getProductByID(id: string): IProduct | null {
    return this.products.find(item => item.id === id) ?? null
  }

  public getPickedProduct(): IProduct | null {
    return this.pickedProduct;
  }

  public setPickedProduct(product: IProduct | null): void {
    this.pickedProduct = product;
  }
}