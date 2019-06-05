import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories = [
    {id: 1, name: 'iOS'},
    {id: 2, name: 'Android'},
    {id: 3, name: 'Windows'},
    {id: 4, name: 'Generic'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
