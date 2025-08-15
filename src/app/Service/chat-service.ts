// src/app/services/chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';

export interface ChatMessage {
  id?: number;
  message: string;
  response: string;
  sessionId: string;
  timestamp: Date;
  isFromUser: boolean;
  messageType: ChatMessageType;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  userId?: string;
  messageType: ChatMessageType;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
  timestamp: Date;
  suggestions?: SuggestionButton[];
  data?: any;
  isTyping: boolean;
}

export interface SuggestionButton {
  text: string;
  action: string;
  data?: any;
}

export enum ChatMessageType {
  General = 0,
  BookingInquiry = 1,
  HotelSearch = 2,
  FlightSearch = 3,
  CarRental = 4,
  TourSearch = 5,
  Support = 6
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly apiUrl = 'https://localhost:7277/api/chatbot'; // Update with your API URL
  private readonly hubUrl = 'https://localhost:7277/chatHub'; // Update with your SignalR hub URL
  
  private hubConnection: signalR.HubConnection | null = null;
  private messagesSubject = new Subject<ChatResponse>();
  private typingSubject = new Subject<boolean>();
  private sessionId: string;
  
  public messages$ = this.messagesSubject.asObservable();
  public typing$ = this.typingSubject.asObservable();
  public isConnected$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.sessionId = this.generateSessionId();
    this.initializeSignalRConnection();
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private initializeSignalRConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('SignalR connection started successfully');
        this.isConnected$.next(true);
        this.joinGroup(this.sessionId);
      })
      .catch(err => {
        console.error('Error starting SignalR connection: ', err);
        this.isConnected$.next(false);
        
        // Retry connection after 5 seconds
        setTimeout(() => {
          this.initializeSignalRConnection();
        }, 5000);
      });

    // Set up SignalR event handlers
    this.hubConnection.on('ReceiveMessage', (response: ChatResponse) => {
      console.log('Received message via SignalR:', response);
      this.messagesSubject.next(response);
    });

    this.hubConnection.on('ReceiveTypingIndicator', (isTyping: boolean) => {
      console.log('Typing indicator:', isTyping);
      this.typingSubject.next(isTyping);
    });

    this.hubConnection.onclose((error) => {
      console.log('SignalR connection closed:', error);
      this.isConnected$.next(false);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('SignalR reconnected:', connectionId);
      this.isConnected$.next(true);
      this.joinGroup(this.sessionId);
    });

    this.hubConnection.onreconnecting((error) => {
      console.log('SignalR reconnecting:', error);
      this.isConnected$.next(false);
    });
  }

  private joinGroup(sessionId: string): void {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('JoinGroup', sessionId)
        .then(() => {
          console.log('Successfully joined group:', sessionId);
        })
        .catch(err => {
          console.error('Error joining group:', err);
        });
    }
  }

  sendMessage(message: string, messageType: ChatMessageType = ChatMessageType.General): Observable<ChatResponse> {
    const request: ChatRequest = {
      message,
      sessionId: this.sessionId,
      messageType
    };

    // Use real backend API
    return this.http.post<ChatResponse>(`${this.apiUrl}/send-message`, request);
  }

  private generateMockResponse(message: string, messageType: ChatMessageType): string {
    switch (messageType) {
      case ChatMessageType.HotelSearch:
        return "I'd be happy to help you find hotels! Please let me know your destination, check-in and check-out dates, and the number of guests.";
      case ChatMessageType.FlightSearch:
        return "Great! I can help you search for flights. Please provide your departure city, destination, travel dates, and number of passengers.";
      case ChatMessageType.CarRental:
        return "I can assist you with car rentals. Please let me know your pickup location, dates, and preferred car type.";
      case ChatMessageType.TourSearch:
        return "Excellent! I can help you find amazing tours. What destination are you interested in and what type of activities do you enjoy?";
      default:
        return `Thank you for your message: "${message}". How can I assist you with your travel plans?`;
    }
  }

  private generateMockSuggestions(messageType: ChatMessageType): SuggestionButton[] {
    switch (messageType) {
      case ChatMessageType.HotelSearch:
        return [
          { text: 'Luxury Hotels', action: 'search_luxury_hotels' },
          { text: 'Budget Options', action: 'search_budget_hotels' },
          { text: 'Near Airport', action: 'search_airport_hotels' }
        ];
      case ChatMessageType.FlightSearch:
        return [
          { text: 'Round Trip', action: 'search_roundtrip' },
          { text: 'One Way', action: 'search_oneway' },
          { text: 'Multi-city', action: 'search_multicity' }
        ];
      default:
        return [
          { text: 'Find Hotels', action: 'search_hotels' },
          { text: 'Search Flights', action: 'search_flights' },
          { text: 'Rent a Car', action: 'search_cars' }
        ];
    }
  }

  getChatHistory(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/history/${this.sessionId}`);
  }

  classifyMessage(message: string): Observable<{ messageType: ChatMessageType }> {
    return this.http.post<{ messageType: ChatMessageType }>(`${this.apiUrl}/classify-message`, { message });
  }

  getSessionId(): string {
    return this.sessionId;
  }

  newSession(): void {
    this.sessionId = this.generateSessionId();
    if (this.hubConnection) {
      this.joinGroup(this.sessionId);
    }
  }

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}