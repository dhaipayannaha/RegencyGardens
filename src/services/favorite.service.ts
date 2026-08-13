import { api } from '@/lib/api';

export const toggleFavorite = (propertyId: string) => {
    return api.post<{ data: { favorited: boolean } }>('/favorite/toggle', {
        propertyId,
    });
};

const getMyFavorites = () => {
    return api.get('/favorite/my-favorites');
};

export const FavoriteService = {
    toggleFavorite,
    getMyFavorites,
};