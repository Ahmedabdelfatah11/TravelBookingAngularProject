// src/Models/profile.ts

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phone: string;
  address: string;
  dateOfBirth: string; // ISO string
  token: string;
  profilePictureUrl?: string; // ← Matches C# backend
}

export interface ProfileParams {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}