import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'safehtml'
})
export class SafehtmlPipe implements PipeTransform {
    constructor(protected sanitizer: DomSanitizer) {}
  public transform(value: any, args?: any): any  {
        var ret = value.replace(/<.*?>/g, '');
        var res = '';
        if(ret.length > args){
            res = ret.substring(0, args);
            res += '...';
        }else{
            res = ret;
        }
        return res;
  }

}
