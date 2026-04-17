import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  navScrolled = false;
  mobileMenuOpen = false;
  currentYear = new Date().getFullYear();

  faqItems = [
    {
      question: 'Do I need a credit card to sign up?',
      answer: 'No. The Free plan is completely free — no credit card required. Just register with your email and start managing tasks immediately.',
      open: false
    },
    {
      question: 'How is my data stored?',
      answer: 'All your data is stored securely in a PostgreSQL database powered by Supabase, with encryption at rest and Row Level Security policies so only you can see your own tasks.',
      open: false
    },
    {
      question: 'Can I use TaskManager on mobile?',
      answer: 'Yes. The app is fully responsive and works in any modern browser on phones, tablets, and desktops.',
      open: false
    },
    {
      question: 'What is the difference between a task and a subtask?',
      answer: 'Tasks are your top-level work items with a title, description, priority, and due date. Subtasks let you break any task into smaller steps and track them through a Kanban board (To Do → In Progress → In Review → Complete).',
      open: false
    },
    {
      question: 'Can I invite team members?',
      answer: 'Team collaboration features are planned for upcoming Pro and Team tiers. For now, Admin users can manage other accounts and view all tasks through the Admin panel.',
      open: false
    },
    {
      question: 'How do I delete my account?',
      answer: 'Go to Settings → scroll to the bottom → click "Delete Account". This permanently removes your profile and all associated tasks.',
      open: false
    }
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    this.navScrolled = window.scrollY > 20;
  }

  goToRegister() { this.router.navigate(['/register']); }
  goToLogin()    { this.router.navigate(['/login']); }

  scrollTo(id: string) {
    this.mobileMenuOpen = false;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleFaq(index: number) {
    this.faqItems[index].open = !this.faqItems[index].open;
  }
}
