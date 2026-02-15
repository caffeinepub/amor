import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface BlogPost {
    id: BlogId;
    title: string;
    content: string;
    date: Time;
    author: string;
    category: string;
    image: ExternalBlob;
}
export type Time = bigint;
export interface FilteredProducts {
    filters: {
        goldType?: GoldType;
        stoneType?: StoneType;
        sortBy?: SortOption;
        priceRange?: [number, number];
        category?: Category;
    };
    totalResults: bigint;
    products: Array<Product>;
}
export interface Order {
    id: string;
    status: OrderStatus;
    customer: Principal;
    timestamp: Time;
    products: Array<ProductId>;
}
export interface ContactMessage {
    id: string;
    name: string;
    isRead: boolean;
    email: string;
    message: string;
    timestamp: Time;
    phone?: string;
}
export type BlogId = string;
export type ProductId = string;
export interface BlogListing {
    categories: Array<string>;
    featured?: BlogPost;
    posts: Array<BlogPost>;
}
export interface Product {
    id: ProductId;
    goldType: GoldType;
    stoneType: StoneType;
    title: string;
    description: string;
    isLimitedEdition: boolean;
    category: Category;
    isNew: boolean;
    price: number;
    images: Array<ExternalBlob>;
}
export interface UserProfile {
    name: string;
    email: string;
    wishlist: Array<ProductId>;
}
export enum Category {
    necklaces = "necklaces",
    earrings = "earrings",
    rings = "rings",
    bracelets = "bracelets"
}
export enum GoldType {
    eighteenK = "eighteenK",
    fourteenK = "fourteenK"
}
export enum OrderStatus {
    shipped = "shipped",
    pending = "pending",
    delivered = "delivered"
}
export enum SortOption {
    priceLowToHigh = "priceLowToHigh",
    newest = "newest",
    priceHighToLow = "priceHighToLow"
}
export enum StoneType {
    ruby = "ruby",
    diamond = "diamond",
    sapphire = "sapphire"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBlogPost(post: BlogPost): Promise<void>;
    addContactMessage(message: ContactMessage): Promise<void>;
    addProduct(product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteBlogPost(postId: BlogId): Promise<void>;
    deleteContactMessage(messageId: string): Promise<void>;
    deleteProduct(productId: ProductId): Promise<void>;
    filterProducts(category: Category | null, priceRange: [number, number] | null, goldType: GoldType | null, stoneType: StoneType | null, sortBy: SortOption | null): Promise<FilteredProducts>;
    getAllOrders(): Promise<Array<Order>>;
    getBlogListing(_category: string | null): Promise<BlogListing>;
    getBlogPost(_id: BlogId): Promise<BlogPost | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactMessages(): Promise<Array<ContactMessage>>;
    getLimitedEditionProducts(): Promise<Array<Product>>;
    getNewestProducts(): Promise<Array<Product>>;
    getOrders(_userId: Principal): Promise<Array<Order>>;
    getProductDetails(_id: ProductId): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWishlist(): Promise<Array<ProductId>>;
    isCallerAdmin(): Promise<boolean>;
    markMessageAsRead(messageId: string): Promise<void>;
    placeOrder(order: Order): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleWishlist(productId: ProductId): Promise<void>;
    updateBlogPost(post: BlogPost): Promise<void>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
