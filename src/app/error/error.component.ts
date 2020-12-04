import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  public errcode: number;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.errcode = (params['errcode'] || 0);
    });
  }


  login(): void {
    const YSN_LOGIN_URL = 'https://adfs.ysn.ru/adfs/oauth2/authorize?client_id=d7096849-369b-4b74-81e1-1a41c59ede5d&response_type=id_token+token&redirect_uri=https%3A%2F%2Faikutsk.ru%2Flogin_ysn&scope=openid'
    + '&nonce=https%3A%2F%2Faikutsk.ru%2Firtm%2F%23%2F'
    + '&cancel_uri=https%3A%2F%2Faikutsk.ru%2Firtm%2F%23%2Ferror';
    window.location.href = YSN_LOGIN_URL;
  }
}
