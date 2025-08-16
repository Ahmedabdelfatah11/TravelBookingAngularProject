import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessageType, ChatResponse, SuggestionButton } from '../Service/chat-service';

interface DisplayMessage {
  id?: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
  suggestions?: SuggestionButton[];
  data?: any;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css'],
  imports: [DatePipe, FormsModule, CommonModule]
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  messages: DisplayMessage[] = [];
  currentMessage = '';
  isTyping = false;
  isConnected = false;
  isChatOpen = false;
  
  private destroy$ = new Subject<void>();
  private shouldScrollToBottom = false;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.initializeChatbot();
    this.loadWelcomeMessage();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeChatbot(): void {
    // Subscribe to connection status
    this.chatbotService.isConnected$
      .pipe(takeUntil(this.destroy$))
      .subscribe(connected => {
        this.isConnected = connected;
        console.log('Connection status:', connected);
      });

    // Subscribe to messages
    this.chatbotService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.addBotMessage(response);
        this.isTyping = false;
      });

    // Subscribe to typing indicator
    this.chatbotService.typing$
      .pipe(takeUntil(this.destroy$))
      .subscribe(typing => {
        this.isTyping = typing;
        if (typing) {
          this.shouldScrollToBottom = true;
        }
      });
  }

  private loadWelcomeMessage(): void {
    const welcomeMessage: DisplayMessage = {
      id: 'welcome_' + Date.now(),
      content: "Hello! I'm your travel assistant. I can help you find hotels, flights, car rentals, and tours. How can I assist you today?",
      isFromUser: false,
      timestamp: new Date(),
      suggestions: [
        { text: 'Find Hotels', action: 'search_hotels' },
        { text: 'Search Flights', action: 'search_flights' },
        { text: 'Rent a Car', action: 'search_cars' },
        { text: 'Browse Tours', action: 'search_tours' }
      ]
    };
    
    this.messages = [welcomeMessage];
    this.shouldScrollToBottom = true;
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    console.log('Chat toggled:', this.isChatOpen);
    
    if (this.isChatOpen) {
      setTimeout(() => {
        this.focusInput();
        this.shouldScrollToBottom = true;
      }, 100);
    }
  }

  sendMessage(): void {
    const trimmedMessage = this.currentMessage?.trim();
    
    if (!trimmedMessage || !this.isConnected) {
      console.log('Cannot send message. Message empty:', !trimmedMessage, 'Connected:', this.isConnected);
      return;
    }

    console.log('Sending message:', trimmedMessage);

    const userMessage: DisplayMessage = {
      id: 'user_' + Date.now(),
      content: trimmedMessage,
      isFromUser: true,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.shouldScrollToBottom = true;

    // Show typing indicator
    this.isTyping = true;

    // Classify message type
    const messageType = this.classifyMessage(trimmedMessage);
    const messageToSend = trimmedMessage;
    this.currentMessage = '';

    // Send message to service
    this.chatbotService.sendMessage(messageToSend, messageType)
  .subscribe({
    next: () => console.log('Message sent successfully'),
    error: (error) => {
      console.error('Error sending message:', error);
      this.isTyping = false;
      this.addErrorMessage();
    }
  });

  }

  onSuggestionClick(suggestion: SuggestionButton): void {
    console.log('Suggestion clicked:', suggestion);
    
    if (!suggestion || !suggestion.text) {
      console.error('Invalid suggestion:', suggestion);
      return;
    }

    this.currentMessage = suggestion.text;
    this.sendMessage();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  newChat(): void {
    console.log('Starting new chat');
    this.messages = [];
    this.currentMessage = '';
    this.isTyping = false;
    this.chatbotService.newSession();
    this.loadWelcomeMessage();
  }

  private addBotMessage(response: ChatResponse): void {
    const botMessage: DisplayMessage = {
      id: 'bot_' + Date.now(),
      content: response.response,
      isFromUser: false,
      timestamp: response.timestamp,
      suggestions: response.suggestions,
      data: response.data
    };

    this.messages.push(botMessage);
    this.shouldScrollToBottom = true;
    console.log('Bot message added:', botMessage);
  }

  private addErrorMessage(): void {
    const errorMessage: DisplayMessage = {
      id: 'error_' + Date.now(),
      content: "Sorry, I'm having trouble processing your request. Please try again.",
      isFromUser: false,
      timestamp: new Date()
    };

    this.messages.push(errorMessage);
    this.shouldScrollToBottom = true;
  }

  private classifyMessage(message: string): ChatMessageType {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hotel') || lowerMessage.includes('room') || lowerMessage.includes('accommodation')) {
      return ChatMessageType.HotelSearch;
    }
    if (lowerMessage.includes('flight') || lowerMessage.includes('airline') || lowerMessage.includes('fly')) {
      return ChatMessageType.FlightSearch;
    }
    if (lowerMessage.includes('car') || lowerMessage.includes('rental') || lowerMessage.includes('drive')) {
      return ChatMessageType.CarRental;
    }
    if (lowerMessage.includes('tour') || lowerMessage.includes('trip') || lowerMessage.includes('excursion')) {
      return ChatMessageType.TourSearch;
    }
    if (lowerMessage.includes('booking') || lowerMessage.includes('reservation') || lowerMessage.includes('cancel')) {
      return ChatMessageType.BookingInquiry;
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
      return ChatMessageType.Support;
    }

    return ChatMessageType.General;
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer?.nativeElement) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }

  private focusInput(): void {
    try {
      if (this.messageInput?.nativeElement) {
        this.messageInput.nativeElement.focus();
      }
    } catch (err) {
      console.error('Could not focus input:', err);
    }
  }

  formatMessage(content: string): string {
    if (!content) return '';
    
    // Simple formatting - you can enhance this
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  trackByMessage(index: number, message: DisplayMessage): string {
    return message.id || index.toString();
  }
}