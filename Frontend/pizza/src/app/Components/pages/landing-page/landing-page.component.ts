import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../system/header/header.component';
import { SessionService } from '../../../Services/session.service';

declare var window: any;

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    // FlowBite miatt :(
    if (window.initFlowbite) {
      setTimeout(() => {
        window.initFlowbite();
      }, 100);
    }
  }
  isUserAdmin = false;

  constructor(sessionService: SessionService) {
    const user = sessionService.getUser();
    this.isUserAdmin = user?.role.role === 'admin';
  }

  ngOnInit(): void {}
}
