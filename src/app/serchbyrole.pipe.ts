import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serchbyrole'
})
export class SerchbyrolePipe implements PipeTransform {

    transform(items: any[], searchByRole: string): any[] {
        if(!items) return [];
        if(!searchByRole) return items;


        searchByRole = searchByRole.toLowerCase();

        return items.filter( it => {
            if(searchByRole == 'musicians'){
                return (it.musicians==1);
            }
            if(searchByRole == 'dancer'){
                return (it.dancer==1);
            }
            if(searchByRole == 'model'){
                return (it.model==1);
            }
            if(searchByRole == 'signupaffiliate'){
                return (it.signupaffiliate==1);
            }
            if(searchByRole == 'fan'){
                return (it.fan==1);
            }
        });
    }
}
