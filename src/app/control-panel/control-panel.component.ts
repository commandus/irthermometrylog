import { Component, OnInit } from '@angular/core';

import { EnvAppService } from '../svc/env-app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {
  constructor(
    public router: Router,
    public env: EnvAppService
  ) {
    this.router = router;
  }

  ngOnInit(): void {
  }

}
