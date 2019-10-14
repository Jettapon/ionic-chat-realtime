// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, URLSearchParams, Response } from '@angular/http';
// import { VariableURL } from '../VariableURL';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import '../VarConfig';
import { VarConfig } from '../VarConfig';
/*
  Generated class for the ServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServicesProvider {

  constructor(public http: Http) {
    console.log('Hello ServicesProvider Provider');
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  public do_login(insertData){
    let myHeader = new Headers();
    myHeader.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeader.append('Accept', 'application/json');
    let _options = new RequestOptions({ headers: myHeader });

    let _body = new URLSearchParams();
    _body.append('mobi_user', insertData.mobi_user);
    _body.append('mobi_pas', insertData.mobi_pas);

    let data = this.http.post(VarConfig.login, _body, _options);

    return data.map((res: Response) => res.json());

  }

  public fetchMsg(page){
    let myHeader = new Headers();
    myHeader.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeader.append('Accept', 'application/json');
    myHeader.append('Authorization', 'Bearer ' + localStorage.getItem('Authorization'));

    let _options = new RequestOptions({ headers: myHeader });

    let data = this.http.get(VarConfig.fetchMessage+'?page='+page, _options);

    return data.map((res: Response) => res.json());
  }

}
