import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ApiService],
})

export class AppComponent implements AfterViewInit {

  movies = [];
  selectedMovie: any;
  title: any;
  desc: any;
  year: any;
  dataSource: any;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  displayedColumns: string[] = ['id', 'title', 'desc', 'year'];

  // MatPaginator Output
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private api: ApiService) {
    this.selectedMovie = { id: -1, title: '', desc: '', year: '' };
  }

  ngAfterViewInit() {
    this.getMovies();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getMovies = () => {
    this.api.getAllMovies().subscribe(
      data => {
        this.movies = data;
        this.dataSource = new MatTableDataSource(this.movies);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }

  movieClicked = (movie) => {
    this.api.getOneMovie(movie.id).subscribe(
      data => {
        this.selectedMovie = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  updateMovie = () => {
    this.api.updateMovie(this.selectedMovie).subscribe(
      data => {
        this.getMovies();
      },
      error => {
        console.log(error);
      }
    );
    window.location.reload();
  }

  createMovie = () => {
    this.api.createMovie(this.selectedMovie).subscribe(
      data => {
        this.movies.push(data);
      },
      error => {
        console.log(error);
      }
    );
    window.location.reload();
  }

  deleteMovie = () => {
    this.api.deleteMovie(this.selectedMovie.id).subscribe(
      data => {
        this.getMovies();
      },
      error => {
        console.log(error);
      }
    );
    window.location.reload();
  }
}
