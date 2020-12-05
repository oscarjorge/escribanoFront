import { Injectable } from '@angular/core';
import { CacheService } from '../cache/cache.service';
import { Favorite } from '../menu/menu-data';

@Injectable()
export class FavoriteService {

    constructor(private cache: CacheService) { }

    public get(): any[] {
        return this.cache.getLocal<Favorite[]>('favorites') || [] ;
    }

    public set(favorites: Favorite[]): void {
        return this.cache.setLocal('favorites', favorites);
    }
    public setSingle(favorite: Favorite): void {
        let f = this.get().filter(f=>f.userId!=favorite.userId);
        
        f.push({userId:favorite.userId, menuIdFavorites: favorite.menuIdFavorites});
        
        return this.cache.setLocal('favorites', f);
    }
}
