import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { ServicesProvider } from '../../providers/services/services';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  data:any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private service: ServicesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
    console.log(this.data);
    this.service.do_login(this.data).subscribe(
      (res)=> {
        console.log(res);
        localStorage.setItem('Authorization' , res.success.token);
        this.navCtrl.setRoot(TabsPage);
      } ,       (err) => {
        console.log(err.status);
      }
    )
  }


}
