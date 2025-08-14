import { Component, signal, inject, effect } from '@angular/core';
import { ChatService } from '../../../../Service/chat-service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { from, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './chat-bot.html',
  styleUrls: ['./chat-bot.css']
})
export class ChatBot {
  private chatService = inject(ChatService);

  // State signals
  isOpen = signal(false);
  isLoading = signal(false);
  userInput = signal('');
  messages = signal<any[]>([]);
  errorLoadingHistory = signal(false);
  historyLoaded = signal(false);

  constructor() {
    effect(() => {
      if (this.isOpen() && !this.historyLoaded()) {
        this.loadChatHistory();
      }
    });
  }

  toggleChat() {
    this.isOpen.update(open => !open);
  }

  async loadChatHistory() {
    if (this.historyLoaded() || this.isLoading()) return;
    
    try {
      this.isLoading.set(true);
      this.errorLoadingHistory.set(false);
      
      const history = await lastValueFrom(this.chatService.getChatHistory());
      
      if (history && Array.isArray(history)) {
        // Map history to the expected message format
        this.messages.set(history.map(item => ({
          from: 'user',
          text: item.message || item.userInput || 'No message content',
          timestamp: new Date(item.timestamp || Date.now())
        })));
        this.messages.set(history.map(item => ({
          from: 'bot',
          text: item.message || item.assistantResponse || 'No message content',
          timestamp: new Date(item.timestamp || Date.now())
        })));
        this.historyLoaded.set(true);
      }
    } catch (error) {
      console.error('Failed to load chat history', error);
      this.errorLoadingHistory.set(true);
      this.messages.set([{
        from: 'bot',
        text: 'Failed to load chat history. Please try again later.',
        timestamp: new Date()
      }]);
    } finally {
      this.isLoading.set(false);
    }
  }

  async sendMessage() {
    const message = this.userInput().trim();
    if (!message || this.isLoading()) return;

    // Add user message immediately
    this.messages.update(messages => [
      ...messages,
      {
        from: 'user',
        text: message,
        timestamp: new Date()
      }
    ]);
    this.userInput.set('');

    try {
      this.isLoading.set(true);
      const response = await lastValueFrom(this.chatService.sendMessage(message));
      
      this.messages.update(messages => [
        ...messages,
        {
          from: 'bot',
          text: response.message || 'No response received',
          timestamp: new Date(response.timestamp || Date.now())
        }
      ]);
    } catch (error) {
      console.error('Error sending message', error);
      this.messages.update(messages => [
        ...messages,
        {
          from: 'bot',
          text: 'Sorry, there was an error processing your message.',
          timestamp: new Date()
        }
      ]);
    } finally {
      this.isLoading.set(false);
    }
  }

  async clearHistory() {
    try {
      this.isLoading.set(true);
      await lastValueFrom(this.chatService.clearHistory());
      this.messages.set([]);
      this.errorLoadingHistory.set(false);
      this.historyLoaded.set(false);
    } catch (error) {
      console.error('Failed to clear history', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async getRandomTip() {
    try {
      this.isLoading.set(true);
      const response = await lastValueFrom(this.chatService.getRandomTravelTip());
      this.messages.update(messages => [
        ...messages,
        {
          from: 'bot',
          text: `Travel Tip: ${response.tip || response.Tip || 'No tips available at the moment.'}`,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Failed to get travel tip', error);
      this.messages.update(messages => [
        ...messages,
        {
          from: 'bot',
          text: 'Could not load travel tips. Please try again.',
          timestamp: new Date()
        }
      ]);
    } finally {
      this.isLoading.set(false);
    }
  }
}