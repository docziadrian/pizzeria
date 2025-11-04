import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Components/system/header/header.component';
import { FooterComponent } from './Components/system/footer/footer.component';
import { NavbarComponent } from './Components/system/navbar/navbar.component';
import { NotificationsComponent } from './Components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    NotificationsComponent,
    NotificationsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Pizzéria';
  subtitle = 'A legjobb pizzák egy helyen!';
  company = 'Bajai SZC Türr István Technikum';
  author = 'Dóczi Adrián Márk';
}
