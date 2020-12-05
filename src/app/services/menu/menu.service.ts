import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FavoriteService } from '../favorites/favorite.service';


import { Location } from '@angular/common';
import * as _ from 'underscore';
import { MenuItem, Favorite, MenuItemType, MenuDataService } from './menu-data';
import { Subject } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
@Injectable()
export class MenuService {
    
    private all_items: Array<MenuItem> = [];
    favorites: Favorite;
    private changeMenuSource = new Subject<Array<MenuItem>>();
    public changeMenu$ = this.changeMenuSource.asObservable();
    constructor(
        public service: ApiService,
        public router: Router,
        public location: Location,
        private route: ActivatedRoute,
        protected favoriteService: FavoriteService,
        private authService: AuthService,
        protected menuData: MenuDataService
    ) {
        
    }
    public buildMenu(translate:boolean) {
        let favoritesByUser = this.favoriteService.get().find(f => f.userId == this.authService.user.id);
        if (!favoritesByUser)
            favoritesByUser = new Favorite(this.authService.user.id);
        this.all_items = this.menuData.get().map(i => {
            let menu_item = new MenuItem(i, null, favoritesByUser);
            return menu_item;
        });
        this.favorites = new Favorite(this.authService.user.id);
        this.all_items.forEach(menuItem => {
            this.findFavorites(menuItem)
        });
        //Aquí filtramos por los items del usuario que son devueltos en el token
        this.all_items[0].items = this.all_items[0].items.filter(i => {
                let prin = this.authService.user.menu.includes(i.id);
                if(prin)
                    i.items = i.items.filter(subitem=> this.authService.user.menu.includes(subitem.id))
                return prin;
            }
        );
        if(translate)
            this.changeMenuSource.next(this.all_items[0].items);
    }
    findFavorites(menuItem: MenuItem) {

        if (menuItem.favorite) {
            this.favorites.menuIdFavorites.push(menuItem.id);
            this.favorites.menuFavorites.push(menuItem);
        }

        if (menuItem.items.length > 0)
            menuItem.items.forEach(menuChild => {
                this.findFavorites(menuChild);
            });
        else
            return;

    }
    favorite(event: Event, item: MenuItem): void {
        event.cancelBubble = true;
        if (item.favorite) {
            this.favorites.menuIdFavorites.splice(this.favorites.menuIdFavorites.lastIndexOf(item.id), 1);
            this.favorites.menuFavorites.splice(this.favorites.menuFavorites.lastIndexOf(item), 1);
        } else {
            this.favorites.menuIdFavorites.push(item.id);
            this.favorites.menuFavorites.push(item);
        }
        item.favorite = !item.favorite;

        this.favoriteService.setSingle(this.favorites);
    }
    public getParent(id:string): MenuItem{
        return this.getMenu(id).parent;
    }
    public getMenu(id?: string): MenuItem{
        id = id || "0";
        let _find: MenuItem = _.chain(this.all_items)
            .map(i => i.flatItems())
            .flatten()
            .findWhere({ id: id })
            .value();
        return _find || this.all_items[0];
    }
}

