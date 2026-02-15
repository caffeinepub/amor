import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Set "mo:core/Set";
import Blob "mo:core/Blob";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type ProductId = Text;
  type BlogId = Text;
  type Wishlist = Set.Set<ProductId>;

  type Category = {
    #rings;
    #necklaces;
    #bracelets;
    #earrings;
  };
  type GoldType = {
    #eighteenK;
    #fourteenK;
  };
  type StoneType = {
    #diamond;
    #ruby;
    #sapphire;
  };

  type Product = {
    id : ProductId;
    title : Text;
    price : Float;
    description : Text;
    category : Category;
    goldType : GoldType;
    stoneType : StoneType;
    images : [Storage.ExternalBlob];
    isNew : Bool;
    isLimitedEdition : Bool;
  };

  type FilteredProducts = {
    products : [Product];
    totalResults : Nat;
    filters : {
      category : ?Category;
      priceRange : ?(Float, Float);
      goldType : ?GoldType;
      stoneType : ?StoneType;
      sortBy : ?SortOption;
    };
  };

  type SortOption = {
    #newest;
    #priceLowToHigh;
    #priceHighToLow;
  };

  type BlogPost = {
    id : BlogId;
    title : Text;
    content : Text;
    author : Text;
    date : Time.Time;
    category : Text;
    image : Storage.ExternalBlob;
  };

  type BlogListing = {
    featured : ?BlogPost;
    posts : [BlogPost];
    categories : [Text];
  };

  type ContactMessage = {
    id : Text;
    name : Text;
    email : Text;
    phone : ?Text;
    message : Text;
    timestamp : Time.Time;
    isRead : Bool;
  };

  type OrderStatus = {
    #pending;
    #shipped;
    #delivered;
  };

  type Order = {
    id : Text;
    customer : Principal;
    products : [ProductId];
    status : OrderStatus;
    timestamp : Time.Time;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    wishlist : [ProductId];
  };

  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // File storage state
  include MixinStorage();

  // Store data in persistent data structures
  let products = Map.empty<ProductId, Product>();
  let blogs = Map.empty<Text, BlogPost>();
  let contactMessages = Map.empty<Text, ContactMessage>();
  let orders = Map.empty<Text, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // ===== USER PROFILE MANAGEMENT =====

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ===== PUBLIC PRODUCT QUERIES =====

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func filterProducts(
    category : ?Category,
    priceRange : ?(Float, Float),
    goldType : ?GoldType,
    stoneType : ?StoneType,
    sortBy : ?SortOption,
  ) : async FilteredProducts {
    let filtered = products.values().toArray().filter(
      func(product) {
        switch (category) {
          case (null) { true };
          case (?c) { product.category == c };
        };
      }
    ).filter(
      func(product) {
        switch (priceRange) {
          case (null) { true };
          case (?(min, max)) { product.price >= min and product.price <= max };
        };
      }
    ).filter(
      func(product) {
        switch (goldType) {
          case (null) { true };
          case (?g) { product.goldType == g };
        };
      }
    ).filter(
      func(product) {
        switch (stoneType) {
          case (null) { true };
          case (?s) { product.stoneType == s };
        };
      }
    );
    let sorted = switch (sortBy) {
      case (null) { filtered };
      case (?#newest) {
        filtered.sort(
          func(a, b) {
            let cmp = a.isNew.compare(false);

            switch (cmp) {
              case (#equal) {
                let priceCmp = Float.compare(a.price, b.price);
                switch (priceCmp) {
                  case (#equal) {
                    Text.compare(a.title, b.title);
                  };
                  case (_) {
                    priceCmp;
                  };
                };
              };
              case (_) {
                cmp;
              };
            };
          }
        );
      };
      case (?#priceLowToHigh) {
        filtered.sort(func(a, b) { Float.compare(a.price, b.price) });
      };
      case (?#priceHighToLow) {
        filtered.sort(func(a, b) { Float.compare(b.price, a.price) });
      };
    };

    {
      products = sorted;
      totalResults = sorted.size();
      filters = {
        category;
        priceRange;
        goldType;
        stoneType;
        sortBy;
      };
    };
  };

  public query ({ caller }) func getProductDetails(_id : ProductId) : async ?Product {
    products.get(_id);
  };

  public query ({ caller }) func getNewestProducts() : async [Product] {
    products.values().toArray().filter(
      func(product) { product.isNew }
    );
  };

  public query ({ caller }) func getLimitedEditionProducts() : async [Product] {
    products.values().toArray().filter(
      func(product) { product.isLimitedEdition }
    );
  };

  // ===== ADMIN PRODUCT MANAGEMENT =====

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(productId);
  };

  // ===== PUBLIC BLOG QUERIES =====

  public query ({ caller }) func getBlogListing(_category : ?Text) : async BlogListing {
    let posts = blogs.values().toArray();

    let filteredPosts = switch (_category) {
      case (null) { posts };
      case (?c) {
        posts.filter(
          func(post) { post.category == c }
        );
      };
    };
    {
      featured = switch (filteredPosts.size()) {
        case (0) { null };
        case (_) { ?filteredPosts[0] };
      };
      posts = filteredPosts;
      categories = ["Fashion", "Lifestyle", "Jewelry"];
    };
  };

  public query ({ caller }) func getBlogPost(_id : BlogId) : async ?BlogPost {
    blogs.get(_id);
  };

  // ===== ADMIN BLOG MANAGEMENT =====

  public shared ({ caller }) func addBlogPost(post : BlogPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add blog posts");
    };
    blogs.add(post.id, post);
  };

  public shared ({ caller }) func updateBlogPost(post : BlogPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };
    blogs.add(post.id, post);
  };

  public shared ({ caller }) func deleteBlogPost(postId : BlogId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };
    blogs.remove(postId);
  };

  // ===== CONTACT MESSAGES =====

  public shared ({ caller }) func addContactMessage(message : ContactMessage) : async () {
    // Public endpoint - anyone can submit contact messages
    contactMessages.add(message.id, message);
  };

  public query ({ caller }) func getContactMessages() : async [ContactMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    contactMessages.values().toArray();
  };

  public shared ({ caller }) func markMessageAsRead(messageId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark messages as read");
    };
    switch (contactMessages.get(messageId)) {
      case (null) {
        Runtime.trap("Message not found");
      };
      case (?message) {
        let updatedMessage = {
          id = message.id;
          name = message.name;
          email = message.email;
          phone = message.phone;
          message = message.message;
          timestamp = message.timestamp;
          isRead = true;
        };
        contactMessages.add(messageId, updatedMessage);
      };
    };
  };

  public shared ({ caller }) func deleteContactMessage(messageId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete contact messages");
    };
    contactMessages.remove(messageId);
  };

  // ===== ORDER MANAGEMENT =====

  public shared ({ caller }) func placeOrder(order : Order) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    // Ensure the order is associated with the caller
    if (order.customer != caller) {
      Runtime.trap("Unauthorized: Cannot place order for another user");
    };
    orders.add(order.id, order);
  };

  public query ({ caller }) func getOrders(_userId : Principal) : async [Order] {
    // Users can only view their own orders, admins can view any orders
    if (caller != _userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter(
      func(order) { order.customer == _userId }
    );
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder = {
          id = order.id;
          customer = order.customer;
          products = order.products;
          status = status;
          timestamp = order.timestamp;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // ===== WISHLIST MANAGEMENT =====

  public shared ({ caller }) func toggleWishlist(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage wishlist");
    };
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("User profile not found");
      };
      case (?profile) {
        let alreadyInWishlist = profile.wishlist.any(
          func(id) {
            id == productId;
          }
        );
        let newWishlist = if (alreadyInWishlist) {
          profile.wishlist.filter(
            func(id) {
              id != productId;
            }
          );
        } else {
          profile.wishlist.concat([productId]);
        };
        let updatedProfile = {
          name = profile.name;
          email = profile.email;
          wishlist = newWishlist;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getWishlist() : async [ProductId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wishlist");
    };
    switch (userProfiles.get(caller)) {
      case (null) { [] };
      case (?profile) { profile.wishlist };
    };
  };
};
