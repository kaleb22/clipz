import { Component, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  videoOrder = 'd'; // descending asceding

  ngOnInit(): void {
    this.route.queryParamMap.subscribe( (params: Params) => {
      this.videoOrder = params.sort === 'a' ? params.sort : 'd';
    });
  }

  sort(event: Event): void {
    const { value } = ( event.target as HTMLSelectElement );

    this.router.navigateByUrl(`/manage?sort=${value}`);
  }

}
