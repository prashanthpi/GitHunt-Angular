import { Component, OnInit, OnDestroy } from '@angular/core';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription';

import gql from 'graphql-tag';

const CurrentUserQuery = gql`
  query CurrentUserForProfile {
    currentUser {
      login
      avatar_url
    }
  }
`;

@Component({
  selector: 'profile',
  template: `
    <p *ngIf="loading" class="navbar-text navbar-right">
      Loading...
    </p>
    <span *ngIf="!loading && currentUser">
      <p class="navbar-text navbar-right">
        {{currentUser.login}}
        &nbsp;
        <a href="/logout">Log out</a>
      </p>
      <a
        class="btn navbar-btn navbar-right btn-success"
        routerLink="/submit">
        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
          &nbsp;
          Submit
      </a>
    </span>
    <p *ngIf="!loading && !currentUser" class="navbar-text navbar-right">
      <a href="/login/github">Log in with GitHub</a>
    </p>
  `
})
export class ProfileComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  currentUser: any;
  currentUserSub: Subscription;

  constructor(
    private apollo: Angular2Apollo
  ) {}

  ngOnInit() {
    this.currentUserSub = this.apollo.watchQuery({
      query: CurrentUserQuery,
    }).subscribe(({data, loading}) => {
      this.currentUser = data.currentUser;
      this.loading = loading;
    });
  }

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
  }
}
