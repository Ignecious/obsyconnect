import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Conversation {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  status: 'open' | 'closed' | 'pending';
  auto_reply_sent?: boolean;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: 'customer' | 'agent' | 'system';
  message: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private messageChannel: RealtimeChannel | null = null;

  constructor() {
    // TODO: Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY in src/environments/environment.ts
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  // ==================== CONVERSATIONS ====================

  /**
   * Get all conversations with their messages
   */
  async getConversations(): Promise<Conversation[]> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select(`
        *,
        messages (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    return data as Conversation[];
  }

  /**
   * Get a single conversation with messages
   */
  async getConversation(id: string): Promise<Conversation | null> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select(`
        *,
        messages (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }

    return data as Conversation;
  }

  /**
   * Create a new conversation
   */
  async createConversation(
    customerName?: string,
    customerEmail?: string,
    customerPhone?: string
  ): Promise<Conversation | null> {
    const { data, error } = await this.supabase
      .from('conversations')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        status: 'open'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    return data as Conversation;
  }

  /**
   * Update conversation status
   */
  async updateConversationStatus(id: string, status: 'open' | 'closed' | 'pending'): Promise<boolean> {
    const { error } = await this.supabase
      .from('conversations')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating conversation:', error);
      return false;
    }

    return true;
  }

  /**
   * Update conversation metadata
   */
  async updateConversation(id: string, updates: Partial<Conversation>): Promise<boolean> {
    const { error } = await this.supabase
      .from('conversations')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating conversation:', error);
      return false;
    }

    return true;
  }

  // ==================== MESSAGES ====================

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data as Message[];
  }

  /**
   * Send a message (from customer or agent)
   */
  async sendMessage(
    conversationId: string,
    sender: 'customer' | 'agent' | 'system',
    message: string
  ): Promise<Message | null> {
    const { data, error } = await this.supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender,
        message
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    return data as Message;
  }

  // ==================== REALTIME ====================

  /**
   * Subscribe to new messages in real-time
   */
  subscribeToMessages(callback: (message: Message) => void): RealtimeChannel {
    this.messageChannel = this.supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('New message received:', payload.new);
          callback(payload.new as Message);
        }
      )
      .subscribe();

    return this.messageChannel;
  }

  /**
   * Subscribe to conversation changes
   */
  subscribeToConversations(callback: (conversation: Conversation) => void): RealtimeChannel {
    return this.supabase
      .channel('conversations-channel')
      .on(
        'postgres_changes',
        {
          event: '*',  // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'conversations'
        },
        (payload) => {
          console.log('Conversation changed:', payload);
          callback(payload.new as Conversation);
        }
      )
      .subscribe();
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribe() {
    if (this.messageChannel) {
      this.supabase.removeChannel(this.messageChannel);
      this.messageChannel = null;
    }
  }
}
