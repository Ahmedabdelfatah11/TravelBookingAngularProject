import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatbotComponent } from "./chatbot/chatbot";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, ChatbotComponent],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Travel Booking';

};


