import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface DashboardSummary {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
}

interface TopCourse {
  courseTitle: string;
  enrollments: number;
}

interface TopStudent {
  studentName: string;
  points: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  summary?: DashboardSummary;
  topCourses: TopCourse[] = [];
  topStudents: TopStudent[] = [];
  loading = false;
  error = '';

  // chart data
  courseChartData?: ChartData<'bar'>;
  studentChartData?: ChartData<'bar'>;
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.loading = true;
    this.http
      .get<DashboardSummary>(`${environment.apiUrl}/admin-dashboard/summary`)
      .subscribe({
        next: (res) => {
          this.summary = res;
          this.loading = false;
        },
        error: () => {
          this.error = 'Грешка при зареждане на статистиките.';
          this.loading = false;
        },
      });

    this.http
      .get<TopCourse[]>(`${environment.apiUrl}/admin-dashboard/top-courses`)
      .subscribe((data) => {
        this.topCourses = data;
        this.courseChartData = {
          labels: data.map((c) => c.courseTitle),
          datasets: [
            {
              data: data.map((c) => c.enrollments),
              backgroundColor: '#3f51b5',
            },
          ],
        };
      });

    this.http
      .get<TopStudent[]>(`${environment.apiUrl}/admin-dashboard/top-students`)
      .subscribe((data) => {
        this.topStudents = data;
        this.studentChartData = {
          labels: data.map((s) => s.studentName),
          datasets: [
            { data: data.map((s) => s.points), backgroundColor: '#4caf50' },
          ],
        };
      });
  }
}
