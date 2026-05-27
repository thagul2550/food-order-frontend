import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Restaurant } from '../../../models/restaurant.model';
import { RestaurantService } from '../../../services/restaurant.service';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './restaurant-list.component.html',
})
export class RestaurantListComponent implements OnInit {
  restaurants: Restaurant[] = [];
  loading = true;
  error = '';
  skeletons = Array(3).fill(0);

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.getAll().subscribe({
      next: (data) => { this.restaurants = data; this.loading = false; },
      error: () => { this.error = 'โหลดร้านอาหารไม่ได้'; this.loading = false; },
    });
  }

  categoryIcon(category: string): string {
    const map: Record<string, string> = {
      Thai: 'pi-flag', Japanese: 'pi-globe', 'Fast Food': 'pi-bolt',
    };
    return 'pi ' + (map[category] ?? 'pi-shop');
  }

  ratingStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getCategoryClass(category: string): string {
    return 'cat-' + category.toLowerCase().replace(/\s+/g, '-');
  }
}
