import type {
    ApiResponse,
    CreateRestaurantInput,
    CreateSubmissionInput,
    EntityId,
    Restaurant,
    Submission,
    SubmissionStatus,
    UpdateRestaurantInput,
    UpdateSubmissionInput,
} from '../types';
import { readStoredValue } from './storage';
import { isRestaurant, isSubmission } from './validation';

const initialRestaurants: Restaurant[] = [
    {
    id: 1,
    name: "Songrim Restaurant",
    category: "Korean cuisine",
    location: "21, World Cup-ro 193beon-gil, Yeongtong-dong, Yeongtong-gu, Suwon-si, Gyeonggi-do",
    priceRange: "7,000-13,000원",
    rating: 4.99,
    description: "A great place for delicious Korean food.",
    recommendedMenu: ["Soft Tofu Stew", "Kimchi Stew", "Beef Bulgogi", "Spicy Stir-fried Pork"],
    likes: 0,
    image: "https://mblogthumb-phinf.pstatic.net/MjAyMjA2MTJfODEg/MDAxNjU0OTYzNTM3MjE1.1BfmrmOsz_B6DBHAnhQSs6qfNIDnssofR-DrzMfigIIg.JHHDheG6ifJjtfKUqLss_mLXWFE9fNJ5BmepNUVXSOog.PNG.cary63/image.png?type=w966"
  },
  {
    id: 2,
    name: "Byulmi Tteokbokki",
    category: "Snack",
    location: "Academy Building, 42 Aju-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do",
    priceRange: "7,000-10,000원",
    rating: 4.98,
    description: "A happy bite with crispy fried goodness",
    recommendedMenu: ["Tteokbokki", "Fried Food", "Sundae", "Fish Cake"],
    likes: 0,
    image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA4MTJfMjcg%2FMDAxNzU0OTQ5ODk1Mjg0.GR6i3mNpJJXyqQrozGEJ65InCDBGlEmxc0aCeVHncJgg.sduDPX67J8hhoGxq4vLohpS4dXk1w-706dQLPfVs1iwg.JPEG%2Foutput%25A3%25DF1564208956.jpg"
  },
  {
    id: 3,
    name: "Sogo",
    category: "Japanese cuisine",
    location: "7, World Cup-ro 193beon-gil, Yeongtong-gu, Suwon-si, Gyeonggi-do",
    priceRange: "10,000-16,000원",
    rating: 4.89,
    description: "Japanese Sushi Restaurant, Gu Heosuabi,",
    recommendedMenu: ["cold buckwheat noodles", "kimchi pork cutlet hot pot", "cotton tofu"],
    likes: 0,
    image: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20190707_63%2F1562462598960nPDMy_JPEG%2FW7iKQEhTMzCF3flC1t0pzgzF.jpeg.jpg"
    }
];

const RESTAURANTS_KEY = 'pwd-week5-restaurants';
const SUBMISSIONS_KEY = 'pwd-week5-submissions';

function readItems<T>(key: string, isItem: (value: unknown) => value is T, fallback: T[] = []): T[] {
    return readStoredValue(key, (value): value is T[] =>
    Array.isArray(value) && value.every(isItem), fallback);
}

function writeItems<T>( key: string, items: T[]): void {
    localStorage.setItem(key, JSON.stringify(items));
}

function updateItem<T extends { id: EntityId }> (
    key: string,
    id: EntityId,
    payload: Partial<Omit<T, 'id'>>,
    isItem: (value: unknown) => value is T,
    fallback: T[] = [],
): ApiResponse<T> {
    const items = readItems(key, isItem, fallback);
    const index = items.findIndex((item) => String(item.id) === String(id));
    const original = items[index];
    if (!original) throw new Error('Item not found.');
    const updated = { ...original, ...payload, id: original.id };
    if (!isItem(updated)) throw new Error('Please confirm the data type to modify.');
    items[index] = updated;
    writeItems(key, items);
    return { data: updated };
}

function deleteItem<T extends { id: EntityId }> (
    key: string,
    id: EntityId,
    isItem: (value: unknown) => value is T,
    fallback: T[] = [],
): number {
    const items = readItems(key, isItem, fallback);
    writeItems(key, items.filter((item) => String(item.id) !== String(id)));
    return 204;
}

export const restaurantAPI = {
    getRestaurants: async (): Promise<ApiResponse<Restaurant[]>> => ({
        data: readItems(RESTAURANTS_KEY, isRestaurant, initialRestaurants),
    }),

    getRestaurantById: async (id: EntityId): Promise<ApiResponse<Restaurant | undefined>> => ({
        data: readItems(RESTAURANTS_KEY, isRestaurant, initialRestaurants)
            .find((item) => String(item.id) === String(id)),
    }),

    getPopularRestaurants: async (): Promise<ApiResponse<Restaurant[]>> => ({
    data: readItems(RESTAURANTS_KEY, isRestaurant, initialRestaurants)
      .sort((a, b) => b.rating - a.rating).slice(0, 5),
  }),

    createRestaurant: async (payload: CreateRestaurantInput): Promise<ApiResponse<Restaurant>> => {
        const items = readItems(RESTAURANTS_KEY, isRestaurant, initialRestaurants);
        const item: Restaurant = {
        ...payload,
        id: crypto.randomUUID(),
        rating: payload.rating ?? 0,
        recommendedMenu: payload.recommendedMenu ?? [],
        likes: 0,
        };
        writeItems(RESTAURANTS_KEY, [...items, item]);
        return { data: item };
    },

    updateRestaurant: async (id: EntityId, payload: UpdateRestaurantInput): Promise<ApiResponse<Restaurant>> =>
        updateItem(RESTAURANTS_KEY, id, {
            ...payload,
            ...('rating' in payload ? { rating: payload.rating ?? 0 } : {}),
            ...('recommendedMenu' in payload ? { recommendedMenu: payload.recommendedMenu ?? [] } : {}),
        }, isRestaurant, initialRestaurants),

        deleteRestaurant: async (id: EntityId): Promise<number> =>
            deleteItem(RESTAURANTS_KEY, id, isRestaurant, initialRestaurants),
};    

export const submissionAPI = {
  createSubmission: async (payload: CreateSubmissionInput): Promise<ApiResponse<Submission>> => {
    const items = readItems(SUBMISSIONS_KEY, isSubmission);
    const item: Submission = { ...payload, id: crypto.randomUUID(), status: 'pending' };
    writeItems(SUBMISSIONS_KEY, [...items, item]);
    return { data: item };
  },

  listSubmissions: async (status?: SubmissionStatus): Promise<ApiResponse<Submission[]>> => ({
    data: readItems(SUBMISSIONS_KEY, isSubmission).filter((item) => !status || item.status === status),
  }),

  updateSubmission: async (id: EntityId, payload: UpdateSubmissionInput): Promise<ApiResponse<Submission>> =>
    updateItem(SUBMISSIONS_KEY, id, payload, isSubmission),

  deleteSubmission: async (id: EntityId): Promise<number> =>
    deleteItem(SUBMISSIONS_KEY, id, isSubmission),
};

export default restaurantAPI;