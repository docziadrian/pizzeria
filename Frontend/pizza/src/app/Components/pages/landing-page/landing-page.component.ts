import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../system/header/header.component';

declare var window: any;

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    // Reinitialize Flowbite components after view is rendered
    if (window.initFlowbite) {
      setTimeout(() => {
        window.initFlowbite();
      }, 100);
    }
  }
}
