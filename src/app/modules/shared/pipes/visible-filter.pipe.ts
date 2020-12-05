import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'visibleFilter',
    pure: false
})

export class VisibleFilterPipe implements PipeTransform {
    transform(items: any[], arg: boolean): any {
        return items.filter(item => item.visible === arg);
    }
}


