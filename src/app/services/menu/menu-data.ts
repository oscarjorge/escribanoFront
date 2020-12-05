import { Inject, LOCALE_ID, Injectable } from "@angular/core";

import * as _ from 'underscore';
@Injectable()
export class MenuDataService{
    constructor(){

    }
    public get(){

        let menu: any[] = JSON.parse(JSON.stringify(this.data));
        let menuTraslated: any[] = [];
        menu.forEach(element => {
            menuTraslated.push( this.translate(element));
        });

        return menuTraslated;
    }
    private translate(item:any){
        item.title = item.title;
        item.review = (item.review!=null)? item.review:null;
        if(item.items){
            item.items.forEach(subitem => {
                return this.translate(subitem);
            });
        }
        return item;

    }
    private data:any[] =[
        {
            "id": "0",
            "title": "Dashboard",
            "icon": "",
            "url": "/dashboard",
           "items": [
                {
                    "id": "1",
                    "title": "Administración",
                    "icon": "fas fa-tools",
                    "review": "Review menu administracion"
                    ,
                    "url": "/dashboard/1",
                    "items": [
                        {
                            "id": "1.1",
                            "title": "Proyectos",
                            "icon": "fas fa-briefcase",
                            "review": "Administra los proyectos, insertando nuevos, eliminándolos o editándolos."
                            ,
                            "url": "/admin/projects",
                            "items": []
                        },
                        {
                            "id": "1.2",
                            "title": "Usuarios",
                            "icon": "fas fa-users-cog",
                            "review": "Administra los usuarios de la aplicación, insertando nuevos, eliminándolos o editándolos."
                            ,
                            "url": "/admin/users",
                            "items": []
                        },
                        {
                            "id": "1.3",
                            "title": "Alta de usuario",
                            "icon": "fas fa-user-plus",
                            "review": "Envía un mail al usuario para que confirme su alta en la aplicación."
                            ,
                            "url": "/admin/user/proposal",
                            "items": []
                        }
                    ]
                },
                {
                    "id": "2",
                    "title": "Imputaciones",
                    "icon": "fas fa-calendar-check",
                    "review": "Review menu checkin",
                    "url": "/users/calendar",

                },
                {
                  "id": "3",
                  "title": "Imputación rápida",
                  "icon": "fas fa-stopwatch",
                  "review": "Imputa rápidamente la entrada o la salida con la ubicación del momento.",
                  "url": "/users/quick-checkin",

              },
                {
                    "id": "4",
                    "title": "Ausencias",
                    "icon": "fas fa-notes-medical",
                    "review": "Review menu checkin",
                    "url": "/pordefinir",
                    "items": [

                    ]
                },
                {
                  "id": "5",
                  "title": "Perfil",
                  "icon": "fas fa-user",
                  "review": "Modifica tú perfil",
                  "url": "/users/profile",
                  "items": [

                  ]
              },
            ]
        }
    ]

}
export enum MenuItemType {
    Card = 0,
    Folder = 1,
    Option = 2
}

export class MenuItem {
    visible: boolean = true;
    items: Array<MenuItem> = [];
    id: string = "";
    title: string = "";
    icon: string = "";
    url: string = "";
    review: string = "";
    currentItem: MenuItem = null;
    type: MenuItemType = MenuItemType.Option;
    favorite: boolean = false;
    role: string;

    private visibleItemsTitle: number = 0;

    constructor(item: Partial<MenuItem>, public parent: MenuItem = null, favorites: Favorite) {
        Object.assign(this, item)
        this.items = (item.items || []).map((i) => { return new MenuItem(i, this, favorites); });
        this.type = !parent
            ? MenuItemType.Card
            : (!!this.items && !!this.items.length)
                ? MenuItemType.Folder
                : MenuItemType.Option;
        this.favorite = !!favorites.menuIdFavorites.filter(f => f == this.id).length;
        this.setVisibleItemsTitle();
    }

    private setVisibleItemsTitle(): void {
        let _count = this.visibleItemsQty();
        if (typeof (_count) === 'undefined') {
            this.visibleItemsTitle = 0;
        } else {
            this.visibleItemsTitle = _count;
        }
    }

    flatItems(): Array<MenuItem> {
        return _.chain([this, this.items, this.items.map(i => i.flatItems())])
            .flatten()
            .unique()
            .value();
    }
    visibleItemsQty(): number {
        if (this.items.length > 0) {
            let _qty = _.chain(this.items)
                .filter((i: MenuItem) => i.visible)
                .map((i: MenuItem) => i.type == MenuItemType.Folder ? i.visibleItemsQty() : 1)
                .reduce((a: number, b: number) => a + b)
                .value();
            return _qty;
        }
        else
            return 0;
    }
    visibleItems(): Array<MenuItem> {
        return this.items.filter(m => m.visible);
    }

    filter(criteria: string) {
        let _regex = new RegExp(criteria, 'gi');
        this.items.forEach(s => s.filter(criteria));
        this.visible = (!!this.visibleItems().length)
            || (!!this.review.match(_regex) || !!this.title.match(_regex));

        this.setVisibleItemsTitle();
    }

    upLevel(): void {
        this.currentItem = !!this.currentItem.parent && this.currentItem.parent.type !== MenuItemType.Card
            ? this.currentItem.parent
            : null;
    }
}

export class Favorite{
    userId: string
    menuIdFavorites: string[]=[];
    menuFavorites: MenuItem[]=[];
    constructor(_userId:string){
        this.userId = _userId;
    }
}
