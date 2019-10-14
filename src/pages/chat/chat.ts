import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Echo } from "laravel-echo-ionic";
import { ServicesProvider } from '../../providers/services/services';
import { VarConfig } from '../../providers/VarConfig';
// import { pusher } from 'pusher-js';
declare var require: any;

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild('content') content:any;

  echo: any = null;
  messages:Array<any> = [];
  users:any = [];
  activeUser: false;
  typingTimer: false;
  menu:any = 'messages';
  totalData = 0;
  totalPage = 0;
  perPage = 0;
  page = 1;
  scrollDirection:any;

  constructor(public navCtrl: NavController, public navParams: NavParams , private service: ServicesProvider) {
    var pusher = require("pusher-js");
    this.echo = new Echo({
      auth: {
        headers: {
          Accept: 'application/json',
          Authorization: "Bearer " + localStorage.getItem('Authorization')
        }
      },
      authEndpoint: 'http://chat.peakcloudz.local/broadcasting/auth',
      broadcaster: "pusher",
      wsHost: VarConfig.hostWs,
      wsPort: 6001,
      key: VarConfig.keyWs,
      enabledTransports: ["ws"],
      encrypted: false
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    // console.log(this.echo);
    
    //Enter the channel and add the event you wanna listen
    this.echo.join("chat")
      .here( user => {
        console.log("HERE")
        this.users = user;
      })
      .joining(user => {
        console.log("joing...")
        this.users.push(user)
      })
      .leaving(user => {
        console.log("leave...")
        this.users = this.users.filter(u => u.id != user.id);
      })
      .listen("msgSent", e => {
        console.log('MsgSent')
        this.messages.push(e.message);
        setTimeout(() => {
          this.content.scrollToBottom(100);
        },100);
      })
      .listenForWhisper("typing", user => {
        console.log(user);
      });
  }

  ngOnInit() {
    this.fetchMessage(this.page);
  }

  fetchMessage(page){
    this.service.fetchMsg(page).subscribe((res) => {
      const data = res.data;
      this.perPage = res.per_page;
      this.totalData = res.total;
      this.totalPage = res.last_page;
      data.forEach(element => {
        this.messages.unshift(element);
      });
      this.page += 1;
      console.log(res)
      setTimeout(() => {
        this.content.scrollToBottom(100);
      },100);
    })
  }

  async doInfinite(infiniteScroll){
    
    setTimeout(() => {
      this.service.fetchMsg(this.page).subscribe(
        res => {
          const data = res.data;
          this.perPage = res.per_page;
          this.totalData = res.total;
          this.totalPage = res.last_page;
          data.forEach(element => {
            this.messages.unshift(element);
          });
          this.page += 1;
        },
        (error) => {
          console.log(error);
        }
      );
      console.log("Async operation has ended");
      infiniteScroll.complete();
      
    }, 1000);
  }

  onScroll($event) {
    return this.scrollDirection = $event.directionY;
  }

}
