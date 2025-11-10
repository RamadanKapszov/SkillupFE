import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CategoryService,
  Category,
} from 'src/app/core/services/category.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  categoryIcons: { [key: number]: string } = {
    1: '💻', // Programming
    2: '🧮', // Math
    3: '🔬', // Science
    4: '🏛️', // History
    5: '🎨', // Art
    6: '💼', // Business
    7: '🗣️', // Languages
    8: '🎸', // Music
    9: '🧘‍♀️', // Fitness
    10: '⏰', // Productivity
    11: '📊', // Data Science
    12: '🌐', // Web Development
  };

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Categories loaded:', data);
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error loading categories:', err);
        this.loading = false;
      },
    });
  }

  viewCategory(id: number) {
    this.router.navigate(['/courses'], { queryParams: { categoryId: id } });
  }
}
