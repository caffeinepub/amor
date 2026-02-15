import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, BlogPost, BlogListing, ContactMessage, Order, UserProfile, Category, GoldType, StoneType, SortOption, OrderStatus } from '../backend';

export function useGetProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilterProducts(
  category: Category | null,
  priceRange: [number, number] | null,
  goldType: GoldType | null,
  stoneType: StoneType | null,
  sortBy: SortOption | null
) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['products', 'filtered', category, priceRange, goldType, stoneType, sortBy],
    queryFn: async () => {
      if (!actor) return { products: [], totalResults: BigInt(0), filters: {} };
      return actor.filterProducts(category, priceRange, goldType, stoneType, sortBy);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductDetails(productId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProductDetails(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

export function useGetNewestProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'newest'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNewestProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLimitedEditionProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'limited'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLimitedEditionProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogListing(category: string | null = null) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogListing>({
    queryKey: ['blog', 'listing', category],
    queryFn: async () => {
      if (!actor) return { posts: [], categories: [], featured: undefined };
      return actor.getBlogListing(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(postId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blog', 'post', postId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBlogPost(postId);
    },
    enabled: !!actor && !isFetching && !!postId,
  });
}

export function useAddContactMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: ContactMessage) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addContactMessage(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact', 'messages'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetWishlist() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWishlist();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useToggleWishlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleWishlist(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Order) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetOrders(userId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders', userId],
    queryFn: async () => {
      if (!actor) return [];
      const principal = { toText: () => userId } as any;
      return actor.getOrders(principal);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
