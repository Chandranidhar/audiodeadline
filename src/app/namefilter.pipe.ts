import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'namefilter'
})
export class NamefilterPipe implements PipeTransform {

    transform(items: any[], searchText: string): any[] {
        if(!items) return [];
        if(!searchText) return items;


        searchText = searchText.toLowerCase();

        return items.filter( it => {
            let fullname = it.fullname;
            if(!fullname)
                fullname = '';
            let email = it.email;
            if(!email)
                email = '';
            let parentname = it.parentname;
            if(!parentname)
                parentname = '';
            let phone = it.phone;
            if(!phone)
                phone = '';
            let fulladdress = it.fulladdress;
            if(!fulladdress)
                fulladdress = '';
            return (fullname.toLowerCase().includes(searchText) || email.toLowerCase().includes(searchText) || parentname.toLowerCase().includes(searchText) || phone.toLowerCase().includes(searchText) || fulladdress.toLowerCase().includes(searchText));
        });
    }

}
