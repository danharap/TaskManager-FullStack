import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userNameSubject = new BehaviorSubject<string | null>(this.getName());
  userName$ = this.userNameSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {}

  private get client() {
    return this.supabaseService.client;
  }

  login(email: string, password: string): Observable<any> {
    return from(this.client.auth.signInWithPassword({ email, password })).pipe(
      switchMap(({ data, error }) => {
        if (error) throw error;
        const userId = data.user!.id;
        return from(
          this.client.from('profiles').select('username, role').eq('id', userId).single()
        ).pipe(
          map(({ data: profile, error: profileError }) => {
            if (profileError) throw profileError;
            localStorage.setItem('userName', profile!.username);
            localStorage.setItem('userRole', profile!.role);
            this.userNameSubject.next(profile!.username);
            return data;
          })
        );
      })
    );
  }

  register(email: string, password: string, username: string): Observable<any> {
    return from(
      this.client.auth.signUp({
        email,
        password,
        options: { data: { username } }
      })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  logout(): void {
    this.client.auth.signOut();
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    this.userNameSubject.next(null);
  }

  getName(): string | null {
    return localStorage.getItem('userName');
  }

  isLoggedIn(): boolean {
    return !!this.client.auth.getSession;
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getToken(): string | null {
    return null;
  }

  changeUsername(_currentUsername: string, newUsername: string): Observable<any> {
    const userId = this.client.auth.getUser;
    return from(this.client.auth.getUser()).pipe(
      switchMap(({ data }) => {
        const uid = data.user!.id;
        return from(
          this.client.from('profiles').update({ username: newUsername }).eq('id', uid)
        );
      }),
      tap(({ error }) => {
        if (error) throw error;
        localStorage.setItem('userName', newUsername);
        this.userNameSubject.next(newUsername);
      })
    );
  }

  changePassword(_currentPassword: string, newPassword: string): Observable<any> {
    return from(this.client.auth.updateUser({ password: newPassword })).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  adminChangeUsername(userId: string, newUsername: string): Observable<any> {
    return from(
      this.client.from('profiles').update({ username: newUsername }).eq('id', userId)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  deleteOwnAccount(): Observable<any> {
    return from(this.client.rpc('delete_own_account')).pipe(
      map(({ error }) => {
        if (error) throw error;
        this.logout();
      })
    );
  }
}
