export class User {
    role: string[] = [];
    name: string = "";
    menu:string[];
    mail: string;
    logical_access: string;
    logical_access_username:string;
    id:string = "";
    picture: any = null;
    constructor(token?: any) {
        if (!token) return;
        this.id = token.sub;
        this.mail = token.email;
        this.role = token.role;
        this.menu = token.menu.split(',');
    }
}
